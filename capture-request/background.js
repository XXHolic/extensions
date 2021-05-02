let requestList = []
let urlPattern = '<all_urls>'


chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.set({ requestList, urlPattern });
  chrome.webRequest.onResponseStarted.addListener(
    handlerResponseStarted,
    { urls: [urlPattern] },
  );
  // 方便调试用，会自动打开一个 tab 页
  // let url = chrome.runtime.getURL("page.html");
  // let tab = await chrome.tabs.create({ url });
});


chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'page.html'
  });
});

const handlerResponseStarted = (details) => {
  chrome.tabs.query({ active: true }, (tab) => {
    // console.log('details', details)
    requestList.unshift(details)
    chrome.storage.local.set({ requestList });
    return { cancel: true };
  })
}

chrome.storage.onChanged.addListener((changeObj, areaName) => {
  // console.log('background changeObj', changeObj)
  const { urlPattern } = changeObj
  if (areaName !== 'local' || !urlPattern) {
    console.warn('urlPattern does not change')
    return;
  }
  const { newValue } = urlPattern
  const hasAddListen = chrome.webRequest.onResponseStarted.hasListener(handlerResponseStarted)
  if (hasAddListen) {
    chrome.webRequest.onResponseStarted.removeListener(handlerResponseStarted);
  }
  chrome.webRequest.onResponseStarted.addListener(
    handlerResponseStarted,
    { urls: [newValue] },
  );
})
