from langchain import OpenAI
from langchain.chains import VectorDBQAWithSourcesChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

import faiss
import pickle

def get_answer_from_ai(question: str):
    # Load the LangChain.
    index = faiss.read_index("docs.index")
    with open("faiss_store.pkl", "rb") as f:
        store = pickle.load(f)
    store.index = index

    chain = VectorDBQAWithSourcesChain.from_llm(
        llm=OpenAI(temperature=0), vectorstore=store)
    result = chain({"question": question})

    return result

def ingest(title: str, content: str):
    # Here we load in the data in the format that Notion exports it in.
    data = []
    sources = []
    data.append(content)
    sources.append(title)

    # Here we split the documents, as needed, into smaller chunks.
    # We do this due to the context limits of the LLMs.
    text_splitter = CharacterTextSplitter(chunk_size=1500, separator="\n")
    docs = []
    metadatas = []
    for i, d in enumerate(data):
        splits = text_splitter.split_text(d)
        docs.extend(splits)
        metadatas.extend([{"source": sources[i]}] * len(splits))

    # Here we create a vector store from the documents and save it to disk.
    store = FAISS.from_texts(docs, OpenAIEmbeddings(), metadatas=metadatas)
    faiss.write_index(store.index, "docs.index")
    store.index = None
    with open("faiss_store.pkl", "wb") as f:
        pickle.dump(store, f)

    return True
