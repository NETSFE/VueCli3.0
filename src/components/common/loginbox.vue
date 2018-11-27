<template>
  <div class="login-box">
    <div v-if="!needCheck">
      <div v-on:click.stop="closeLogin" class="close-btn"></div>
      <div class="login-title">
        <p class="login-text">为方便您中奖后与您联系</p>
        <p class="login-text">请用手机验证码登录</p>
      </div>
      <div class="login-field">
        <input v-model="loginPhone" class="login-input" type="text" maxlength="11" placeholder="请输入手机号" />
      </div>
      <div class="login-field">
        <input v-model="phoneCaptcha" class="login-input message-input" type="text" placeholder="短信验证码" />
        <div class="check-word-div">
          <button v-if="!isCounting" v-on:click.stop="getCheck" class="check-word"
            data-event-category="zhongqiu" data-event-action="click" data-event-param="获取验证码" otype="button" otitle="获取验证码"
          >
          获取验证码
          </button>
          <button v-if="isCounting" class="check-count"
             data-event-category="zhongqiu" data-event-action="click" data-event-param="重新获取" otype="button" otitle="重新获取"
          >
          {{count}}s重新获取
          </button>
        </div>
      </div>
      <div class="login-tip">
        <p>{{ loginTip }}</p>
      </div>
      <div class="login-field btn-field">
        <button v-on:click.stop="login" v-bind:class="{active: loginActive}" class="login-btn"
           data-event-category="zhongqiu" data-event-action="click" data-event-param="立刻登录" otype="button" otitle="立刻登录"
        >立刻登录</button>
      </div>
    </div>
    <div class="loading" v-show="isLoading">
      <i class="loading-gif"></i>
    </div>
    <div v-if="needCheck">
      <div v-on:click.stop="needCheck=false" class="close-btn"></div>
      <div class="check-title">
        <p class="login-text">为了您的账号安全，请进行身份验证！</p>
      </div>
      <div class="check-div">
        <div v-on:click.stop="refreshLoginCaptcha" class="check-div-img">
          <img width="100%" height="100%" v-bind:src="loginImage" /> 
        </div>
      </div>
      <div class="login-field check-field">
        <input v-model="loginCaptcha" class="login-input check-input" type="text" placeholder="请输入验证码" />
      </div>
      <div class="check-btn-field">
        <button v-on:click.stop="checkLoginImage" v-bind:class="{active: checkActive}" class="login-btn">确认</button>
      </div>
    </div>
  </div>
</template>
<script>
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
        isLoading: false
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
        if (!this.loginCaptcha) {
          return false
        }
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
          // console.log(data)
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
              jtSafeKey: new PaWebJs().get()
            }
          }).then((data) => {
            console.log(data)
            data = data.data
            if (data.code !== 0) {
              this.loginTip = data.msg
              return false
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
  * {
    box-sizing: border-box;
  }
  .login-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 330px;
    height: 320px;
    background: #FFFFFF;
  }
  .login-title {
    width: 100%;
    height: 100px;
    padding-top: 28px;
    text-align: center;
  }
  .login-text {
    font-size: 15px;
    color: #171717;
    line-height: 21px;
  }
  .login-field {
    position: relative;
    width: 280px;
    height: 50px;
    /*margin-bottom: 10px;*/
    margin: 0 auto 10px auto;
    border: 1px solid #DDDDDD; /*no*/
    border-radius: 2px;
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
  input[placeholder], textarea[placeholder] {
    font-size: 16px;
    color: #9A9A9A;
    letter-spacing: 0.16px;
    line-height: 22px;
    padding: 12px 0;
  }
  .message-input {
    width: 150px;
  }
  .login-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #9A9A9A;
    opacity:1; 
  }

  .login-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #9A9A9A;
    opacity:1;
  }

  .login-input:-ms-input-placeholder{
    color: #9A9A9A;
    opacity:1;
  }

  .login-input::-webkit-input-placeholder{
    color: #9A9A9A;
    opacity:1;
  }

  .check-word-div {
    position: absolute;
    width: 120px;
    height: 30px;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .check-word {
    width: 100%;
    height: 30px;
    border: 1px solid #FF8028; /*no*/
    border-radius: 2px;
    background: transparent;
    font-size: 14px;
    color: #FF8028;
    outline: none;
  }

  .btn-field {
    border: none;
    margin-top: 30px;
  }

  .login-btn {
    width: 100%;
    height: 100%;
    background: #FF8028;
    border: none;
    opacity: 0.6;
    font-size: 17px;
    color: #FFFFFF;
    outline: none;
  }

  .login-btn.active{
    opacity: 1;
    outline: none;
  }
  .login-tip {
    position: absolute;
    left: 25px;
    width: 280px;
    font-size: 14px;
    color: #F05A23;
  }
  .login-tip p {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .check-count {
    width: 100%;
    height: 30px;
    background: #EFEFF4;
    border-radius: 2px;
    font-size: 14px;
    color: #616161;
    outline: none;
    border: none;
  }
  .check-title {
    width: 100%;
    height: 85px;
    padding-top: 40px;
    text-align: center;
  }
  .check-div {
    width: 100%;
    height: 30px;
    margin-bottom: 30px;
  }
  .check-div-img {
    width: 100px;
    height: 30px;
    margin: 0 auto;
    background: #F7F7F7;
  }
  .check-field {
    width: 200px;
  }
  .check-input {
    text-indent: 0;
    text-align: center;
  }
  .check-btn-field {
    width: 160px;
    height: 44px;
    margin: 20px auto 0 auto;
  }
  .close-btn {
    position: absolute;
    right: 2px;
    top: 2px;
    width: 36px;
    height: 36px;
    background: url("../../assets/zhongqiuclose.png") no-repeat center center;
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
</style>
