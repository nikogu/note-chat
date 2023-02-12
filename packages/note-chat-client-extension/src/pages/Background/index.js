// const apiPrefix = 'https://second-brain-1g2gwhaud0d1992d-1253325503.ap-shanghai.app.tcloudbase.com/container-qa-server2';
const apiPrefix = 'http://127.0.0.1:5000';

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "ai:learn" }, (res) => {
      if (res && res.data && res.data.title && res.data.content) {
        chrome.action.setBadgeText({
          tabId: tabs[0].id,
          text: '...',
        });
        chrome.action.setBadgeBackgroundColor({
          tabId: tabs[0].id,
          color: '#808080',
        });

        postData(`${apiPrefix}/learn`, res.data).then(result => {
          chrome.action.setBadgeText({
            tabId: tabs[0].id,
            text: 'learn',
          });
          chrome.action.setBadgeBackgroundColor({
            tabId: tabs[0].id,
            color: '#4dbb7c',
          });
        }).catch(() => {
          console.log('learn requested');
          chrome.action.setBadgeText({
            tabId: tabs[0].id,
            text: 'err',
          });
          chrome.action.setBadgeBackgroundColor({
            tabId: tabs[0].id,
            color: '#ed1b3e',
          });
        });
      }
    });
  });
});
