const md5 = require('js-md5')
const PaWebJs = require('@static/pawebjs')
import { gotoShare } from '@utils/native'

export const typeOf = input => {
  return Object.toString.call(input).slice(8, -1).toLowerCase()
}

export const getQuery = function() {
  var search = location.search
  if (!search) return {}
  search = search.substring(1)
  search = search.split('&')
  var query = {}
  for (var i = 0; i < search.length; i++) {
    var item = search[i]
    item = item.split('=')
    if (!item[0]) continue
    query[item[0]] = decodeURIComponent(item[1])
  }
  return query
}

export const getVueQuery = function() {
  var hash = location.hash
  var search = hash.split('?')[1]
  var linkQuery = getQuery()
  if (!search) return linkQuery
  search = search.split('&')
  var query = {}
  for (var i = 0; i < search.length; i++) {
    var item = search[i]
    item = item.split('=')
    if (!item[0]) continue
    query[item[0]] = decodeURIComponent(item[1])
  }
  return Object.assign({}, linkQuery, query)
}

export const getToken = function() {
  var oneHour = 1000 * 60 * 60
  var loginToken = getStorage('login_token', oneHour) || ''
  console.log(loginToken)
  var userId = getStorage('user_id', oneHour) || ''
  console.log(userId)
  var rand = getRand(1000, 9999)
  var timestamp = new Date().getTime()
  var deviceType = 'm'
  var deviceId = md5(new PaWebJs().get())
  var token = md5(rand + '' + timestamp + userId + deviceId + deviceType)
  // console.log(new PaWebJs().get())
  return {
    user_id: userId,
    login_token: loginToken,
    rand: rand,
    timestamp: timestamp,
    device_type: deviceType,
    token: token,
    device_id: deviceId
  }
}

export const clearLogin = function() {
  localStorage.removeItem('login_token')
  localStorage.removeItem('user_id')
}

export const getRand = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export const setStorage = function(key, value) {
  var curTime = new Date().getTime()
  localStorage.setItem(key, JSON.stringify({data: value, time: curTime}))
}

export const getStorage = function(key, exp) {
  var data = localStorage.getItem(key)
  if (!data) {
    localStorage.removeItem(key)
    return false
  }
  var dataObj = JSON.parse(data)
  if (exp && new Date().getTime() - dataObj.time > exp) {
    localStorage.removeItem(key)
    return false
  }
  // var returnData = JSON.parse(dataObj.data)
  return dataObj.data
}

/*
* 获取随机字符串
* @param n [Number] 长度
*/
const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const getRandomString = function(n) {
  var res = ''
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35)
    res += chars[id]
  }
  return res
}

export const convertPostData = function(data) {
  // TODO 利用对象引用的原理 暂时没有找到替换方案
  var newData = {
    value: ''
  }
  for (var key in data) {
    convertObject(key, data[key], newData)
  }
  return newData.value
}

function convertObject(key, data, newData) {
  if (newData.value.length && newData.value[newData.value.length - 1] !== '&') {
    newData.value += '&'
  }
  switch (typeof data) {
    case 'number':
    case 'string':
      newData.value += key + '=' + data
      break
    case 'object':
      for (var k in data) {
        convertObject((key + '[' + k + ']'), data[k], newData)
      }
      break
    case 'undefined':
      newData.value += key + '='
      break
    default:
      newData.value += key + '=' + data
      break
  }
}
export const transformNum = function(num) {
  if (!num) {
    return num
  }
  // num = num.toString()
  // let regExp = /\d{1,3}(?=(\d{3})+(?:\.\d+)?$)/g
  // let res = num.replace(regExp, function(match) {
  //   return match + ','
  // })
  return parseInt(num).toLocaleString()
}

export const setCookie = function(cName, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
}

export const getCookie = function(cName) {
  if (document.cookie.length > 0) {
    var cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      var cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

/*
* app分享功能
*/
export const share = function(link, title, src, desc) {
  return new Promise((resolve) => {
    const url = process.env.NODE_ENV === 'production' ? `https://m.pingan.com/c3/app/${link}` : `http://stg5.pingan.com.cn:60880/pacms/c3/app/${link}`
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    var params
    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL('image/jpg')
      canvas = null
      params = {
        title: title,
        url: encodeURI(url),
        img: dataURL,
        desc: desc
      }
      resolve(params)
    }
  }).then(res => {
    return gotoShare({
      jsonStr: JSON.stringify(res)
    })
  })
}

/*
* 在vuex中操作
* 合并对象属性（在原始对象上进行修改）
*/
const merge = (obj, options) => {
  if (obj && options) {
    for (let p in options) {
      if (typeOf(obj[p]) === 'object' && typeOf(options[p]) === 'object') {
        merge(obj[p], options[p])
      } else {
        obj[p] = options[p]
      }
    }
  }
  return obj
}
