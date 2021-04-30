let requestList = []

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.sync.set({ requestList });
  // 方便调试用，会自动打开一个 tab 页
  let url = chrome.runtime.getURL("page.html");
  let tab = await chrome.tabs.create({ url });
});


chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'page.html'
  });
});

chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    chrome.tabs.query({ active: true }, (tab) => {
      // console.log('details', details)
      requestList.unshift(details)
      chrome.storage.sync.set({ requestList });
      return { cancel: true };
    })

  },
  { urls: ["*://github.com/*"] },
);
