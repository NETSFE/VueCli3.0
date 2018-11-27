<template>
  <div class="yanzhi">
    <preload :imgUrlArr="imgUrls" @imgAllLoaded="imgAllLoaded"></preload>
    <transition name="show">
      <div class="index-page" v-show="show">
        <!--<div class="title" :class="{'bounceIn': show}">
          <img src="../../assets/yanzhi/title.png" alt="年终奖有多少？测测颜值便知晓">
        </div>
        <div class="man">
          <img src="../../assets/yanzhi/man.png">
        </div>-->
        <div class="index-wrap" v-show="!showUploadModal">
          <button class="start-btn" otype="button" otitle="蛙儿子-Click_upload" data-event-param="蛙儿子-Click_upload" data-event-category="蛙儿子-Click_upload" data-event-action="click" @click="startClick()">立即上传你的靓照</button>
          <input type="file" accept="image/*" @change="updatePreviewImg" ref="fileInput">
          <!--<img src="../../assets/yanzhi/btn-text.png">-->
        </div>
      </div>
    </transition>
    <transition name="show">
      <div class="upload-modal" v-show="showUploadModal" ref="uploadModal">
        <div class="upload-content">
          <div class="preview-container" ref="previewContainer">
            <div class="picture" ref="picContainer">
              <div :style="`background-image:url(${previewImageUrl})`" ref="previewImg"></div>
            </div>
            <div class="scan-wrap" v-show="scanning">
              <div class="scan-bg">
                <div class="scan-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="scan-line"></div>
            </div>
          </div>
          <div class="upload-info" v-show="!scanning">
            <div class="tips">
              <img src="../../assets/yanzhi/upload-txt.png">
            </div>
            <p>还请上报你的大名</p>
            <input type="text" v-model="userName" placeholder="还没输入姓名哦~" maxlength="8" @focus="focusHandler" @blur="blurHandler">
            <button otitle="蛙儿子-Write_name" data-event-param="蛙儿子-Write_name" data-event-category="蛙儿子-Write_name" data-event-action="click" class="upload-btn" @click="upload" :disabled="!previewImageUrl || !userName">查看蛙儿子类型</button>
          </div>
          <div class="scanning-info" v-show="scanning">
            <p class="big">AI机器人正在计算你的颜值</p>
            <p class="small">据说，颜值高的都比较耗时...</p>
            <p class="progress">{{percent}}%</p>
          </div>
        </div>
      </div>
    </transition>
    <div class="result-modal" v-show="showResultModal">
      <div class="box-wrap" ref="boxWrap" >
        <div class="box">
          <div class="avator">
            <img :src="uploadImageUrl">
          </div>
          <p class="user-name">{{userName}}养的蛙儿子是：</p>
          <div class="result-img">
            <img :src="resultTxtUrl">
          </div>
          <div class="plate">
            <p class="result-text">{{resultText}}</p>
            <div class="qrcode">
              <img src="../../assets/yanzhi/qrcode.png">
            </div>
          </div>
        </div>
      </div>
      <div class="result-box-wrap" :class="{'fadeInDown': resultImageUrl}">
        <div class="img-box">
          <img :src="resultImageUrl" v-show="resultImageUrl">
        </div>
      </div>
      <div class="btn-wrap">
        <div class="save">
          <img src="../../assets/yanzhi/longsave.png">
        </div>
        <div class="btn-group">
          <div class="flex">
            <button :class="isFace ? 'restart1': 'restart'" @click="restart" otitle="蛙儿子-Reupload" data-event-param="蛙儿子-Reupload" data-event-category="蛙儿子-Reupload" data-event-action="click">换一张试试</button>
            <button class="share" v-if="!isFace" @click="share" otitle="蛙儿子-share" data-event-param="蛙儿子-share" data-event-category="蛙儿子-share" data-event-action="click">分享给好友</button>
            <button class="jump" v-if="isFace"  @click="gift" otitle="蛙儿子-click_frog_gift" data-event-param="蛙儿子-click_frog_gift" data-event-category="蛙儿子-click_frog_gift" data-event-action="click">领取蛙儿子的礼物</button>
          </div>
        </div>
        <div class="bottom-text">
          <p class="bottom-texts">依托于平安科技人脸识别技术及大数据智能引擎分析</p>
          <p class="bottom-texts">平安科技中国平安官网团队出品</p>
        </div>
      </div>
      <transition name="show">
        <p class="drawing-tips" v-show="!resultImageUrl">
      茫茫蛙海中，哪一只才是你的蛙儿子，机器人已哭瞎，请耐心等候...</p>
      </transition>
    </div>
    <div v-show="showResult" class="haveResultBg">
      <div class="haveResult">
        <p class="haveResult-text">恭喜你有机会获得：安仔</p>
        <img src="../../assets/yanzhi/gongzai.png"/>
        <p class="haveResult-text1">我们将会在后台随机抽取数名幸运儿，在3月份统一发放公仔，数量有限先到先得。中奖的蛙妈蛙爸请注意查收短信，届时我们会有工作人员与您联系，敬请留意。如有疑问，请添加微平安（weipingan95511）进行咨询。</p>
        <div class="flex">
          <button class="restart" @click="restart" otitle="蛙儿子-Reupload" data-event-param="蛙儿子-Reupload" data-event-category="蛙儿子-Reupload" data-event-action="click">回到首页</button>
          <button class="share"  @click="share" otitle="蛙儿子-share" data-event-param="蛙儿子-share" data-event-category="蛙儿子-share" data-event-action="click">分享给好友</button>
        </div>
      </div>
    </div>
    <div class="share-modal" v-show="showShareModal" @click="showShareModal=!showShareModal">
      <img src="../../assets/yanzhi/share.png" class="share-img" v-show="isWechat">
      <img src="../../assets/yanzhi/share1.png" class="share-img1" v-show="!isWechat">
    </div>
    <!-- <LoginBox ref="loginbox" :loginCallback="loginCallback"></LoginBox> -->
  </div>
</template>

<script>
import { statistics, webTrends } from '@utils/statistics'
import Preload from '@components/yanzhi/preload'
import Exif from 'exif-js'
import $ from 'jquery'
import html2canvas from 'html2canvas'
import {mFetchData} from '@utils/utils'
import {getToken} from '@utils/util'
import {prefixStyle} from '@utils/dom'
import {postFaceInfo} from '@utils/urls'
import {wxShare} from '@utils/wechat'
import bg from '@assets/yanzhi/bg.png'
import save from '@assets/yanzhi/longsave.png'
import uploadTxt from '@assets/yanzhi/upload-txt.png'
// import uploadBtn from '@assets/yanzhi/upload-btn.png'
import bgScan from '@assets/yanzhi/bg-scan.png'
// import bgBox from '@assets/yanzhi/bg-box.png'
import mid2 from '@assets/yanzhi/m2.png'
import mid3 from '@assets/yanzhi/m3.png'
import mid4 from '@assets/yanzhi/m4.png'
import mid5 from '@assets/yanzhi/m5.png'
import mid6 from '@assets/yanzhi/m6.png'
import mid7 from '@assets/yanzhi/m7.png'
import mid8 from '@assets/yanzhi/m8.png'
import mid9 from '@assets/yanzhi/m9.png'
import mid10 from '@assets/yanzhi/m10.png'
import mid11 from '@assets/yanzhi/m11.png'
import mid12 from '@assets/yanzhi/m12.png'
import mid13 from '@assets/yanzhi/m13.png'
import error from '@assets/yanzhi/error.png'
import share from '@assets/yanzhi/share.png'
import share1 from '@assets/yanzhi/share1.png'
import resultbg from '@assets/yanzhi/resultbg.jpg'
import {resultTexts} from '@utils/faceaiConfig'

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://pa18-pweb.pingan.com' : 'http://103.28.215.253:181'
const uploadUrl = `${baseUrl}/facial/index`
const MAX_SIZE = 1024 * 1024 // 图片最大限制1MB
const MAX_SCALE = 2
const MIN_SCALE = 1
const transform = prefixStyle('transform')
const isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
const rImg = [mid2, mid3, mid4, mid5, mid6, mid7, mid8, mid9, mid10, mid11]
export default {
  components: {
    Preload
    // LoginBox
  },
  data() {
    return {
      imgUrls: [bg, uploadTxt, bgScan, save, error, share, share1, resultbg],
      show: false,
      showUploadModal: false,
      previewImageUrl: '',
      uploadImageUrl: '',
      userName: '',
      fileTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      scanning: false,
      percent: 0,
      showResultModal: false,
      resultTxtUrl: '',
      resultText: '',
      resultImageUrl: '',
      showShareModal: false,
      isWechat: false,
      isFace: true,
      showResult: false,
      file: ''
    }
  },
  beforeCreate() {
    wxShare.beforeInit(() => {
      wxShare.init('oMbAEuONvyGY90X_yfbxQZ9ve6vQ', true, () => {
        wxShare.initWeixinANA(
          '蛙儿子还是蛙丈夫？请收好这份测试秘籍',
          '蛙儿子还是蛙丈夫？请收好这份测试秘籍',
          '世界上的蛙有6000多种，快来测试你养的蛙儿子是哪一种？',
          'https://resources.pingan.com/app_series/caishenjie/images/waezi-share.jpg',
          location.href
        )
      })
    })
  },
  mounted() {
    // this.$refs.loginbox.show()
    statistics()
    webTrends()
    this.isWechat = /micromessenger/.test(navigator.userAgent.toLowerCase())
    const previewContainer = this.$refs.previewContainer
    const previewImg = this.$refs.previewImg
    // eslint-disable-next-line
    const imgHammer = new Hammer(previewImg)

    imgHammer.get('pan').set({
      // eslint-disable-next-line
      direction: Hammer.DIRECTION_ALL
    })

    imgHammer.on('panstart', () => {
      if (!imgHammer.maxY || !imgHammer.maxX) {
        const img = new Image()
        img.src = this.previewImageUrl
        const imgW = img.width
        const imgH = img.height
        const maxY = imgH / (imgW / previewContainer.clientWidth) - previewContainer.clientHeight | 0
        const maxX = imgW / (imgH / previewContainer.clientHeight) - previewContainer.clientWidth | 0
        imgHammer.maxY = maxY > 0 ? maxY : 0
        imgHammer.maxX = maxX > 0 ? maxX : 0
        console.log(`maxX: ${imgHammer.maxX}, maxY: ${imgHammer.maxY}`)
      }
      imgHammer.startX = imgHammer.startX || 0
      imgHammer.startY = imgHammer.startY || 0
      imgHammer.initX = imgHammer.startX || 0
      imgHammer.initY = imgHammer.startY || 0
    })

    imgHammer.on('panmove', e => {
      imgHammer.startX = imgHammer.initX + e.deltaX
      imgHammer.startY = imgHammer.initY + e.deltaY
      if (imgHammer.startX < -imgHammer.maxX) {
        imgHammer.startX = -imgHammer.maxX
      }
      if (imgHammer.startX > 0) {
        imgHammer.startX = 0
      }
      if (imgHammer.startY < -imgHammer.maxY) {
        imgHammer.startY = -imgHammer.maxY
      }
      if (imgHammer.startY > 0) {
        imgHammer.startY = 0
      }
      previewImg.style.backgroundPositionX = `${imgHammer.startX}px`
      previewImg.style.backgroundPositionY = `${imgHammer.startY}px`
    })

    imgHammer.get('pinch').set({ enable: true })

    imgHammer.on('pinchstart', () => {
      imgHammer.startScale = imgHammer.startScale || 1
      imgHammer.initScale = imgHammer.startScale || 1
    })
    // 放大
    imgHammer.on('pinchout', e => {
      imgHammer.startScale = imgHammer.initScale + (e.scale - 1)
      if (imgHammer.startScale >= MAX_SCALE) {
        imgHammer.startScale = MAX_SCALE
      }
      previewImg.style[transform] = `scale(${imgHammer.startScale})`
    })
    // 缩小
    imgHammer.on('pinchin', e => {
      imgHammer.startScale = imgHammer.initScale - (1 - e.scale)
      if (imgHammer.startScale >= MAX_SCALE) {
        imgHammer.startScale = MAX_SCALE
      }
      if (imgHammer.startScale <= MIN_SCALE) {
        imgHammer.startScale = MIN_SCALE
      }
      previewImg.style[transform] = `scale(${imgHammer.startScale})`
    })
  },
  methods: {
    startClick() {
      // eslint-disable-next-line
      // _smq.push(['custom', 'Mob', 'Mob_1'])
      this.$refs.fileInput.click()
    },
    // linkClick() {
    //   // eslint-disable-next-line
    //   _smq.push(['custom', 'Mob', 'Mob_6'])
    // },
    imgAllLoaded() {
      this.show = true
    },
    updatePreviewImg(e) {
      let files = e.target.files || e.dataTransfer.files

      if (!files.length) return
      let file = files[0]
      if (this.validFileType(file)) {
        alert('文件格式不对！')
        return
      }
      this.imgPreview(file)
    },
    imgPreview(file) {
      let self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, 'Orientation')
      })
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader()
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function() {
          self.showUploadModal = true
          self.rotateImg(this.result, Orientation, function(data) {
            self.previewImageUrl = data
            self.$refs.previewImg.style.backgroundPositionX = 0
            self.$refs.previewImg.style.backgroundPositionY = 0
            self.$refs.previewImg.style[transform] = `scale(1)`
          })
        }
      }
    },
    upload() {
      // eslint-disable-next-line
      // _smq.push(['custom', 'Mob', 'Mob_2'])
      this.scanning = true
      this.$refs.uploadModal.scrollTop = 0

      this.drawImage(this.$refs.picContainer).then(canvas => {
        this.uploadImageUrl = canvas.toDataURL('image/jpeg')
        const newBlob = this.dataURLtoBlob(this.uploadImageUrl)
        if (newBlob.size > MAX_SIZE) {
          alert('图片大小超过1MB，请重新上传')
          this.restart()
          return
        }
        const commonParas = getToken()
        let fData = new FormData()
        let self = this

        fData.append('img', newBlob, '.jpeg')
        for (let key in commonParas) {
          fData.append(key, commonParas[key])
        }

        $.ajax({
          url: uploadUrl,
          type: 'POST',
          data: fData,
          cache: false,
          processData: false,
          contentType: false,
          timeout: 20000,
          xhr: function() {
            let myXhr = $.ajaxSettings.xhr()
            if (myXhr.upload) {
              myXhr.upload.onprogress = self.progressHandler
            }
            return myXhr
          }
        }).done((res) => {
          console.log(res.code)
          let self = this
          this.showUploadModal = false
          this.showResultModal = true
          const similarity = res.data.score
          // let id = Math.ceil(Math.random() * 9)
          if (res.code === 0) {
            this.isFace = true
            this.file = res.data.file
            if (similarity < 0.2) {
              this.resultTxtUrl = mid12
              this.resultText = resultTexts[10]
            } else if (similarity >= 0.2 && similarity <= 0.23) {
              this.resultTxtUrl = rImg[0]
              this.resultText = resultTexts[0]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.23 && similarity <= 0.25) {
              this.resultTxtUrl = rImg[1]
              this.resultText = resultTexts[1]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.25 && similarity <= 0.28) {
              this.resultTxtUrl = rImg[8]
              this.resultText = resultTexts[8]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.28 && similarity <= 0.32) {
              this.resultTxtUrl = rImg[2]
              this.resultText = resultTexts[2]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.32 && similarity <= 0.36) {
              this.resultTxtUrl = rImg[3]
              this.resultText = resultTexts[3]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.36 && similarity <= 0.38) {
              this.resultTxtUrl = rImg[4]
              this.resultText = resultTexts[4]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.38 && similarity <= 0.4) {
              this.resultTxtUrl = rImg[9]
              this.resultText = resultTexts[9]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.4 && similarity <= 0.44) {
              this.resultTxtUrl = rImg[5]
              this.resultText = resultTexts[5]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.44 && similarity <= 0.48) {
              this.resultTxtUrl = rImg[6]
              this.resultText = resultTexts[6]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.48 && similarity <= 0.5) {
              this.resultTxtUrl = rImg[7]
              this.resultText = resultTexts[7]
              console.log(this.resultTxtUrl, this.resultText)
            } else if (similarity > 0.5 && similarity <= 1) {
              this.resultTxtUrl = mid13
              this.resultText = resultTexts[11]
            }
          }
          if (res.code === 1 || res.code === 5 || res.code === 7) {
            this.resultTxtUrl = error
            this.resultText = resultTexts[12]
            this.isFace = false
          }
          setTimeout(() => {
            this.drawImage(this.$refs.boxWrap).then(canvas => {
              const img = new Image()
              const imgUrl = canvas.toDataURL('image/png')
              img.src = imgUrl
              img.onload = function() {
                self.resultImageUrl = imgUrl
              }
            })
          }, 200)
        }).fail((xhr, textStatus) => {
          this.scanning = false
          if (textStatus === 'timeout') {
            alert('网络超时，请重试！')
            return
          }
          alert('系统错误，请稍后再试！')
        })
      })
    },
    progressHandler(e) {
      if (e.lengthComputable) {
        this.percent = ~~(e.loaded / e.total * 100)
      }
    },
    restart() {
      // eslint-disable-next-line
      // _smq.push(['custom', 'Mob', 'Mob_3'])
      console.log('restart')
      this.showUploadModal = false
      this.previewImageUrl = ''
      this.uploadImageUrl = ''
      this.userName = ''
      this.percent = 0
      this.scanning = false
      this.showResultModal = false
      this.resultImageUrl = ''
      this.$refs.fileInput.value = ''
      this.showResult = false
    },
    gift() {
      this.$refs.loginbox.show()
    },
    rotateImg(img, direction, next) {
      let image = new Image()
      image.onload = function() {
        let degree = 0
        let drawWidth
        let drawHeight
        let width
        let height
        drawWidth = this.naturalWidth
        drawHeight = this.naturalHeight
        // 以下改变一下图片大小
        let maxSide = Math.max(drawWidth, drawHeight)
        if (maxSide > 1024) {
          let minSide = Math.min(drawWidth, drawHeight)
          minSide = minSide / maxSide * 1024
          maxSide = 1024
          if (drawWidth > drawHeight) {
            drawWidth = maxSide
            drawHeight = minSide
          } else {
            drawWidth = minSide
            drawHeight = maxSide
          }
        }
        let canvas = document.createElement('canvas')
        canvas.width = width = drawWidth
        canvas.height = height = drawHeight
        let context = canvas.getContext('2d')
        // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        switch (direction) {
        // iphone横屏拍摄，此时home键在左侧
        case 3:
          degree = 180
          drawWidth = -width
          drawHeight = -height
          break
          // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
          canvas.width = height
          canvas.height = width
          degree = 90
          drawWidth = width
          drawHeight = -height
          break
          // iphone竖屏拍摄，此时home键在上方
        case 8:
          canvas.width = height
          canvas.height = width
          degree = 270
          drawWidth = -width
          drawHeight = height
          break
        }
        // 使用canvas旋转校正
        context.rotate(degree * Math.PI / 180)
        context.drawImage(this, 0, 0, drawWidth, drawHeight)
        // 返回校正图片
        next(canvas.toDataURL('image/jpeg', 1))
      }
      image.src = img
    },
    // dataURL转Blob
    dataURLtoBlob(dataURL) {
      let binaryString = atob(dataURL.split(',')[1])
      let arrayBuffer = new ArrayBuffer(binaryString.length)
      let intArray = new Uint8Array(arrayBuffer)
      let mime = dataURL.split(',')[0].match(/:(.*?);/)[1]
      for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i)
      }
      let data = [intArray]
      let result
      try {
        result = new Blob(data, {
          type: mime
        })
      } catch (error) {
        window.BlobBuilder = window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder
        if (error.name === 'TypeError' && window.BlobBuilder) {
          var builder = new window.BlobBuilder()
          builder.append(arrayBuffer)
          result = builder.getBlob()
        } else {
          throw new Error('没救了')
        }
      }
      return result
    },
    validFileType(file) {
      for (let index of this.fileTypes) {
        if (file.type === this.fileTypes[index]) {
          return true
        }
      }
      return false
    },
    getDPR() {
      return window.devicePixelRatio && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1
    },
    drawImage(dom) {
      // 获取想要转换的 DOM 样式
      const box = window.getComputedStyle(dom)
      // DOM 节点计算后宽高
      const dWidth = parseInt(box.width, 10)
      const dHeight = parseInt(box.height, 10)

      // 获取像素比
      const scaleBy = this.getDPR()
      // 创建自定义 canvas 元素
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
      canvas.width = dWidth * scaleBy
      canvas.height = dHeight * scaleBy
      // 设定 canvas css宽高为 DOM 节点宽高
      canvas.style.width = `${dWidth}px`
      canvas.style.height = `${dHeight}px`

      // 将所有绘制内容放大像素比倍
      context.scale(scaleBy, scaleBy)

      // 将自定义 canvas 作为配置项传入，开始绘制
      return html2canvas(dom, {canvas, useCORS: true})
    },
    share() {
      // eslint-disable-next-line
      // _smq.push(['custom', 'Mob', 'Mob_4'])
      this.showShareModal = true
    },
    focusHandler() {
      if (isAndroid) {
        this.timer = setTimeout(() => {
          this.$refs.uploadModal.scrollTop = 999
        }, 500)
      }
    },
    blurHandler() {
      if (isAndroid) {
        clearInterval(this.timer)
        this.$refs.uploadModal.scrollTop = 0
      }
    },
    loginCallback(userdata) {
      var data = {
        mobile: userdata.phone,
        file: this.file
      }
      mFetchData({
        url: postFaceInfo,
        method: 'POST',
        data: data
      }).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          this.$refs.loginbox.hide()
          this.$refs.loginbox.reset()
          this.showResult = true
        } else {
          alert(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.yanzhi {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 375px;
  margin: 0 auto;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-overflow-scrolling: touch;
  user-select: none;
  font-family: system-ui, "PingFang SC", STHeiti, sans-serif;
  .index-page {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/yanzhi/bg.png);
    background-size: 100% 100%;
    .title {
      position: absolute;
      top: 21px;
      left: 50%;
      width: 340px;
      margin-left: -170px;
      img {
        display: block;
        width: 100%;
      }
    }
    .man {
      position: absolute;
      bottom: 0;
      left: 0;
      img {
        display: block;
        width: 100%;
      }
    }
    .index-wrap {
      position: absolute;
      left: 0;
      bottom: 70px;
      width: 100%;
      .start-btn {
        appearance: none;
        padding: 0;
        outline: 0;
        /*border: none;*/
        display: block;
        width: 240px;
        height: 44px;
        margin: 0 auto;
        background: #FFFFFF;
        border: 2px solid #5D6158;
        border-radius: 100px;
        font-size: 16px;
        color: #5D6158;
        letter-spacing: 0.18px;
        font-weight: bold;
        /*background-color: transparent;
        background-image: url(../../assets/yanzhi/start.png);
        background-size: 100% 100%;*/
      }
      input {
        display: none;
      }
      img {
        display: block;
        width: 235px;
        margin: 18px auto 0;
      }
    }
  }
  .upload-modal {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(0, 0, 0, .8);
    .upload-content {
      width: 250px;
      margin: 50px auto 0;
      .preview-container {
        position: relative;
        box-sizing: border-box;
        width: 250px;
        height: 250px;
        overflow: hidden;
        border: 5px solid #fff;
        border-radius: 15px;
        .picture {
          position: relative;
          width: 100%;
          height: 100%;
          div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
        .scan-wrap {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .3);
          .scan-bg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 210px;
            height: 210px;
            background-image: url(../../assets/yanzhi/bg-scan.png);
            background-size: 100% 100%;
            .scan-dots span {
              position: absolute;
              display: block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              opacity: 0;
              background: rgba(255, 149, 45, .8);
              animation: blink .75s infinite;
              &:nth-child(1) {
                top: 5px;
                left: 30%;
              }
              &:nth-child(2) {
                top: 50px;
                left: 60%;
              }
              &:nth-child(3) {
                top: 75px;
                left: 15%;
              }
              &:nth-child(4) {
                top: 100px;
                left: 70%;
              }
              &:nth-child(5) {
                top: 170px;
                left: 50%;
              }
            }
          }
          .scan-line {
            position: absolute;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            transform: translate3d(0, 100%, 0);
            border-top: 2px solid rgb(255, 149, 45);
            background: rgba(255, 149, 45, .3);
            animation: scan 1.5s infinite;
          }
        }
      }
      .upload-info {
        .tips {
          width: 240px;
          margin: 15px auto 0;
          img {
            display: block;
            width: 100%;
          }
        }
        .upload-btn {
          appearance: none;
          border: none;
          outline: 0;
          display: block;
          width: 179px;
          height: 44px;
          margin: 40px auto 0;
          padding: 0;
          background: #FFC83F;
          border: 2px solid #FFFFFF;
          border-radius: 100px;
          font-size: 16px;
          color: #624304;
          letter-spacing: 0.18px;
          &:disabled {
            background: #ECDBB2;
            border: 2px solid #FFFFFF;
            border-radius: 100px;
            font-size: 16px;
            color: #989180;
            letter-spacing: 0.18px;
          }
        }
        p {
          margin-top: 20px;
          color: rgb(255, 149, 45);
          font-size: 18px;
          text-align: center;
        }
        input {
          appearance: none;
          outline: 0;
          box-sizing: border-box;
          display: block;
          width: 100%;
          height: 50px;
          line-height: 16px;
          margin: 15px 0;
          padding: 15px 10px;
          border: 2px solid rgb(255, 149, 45);
          border-radius: 5px;
          font-size: 16px;
          &::-webkit-input-placeholder{
            font-size: 16px;
            line-height: 1em;
          }
        }
      }
      .scanning-info {
        text-align: center;
        color: rgb(255, 149, 45);
        .big {
          margin: 18px 0 7.5px;
          font-size: 20px;
        }
        .small {
          font-size: 15px;
        }
        .progress {
          margin-top: 29px;
          font-weight: bold;
          font-size: 30px;
        }
      }
    }
  }
  .result-modal {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding-top: 20px;
    background-image: url(../../assets/yanzhi/result-bg.png);
    background-size: 100% 100%;
    .box-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transform: translate3d(0, -200%, 0);
      box-sizing: border-box;
      padding: 20px 5px 5px;
      background-image: url(../../assets/yanzhi/result-bg.png);
      background-color: transparent;
      background-size: cover;
      background-position: 0 0;
      background-repeat: no-repeat;
      .box {
        width: 335px;
        height: 430px;
        background: #E4DDBF;
        border: 2px solid #5D6158;
        border-radius: 8px;
        margin: 0 auto;
        overflow: hidden;
        .avator {
          box-sizing: border-box;
          position: relative;
          top: 15px;
          left:20px;
          width: 48px;
          height: 48px;
          border: 2px solid #FFFFFF;
          border-radius: 4px;
          overflow: hidden;
          background-image: url(../../assets/yanzhi/bg-avator.png);
          background-size: 100% 100%;
          img {
            display: block;
            width: 47px;
            margin: 0px auto;
            border-radius: 4px;
          }
        }
        .user-name {
          position: relative;
          top: -20px;
          left: 82px;
          display: inline-block;
          text-align: left;
          font-size: 17px;
          color: #202020;
          letter-spacing: 0.17px;
        }
        .result-img {
          width: 300px;
          min-height: 250px;
          margin: 12px auto 10px;
          img {
            display: block;
            width: 100%;
          }
        }
        .plate {
          width: 100%;
          box-sizing: border-box;
          padding: 0 15px;
          overflow: hidden;
          .result-text {
            width: 200px;
            display: block;
            float: left;
            vertical-align: top;
            margin-top: 10px;
            font-size: 13px;
            color: #202020;
            letter-spacing: 0.15px;
            line-height: 20px;
          }
          .qrcode {
              display: block;
              float: right;
              width: 80px;
              height: 80px;
              background: #FFFFFF;
              border: 2px solid #5D6158;
              border-radius: 4px;
              img {
                display: block;
                width: 74px;
                height: 74px;
                margin: 3px auto;
              }
          }
        }
      }
    }
    .result-box-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      background-color: transparent;
      font-size: 0;
      height: 454px;
      overflow: hidden;
      .img-box {
        width: 375px;
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .btn-wrap {
      position: absolute;
      top: 460px;
      left: 0;
      width: 100%;
      .save {
        box-sizing: border-box;
        padding: 0 20px;
        font-size: 0;
        text-align: right;
        img {
          display: inline-block;
          width: 168.5px;
        }
      }
      .btn-group {
        box-sizing: border-box;
        margin: 0 auto;
        padding: 0 20px;
        button {
          appearance: none;
          margin: 0;
          padding: 0;
          outline: 0;
          border: none;
          background-color: transparent;
        }
        .flex {
          display: flex;
          margin: 20px auto 0;
          width: 300px;
        }
        .restart {
          flex: 1;
          width: 140px;
          height: 44px;
          background: #FFC83F;
          border: 2px solid #FFFFFF;
          border-radius: 100px;
          margin-right: 20px;
          font-size: 16px;
          color: #624304;
          letter-spacing: 0.18px;
          max-width: 140px;
        }
        .restart1 {
          flex: 1;
          width: 120px;
          height: 44px;
          background: #FFFFFF;
          border: 2px solid #5D6158;
          border-radius: 100px;
          margin-right: 15px;
          font-size: 16px;
          color: #5D6158;
          letter-spacing: 0.18px;
          max-width: 120px;
        }
        .jump {
          flex: 1;
          width: 180px;
          background: #FFC83F;
          border: 2px solid #FFFFFF;
          border-radius: 100px;
          font-size: 16px;
          color: #624304;
          letter-spacing: 0.18px;
          text-align: center;
          min-width: 170px;
          text-decoration: none;
        }
        .share {
          flex: 1;
          height: 44px;
          background: #FFC83F;
          border: 2px solid #FFFFFF;
          border-radius: 100px;
          font-size: 16px;
          color: #624304;
          letter-spacing: 0.18px;
          max-width: 140px;
        }
        /*.link {
          flex: 1;
          height: 47.5px;
          background-image: url(../../assets/yanzhi/link-btn.png);
          background-size: 100% 100%;
        }*/
      }
      .bottom-text{
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        .bottom-texts {
          margin-top: 2px;
          text-align: center;
          line-height: 20px;
          font-size: 13px;
          color: #FFFFFF;
          letter-spacing: 0.2px;
        }
      }
    }
    .drawing-tips {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      height: 20px;
      text-align: center;
      font-size: 16px;
      color: #fff;
    }
  }
  .haveResultBg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-image: url(../../assets/yanzhi/result-bg.png);
    background-size: 100% 100%;
    .haveResult {
      width: 335px;
      height: 400px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #F9F5E5;
      border: 2px solid #5D6158;
      border-radius: 8px;
      margin: 70px auto 0;
      z-index: 11;
      .haveResult-text {
        margin-top: 40px;
        text-align: center;
        font-size: 18px;
        color: #5D6158;
        letter-spacing: 0.24px;
      }
      img{
        width: 90px;
        height: 90px;
        display: block;
        margin: 20px auto;
      }
      .haveResult-text1 {
        width: 290px;
        height: 100px;
        display: block;
        margin: 0 auto;
        font-size: 14px;
        color: #5D6158;
        letter-spacing: 0.16px;
        text-align: center;
      }
      .flex {
        display: flex;
        margin: 20px auto 0;
        width: 300px;
        .restart {
          flex: 1;
          width: 140px;
          height: 44px;
          background: #FFC83F;
          border: 2px solid #FFFFFF;
          border-radius: 100px;
          margin-right: 20px;
          font-size: 16px;
          color: #624304;
          letter-spacing: 0.18px;
          max-width: 140px;
          outline: none;
        }
        .share {
          flex: 1;
          height: 44px;
          background: #FFC83F;
          border: 2px solid #FFFFFF;
          border-radius: 100px;
          font-size: 16px;
          color: #624304;
          letter-spacing: 0.18px;
          max-width: 140px;
          outline: none;
        }
      }
    }
  }
  .share-modal {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    img {
      position: absolute;
      display: block;
      &.share-img {
        top: 10px;
        right: 20px;
        width: 260px;
      }
      &.share-img1 {
        left: 0;
        bottom: 0;
        width: 100%;
      }
    }
  }
}
.show-enter-active, .show-leave-active{
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.show-enter, .show-leave-to {
  opacity: 0;
}
@keyframes scan {
  to {
    transform: translate3d(0, 0, 0);
  }
}
@-webkit-keyframes scan {
  to {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes blink {
  to {
    opacity: .5;
  }
}
@-webkit-keyframes blink {
  to {
    opacity: .5;
  }
}
@-webkit-keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    transform: scale3d(.3, .3, .3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(.97, .97, .97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
@keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    transform: scale3d(.3, .3, .3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(.97, .97, .97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
.bounceIn {
  animation-name: bounceIn;
  animation-duration: 1s;
  animation-fill-mode: both;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
@-webkit-keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadeInDown {
  animation-name: fadeInDown;
  animation-duration: 1s;
  animation-fill-mode: both;
}
</style>
