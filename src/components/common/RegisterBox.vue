<template>
  <div class="register-box">
    <div v-if="!needCheck">
      <div class="title">立即注册领取</div>
        <input v-model="loginPhone" class="phone" type="tel" maxlength="11" placeholder="请输入手机号" />
      <div class="code-box">
        <input v-model="phoneCaptcha" class="code" type="number" placeholder="请输入短信验证码" />
        <span class="parting-line"></span>
        <span class="get-code" v-if="!isCounting" v-on:click.stop="getCheck" >获取验证码</span>
        <span class="get-code" v-if="isCounting">{{count}}s重新获取</span>
      </div>
      <div class="login-tip">
        <div>{{ loginTip }}</div>
      </div>
      <a v-on:click.stop="login"
        v-bind:class="{active: loginActive}" class="collect login-btn"
        data-event-category="invite" data-event-action="click" data-event-param="立即领取"
        otype="button" otitle="立即领取">
        立即领取
      </a>
    </div>
    <div class="loading" v-show="isLoading">
      <i class="loading-gif"></i>
    </div>
    <div class="bubble" v-if="isBubbleShow">{{ message }}</div>
    <div v-if="needCheck">
      <div class="content">
        <div @click.stop="needCheck=false" class="close-btn"></div>
        <div class="title">为了您的账号安全，请进行身份验证！</div>
        <div class="veritify-code-box">
          <input class="veritify-code" v-model="loginCaptcha" type="text" maxlength="6" placeholder="请输入验证码">
          <span class="get-veritify-code">
            <div class="pic-veritify-code" @click.stop="refreshLoginCaptcha">
              <img width="100%" height="100%" :src="loginImage" /> 
            </div>
          </span>
        </div>
        <div class="tip">点击更换验证码</div>
        <a class="confirm" @click.stop="checkLoginImage" v-bind:class="{active: checkActive}">确认</a>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@routes/register'
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
import { getPhoneCaptcha, loginOneCard, getImageCaptcha, reloadImageCaptcha } from '@utils/urls'
import { mFetchData } from '@utils/utils'
import { setStorage, clearLogin } from '@utils/util'
const PaWebJs = require('@static/pawebjs')
export default {
  data() {
    return {
      count: 60,
      isCounting: false,
      loginTip: '',
      timer: null,
      needCheck: false,
      loginPhone: '',
      phoneCaptcha: '',
      loginCaptcha: '',
      loginImage: '',
      isLoading: false,
      invite_user_id: '',
      message: '',
      isBubbleShow: false
    }
  },
  props: {
    loginCallback: Function,
    closeCallback: Function
  },
  computed: {
    loginActive: function() {
      if (this.loginPhone && this.phoneCaptcha) {
        return true
      }
      return false
    },
    checkActive: function() {
      if (this.loginCaptcha) {
        return true
      }
      return false
    }
  },
  mounted() {
    console.log(this.$route.query.invite_user_id)
    this.invite_user_id = this.$route.query.invite_user_id
  },
  methods: {
    closeLogin: function() {
      this.closeCallback && this.closeCallback()
    },
    countDown: function() {
      this.isCounting = true
      this.count = 60
      this.counter()
    },
    counter() {
      setTimeout(() => {
        this.count--
        if (this.count === 0) {
          this.isCounting = false
          this.timer = null
        }
        this.counter()
      }, 1000)
    },
    checkLoginImage: function() {
      console.log(this.loginCaptcha)
      if (!this.loginCaptcha) {
        console.log('123')
        return false
      }
      console.log('321')
      this.needCheck = false
      this.fetchPhoneCaptcha()
    },
    checkPhone: function() {
      if (this.loginPhone && /1[3578]\d{9}$/i.test(this.loginPhone)) {
        this.loginTip = ''
        return true
      }
      this.loginTip = '请输入11位手机号'
      return false
    },
    getCheck: function() {
      if (!this.checkPhone()) {
        return false
      }
      this.isLoading = true
      console.log(this.isLoading)
      this.clearTip()
      this.clearImage()
      // this.countDown()
      this.fetchImgCaptcha().then((image) => {
        if (image) {
          this.needCheck = true
          this.loginImage = image
          this.isLoading = false
          return false
        }
        this.fetchPhoneCaptcha()
      })
    },
    fetchPhoneCaptcha: function() {
      this.isLoading = true
      mFetchData({
        url: getPhoneCaptcha,
        method: 'POST',
        data: {
          login_name: this.loginPhone,
          image: this.loginCaptcha
        }
      }).then((data) => {
        console.log(data)
        this.isLoading = false
        if (data.data.code !== 0) {
          this.loginTip = data.data.msg
          return false
        }
        this.needCheck = false
        this.countDown()
      }, (err) => {
        this.isLoading = false
        this.loginTip = err.msg
      })
    },
    fetchImgCaptcha: function() {
      return mFetchData({
        url: getImageCaptcha,
        method: 'POST',
        data: {
          login_name: this.loginPhone,
          type: 2
        }
      }).then((data) => {
        console.log(data)
        data = data.data
        if (data.code !== 0) {
          this.loginTip = data.msg
          return false
        }
        var image = data.data.image
        return Promise.resolve(image)
      }, function(err) {
        console.log(err)
      })
    },
    refreshLoginCaptcha: function() {
      return mFetchData({
        url: reloadImageCaptcha,
        method: 'POST',
        data: {
          login_name: this.loginPhone
        }
      }).then((data) => {
        console.log(data)
        data = data.data
        if (data.code !== 0) {
          this.loginTip = data.msg
          return false
        }
        var image = data.data.image
        this.loginImage = image
        return Promise.resolve(image)
      }, function(err) {
        console.log(err)
      })
    },
    login: function() {
      // 清除登陆缓存
      clearLogin()
      if (!this.loginActive) {
        return false
      }
      if (this.checkPhone() && this.phoneCaptcha) {
        mFetchData({
          url: loginOneCard,
          method: 'POST',
          data: {
            login_name: this.loginPhone,
            captcha: this.phoneCaptcha,
            jtSafeKey: new PaWebJs().get(),
            invite_user_id: this.invite_user_id
          }
        }).then((data) => {
          console.log('invite:', this.invite_user_id)
          console.log(data)
          data = data.data
          if (data.code !== 0) {
            this.loginTip = data.msg
            return false
          } else {
            const mesObj = ['您的积分已发放，请进入app内领取！', '领取成功，赶紧下载平安精选app激活使用吧！']
            this.isBubbleShow = true
            this.message = mesObj[data.data.is_first]
            setTimeout(() => {
              this.isBubbleShow = false
              router.push('/download')
            }, 1500)
          }
          setStorage('user_id', data.data['user_id'])
          setStorage('login_token', data['login_token'])
          this.loginCallback && this.loginCallback(data)
        }, function(err) {
          console.log(err)
          this.loginTip = err.msg
        })
      }
    },
    clearTip: function() {
      this.loginTip = ''
    },
    clearImage: function() {
      this.loginImage = ''
      this.loginCaptcha = ''
    }
  }
}
</script>
<style lang="css" scoped>
.register-box {
  width: 335px;
  height: 246px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0 4px 30px 0 #9B0000;
  border-radius: 6px;
  margin: 21px 20px 0 20px;
  flex-shrink: 0;
}
.title {
  text-align: center;
  font-size: 16px;
  color: #383C44;
  margin-top: 18px;
}
.phone, .code-box {
  width: 305px;
  border-radius: 2px;
  background: #F7F7F7;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.phone {
  margin-top: 16px;
}
.code-box {
  margin-top: 12px;
}
.code {
  width: 192px;
}
input {
  box-sizing: border-box;
  outline: none;
  height: 44px;
  line-height: 44px;
  background: #F7F7F7;
  border: none;
  font-size: 16px;
  color: #171717;
  padding-left: 14px;
}
::-webkit-input-placeholder {
  color: #9A9A9A;
}
.parting-line {
  display: inline-block;
  width: 1px;
  height: 24px;
  background: #D8D8D8;
}
.get-code {
  font-size: 16px;
  color: #383C44;
  line-height: 16px;
  background: #F7F7F7;
}
.collect {
  display: block;
  width: 305px;
  height: 44px;
  line-height: 44px;
  margin-top: 20px;
  text-align: center;
  background-image: linear-gradient(-180deg, #FFE7A5 0%, #F5B31E 100%);
  box-shadow: 0 2px 10px 0 #FFE5A9;
  border-radius: 100px;
  font-size: 16px;
  color: #383C44;
}
.login-input {
  width: 100%;
  border: none;
  padding: 0;
  text-indent: 12px;
  line-height: 46px;
  font-size: 16px;
  outline: none;
}
.login-btn {
  border: none;
  opacity: 0.6;
  font-size: 17px;
  color: #FFFFFF;
  outline: none;
}
.login-btn.active {
  opacity: 1;
  outline: none;
}
.login-tip {
  position: absolute;
  left: 36px;
  width: 280px;
  font-size: 14px;
  color: #F05A23;
}
.login-tip div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
.content {
  width: 330px;
  height: 195px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #FFFFFF;
  border-radius: 2px;
  z-index: 2;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  margin-top: 142px;
}
.content .title {
  font-size: 15px;
  color: #171717;
  margin-top: 26px;
}
.mask {
  position: absolute;
  width: 375px;
  height: 667px;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.content .veritify-code-box {
  width: 305px;
  border-radius: 2px;
  margin-top: 26px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.content .veritify-code {
  width: 192px;
}
.content input {
  box-sizing: border-box;
  outline: none;
  height: 30px;
  line-height: 30px;
  background: #fff;
  border: none;
  padding-left: 0;
  border-bottom: 1px solid #DDDDDD;
  font-size: 14px;
  color: #171717;
}
.pic-veritify-code {
  width: 85px;
  height: 30px;
  background: #F7F7F7;
}
.content .tip {
  width: 288px;
  text-align: right;
  font-size: 12px;
  color: #616161;
}
.content .get-veritify-code {
  font-size: 16px;
  color: #383C44;
  line-height: 16px;
}
.confirm {
  width: 305px;
  height: 44px;
  line-height: 44px;
  margin-top: 20px;
  text-align: center;
  background: #D72121;
  border-radius: 100px;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.close-btn {
  position: absolute;
  right: 2px;
  top: 2px;
  width: 36px;
  height: 36px;
  background: url("../../assets/register/close.png") no-repeat center center;
  background-size: 12px 12px;
}
.loading {
  position: fixed;
  /* background: rgba(0, 0, 0, 0.6); */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-gif {
  display: inline-block;
  width: 32px;
  height: 32px;
  background: url(../../assets/zhongqiu/loading.gif);
  background-size: contain;
}
.bubble {
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 30%;
  width: 50%;
  height: 60px;
  line-height: 26px;
  text-align: center;
  color: #fff;
  background: rgba(0,0,0,0.6);
  border-radius: 4px;
  font-size: 14px;
  padding: 10px;
}
</style>

