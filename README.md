# Note Chat

Note Chat is a note-taking AI assistant based on LLMs

Based on:
- [notion-qa](https://github.com/hwchase17/notion-qa)
- [chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react)
- [flask](https://flask.palletsprojects.com/en/2.2.x/)

## Usage
### Client

```bash
$ cd note-chat-client-extension
$ pnpm install
$ pnpm start
```

Open your chrome browser load the packages.

### Server

```bash
$ cd note-chat-server
$ export OPENAI_API_KEY=[your key]
$ pip install -r requirements.txt
$ flask run
```

The default local port is 5000, and the path accessed by the client is also 5000.

### Demo
<img width="800" alt="image" src="https://user-images.githubusercontent.com/1179603/218291977-84cde44e-29b8-45a1-a37b-a953519dbea2.png">

<img width="239" alt="image" src="https://user-images.githubusercontent.com/1179603/218292006-f040297a-2020-4f86-ab56-894227e8e63a.png">

<img width="800" alt="image" src="https://user-images.githubusercontent.com/1179603/218292017-49325784-5a62-4268-9b1b-eedf5f8911b9.png">