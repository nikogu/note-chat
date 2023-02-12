
import { Readability } from '@mozilla/readability';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, sender);
  if (!request || !request.type) return;
  if (request.type === 'ai:learn') {
    console.log('----------Readability------------');
    console.log('----------Readability------------');
    console.log('----------Readability------------');
    console.log('----------Readability------------');
    // process received message
    const documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    const data = {
      title: article.title,
      content: article.textContent,
    }
    console.log('------------------data', data);
    sendResponse({
      data,
    });
  }
  // if (request.type === 'ai:learn') {
  //   const title = document.querySelector('sr-rd-title').innerText;
  //   const desc = document.querySelector('sr-rd-desc').innerText;
  //   const content = document.querySelector('sr-rd-content').innerText;
  //   console.log(title, desc, content);
  //   // download(`${title}.md`, `${desc}${desc ? '<br>' : ''}${content}`);
  //   const realContent = `${desc}${desc ? '<br>' : ''}${content}`;

  //   if (!title || !content) {
  //     throw new Error('no title or content');
  //   }
  //   const data = {
  //     title,
  //     content: realContent,
  //   }
  //   console.log('sending request learn...');
  //   console.log(data);
  //   sendResponse({
  //     data,
  //   });
  // }
});
