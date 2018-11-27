/**
 * 健康险用的底部提交按钮
 * 必填入参: 
 * price 保费金额
 * subFn 立刻投保按钮函数
*/

<template>
  <div class="btn-container">
    <div class="health-btn">
      <div @touchstart.prevent.stop="bpFn" class="health-item health-item-phone" >
        <div class="icon-phone"></div>
        <p class="phone-text">电话客服</p>
      </div>
      <div class="health-item health-item-price">
        保费: {{price}}元
      </div>
      <div @touchstart.prevent.stop="jumpUrl" class="health-item health-item-sub" >
        <span>立即投保</span>
      </div>
    </div>
    <div class="mask" v-show="showPhone" @touchmove.prevent>
      <div class="mask-inner">
        <div class="content">
          <p class="content-title">提示</p>
          <p class="content-text">您即将拨打平安服务电话: <span class="color-F05A23">95511</span></p>
          <p class="content-text">接通后,请转 <span class="color-F05A23">7</span> 联系客服</p>
        </div>
        <div class="actions clear">
          <v-touch tag="div" v-on:tap.prevent="showPhone = false" class="action-item">取消</v-touch>
          <a href="tel:95511">
            <div class="action-item">确认</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { onEventWithLabel } from '@utils/bp'
  import {IS_NATIVE, getDataWithLogin, needFixBasicInfo} from '@utils/native'
  import {getApplicant} from '@utils/urls'
  import {verifyFetch} from '@utils/utils'
  export default {
    data() {
      return {
        showPhone: false
      }
    },
    methods: {
      getUserData: function() {
        return getDataWithLogin({
          params: ['user_id', 'phone', 'name', 'sex', 'id_no', 'id_type', 'birthdate']
        }).then((data) => {
          if (data.code > 0) {
            console.log(data)
            return Promise.resolve(data)
          }
          console.log('获取五项信息+收集')
          console.log(data)
          if (!data.name || !data.sex || !data.id_no || !data.id_type || !data.birthdate) {
            return needFixBasicInfo({errmsg: '请补全您的信息'}).then((data2) => {
              console.log('补全信息完')
              console.log(data2)
              if (data2 !== 'success') {
                return Promise.resolve({
                  code: '666',
                  msg: '未补全五项信息'
                })
              }
              return this.getUserData()
            })
          }
          console.log('resolve')
          return Promise.resolve(data)
        })
      },
      jumpUrl: function() {
        onEventWithLabel(this.eventId, this.submitEventLabel)
        // this.subFn && this.subFn()
        this.$store.dispatch({
          type: 'health/sendProductid',
          productid: this.productid
        })
        console.log(IS_NATIVE)
        if (!IS_NATIVE) {
          this.$store.dispatch({
            type: 'userinfo/updateUser',
            isLogin: true,
            user_id: '558541508466502880',
            phone: '13631593690',
            name: '文哥',
            sex: 'M',
            id_no: '141124197302236271',
            id_type: '1',
            birthdate: '1973-02-23'
          })
          verifyFetch({
            url: getApplicant,
            params: {
              user_id: '558541508466502880'
            }
          }).then((res) => {
            if (res.data.code === 0) {
              var resData = res.data.data
              this.$store.dispatch({
                type: 'userinfo/updateUser',
                email: resData.email || '',
                phone: resData.mobile || '',
                location: resData.residence || '',
                socialsecurity: resData.is_insurance || ''
              })
              this.$router.push({path: '/notice'})
            } else {
              console.log(res.data.msg)
            }
          })
          return
        }
        this.getUserData().then((data) => {
          console.log('then')
          console.log(data)
          if (data.code > 0) {
            return
          }
          this.$store.dispatch({
            type: 'userinfo/updateUser',
            isLogin: true,
            name: data.name,
            user_id: data.user_id,
            phone: data.phone,
            sex: data.sex,
            id_no: data.id_no,
            id_type: data.id_type,
            birthdate: data.birthdate
          })
          console.log('dispatch user')
          console.log(this.$store.state)
          verifyFetch({
            url: getApplicant,
            params: {
              user_id: data.user_id
            }
          }).then((res) => {
            if (res.data.code === 0) {
              var resData = res.data.data
              this.$store.dispatch({
                type: 'userinfo/updateUser',
                email: resData.email || '',
                phone: resData.mobile || '',
                location: resData.residence || '',
                socialsecurity: resData.is_insurance || ''
              })
              this.$router.push({path: '/notice'})
            } else {
              console.log(res.data.msg)
            }
          })
          this.$router.push({path: '/notice'})
        })
      },
      bpFn: function() {
        this.showPhone = !this.showPhone
        onEventWithLabel(this.eventId, this.phoneEventLabel)
      }
    },
    props: {
      subFn: Function,
      eventId: {},
      submitEventLabel: {},
      phoneEventLabel: {},
      productid: String
    },
    computed: {
      price() {
        return this.$store.state.premiumMeasure.fee || '--'
      }
    }
  }
</script>
<style scoped>
  .btn-container{
    position: absolute;
    bottom: 0;
  }
  .clear{
    *zoom: 1;
  }
  .clear::after{
    content: '\200B';
    clear: both;
    height: 0;
    display: block;
  }
  .color-F05A23{
    color: #F05A23;
  }
  .health-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50px;
    background: #FFFFFF;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom); 
  }
  .health-item{
    /*width: 50%;*/
    height: 100%;
    text-align: center;
  }
  .health-item-sub{
    width: 152px;
    background: #FF8028;
    color: #FFFFFF;
    font-size: 17px;
    line-height: 50px;
  }
  .health-item-sub:active{
    background: #F05A23;
  }
  .health-item-phone {
    width: 71px;
    background: #FFFFFF;
    color: #171717;
    font-size: 12px;
  }
  .health-item-price {
    width: 152px;
    font-size: 17px;
    color: #FFFFFF;
    background: #F5BE00;
    line-height: 50px;
  }
  .icon-phone{
    /*padding: 7px 0 4px 0;*/
    height: 29px;
    background: url("../../assets/health-phone.png") no-repeat center center;
    background-size: 15px 18px;
  }
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .mask-inner{
    position: fixed;
    width: 320px;
    top: 145px;
    left: 0;
    right: 0;
    margin: auto;
    background: #FFFFFF;
    border-radius: 5px;
  }
  .content{
    text-align: center;
  }
  .content-title{
    padding: 20px 0;
    font-size: 16px;
    font-weight: bold;
  }
  .content-text{
    font-size: 15px;
  }
  .actions{
    margin-top: 20px;
    border-top: 1px solid #c6c6c6; /*no*/
  }
  .action-item{
    float: left;
    width: 159px;
    border-right: 1px solid #c6c6c6; /*no*/
    text-align: center;
    font-size: 17px;
    line-height: 50px;
    color: #f05a23;
  }
  .action-item:active{
    background: #F6F6F6;
  }
  a .action-item{
    border-right: none;
  }
</style>
