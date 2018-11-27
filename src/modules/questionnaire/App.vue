<template>
  <div class="questionnaire">
    <transition name="slide-fade">
      <div v-if="!showResult">
        <header class="header">
          <span class="app-icon"></span>
          <span class="app-title">平安+PLUS</span>
        </header>
        <div class="content-wrap" ref="wrap">
          <div class="item">
            <div class="roll-wrap">
              <div class="roll-items">
                <div v-for="(item, index) in rollList" :class="activeItem === item.idx ? 'active' : ''" :key="index" class="roll-item">
                  <div v-if="!item.isReward && time != 0" @click="start" class="roll-btn" otitle="立即抽奖" data-event-param="立即抽奖" data-event-category="立即抽奖" data-event-action="click">点击抽奖</div>
                  <div v-if="!item.isReward && time == 0" @click="start" class="no-roll-btn" otitle="立即抽奖" data-event-param="立即抽奖" data-event-category="立即抽奖" data-event-action="click">抽奖次数已用完</div>
                  <div v-if="item.isReward" :class="item.cls" class="roll-img"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer class="footer">
          <div class="rule-title">活动规则</div>
          <p>1、每份问卷均可参与一次抽奖</p>
          <p>2、抽奖前请登录一帐通</p>
          <p>3、如中奖，请填写收货信息，我们将在15个工作日内发出</p>
          <p>4、本页面由平安科技团队开发，活动最终解释权归平安科技所有</p>
        </footer>
      </div>
    </transition>
    <transition name="in">
      <div v-if="showResult" :class="{fadeIn: showResult}">
        <div class="result">
          <header class="result-header">
            <div class="result-reward">
              <img :class="'r'+ rewardData.img" :src="img[rewardData.img - 1]"/>
            </div>
            <p class="result-p1">恭喜你</p>
            <p class="result-p2">获得{{rewardData.name}}</p>
          </header>
          <div class="result-content" v-if="!success">
            <span class="t1-before"></span>
            <span class="t1-after"></span>
            <p class="t1"><span class="pot"></span>填写领奖信息<span class="pot1"></span></p>
            <input type="text" class="name" maxlength="8" placeholder="姓名" v-model="name"/>
            <input type="number" class="tel" maxlength="11" placeholder="电话" v-model="tel" @input="limit"/>
            <textarea class="address" placeholder="收货地址" v-model="address"></textarea>
            <div class="tip">{{tip}}</div>
            <button class="submit" @click="submit" otitle="提交" data-event-param="提交" data-event-category="提交" data-event-action="click">提交</button>
          </div>
          <div class="result-success" v-else>
            <p class="result-p1"><span class="icon"></span><span class="p1">信息已提交成功</span></p>
            <p class="result-p2">我们将会在15个工作日内与您联系</p>
          </div>
        </div>
      </div>
    </transition>
    <commonMask ref="commonRef">
      <div class="tmask">
        <div class="t-top">
          <img src="../../assets/questionnaire/no-reward.png" class="no-reward">
        </div>
        <div class="t-bottom">
          <p class="p1">没有中奖</p>
          <p class="p2">相信下次幸运会属于你！</p>
          <div class="know" @click="hideRewardDialog">知道了</div>
        </div>
      </div>
    </commonMask>
  </div>
</template>

<script>

import { statistics, webTrends } from '@utils/statistics'
import { getVueQuery } from '@utils/util'
import { verifyFetch } from '@utils/utils'
import { worldcupChance, worldcupLottery, postAddress } from '@utils/urls'
import mask from '@components/common/mask'
import img1 from '@assets/questionnaire/1.png'
import img2 from '@assets/questionnaire/2.png'
import img3 from '@assets/questionnaire/3.png'
import img4 from '@assets/questionnaire/4.png'
import img5 from '@assets/questionnaire/5.png'
import img6 from '@assets/questionnaire/6.png'
import img7 from '@assets/questionnaire/7.png'

const ROLL_LIST = [
  {
    cls: 'prize-1',
    isReward: true,
    name: '10g金条',
    idx: 1,
    rewardId: 'A',
    img: 1,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'prize-2',
    isReward: true,
    name: 'Kindle',
    idx: 2,
    rewardId: 'C',
    img: 2,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'prize-3',
    isReward: true,
    name: '1000元京东E卡',
    rewardId: 'B',
    img: 3,
    idx: 3,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'prize-4',
    isReward: true,
    name: '100元话费',
    rewardId: 'D',
    img: 4,
    idx: 8,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'roll-btn',
    isReward: false,
    name: '',
    desc: ''
  }, {
    cls: 'prize-5',
    isReward: true,
    name: '50元话费',
    rewardId: 'E',
    img: 5,
    idx: 4,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'prize-6',
    isReward: true,
    name: '20元话费',
    rewardId: 'F',
    img: 6,
    idx: 7,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'prize-7',
    isReward: true,
    name: '10元话费',
    rewardId: 'G',
    img: 7,
    idx: 6,
    desc: '奖品在活动结束后的7-14个工作日内发送至您的手机号，请注意查收！'
  }, {
    cls: 'prize-thx',
    isReward: true,
    name: '感谢参与',
    rewardId: 'H',
    img: 8,
    idx: 5,
    desc: '感谢参与,再接再厉!'
  }
]

export default {
  data() {
    return {
      rolling: false,
      time: 1, // 抽奖次数
      rollList: ROLL_LIST,
      listLen: ROLL_LIST.length,
      activeItem: 0,
      speed: 100,
      rewardResult: 0,
      timer: null,
      count: 50, // 最少次数
      rollTimes: 0,
      rewardData: {},
      showResult: false,
      tel: '',
      name: '',
      address: '',
      tip: '',
      success: false,
      img: [img1, img2, img3, img4, img5, img6, img7],
      surveyId: ''
    }
  },
  components: {
    commonMask: mask
  },
  computed: {
    isReward() {
      if (this.rewardResult === 'H') {
        return false
      } else {
        return true
      }
    },
    query() {
      return getVueQuery()
    }
  },
  beforeMount() {
    statistics()
    webTrends()
    if (this.query.survey_id) {
      this.surveyId = this.query.survey_id
    }
    this.getChance()
  },
  methods: {
    init() {
      this.rewardResult = 0
      this.rewardData = {}
      this.activeItem = 0
      this.speed = 100
      this.rollTimes = 0
      this.tip = ''
      this.tel = ''
      this.name = ''
      this.address = ''
    },
    getChance() {
      verifyFetch({
        url: worldcupChance,
        method: 'GET',
        params: {
          theme: 'plus_survey',
          survey_id: this.surveyId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.time = res.data.data
        } else {
          alert(res.data.msg)
        }
      })
    },
    start() {
      if (this.time <= 0) {
        // this.showNoChanceDialog()
        return
      }
      if (this.rolling) {
        return
      }
      this.rolling = true
      verifyFetch({
        url: worldcupLottery,
        method: 'GET',
        params: {
          theme: 'plus_survey',
          survey_id: this.surveyId
        }
      }).then(res => {
        if (res.data.code === 0) {
          console.log(res)
          this.init()
          this.rewardResult = res.data.data.prize
          // this.time = res.data.data.chances
          this.setRewardData()
          this.raffle()
        }
      })
    },
    setRewardData() {
      for (let i = 0, len = this.rollList.length; i < len; i++) {
        if (this.rollList[i].rewardId === this.rewardResult) {
          this.rewardData = this.rollList[i]
        }
      }
    },
    raffle() {
      this.timer = setTimeout(() => {
        this.speedHandler()
        this.roll()
        if (this.rollTimes >= this.count && this.rewardData.idx && this.rewardData.idx === this.activeItem) {
          clearTimeout(this.timer)
          // TODO 组件回调点
          setTimeout(() => {
            this.showRewardDialog()
            this.time = 0
            this.rolling = false
          }, 500)
          return
        }
        this.raffle()
      }, this.speed)
    },
    speedHandler() {
      if (this.rollTimes >= this.count && this.rewardData.idx) {
        this.speed += 140
        return
      }
      if (this.rollTimes >= this.count && this.rewardData.idx && this.rewardData.idx === this.activeItem - 1) {
        this.speed += 300
      }
    },
    roll(callback) {
      this.rollTimes++
      if (++this.activeItem >= this.listLen) {
        this.activeItem = 1
      }
    },
    showRewardDialog() {
      console.log(this.rewardData)
      // this.showMask = true
      // this.showReward = true
      if (this.rewardResult === 'H') {
        this.$refs.commonRef.show()
      } else {
        this.showResult = true
      }
    },
    hideRewardDialog() {
      this.$refs.commonRef.hide()
    },
    limit() {
      if (this.tel.length > 11) {
        this.tel = this.tel.slice(0, 11)
      }
    },
    submit() {
      if (!this.name) {
        this.tip = '姓名不能为空！'
        return
      }
      if (!this.tel) {
        this.tip = '号码不能为空！'
        return
      }
      if (!this.address) {
        this.tip = '收获地址不能为空！'
        return
      }
      if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.tel)) {
        this.tip = '手机号码格式不正确！'
        return
      }
      verifyFetch({
        url: postAddress,
        method: 'POST',
        data: {
          name: this.name,
          mobile: this.tel,
          address: this.address,
          survey_id: this.surveyId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.success = true
        } else {
          this.tip = res.data.msg
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.in-enter {
  transform: translateX(100%);
  -webkit-transform: translateX(100%);
}
.in-enter-to {
  transform: translateX(0);
  -webkit-transform: translateX(0);
}
.in-enter-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  -webkit-transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-leave-to {
  transform: translateX(-100%);
  -webkit-transform: translateX(-100%);
}
.questionnaire {
  position: absolute;
  width: 100%;
  height: 100%;
  .header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 257px;
    background: url('../../assets/questionnaire/bg.png') no-repeat 0 0;
    background-size: 100% 100%;
    .app-icon {
      position: absolute;
      top: 7px;
      left: 6px;
      display: block;
      width: 22px;
      height: 22px;
      background: url('../../assets/questionnaire/icon.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
    .app-title {
      position: absolute;
      top: 10px;
      left: 34px;
      color: #F88E2C;
    }
  }
  .content-wrap {
    position: absolute;
    top: 125px;
    width: 100%;
    .item {
      margin: 0 auto;
      .roll-wrap {
        width: 328px;
        height: 328px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 22px;
        background-image: url(../../assets/questionnaire/lottery-frame.png);
        background-size: 100% 100%;
        .roll-items {
          width: 100%;
          height: 100%;
          .roll-item {
            width: 92px;
            height: 92px;
            float: left;
            margin: 0 2px 4px 0;
            &.active {
              opacity: 0.5;
            }
            .roll-img, .roll-btn, .no-roll-btn {
              height: 100%;
              background-size: 100% 100%;
            }
            .roll-btn {
              background-image: url(../../assets/questionnaire/roll-btn.png);
              font-size: 22px;
              color: #8E431B;
              box-sizing: border-box;
              padding: 14px 23px;
              text-align: center;
            }
            .no-roll-btn {
              background-image: url(../../assets/questionnaire/no-roll-btn.png);
              font-size: 16px;
              color: #575757;
              box-sizing: border-box;
              padding: 23px 14px;
              text-align: center;
            }
            .prize-1 {
              background-image: url(../../assets/questionnaire/prize-1.png);
            }
            .prize-2 {
              background-image: url(../../assets/questionnaire/prize-2.png);
            }
            .prize-3 {
              background-image: url(../../assets/questionnaire/prize-3.png);
            }
            .prize-4 {
              background-image: url(../../assets/questionnaire/prize-4.png);
            }
            .prize-5 {
              background-image: url(../../assets/questionnaire/prize-5.png);
            }
            .prize-6 {
              background-image: url(../../assets/questionnaire/prize-6.png);
            }
            .prize-7 {
              background-image: url(../../assets/questionnaire/prize-7.png);
            }
            .prize-thx {
              background-image: url(../../assets/questionnaire/thx.png);
            }
          }
        }
      }
    }
  }
  .footer {
    position: absolute;
    top: 469px;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    width: 328px;
    height: 118px;
    background: #FFE7BD;
    box-shadow: 0 0 4px 0 #FFCC75;
    border-radius: 5px;
    .rule-title {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      text-align: center;
      width: 121px;
      height: 23px;
      background: url('../../assets/questionnaire/rule-bg.png') no-repeat 0 0;
      background-size: 100% 100%;
      font-size: 14px;
      color: #B36001;
      line-height: 23px;
      margin-bottom: 5px;
    }
    p {
      font-size: 12px;
      color: #B98B55;
      padding: 0 9px;
      line-height: 18px;
    }
  }
  .tmask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 271px;
    height: 270px;
    margin: auto;
    background: #FDFFFF;
    text-align: center;
    border-radius: 25px;
    .t-top {
      width: 100%;
      height: 104px;
      background: #F1F7FF;
      border-radius: 25px 25px 0 0;
      .no-reward {
        width: 65px;
        height: 68px;
        margin-top: 19px;
      }
    }
    .t-bottom {
      // display: flex;
      // justify-content: center;
      // flex-wrap: wrap;
      text-align: center;
      .p1 {
        width: 100%;
        font-size: 17px;
        color: #222222;
        margin-top: 23px;
      }
      .p2 {
        width: 100%;
        font-size: 14px;
        color: #999999;
        margin-top: 5px;
      }
      .know {
        display: inline-block;
        width: 222px;
        height: 44px;
        line-height: 44px;
        background-color: #FF5D26;
        border-radius: 100px;
        font-size: 16px;
        color: #FFFFFF;
        margin-top: 30px;
      }
    }
  }
  .result {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    .result-header {
      overflow: hidden;
      width: 100%;
      height: 287px;
      background: url('../../assets/questionnaire/result-bg.png') no-repeat 0 0;
      background-size: 100% 100%;
      .result-reward {
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 90px;
        border-radius: 45px;
        background: #FFFFFF;
        .r1 {
          width: 60px;
          height: 27px;
        }
        .r2 {
          width: 55px;
          height: 50px;
        }
        .r3, .r4, .r5, .r6, .r7, .r8 {
          width: 46px;
          height: 32px;
        }
      }
      .result-p1 {
        width: 100%;
        margin-top: 140px;
        text-align: center;
        font-size: 26px;
        color: #FFFFFF;
      }
      .result-p2 {
        width: 100%;
        margin-top: 8px;
        text-align: center;
        font-size: 16px;
        color: #FFFFFF;
      }
    }
    .result-content {
      position: relative;
      width: 351px;
      height: 297px;
      background: #FFE7BD;
      margin: 0 auto;
      text-align: center;
      .t1 {
        position: relative;
        top: -24px;
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: #FF7022;
      }
      .pot {
        display: inline-block;
        border-radius: 3px;
        height: 6px;
        width: 6px;
        background: #FF7022;
        position: relative;
        top: -3px;
        left: -4px;
      }
      .pot1 {
        display: inline-block;
        border-radius: 3px;
        height: 6px;
        width: 6px;
        background: #FF7022;
        position: relative;
        top: -3px;
        right: -4px;
      }
      .t1-before {
        display: block;
        position: absolute;
        top: -16px;
        left: 86px;
        border-bottom: 2px solid #FF7022;
        width: 32px;
      }
      .t1-after {
        display: block;
        position: absolute;
        top: -16px;
        right: 86px;
        border-bottom: 2px solid #FF7022;
        width: 32px;
      }
      input, textarea {
        background: #FDFFFF;
        border-radius: 1px;
        width: 319px;
        margin-bottom: 13px;
        font-size: 13px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 10px;
      }
      textarea {
        padding: 5px 10px;
        -webkit-tap-highlight-color: transparent;
        outline: none;
        -webkit-appearance:none;
        border: none;
        margin-bottom: 6px;
      }
      .name {
        height: 44px;
      }
      .tel {
        height: 44px;
      }
      .address {
        height: 84px;
      }
      input::input-placeholder {
        color: #CCCCCC !important 
      }
      input::-ms-input-placeholder { 
        color: #CCCCCC !important 
      }
      input::-webkit-input-placeholder { 
        color: #CCCCCC !important 
      } 
      input::-moz-placeholder { 
        color: #CCCCCC !important 
      }
      textarea::input-placeholder {
        color: #CCCCCC !important 
      }
      textarea::-ms-input-placeholder { 
        color: #CCCCCC !important 
      }
      textarea::-webkit-input-placeholder { 
        color: #CCCCCC !important 
      } 
      textarea::-moz-placeholder { 
        color: #CCCCCC !important 
      }
      .tip {
        width: 100%;
        height: 12px;
        color: #F05A23;
        margin-bottom: 6px;
      }
      .submit {
        // display: block;
        width: 222px;
        height: 44px;
        border-radius: 100px;
        background-color: #FF5D26;
        color: #FFFFFF;
        font-size: 16px;
        -webkit-tap-highlight-color: transparent;
        outline: none;
        -webkit-appearance:none;
        border: 0px;
      }
    }
    .result-success {
      width: 351px;
      height: 297px;
      background: #FFE7BD;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
      .result-p1 {
        font-size: 17px;
        color: #B98B55;
        text-align: center;
        line-height: 20px;
        margin: 100px 0 10px;
        .icon {
          display: inline-block;
          width: 28px;
          height: 28px;
          background: url('../../assets/questionnaire/success.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
        .p1 {
          position: relative;
          top: -7px;
          left: 4px;
        }
      }
      .result-p2 {
        font-size: 14px;
        color: #B98B55;
        text-align: center;
        line-height: 20px;
      }
    }
  }
}
@supports(display: flex){
  .roll-items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
  }
  .roll-item {
    float: none !important;
    margin: 0 !important;
  }
}
@supports(background-image: linear-gradient(-57deg, #FF964E 0%, #FF5D26 100%)){
  .know {
    background-image: linear-gradient(-57deg, #FF964E 0%, #FF5D26 100%) !important;
  }
  .submit {
    background-image: linear-gradient(-57deg, #FF964E 0%, #FF5D26 100%) !important;
  }
}
</style>
