import os
from gpt_index import GPTSimpleVectorIndex, Document, SimpleDirectoryReader
from gpt_index.langchain_helpers.text_splitter import TokenTextSplitter


def get_answer_from_ai(question: str):
    index = GPTSimpleVectorIndex.load_from_disk('data.json')
    response = index.query(question)
    print('response', response)
    return {'answer': str(response), 'source': response.get_formatted_sources()}


def ingest(content: str):
    print('ingest content', content)
    document = Document(content)
    text_splitter = TokenTextSplitter(
        separator="\n", chunk_size=2048, chunk_overlap=20)
    text_chunks = text_splitter.split_text(document.text)
    doc_chunks = [Document(t) for t in text_chunks]

    print('document', document)

    # Check if the file data.json exists
    # Create the file if it does not exist
    # Create an empty GPTSimpleVectorIndex
    # Save the Empty index to a file named 'data.json'
    if not os.path.exists("data.json"):
        with open("data.json", "w") as f:
            f.write("")
            index = GPTSimpleVectorIndex([])
            index.save_to_disk('data.json')

    index = GPTSimpleVectorIndex.load_from_disk('data.json')

    index.insert(document)
    index.save_to_disk('data.json')

    # documents = SimpleDirectoryReader("data").load_data()
    # index = GPTSimpleVectorIndex(documents)
    # index.save_to_disk('data.json')

    # response = index.query("What's going on with Microsoft and Google lately")
    # print(response)

    return True
