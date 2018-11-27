/* eslint-disable */
/**
 * 微信类方法
 */
import { wechatFetch, getVeriFetchParams } from './utils'

// export const IS_WECHAT = _isWechat()
export const getIsWechat = _isWechat

function _isWechat() {
  var ua = navigator.userAgent
  // console.log('(/MicroMessenger/i).test(navigator.userAgent)', (/MicroMessenger/i).test(ua))
  return (/MicroMessenger/i).test(ua)
}

/**
 * 微信授权方法
 */

export const Auth = function(opt = {}) {
  var opts = getVeriFetchParams({device_type: 'wx'}, false)
  let furl = window.btoa(opt.furl || location.href)
  let nfurl = window.btoa(opt.nfurl || location.href)
  opts = {
    furl,
    nfurl,
    ...opts
  }
  var query = ''
  for (var key in opts) {
    if(query.length) {
      query += '&'
    }
    query += key
    query += '='
    query += opts[key]
  }
  window.location.href = `https://pa18-pweb.pingan.com/wechat/WpaUser/authorize?${query}`
}

/**
 * 获取微信用户信息
 */

export const getWechatUser = function(openId) {
  return wechatFetch({
    url: 'https://pa18-pweb.pingan.com/wechat/WpaUser/getUserInfo',
    params: {
      open_id: openId
    },
    type: 'GET'
  }).then(data => {
    // console.log(data)
    if (data.data.code === 0) {
      return Promise.resolve(data.data.data)
    }
    if (data.data.code === 3) {
      Auth()
    }
  })
}

export const wxShare = {
  inited: false,
  initScript: false,
  config: {},
  init: function(callback) {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js'
    script.onload = () => {
      console.log('init wechat script complete')
      this.initScript = true
      callback && callback()
    }
    head.appendChild(script)
  },
  initShare: function(title, desc, imgUrl, link, successCallback, failCallback) {
    var shareObj = {
      title: title || document.title,
      desc: desc || '中国平安',
      link: link || location.href,
      imgUrl: imgUrl || 'https://resources.pingan.com/app_series/huodong/mWechatShare.jpg',
      success: function(res) {
        // console.log('wechatShareSuccess:', res)
        successCallback && successCallback(res)
      },
      cancel: function(err) {
        console.log('wechatShareError:', err)
        failCallback && failCallback(err)
      }
    }
    var wx = window.wx
    // 分享给朋友
    wx.onMenuShareAppMessage(shareObj)
    // 分享朋友圈
    wx.onMenuShareTimeline(shareObj)
    // 分享QQ
    wx.onMenuShareQQ(shareObj)
    // 分享腾讯微博
    wx.onMenuShareWeibo(shareObj)
  },
  initWechat: function(callback) {
    var wx = window.wx
    this.initConfig()
    // console.log(this.config)
    this.getSignature().then((data) => {
      data = data.data.data
      console.log(data)
      var wxConfig = {
        debug: process.env.NODE_ENV === 'development',
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo'
        ]
      }
      wx.config(wxConfig)
      wx.error(function(res) {
        console.log('wxerror:', res)
      })
      wx.checkJsApi({
        jsApiList: wxConfig.jsApiList,
        success: function(res) {
          console.log('wxCheckJsApi success:', res)
        }
      })
      wx.ready(() => {
        console.log('wxCheckJsApi Ready')
        this.inited = true
        if (callback && typeof callback === 'function') {
          callback()
        }
        // if (shareStage) {
        //   shareStage()
        //   shareStage = undefined
        // }
      })
    })
  },
  initConfig: function(custom = {}) {
    let defaultConf = {
      ucp_uri: 'https://pa18-pweb.pingan.com/wechat/Wxjssdk/getSign',
    }
    // if (/127|stg/.test(location.host)) {
    //   Object.assign(defaultConf, {
    //     ucp_uri: 'http://eim-talk-stg.dmzstg.pingan.com.cn/pars-pir'
    //   })
    // }
    this.config = Object.assign(defaultConf, custom)
  },
  getSignature: function() {
    console.log('getSignature')
    return wechatFetch({
      url: this.config.ucp_uri,
      type: 'GET',
      params: {
        request_url: window.btoa(location.href),
        ...getVeriFetchParams({device_type: 'wx'}, false)
      }
    })
    // .then(res => {
    //   console.log(res)
    //   // var resData = JSON.parse(res)
    //   callback && callback(res.data.data)
    // }, err => {
    //   console.log('getSignatureErr', err)
    // })
  }
}

let shareStage

export function regWxShare(title, desc, imgUrl, link, success, fail) {
  if (!wxShare.inited) {
    return shareStage = function() {
      return wxShare.initShare(title, desc, imgUrl, link, success, fail)
    }
  }
  wxShare.initShare(title, desc, imgUrl, link, success, fail)
}
