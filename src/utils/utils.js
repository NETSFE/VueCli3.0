require('es6-promise').polyfill()
const axios = require('axios')
const fetchJsonp = require('fetch-jsonp')
const md5 = require('js-md5')
import { PaWebJs } from './pawebjs'
import { IS_NATIVE, getDataWithLogin, needLogin, getParams } from './native'
import { getRand, getToken, convertPostData, getStorage } from './util'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// 部分请求出现多次调用convertPostData的情况，原因不明，暂且将convertPostData移到fetchData
// axios.interceptors.request.use(function(config) {
//   if (config.method.toLowerCase() === 'post') {
//     config.data = convertPostData(config.data)
//   }
//   return config
// }, function(err) {
//   console.log(err)
//   return Promise.reject(err)
// })
axios.interceptors.response.use(function(res) {
  return res
}, function(err) {
  return Promise.reject(err)
})

/**
 * 异步请求方法，支持jsonp
 * @param {url, params, jsonp, etc.} opts
 * @updated 2017/9/26 解决post问题
 */
export const fetchData = function(opts = {}) {
  if (opts.jsonp) {
    var extra = '?'
    var i = 0
    for (let key in opts.data) {
      if (i > 0) {
        extra += '&'
      }
      extra += key
      extra += '='
      extra += opts.data[key]
      i++
    }
    return fetchJsonp(opts.url + extra).then(function(response) {
      return response.json()
    })
  }
  // if (opts.method && opts.method.toLowerCase() === 'post' && !opts.transformRequest) {
  //   opts.transformRequest = function(data, header) {
  //     return convertPostData(data)
  //   }
  // }
  if (opts.method && opts.method.toLowerCase() === 'post') {
    opts.data = convertPostData(opts.data)
  }
  console.log('requetData:', opts)
  var res = axios(opts)
  return res
}

/**
 * M站用验签请求
 **/

export const mFetchData = function(opts = {}) {
  var tokenObj = getToken()
  opts.data = Object.assign({}, opts.data, tokenObj)
  // console.log(opts)
  return fetchData(opts)
}

/**
 * 自带验签,无需登录的接口
 */

export const vFetch = function(opts = {}) {
  if (process.env.NODE_ENV === 'development' && !IS_NATIVE) {
    return devFetch(opts)
  }
  opts.params = opts.params || {}
  var o = Object.assign({}, opts)
  var defaultParam = ['user_id', 'device_id', 'device_type', 'device_version', 'login_token', 'key']
  var nativeParams = o.nativeParams || []
  var newParams = defaultParam.concat(nativeParams)
  return getParams({params: newParams}).then(data => {
    if (data.code) {
      return Promise.resolve({data: data})
    }
    var veriParams = Fetch(data)
    delete o.nativeParams
    o.params = Object.assign({}, o.params, veriParams)
    return fetchData(o).then((resData) => {
      Promise.resolve(data)
      if (resData && (resData.data.code === 2 || resData.data.code === 3)) {
        return needLogin({
          errmsg: resData.data.msg
        })
      }
      return Promise.resolve(resData)
    }).catch((e) => {
      console.log('e', e)
    })
  })
}

/**
 * 自带验签的请求(APP用接口)
 * @param {url, params, jsonp, nativeParams, etc.} opts
 * 注意: 使用了assign做浅拷贝,请不要操作到第二层的数据
 */

export const verifyFetch = function(opts = {}) {
  console.log('isNative:', IS_NATIVE)
  if (process.env.NODE_ENV === 'development' && !IS_NATIVE) {
    return devFetch(opts)
  }
  opts.params = opts.params || {}
  var o = Object.assign({}, opts)
  var defaultParam = ['user_id', 'device_id', 'device_type', 'device_version', 'login_token', 'key']
  var nativeParams = o.nativeParams || []
  var newParams = defaultParam.concat(nativeParams)
  return getDataWithLogin({params: newParams}).then(function(data) {
    console.log('data', data)
    if (data.code) {
      return Promise.resolve({data: data})
    }
    var veriParams = Fetch(data)
    delete o.nativeParams
    o.params = Object.assign({}, o.params, veriParams)
    return fetchData(o).then((fetchData) => {
      // console.log(needLogin)
      // Promise.resolve(data)
      if (fetchData && (fetchData.data.code === 2 || fetchData.data.code === 3)) {
        return needLogin({
          errmsg: fetchData.data.msg
        }).then(state => {
          // console.log(state)
          if (state === 'failed') {
            return Promise.resolve(state)
          }
          return verifyFetch(opts)
        })
      }
      return Promise.resolve(fetchData)
    })
  })
}

function devFetch(opts = {}) {
  opts.params = opts.params || {}
  var devUser = {
    user_id: '388541504681377764',
    developer: true
  }
  delete opts.nativeParams
  opts.params = Object.assign({}, opts.params, devUser)
  return fetchData(opts)
}

function Fetch(userdata) {
  var rand = getRand(1000, 9999)
  var timestamp = Math.ceil(new Date().getTime() / 100)
  var userId = userdata.user_id
  var deviceId = userdata.device_id
  var deviceType = userdata.device_type
  var key = userdata.key
  var token = md5(key + rand + timestamp + userId + deviceId + deviceType)
  delete userdata.key
  return Object.assign({}, userdata, {
    rand,
    timestamp,
    token,
    version: ''
  })
}

export const getRandomString = function(n) {
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var res = ''
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35)
    res += chars[id]
  }
  return res
}
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

/*
ajax
*/

// export const ajax = function(opts) {
//   return new Promise(function(resolve, reject) {
//     var req = new XMLHttpRequest()
//     req.onload = function() {
//       if (req.status === 200 || req.status === 304) {
//         resolve(JSON.parse(req.response))
//       } else {
//         reject(Error(req.statusText))
//       }
//     }
//     req.onerror = function() {
//       reject(Error('Network Error'))
//     }
//     let type, param, url, async
//     opts.type === null || opts.type.toUpperCase() === 'GET' ? type = 'get' : type = 'post'
//     param = formatParams(opts.param)
//     if (type === 'get') {
//       opts.param === null || param === '' ? url = opts.url : url = opts.url + '?' + param
//     } else {
//       url = opts.url
//     }
//     console.log(url)
//     async = true
//     req.open(type, url, async)
//     req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
//     req.send(param)
//   })
//   function formatParams(data) {
//     var fpArr = []
//     for (var fpName in data) {
//       fpArr.push(fpName + '=' + data[fpName])
//     }
//     return fpArr.join('&')
//   }
// }

// 登录超时时间
export const EXP_TIME = 1000 * 60 * 60
/**
 * @description 根据用户数据生成用户PHP端验签数据
 * @param {Object} userdata 用户数据
 */
export function getVeriFetchParams(userdata = {}) {
  var rand = getRand(1000, 9999)
  var timestamp = Math.ceil(new Date().getTime() / 100)
  var userId = userdata.user_id || getStorage('user_id', EXP_TIME)
  var loginToken = userdata.login_token || getStorage('login_token', EXP_TIME)
  var deviceId = userdata.device_id || md5(new PaWebJs().get())
  var deviceType = userdata.device_type || 'm'
  var key = userdata.key || ''
  var token = md5(key + rand + timestamp + userId + deviceId + deviceType)
  delete userdata.key
  return Object.assign({}, userdata, {
    device_type: deviceType,
    device_id: deviceId,
    rand: rand,
    timestamp: timestamp,
    token: token,
    login_token: loginToken,
    user_id: userId,
    version: ''
  })
}

/**
 * @description 用于需要登录的接口请求
 * @param {Object} opts
 */
export const verifyFetchData = function(opts = {params: {}}) {
  var cloneOpts = Object.assign({}, opts)
  var veriParams = getVeriFetchParams(cloneOpts.params)

  cloneOpts.params = Object.assign({}, cloneOpts.params, veriParams)

  return justFetch(cloneOpts)
}

let deviceId = null

export const wechatFetch = function(opts = {}, deviceType = 'm') {
  if (!deviceId) {
    deviceId = md5(new PaWebJs().get())
  }
  var storage = JSON.parse(getStorage('gwfe', EXP_TIME))
  let userId = storage ? storage.userId : ''
  let timestamp = new Date().getTime()
  let rand = Math.floor(Math.random() * (9999 - 1000)) + 1000
  let token = md5(rand + '' + timestamp + userId + deviceId + deviceType)
  if (!opts.params) {
    opts.params = {}
  }
  opts.params.device_type = deviceType
  opts.params.device_id = deviceId
  opts.params.rand = rand
  opts.params.timestamp = timestamp
  opts.params.token = token
  opts.params.user_id = userId

  return justFetch(opts)
}

export function justFetch(opts) {
  if (opts.jsonp) {
    var extra = '?'
    var i = 0
    for (let key in opts.params) {
      if (i > 0) {
        extra += '&'
      }
      extra += key
      extra += '='
      extra += opts.params[key]
      i++
    }
    return fetchJsonp(opts.url + extra).then(function(response) {
      return response.json()
    })
  }
  if (opts.method && opts.method.toUpperCase() === 'POST') {
    opts.data = Object.assign({}, opts.params, opts.data)
    opts.params = {}
  }
  var res = axios(opts)
  return res
}
