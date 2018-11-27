let imgList = []
let offet = document.documentElement.clientHeight / 2
let delay
let time = 18

/* 刷新率60Hz, 所有图片都会加载 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60)
    }
})()

/* 防抖，当前及以下半个视窗内的图片会加载 */
function _lazyLoadDelay(loadPart = false) {
  if (loadPart) {
    clearTimeout(delay)
    delay = setTimeout(() => {
      _loadImg()
    }, time)
  } else {
    window.requestAnimFrame(_loadImg)
  }
}

function _isShow(el) {
  let coords = el.getBoundingClientRect()
  return coords.top <= document.documentElement.clientHeight + parseInt(offet) && coords.top >= 0
}

function _loadImg() {
  for (let i = 0, len = imgList.length; i < len; i++) {
    if (_isShow(imgList[i])) {
      imgList[i].src = imgList[i].getAttribute('data-src')
      imgList.splice(i, 0)
    }
  }
}

export const lazyload = {
  mounted() {
    let loadPart = this.$options.loadPart === 'undefined' ? '' : this.$options.loadPart
    _lazyLoadDelay(loadPart)
    window.addEventListener('scroll', function(e, loadPart) {
      _lazyLoadDelay(loadPart)
    }, false)
  },
  directives: {
    lazyload: {
      bind(el, binding) {
        imgList.push(el)
      }
    }
  }
}
