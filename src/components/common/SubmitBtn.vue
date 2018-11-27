/*此方法为银行跳转单按钮
* 使用$refs方法
* 必传值为按钮名称和跳转入口如 
* menuId M002
*/
<template>
  <div class="btn-contianer">
    <div class="health-btn">
      <v-touch tag="div" class="health-item health-item-sub" >
        <span>{{ btnName }}</span>
      </v-touch>
    </div>
    <transition name="fade">
      <div class="mask" v-show="showMask" @touchmove.prevent>
        <div class="mask-content" v-html="maskMsg">
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
// import { fetchData } from '@utils/utils'
import { verifyFetch } from '@utils/utils'
import { getBankData, getBankRedirect, getBankLogin } from '@utils/urls'
export default {
  data() {
    return {
      showMask: false,
      maskMsg: '<p>您的身份信息不全</p><p>请先前往一账通补全</p>',
      isFetching: false
    }
  },
  methods: {
    childMethod(menuId) {
      if (this.isFetching) {
        return false
      }
      this.isFetching = true
      var params = {
        url: getBankData,
        nativeParams: ['user_id']
      }
      verifyFetch(params).then(res => {
        this.isFetching = false
        var encode = getBankRedirect + '?menuId=' + menuId
        var getEm1 = encodeURIComponent(encode)
        if (res.data.code === 0) {
          var resData = res.data.data
          var bank = getBankLogin + '?mchId=B170700901&encryptData=' + resData + '&redirectUrl=' + getEm1
          // console.log('submitBtn show bank ===========>')
          // console.log(bank)
          window.location.href = bank
          // console.log(bank)
        } else if (res.data.code === 9) {
          this.showMask = true
          setTimeout(() => {
            this.showMask = false
          }, 1500)
        } else if (res.data.code !== 1) {
          console.log(res.data.msg)
        }
      })
      // fetchData(params).then(res => {
      //   // console.log(res.data)
      //   var encode = 'https://bank-static-stg.pingan.com.cn/bbc/index/landing.html?menuId=' + menuId
      //   var getEm1 = encodeURIComponent(encode)
      //   if (res.data.code === 0) {
      //     var resData = res.data.data
      //     var bank = 'https://rmb-stg.pingan.com.cn/brcp/uc/cust/uc-third-auth.autoLogin.do?mchId=B170700901&encryptData=' + resData + '&redirectUrl=' + getEm1
      //     window.location.href = bank
      //     // console.log(bank)
      //   } else if (res.data.code !== 1) {
      //     console.log(res.data.msg)
      //   }
      // })
    }
  },
  props: [
    'btnName'
  ]
}
</script>
<style scoped>
  .btn-contianer{
    position: absolute;
    bottom: 0;
  }
  .health-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }
  .health-item{
    float: left;
    width: 100%;
    height: 100%;
    text-align: center;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: rgba(200,200,200,0);
  }
  .health-item:active{
    background: #F05A23;
  }
  .health-item-sub{
    background: #FF8028;
    color: #FFFFFF;
    font-size: 17px;
    line-height: 50px;
  }
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
  }
  .mask-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 15px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    line-height: 24px;
    font-size: 17px;
    z-index:100;
    white-space: nowrap;
    text-align: center;
    border-radius: 2.5px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
