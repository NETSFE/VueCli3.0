import {getRandomString} from '@utils/util'

/*
* 原生接口方法封装
*/

/**
 * APP参数定义 key为params 数组方式传入
 * loginState
 * partyNo
 * clientNo
 *
 * APP方法定义
 * nativeNeedLogin 登陆跳转
*/

// const isDev = process.env.NODE_ENV === 'development'
/*
 * 当前native设备标识
*/
export const DEVICE = getDevice()
/**
 * hybridApp标识
*/
export const IS_NATIVE = checkNative()
// export const IS_NATIVE = true

/**
 * TalkingDataBuriedPoint
 * 埋点方法
 */

export const talkingDataBuriedPoint = function(opts = {}) {
  return callFn(opts, 'TalkingDataBuriedPoint')
}

/**
 * 分享
 * callback 1成功 0失败
*/

export const gotoShare = function(opts = {}) {
  return callFn(opts, 'nativeGotoShare')
}

/**
 * 登陆跳转调用
 * @param opts.errMsg 错误信息 给APP作为错误信息展示
 * callback 返回一个state字符串 failed失败 success成功
*/

export const needLogin = function(opts = {}) {
  return callFn(opts, 'nativeNeedLogin')
}

/**
 * 调用补全五项信息页面
 * @param opts.errMsg 错误信息 给APP作为错误信息展示
 * callback 返回一个state字符串 failed失败 success成功
*/

export const needFixBasicInfo = function(opts = {}) {
  return callFn(opts, 'nativeNeedPerfectBasicInfo')
}
// 打开我的奖品页面时新开一个容器
export const openMyPrise = function(opts = {}) {
  console.log('nativeOpenMyPrize')
  return callFn(opts, 'nativeOpenMyPrize')
}
// 隐藏右上角我的奖品
export const hideMyPrise = function(opts = {}) {
  console.log('nativeHideMyPrizeButton')
  return callFn(opts, 'nativeHideMyPrizeButton')
}

// 显示右上角我的奖品
export const showMyPrise = function(opts = {}) {
  console.log('nativeShowMyPrizeButton')
  return callFn(opts, 'nativeShowMyPrizeButton')
}
// 邀请好友
export const invitePerson = function(opts = {}) {
  console.log('nativeOpenShareInviteRegister')
  return callFn(opts, 'nativeOpenShareInviteRegister')
}
/**
 * 打开GPS
 * callback 返回一个state字符串 failed失败 success成功
*/

export const needOpenGPS = function(opts = {}) {
  return callFn(opts, 'nativeOpenGPS')
}

/**
 * 打开I贷SDK
 * opts = { params: {jsonStr: "{'mobile': '手机号'}"} }
*/

export const callILoan = function(opts = {}) {
  return callFn(opts, 'nativeCallILoan')
}

/**
 * 打开第三方链接
 * callback 返回不知
*/

export const jumpLink = function(opts = {}) {
  return callFn(opts, 'nativeOpenBrowserPage')
}

/**
 * 获取GPS状态
 * 1 已打开 0 未打开
*/

export const getGPSStatus = function(opts = {}) {
  // alert('getGPSStatus')
  return callFn(opts, 'nativeGPSStatus')
}

/*
* 获取内容函数
*/

export const getParams = function(opts = {}) {
  let o = Object.assign({}, opts)
  if (!o.params || o.params.length === 0) {
    Promise.resolve({
      code: 666,
      msg: '需要传入params'
    })
  }
  if (!checkNewNative()) {
    o.params = o.params.join('|')
  }
  console.log(o)
  return callFn(o, 'nativeGetParams')
}

/**
 * 获取登陆后数据
 * opts: {params: ['phone']}
 */

export const getDataWithLogin = function(opts = {}, autoFetch = true) {
  if (!opts.params || opts.params.length === 0) {
    return Promise.reject({
      code: 666,
      msg: 'getDataWithLogin prams必填且不能为空'
    })
  }
  opts.params.push('loginState')
  let pm = getParams(opts)
  return pm.then(function(data) {
    if (Number(data.loginState) === 0) {
      return needLogin().then(function(state) {
        if (!autoFetch) {
          return false
        }
        if (state === 'failed') {
          return Promise.resolve({
            code: 666,
            msg: '请先进行登录后再操作'
          })
        }
        return getParams(opts)
      })
    }
    return Promise.resolve(data)
  })
}

/*
* 获取登陆状态 0未登录 1已登陆
*/

export const isLogin = function(opts = {}) {
  // console.log(123)
  return callFn(opts, 'nativeGetIsLogin')
}

/*
*跳转到活动页
*/
export const jumpActivity = function(opts = {}) {
  // console.log(123)
  console.log('nativeOpenActivityHomePage')
  return callFn(opts, 'nativeOpenActivityHomePage')
}
/*
* 隐藏返回按钮方法
*/

export const hideBackbutton = function(opts = {}) {
  // console.log(123)
  return callFn(opts, 'hideBackbutton')
}

/*
* 获取partyNo
*/

export const getPartyNo = function(opts = {}) {
  return callFn(opts, 'nativeGetPartyNo')
}
/*
* 获取当前城市
*/

export const getCity = function(opts = {}) {
  return callFn(opts, 'nativeLocationInfo')
}

/*
* 获取clientNo
*/

export const getClientNo = function(opts = {}) {
  return callFn(opts, 'nativeGetClientNo')
}

/**
 * hybridApp标识
*/
// export const IS_NATIVE = checkNative()
// export const IS_NATIVE = true

export function checkNative() {
  return checkNewNative() || checkOldNative()
}

export function checkNewNative() {
  var device = getDevice()
  if (device === 'IOS') {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.commonNativeFunc
  }
  if (device === 'ANDROID') {
    return window.nativeClient && window.nativeClient.commonNativeFunc
  }
  return false
}

/**
 * 旧版APP标识
 */

export function checkOldNative() {
  var device = getDevice()
  if (device === 'IOS') {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeGetParams
  }
  if (device === 'ANDROID') {
    return window.nativeClient && window.nativeClient.nativeGetParams
  }
  return false
}

/*
* 获取当前Native设备
*/
export function getDevice() {
  const UA = window.navigator.userAgent
  if (UA.indexOf('Android') > -1 || UA.indexOf('Adr') > -1) {
    return 'ANDROID'
  }
  if (UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    return 'IOS'
  }
}

/**
* @description 调用容器 兼容浏览器及原生APP
*/
export const callFn = function(opts = {}, nativeType) {
  // if (!opts.type) {
  //   return false
  // }
  var isNative = checkNative()
  if (isNative && nativeType) {
    return callNativeFn(nativeType, opts)
  }
  return Promise.resolve({
    code: 666,
    msg: '这个是兼容浏览器环境的,现在还不知道发啥,需要再说吧'
  })
}

/**
* @description 调用APP协议底层
*/
export const callNativeFn = function(nativeType, opts = {}) {
  var cloneOpts = Object.assign({}, opts)
  var deviceType = getDevice()
  return new Promise(function(resolve) {
    const callbackName = 'callback_' + getRandomString(10)
    // 是否新APP协议
    const isNewApp = checkNewNative()
    cloneOpts.callback = callbackName
    window[callbackName] = function(data) {
      window[callbackName] = null
      if (isNewApp) {
        return resolve(JSON.parse(data).payload)
      }
      // console.log(data)
      return resolve(analyseData(data))
    }
    if (isNewApp) {
      var checkList = ['TalkingDataBuriedPoint', 'nativeCallILoan', 'nativeOpenBrowserPage']
      if (checkList.indexOf(nativeType) >= 0) {
        try {
          cloneOpts = JSON.parse(cloneOpts.jsonStr)
        } catch (e) {
          cloneOpts = cloneOpts.jsonStr
        }
      }
      var newOpts = {
        type: nativeType,
        payload: cloneOpts,
        callback: callbackName
      }
      delete cloneOpts.callback
      if (deviceType === 'IOS') {
        return window['webkit']['messageHandlers']['commonNativeFunc']['postMessage'](JSON.stringify(newOpts))
      }
      if (deviceType === 'ANDROID') {
        return window['nativeClient']['commonNativeFunc'](JSON.stringify(newOpts))
      }
    }
    // 旧版本协议处理
    return dealAppRequest(deviceType, cloneOpts, nativeType)
  })
}

/**
 * 旧版本APP兼容处理
 */

export const dealAppRequest = function(device, opts, nativeType) {
  const newOpts = {
    callback: opts.callback,
    ...opts
  }
  if (device === 'IOS') {
    let nativeFn = window['webkit']['messageHandlers'][nativeType]
    if (!nativeFn) return
    return window['webkit']['messageHandlers'][nativeType]['postMessage'](jointData(newOpts))
  }
  if (device === 'ANDROID') {
    let nativeFn = window['nativeClient'][nativeType]
    if (!nativeFn) return
    return window['nativeClient'][nativeType](jointData(newOpts))
  }
}

/*
* 拼接数据用于发送给APP
* @param opts [Object] 数据对象
*/
function jointData(opts = {}) {
  let data = ''
  for (let key in opts) {
    data += data.length > 0 ? '&' : ''
    data += key
    data += '='
    let value = opts[key]
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    data += encodeURIComponent(value)
  }
  return data
}

/*
* 解析APP过来的数据
* @param data [String] 数据
*/
function analyseData(data) {
  var result = {}
  var arr = data.split('&')
  if (arr.length === 1 && arr[0].split('=').length === 1) {
    return data
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    let arr2 = arr[i].split('=')
    result[arr2[0]] = decodeURIComponent(arr2[1])
  }
  return result
}
