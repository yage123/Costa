/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
* @param {Object} data
* @returns {Object} no empty
* */
export function filterEmptyData(data) {
  for (const key in data) {
    if (data[key] === '') {
      delete data[key]
    }
  }
  return data
}

/**
 * @param {Object} data
 * @returns {Object} empty
 * */
export function setEmptyData(data) {
  for (const key in data) {
    if (data[key] !== '') {
      data[key] = ''
    }
  }
  return data
}

// 数组中匹配单个字符串的方法，传入数组支持格式[{},{}],
export function searchStr(str, arr) {
  const newList = []
  // 要匹配字符串的首个字符
  const startChar = str.charAt(0)
  // 要匹配字符串的字符长度
  const strLength = str.length
  for (let i = 0; i < arr.length; i++) {
    // 默认数组arr中对象arr[i]不存在str
    let isExist = false
    const obj = arr[i]
    for (const key in obj) {
      if (typeof (obj[key]) === 'function') {
        obj[key]()
      } else {
        let keyValue = ''
        // 获取arr[i][key]的值
        if (obj[key] !== null && typeof (obj[key]) === 'string') {
          keyValue = obj[key]
        } else if (obj[key] !== null && typeof (obj[key]) !== 'string') {
          keyValue = JSON.stringify(obj[key])
        }
        // arr[i][key]中的各个位置的字符与str的0位置字符startChar对比如果相等，
        // 在arr[i][key]中从j位置截取与str长度相同的字符，对比是否相等
        for (let j = 0; j < keyValue.length; j++) {
          // 把原有数据转化为小写，输入数据也转化为纯小写，实现模糊匹配,如区分大小写，可删除toLowerCase()
          if (keyValue.charAt(j).toLowerCase() === startChar.toLowerCase()) {
            if (keyValue.substring(j).substring(0, strLength).toLowerCase() === str.toLowerCase()) {
              // 模糊匹配到的字符存在表示arr[i]中存在str
              isExist = true
              break
            }
          }
        }
      }
    }
    // 当arr[i]中存在str时，把arr[i]放入一个新数组
    if (isExist === true) {
      newList.push(obj)
    }
  }
  // 最后返回这个新数组
  return newList
}

export function findarrays(ar, feature, v) {
  var arr = []

  for (var i = 0; i < ar.length; i++) {
    var atxt = ar[i][feature]
    var btxt = v
    var atxtarr = atxt.split('')
    var btxtarr = btxt.split('')

    var type = 0

    for (var k = 0; k < atxtarr.length; k++) {
      for (var j = 0; j < atxtarr.length; j++) {
        if (atxtarr[k] === btxtarr[j]) {
          type += 1
        }
      }
    }
    if (type >= 1) {
      arr.push(ar[i])
    }
  }
  return arr
}
export function fuzzyQuery(list, feature, keyWord) {
  var arr = []
  for (var i = 0; i < list.length; i++) {
    if ((list[i]['portName'] || list[i]['countryOrArea']) != null) {
      if (list[i]['portName'] == null) {
        if (list[i]['countryOrArea'].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0) {
          arr.push(list[i])
        }
      } else if (list[i]['countryOrArea'] == null) {
        if (list[i]['portName'].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0) {
          arr.push(list[i])
          // console.log(list[i]['portName'])
        }
      } else if ((list[i]['portName'] && list[i]['countryOrArea']) != null) {
        if (list[i]['portName'].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0 || list[i]['countryOrArea'].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0) {
          arr.push(list[i])
          // console.log(list[i]['portName'])
        }
      }
    }
  }
  return arr
}
export function fuzzyQueryPorts(list, feature, keyWord) {
  var arr = []
  for (var i = 0; i < list.length; i++) {
    if (list[i][feature].toLowerCase().replace(/\s+/g, '').indexOf(keyWord.toLowerCase().replace(/\s+/g, '')) >= 0 || list[i]['portNameTo'].toLowerCase().replace(/\s+/g, '').indexOf(keyWord.toLowerCase().replace(/\s+/g, '')) >= 0) {
      arr.push(list[i])
    }
  }
  return arr
}
export function fuzzyQueryPort(list, feature, keyWord) {
  var arr = []
  for (var i = 0; i < list.length; i++) {
    if (list[i][feature].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0) {
      arr.push(list[i])
    }
  }
  return arr
}

export function fuzzyQueryShip(portList, keyWord) {
  const arr = []
  for (var j = 0; j < portList.length; j++) {
    let type = 0
    const shipList = portList[j]['shipCanCall'].split(',')
    for (var a = 0; a < keyWord.length; a++) {
      for (var i = 0; i < shipList.length; i++) {
        if (shipList[i].toUpperCase() === keyWord[a].toUpperCase()) {
          type += 1
        }
      }
    }
    if (type >= keyWord.length) {
      arr.push(portList[j])
    }
  }
  return arr
}

export function exam() {
  const arr = []
  let type = 0
  const shipList = ['1','2','3','4','5']
  const keyWord = ['1','2']
  for (var a = 0; a < keyWord.length; a++) {
    for (var i = 0; i < shipList.length; i++) {
      if (shipList[i] === keyWord[a]) {
        type += 1
        break
      }
    }
    if (type === keyWord.length) {
      arr.push(shipList[i])
    }
  }
  return arr
}
