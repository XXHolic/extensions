// 储存请求数据
let requestList = []
// 网址过滤的默认值
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

// 监听请求事件的处理程序
const handlerResponseStarted = (details) => {
  // 找到处于激活状态的 Tab
  chrome.tabs.query({ active: true }, (tab) => {
    requestList.unshift(details)
    chrome.storage.local.set({ requestList });
    return { cancel: true };
  })
}

// 监听 storage 改变事件
chrome.storage.onChanged.addListener((changeObj, areaName) => {
  const { urlPattern } = changeObj
  // 由于在 page.html 里面也监听了，所以要判断是不是 urlPattern 变动了
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
