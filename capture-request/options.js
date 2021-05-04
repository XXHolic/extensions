window.onload = function () {
  const applyEle = document.querySelector('#apply')
  const patternValueEle = document.querySelector('#patternValue')
  applyEle.addEventListener("click", (e) => {
    const value = patternValueEle.value || '<all_urls>'
    chrome.storage.local.set({ urlPattern: value });
    alert('应用成功')
  });
}
