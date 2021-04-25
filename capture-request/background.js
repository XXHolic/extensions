
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.set({ color });
//     console.log('Default background color set to %cgreen', `color: ${color}`);
// });
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'page.html'
  });
});

chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    chrome.tabs.query({ active: true }, (tab) => {
      console.log('details', details)
      return { cancel: true };
    })

  },
  { urls: ["*://github.com/*"] },
);
