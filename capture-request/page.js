window.onload = () => {
  let localShowList = []; // 这个是页面真正展示的数据

  const createEle = (tag, { className, text }) => {
    const ele = document.createElement(tag)
    if (text) {
      const textEle = document.createTextNode(text)
      ele.appendChild(textEle)
    }
    if (className) {
      ele.setAttribute('class', className)
    }
    return ele;
  }
  const appendChildList = (parent, childArr) => {
    childArr.map(ele => {
      parent.appendChild(ele)
    })
  }

  const listContainer = document.querySelector('#reqList')

  chrome.storage.onChanged.addListener(({ requestList }, areaName) => {
    const { newValue } = requestList
    const newItem = newValue[0] || null
    const { requestId, initiator, method, type, url, ip, statusLine } = newItem
    const cellClass = 'table-td'
    const requestIdEle = createEle('td', { className: `${cellClass}`, text: requestId })
    const methodEle = createEle('td', { className: `${cellClass}`, text: method })
    const urlEle = createEle('td', { className: `${cellClass}`, text: url })
    const ipEle = createEle('td', { className: `${cellClass}`, text: ip })
    const parentEle = createEle('tr', { className: 'table-body-tr' })
    appendChildList(parentEle, [requestIdEle, methodEle, urlEle, ipEle])
    listContainer.appendChild(parentEle)
  })

  const operateEle = document.querySelector('#operate-filter')
  operateEle.addEventListener('click', () => {
    chrome.storage.sync.get("requestList", ({ requestList }) => {
      console.log(requestList)
    });
  })

  const exportEle = document.querySelector('#operate-export')
  exportEle.addEventListener('click', () => {
    chrome.storage.sync.get("requestList", ({ requestList }) => {
      console.log(requestList)
      const txt = JSON.stringify(requestList)
      let blob = new Blob([txt], { type: 'application/octet-stream' });
      let dt = (new Date()).getSeconds();
      chrome.downloads.download({
        url: URL.createObjectURL(blob),
        saveAs: true,
        conflictAction: 'overwrite',
        filename: dt + '.json'
      });
    });
  })

}
