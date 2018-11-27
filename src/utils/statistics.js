  const env = process.env.NODE_ENV === 'production'
  export const statistics = function() {
    /* eslint-disable */
    // 百度统计
    var _hmt = _hmt || []
    function addScript () {
      var hm = document.createElement('script')
      hm.src = '//hm.baidu.com/hm.js?9369099388bd64a012949144efc749a1'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    }
    addScript()
    // 广告事件统计
    document.body.onclick = function (e) {
      
      let target = e.target
      while (target.tagName !== 'BODY' && (!target.dataset.eventCategory || !target.dataset.eventAction)){
        target = target.parentNode
      }
      if (target.tagName ==='BODY') {
        return
      }
      const data = target.dataset
      if (!data.eventCategory || !data.eventAction) {
        return
      }
      sendEvent(data.eventCategory, data.eventAction, data.eventParam)
    }
    function sendEvent (category, action, param) {
      // 发送事件统计
      window._hmt.push(['_trackEvent', category, action, param])
    }
    return
  }
  
  export const addReportScript = function() {
    var paReport = document.createElement('script')
    paReport.src = '//caap.pingan.com.cn/web/resources/js/PAReport/iPAReport.min.js'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(paReport, s)
  }
  
  export const webTrends = function() {
    var sdc = document.createElement('script')
    sdc.src = '//m.pingan.com/app_js/sdc/src/sdc_wap.js'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(sdc, s)
  }

  const Pad = function () {
    /* eslint-disable */
    // 天眼
    var appid, jsUrl
    if (env) {
      appid = '63AEB6EECBD140AD82DDF949CC3CA02F'
      jsUrl = 'https://dn-mailattachments.qbox.me/h5sdk001.js'
    } else {
      appid = 'EC6B426678654AC5B76D5C828A225008'
      jsUrl = 'https://test-padn-access.pingan.com.cn:3443/js/h5Sdk_test.js'
    }
    var _hmt = _hmt || []
    function addInnerScript () {
      var h = document.createElement('script')
      h.appendChild(document.createTextNode(`var pingan_sdk_appid = "${appid}"; var pingan_sdk_vn = "1.0"; var pingan_sdk_vc = "1.0";`))
      var s = document.getElementsByTagName('body')[0]
      s.appendChild(h)
    }
    function addScript () {
      var hm = document.createElement('script')
      hm.src = jsUrl
      // hm.src = 'https://test-padn-access.pingan.com.cn:3443/js/h5Sdk_test.js'
      var s = document.getElementsByTagName('body')[0]
      s.appendChild(hm)
    }
    addInnerScript()
    addScript()
    return
  }

  export const hmAndPad = function () {
    var _hmt = _hmt || []
    function addScript () {
      var hm = document.createElement('script')
      hm.src = '//hm.baidu.com/hm.js?9369099388bd64a012949144efc749a1'
      var s = document.getElementsByTagName('body')[0]
      s.appendChild(hm)
    }
    addScript()
    function isEmpty(obj) {
      for (var name in obj) {
        if (obj.hasOwnProperty('eventCategory')) {
          return false;
        }
      }
      return true;
    };
    Pad()
    // 广告事件统计
    document.body.onclick = function (e) {
      var target = e.target;
      while (isEmpty(target.dataset) && target.tagName !== 'BODY') {
        target = target.parentNode;
      }
      var data = target.dataset;
      if (target.tagName === 'A') {
        e.preventDefault();
      }
      var href = target.href;
      var id = data.id;
      if (id) {
        try {
          // _smq.push(['custom', 'Mob', id]);
          PAReport.setEventReport(id);
        } catch (e) {
          console.log('err', e)
        }
      }
      if (data.eventCategory && data.eventAction && data.eventParam) {
        sendEvent(data.eventCategory, data.eventAction, data.eventParam);
        if (SKAPP) {
          SKAPP.onEvent(data.eventCategory)
        }
      }
      setTimeout(function () {
        if (!target.href) {
          return;
        }
        location.href = href;
      }, 500)
    }
  
    function sendEvent(category, action, param) {
      // 发送事件统计
      window._hmt.push(['_trackEvent', category, action, param])
    }
    return
  }

  export const HPC = function () {
    var _hmt = _hmt || []
    function addScript () {
      var hm = document.createElement('script')
      hm.src = '//hm.baidu.com/hm.js?9369099388bd64a012949144efc749a1'
      var s = document.getElementsByTagName('body')[0]
      s.appendChild(hm)
    }
    addScript()
    addReportScript()
    function isEmpty(obj) {
      for (var name in obj) {
        if (obj.hasOwnProperty('eventCategory')) {
          return false;
        }
      }
      return true;
    };
    Pad()
    // 广告事件统计
    document.body.onclick = function (e) {
      var target = e.target;
      while (isEmpty(target.dataset) && target.tagName !== 'BODY') {
        target = target.parentNode;
      }
      var data = target.dataset;
      if (target.tagName === 'A' && target.className !== 'egg') {
        e.preventDefault();
      }
      var href = target.href;
      console.log(target.id)
      var id = data.id;
      if (id) {
        try {
          // _smq.push(['custom', 'Mob', id]);
          PAReport.setEventReport(id);
        } catch (e) {
          console.log('err', e)
        }
      }
      if (data.eventCategory && data.eventAction && data.eventParam) {
        sendEvent(data.eventCategory, data.eventAction, data.eventParam);
        if (SKAPP) {
          SKAPP.onEvent(data.eventCategory, data.eventCategory)
        }
      }
      setTimeout(function () {
        if (!target.href) {
          return;
        }
        location.href = href;
      }, 2000)
    }
  
    function sendEvent(category, action, param) {
      // 发送事件统计
      window._hmt.push(['_trackEvent', category, action, param])
    }
    return
  }
  // export const admaster = function() {
  //   var adm = document.createElement('script')
  //   adm.innerHTML = '!(function(a,b,c,d,e,f){var g="",h=a.sessionStorage,i="__admaster_ta_param__",j="tmDataLayer"!==d?"&dl="+d:"";if(a[f]={},a[d]=a[d]||[],a[d].push({startTime:+new Date,event:"tm.js"}),h){var k=a.location.search,l=new RegExp("[?&]"+i+"=(.*?)(&|#|$)").exec(k)||[];l[1]&&h.setItem(i,l[1]),l=h.getItem(i),l&&(g="&p="+l+"&t="+ +new Date)}var m=b.createElement(c),n=b.getElementsByTagName(c)[0];m.src="//tag.cdnmaster.cn/tmjs/tm.js?id="+e+j+g,m.async=!0,n.parentNode.insertBefore(m,n)})(window,document,"script","tmDataLayer","TM-944440","admaster_tm");'
  //   var head = document.head || document.getElementsByTagName('head')[0]
  //   head.appendChild(adm)
  // }
