window.onload = () => {
  let localFilterList = []; // 页面筛选后的数据

  const createEle = (tag, { className, text, showTitle = false }) => {
    const ele = document.createElement(tag)
    if (text) {
      const textEle = document.createTextNode(text)
      ele.appendChild(textEle)
    }
    if (className) {
      ele.setAttribute('class', className)
    }
    if (showTitle) {
      ele.setAttribute('title', text)
    }
    return ele;
  }
  const appendChildList = (parent, childArr) => {
    childArr.map(ele => {
      parent.appendChild(ele)
    })
  }

  const listContainer = document.querySelector('#reqList')
  const filterResultContainer = document.querySelector('#resultList')



  const creteRowEle = (data) => {
    const { requestId, url } = data
    const cellClass = 'table-td'
    const requestIdEle = createEle('td', { className: `${cellClass}`, text: requestId })
    const urlTdEle = createEle('td', { className: `${cellClass}`, text: '' })
    const urlEle = createEle('div', { className: 'table-ellipsis', showTitle: true, text: url })
    appendChildList(urlTdEle, [urlEle])
    const parentEle = createEle('tr', { className: 'table-body-tr' })
    appendChildList(parentEle, [requestIdEle, urlTdEle])
    return parentEle
  }

  chrome.storage.onChanged.addListener((changeObj, areaName) => {
    // console.log('page changeObj', changeObj)
    const { requestList } = changeObj
    // 由于在 background.js 里面也监听了，所以要判断是不是 requestList 变动了
    if (areaName !== 'local' || !requestList) {
      console.warn('requestList does not change')
      return;
    }
    const { newValue } = requestList || { newValue: [] }
    const newItem = newValue[0] || null
    if (!newItem) {
      console.warn('no data')
      return;
    }
    const parentEle = creteRowEle(newItem)
    listContainer.appendChild(parentEle)
  })

  const operateEle = document.querySelector('#operate-filter')
  const filterInputEle = document.querySelector('#filterValue')
  const resultListEle = document.querySelector('#resultList')
  operateEle.addEventListener('click', () => {
    chrome.storage.local.get("requestList", ({ requestList }) => {
      const value = filterInputEle.value
      if (!value) {
        filterResultContainer.innerHTML = ''
        return;
      }
      localFilterList = []
      if (requestList && value) {
        localFilterList = requestList.filter((ele) => {
          return ele.url.indexOf(value) > -1
        })
      }
      const rowEle = localFilterList.map(ele => {
        return creteRowEle(ele)
      })
      appendChildList(filterResultContainer, rowEle)
    });
  })

  const clearEle = document.querySelector('#operate-clear')
  clearEle.addEventListener('click', () => {
    listContainer.innerHTML = ''
    chrome.storage.local.set({ requestList: [] });
  })
  // 点击导出的按钮
  const exportEle = document.querySelector('#operate-export')
  exportEle.addEventListener('click', () => {
    if (!localFilterList.length) {
      alert('无有效数据')
      return;
    }
    const txt = JSON.stringify(localFilterList)
    let blob = new Blob([txt], { type: 'application/octet-stream' });
    // 文件名称获取时间的秒数，可按照自己喜好定义
    let dt = (new Date()).getSeconds();
    chrome.downloads.download({
      url: URL.createObjectURL(blob),
      saveAs: true,
      conflictAction: 'overwrite',
      filename: dt + '.json'
    });
  })

}
