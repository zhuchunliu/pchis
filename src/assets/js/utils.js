// 判断是否是微信客户端
export const isWeixin = () => {
  let ua = window.navigator.userAgent.toLowerCase()
  if (/MicroMessenger/i.test(ua)) {
    return true
  } else {
    return false
  }
}

// 存储localStorage
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 获取localStorage
export const getStore = name => {
  if (!name || !window.localStorage.getItem(name)) {
    return ''
  }
  return JSON.parse(window.localStorage.getItem(name))
}

// 删除localStorage
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

// url QueryStr
export const GetQueryString = name => {
  let after = window.location.href.split('?')[1]
  if (after) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = after.match(reg)
    if (r != null) {
      return decodeURIComponent(r[2])
    } else {
      return null
    }
  }
}

// 摇一摇事件
export const shake = (fn, bloon = true) => {
  if (!bloon) {
    if (window.DeviceMotionEvent) {
      window.removeEventListener('devicemotion', deviceMotionHandler, false)
    }
    return
  }
  init()
  let SHAKE_THRESHOLD = 1800
  let lastUpdate = 0
  let [x, y, z, lastX, lastY, lastZ] = [0, 0, 0, 0, 0, 0]
  function init () {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', deviceMotionHandler, false)
    } else {
      alert('手机不支持摇动')
    }
  }
  function deviceMotionHandler (eventData) {
    let acceleration = eventData.accelerationIncludingGravity
    let curTime = new Date().getTime()
    if ((curTime - lastUpdate) > 100) {
      let diffTime = curTime - lastUpdate
      lastUpdate = curTime
      x = acceleration.x
      y = acceleration.y
      z = acceleration.z
      let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000

      if (speed > SHAKE_THRESHOLD) {
        // alert('摇动了')
        // return (x, y, z)
        fn.call(this, [x, y, z])
      }
      lastX = x
      lastY = y
      lastZ = z
    }
  }
}

// url 转码
export const urlencode = str => {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
}

// 美化手机号
export const goodPhone = str => {
  let oldNum = getStore('oldPhoneNum').str
  // console.log(oldNum)
  if (str) {
    str = str.slice(0, 13)
    setStore('oldPhoneNum', {str: str})
  }
  if (oldNum && str) {
    if (/^\d{3}$/.test(str) && /^\d{2}$/.test(oldNum)) {
      return str.replace(/(\d{3})/, '$1-')
    } else if (/^\d{3}$/.test(str) && /^\d{3}-$/.test(oldNum)) {
      return str.slice(0, 2)
    }
    if (/^\d{3}-\d{4}$/.test(str) && /^\d{3}-\d{3}$/.test(oldNum)) {
      return str.replace(/(\d{3})-*(\d{4})/, '$1-$2-')
    } else if (/^\d{3}-\d{4}$/.test(str) && /^\d{3}-\d{4}-$/.test(oldNum)) {
      return str.slice(0, 7)
    }
    if (/^\d{3}-*\d{4}-*\d{4}$/.test(str)) {
      return str.replace(/(\d{3})-*(\d{4})-*(\d{4})/, '$1-$2-$3')
    } else {
      return str
    }
  } else {
    if (/^\d{3}-*\d{4}-*\d{4}$/.test(str)) {
      return str.replace(/(\d{3})-*(\d{4})-*(\d{4})/, '$1-$2-$3')
    } else {
      return str
    }
  }
}

// 真实手机号
export const realPhone = str => {
  return str.replace(/-/g, '')
}

// money
export const goodMoney = str => {
  let num
  let addDot = true
  let arr = str.replace(/[^(\d|.)]*/g, '').split('.')
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '') {
      if (addDot) {
        addDot = false
      } else {
        arr.splice(i, 1)
        i = i - 1
      }
    }
  }
  // 打散成 ['123', '', '12313123', '666'] 这样的数组
  if (arr.length === 1) {
    num = arr[0]
  } else if (arr.length > 1) {
    num = arr[0] + '.' + arr[1].slice(0, 2)
  } else {
    num = ''
  }
  return num
}

// 美化时间
export const goodTime = str => {
  let now = new Date().getTime()
  let oldTime = new Date(str).getTime()
  let difference = now - oldTime
  let result = ''
  let minute = 1000 * 60
  let hour = minute * 60
  let day = hour * 24
  // let halfamonth = day * 15
  let month = day * 30
  let year = month * 12

  let _year = difference / year
  let _month = difference / month
  let _week = difference / (7 * day)
  let _day = difference / day
  let _hour = difference / hour
  let _min = difference / minute

  if (_year >= 1) {
    result = ~~(_year) + ' 年前'
  } else if (_month >= 1) {
    result = ~~(_month) + ' 个月前'
  } else if (_week >= 1) {
    result = ~~(_week) + ' 周前'
  } else if (_day >= 1) {
    result = ~~(_day) + ' 天前'
  } else if (_hour >= 1) {
    result = ~~(_hour) + ' 个小时前'
  } else if (_min >= 1) {
    result = ~~(_min) + ' 分钟前'
  } else result = '刚刚'
  return result
}

// 格式化日期
export const formatTime = (t, fmt) => {
  let time = new Date(t)
  let o = {
    'M+': time.getMonth() + 1, // 月份
    'd+': time.getDate(), // 日
    'h+': time.getHours() % 12 === 0 ? 12 : time.getHours() % 12, // 小时
    'H+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    'S': time.getMilliseconds() // 毫秒
  }
  let week = {
    '0': '天',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[time.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export const getWeekDay = (t) => {
  const now = new Date(t)
  const nowTime = now.getTime()
  let day = now.getDay()
  console.log(day)
  if (day === 0) {
    day = 7
  }
  const oneDayLong = 24 * 60 * 60 * 1000
  const MondayTime = nowTime + (1 - day) * oneDayLong
  const TuesdayTime = nowTime + (2 - day) * oneDayLong
  const WednesdayTime = nowTime + (3 - day) * oneDayLong
  const ThursdayTime = nowTime + (4 - day) * oneDayLong
  const FridayTime = nowTime + (5 - day) * oneDayLong
  const SaturdayTime = nowTime + (6 - day) * oneDayLong
  const SundayTime = nowTime + (7 - day) * oneDayLong

  const monday = new Date(MondayTime)
  const tuesday = new Date(TuesdayTime)
  const wednesday = new Date(WednesdayTime)
  const thursday = new Date(ThursdayTime)
  const friday = new Date(FridayTime)
  const saturday = new Date(SaturdayTime)
  const sunday = new Date(SundayTime)

  return [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
}

// 表单用到的正则
export const regExp = {
  // 非手机号
  // mobile: function (str) {
  //   return !(/^1[34578]\d{9}$/.test(str))
  // },
  mobile: function (str) {
    if (str.length != 11) {
      return true
    } else {
      return false
    }
  },
  // 非真实姓名
  realName: function (str) {
    return !(/^([\u4e00-\u9fa5]){2,7}$/.test(str))
  },
  // 非身份证号
  idCard: function (str) {
    let _true = true

    if (str.length !== 18) {
      return _true
    } else {
      let numArr = str.split('')
      let modulusArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      let parallelArr = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let _num = 0

      for (let i = 0; i < 17; i++) {
        _num += numArr[i] * modulusArr[i]
      }
      return parallelArr[_num % 11] != numArr[17] ? _true : false
    }
    // return !(/^([1-9]\d{14})|([1-9]\d{16}([0-9]|X))$/.test(str)) // 简化版身份证验证
  },
  // 非护照
  passport: function (str) {
    return !(/^[a-zA-Z0-9]{5,17}$/.test(str))
  },
  // 非港澳通行证 台湾通行证
  HKMacaoandTW: function (str) {
    return !(/^([HMhm]{1}([0-9]{10}|[0-9]{8}))|([0-9]{8})|([0-9]{10})$/.test(str))
  },
  // 正整数
  signlessInt: function (str) {
    return !(/^[1-9]\d*$/.test(str))
  },
  // 判断非空集合
  trim: function (str) {
    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
  },

  // 验证6-16位数字和字母的组合
  numberletter: function (str) {
    return !(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(str))
  }
}

// 设置网页字体大小
export const autoFontSize = () => {
  let setFontSize = () => {
    if (document.documentElement.offsetWidth > 750) {
      document.documentElement.style.fontSize = 100 + 'px'
    } else {
      document.documentElement.style.fontSize = document.documentElement.offsetWidth / 7.5 + 'px'
    }
  }
  setFontSize()
  window.onresize = function () {
    setFontSize()
  }
}

// 节假日计算
export const getworkday = (str, day) => {
  let holiday = ['2017-10-28']
  let holidayMap = {}

  function getMap (hd) {
    for (let i = 0; i < hd.length; i++) {
      holidayMap[hd[i]] = '1'
    }
  }

  function formatTen (f) {
    if (parseInt(f, 10) < 10) {
      return '0' + f
    }
    return f
  }

  function formateDate (date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + formatTen(month) + '-' + formatTen(day)
  }

  function getworkday (dat, itervalByDay) {
    let str = dat.split('-')
    let date = new Date()
    date.setUTCFullYear(str[0], str[1] - 1, str[2])
    date.setUTCHours(0, 0, 0, 0)
    let millisceonds = date.getTime()
    for (let i = 1; i <= itervalByDay; i++) {
      millisceonds += 24 * 60 * 60 * 1000
      date.setTime(millisceonds)

      if (date.getDay() === 0 || date.getDay() === 6) {
        i--
      } else { // 过滤节假日
        let d = formateDate(date)
        if (holidayMap[d]) {
          i--
        }
      }
    }

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let rq = year + '-' + formatTen(month) + '-' + formatTen(day)

    return rq
  }
  getMap(holiday)
  return getworkday(str, day)
}

export const htmlDecodeByRegExp = (str) => {
  let s = ''
  if (!str) return ''
  s = str.replace(/&amp;/g, '&')
  s = s.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&nbsp;/g, ' ')
  s = s.replace(/,/g, ' ')
  s = s.replace(/\n/g, ' ')
  return s
}
 // 可能为0
export const isCheckNull = (str) => {
  let s = false
  if (str === null || str === 0 || str === undefined || str === '' || str === ' ') {
    s = true
  }
  return s
}
