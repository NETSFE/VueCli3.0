<template>
  <div class="login-wrap" v-show="needLogin">
    <div class="login-mask"></div>
    <div class="login-box">
      <div v-if="!needCheck">
        <div class="login-title">
          <h2>一账通登录</h2>
        </div>
        <div class="login-field">
          <input v-model="loginPhone" class="login-input" type="text" maxlength="11" placeholder="请输入手机号" />
        </div>
        <div class="login-field">
          <input v-model="phoneCaptcha" class="login-input message-input" type="text" placeholder="短信验证码" />
          <div class="check-word-div">
            <button v-if="!isCounting" v-on:click.stop="getCheck" class="check-word"
              data-event-category="worldcup" data-event-action="click" data-event-param="获取验证码" otype="button" otitle="获取验证码"
            >
            获取验证码
            </button>
            <button v-if="isCounting" class="check-count"
              data-event-category="worldcup" data-event-action="click" data-event-param="重新获取" otype="button" otitle="重新获取"
            >
            {{count}}s重新获取
            </button>
          </div>
        </div>
        <div class="login-tip">
          <p>{{ loginTip }}</p>
        </div>
        <div class="btn-field">
          <button v-on:click.stop="login" v-bind:class="{active: loginActive}" class="login-btn"
            data-event-category="worldcup" data-event-action="click" data-event-param="立刻登录" otype="button" otitle="立刻登录"
          >确认</button>
          <button v-on:click.stop="hide" class="hide-btn">关闭</button>
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
        isLoading: false,
        needLogin: false
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
      show: function() {
        this.needLogin = true
      },
      hide: function() {
        this.needLogin = false
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
        if (this.loginPhone && /1[3456789]\d{9}$/i.test(this.loginPhone)) {
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
  .login-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
  }
  .login-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 20;
    width: 300px;
    height: 257px;
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
  }
  .login-title {
    width: 100%;
    height: 45px;
    margin-bottom: 10px;
    text-align: center;
  }
  .login-title h2 {
    height: 45px;
    line-height: 45px;
    margin: 0;
    background: #284c17;
    font-size: 16px;
    color: #fff;
  }
  .login-text {
    font-size: 15px;
    color: #171717;
    line-height: 21px;
  }
  .login-field {
    position: relative;
    width: 257px;
    height: 60px;
    margin: 0 auto;
    border-bottom: 2px solid #e8e8e8;
  }
  .login-input {
    width: 100%;
    height: 58px;
    line-height: 58px;
    border: none;
    padding: 0;
    text-indent: 12px;
    font-size: 16px;
    color: #222;
    outline: none;
  }
  input[placeholder], textarea[placeholder] {
    font-size: 16px;
    letter-spacing: 0.16px;
    line-height: 22px;
    padding: 12px 0;
  }
  .message-input {
    width: 150px;
  }

  .check-word-div {
    position: absolute;
    width: 88px;
    height: 28px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .check-word {
    width: 100%;
    height: 28px;
    border: 1px solid #284c17;
    border-radius: 3px;
    background: transparent;
    font-size: 12px;
    color: #284c17;
    outline: none;
  }

  .btn-field {
    width: 257px;
    margin: 0 auto;
    border: none;
    display: flex;
    justify-content: space-between;
  }

  .btn-field .hide-btn {
    border: none;
    outline: none;
    width: 88px;
    height: 37px;
    line-height: 37px;
    background: #949494;
    color: #fff;
    font-size: 14px;
    text-align: center;
    border-radius: 20px;
  }

  .login-btn {
    width: 149px;
    height: 37px;
    background: #284c17;
    border: none;
    font-size: 14px;
    color: #fff;
    outline: none;
    border-radius: 20px;
  }

  .login-btn.active{
    opacity: 1;
    outline: none;
  }
  .login-tip {
    width: 257px;
    min-height: 16px;
    margin: 4px auto;
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
    font-size: 12px;
    color: #616161;
    outline: none;
    border: none;
    padding: 0;
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
    margin-bottom: 10px;
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
