<template>
  <div id="container">
    <table border="0" cellpadding="0" cellspacing="0">
      <tr v-for="c in list">
        <td v-for="ct in c.item" class="unit"  v-bind:class= "{isactive: (ct.index === active)}"  @click.prevent="toggle(ct.index)"><img v-bind:src="ct.picture"/><div class="mask"></div></td>
      </tr>
    </table>
    <a v-show="hasGift" href="./rollmyprize.html" class="award"></a>
    <div v-show="isShowTip" class="content-mask" @touchmove.prevent>
      <div class="content-container">
        <div class="content-close" v-on:click="isShowTip=!isShowTip" ></div>
        <div class="content-img" v-bind:style="{backgroundImage: prizeImg ? 'url(' + prizeImg + ')' : ''}">
        </div>
        <p v-if="!thankU" class="content-desc">太棒了,恭喜您获得</p>
        <p v-if="!thankU" class="content-name" v-html="prizeName"></p>
        <p v-if="thankU" class="content-name2" v-html="prizeName"></p>
        <a href="./rollmyprize.html"><div v-if="!thankU" class="content-button"></div></a>
      </div>
    </div>
    <div v-if="isNoChance" v-on:click="isNoChance = !isNoChance" class="overlay"  @touchmove.prevent>    
    </div>
	</div>
</template>
<script>
  import { verifyFetch } from '@utils/utils'
  import { getDrawTimes, drawLottery, getGiftList } from '@utils/urls'
  import { isLogin } from '@utils/native'
  // 后台返回中奖位置与前端奖品位置对应表
  const GIFT_LIST = {
    0: {
      index: 0,
      name: '联想ThinkPad笔记本电脑',
      img: require('@assets/roll/0.png')
    },
    1: {
      index: 1,
      name: '佳能单反相机',
      img: require('@assets/roll/1.png')
    },
    2: {
      index: 2,
      name: '美的空调扇',
      img: require('@assets/roll/2.png')
    },
    3: {
      index: 3,
      name: '床上四件套',
      img: require('@assets/roll/3.png')
    },
    4: {
      index: 7,
      name: '美旅拉杆箱',
      img: require('@assets/roll/4.png')
    },
    5: {
      index: 5,
      name: '话费充值卡',
      img: require('@assets/roll/5.png')
    },
    6: {
      index: 6,
      name: '爱奇艺vip',
      img: require('@assets/roll/6.png')
    },
    7: {
      index: 4,
      name: '赠险',
      img: require('@assets/roll/7.png')
    },
    8: {
      index: 4,
      name: '祝福',
      img: require('@assets/roll/8.png')
    }
  }

  const WISH_LIST = [
    '<p>我要一步一步往上爬</p><p>在最高点乘着叶片往前飞</p>',
    '<p>你的青春</p><p>如夏花一样绚烂</p>',
    '<p>花样年华里你美丽的脸庞</p><p>映着你最温情的梦想</p>',
    '<p>不管这世界怎么改变</p><p>梦想依然在我心间</p>',
    '<p>人生路上甜苦和喜忧</p><p>愿你为梦想而坚守</p>',
    '<p>梦想在你手中</p><p>这是你的天地</p>',
    '<p>挑战一切</p><p>飞向更高天空</p>',
    '<p>少年的梦</p><p>寻找世界最高的山峰</p>',
    '<p>这个世界由 梦想制造</p><p>逆风就要飞得更高</p>',
    '<p>既然要远航就注定风浪</p><p>成功它就站在失败身旁</p>',
    '<p>随风飞翔有梦作翅膀</p><p>敢爱敢做勇敢闯一闯</p>',
    '<p>勇敢去面对</p><p>明天会更美</p>',
    '<p>认真地过每一分钟</p><p>心跟着希望在动</p>',
    '<p>坚定着美梦</p><p>努力就能成功</p>',
    '<p>只要扎根在土壤</p><p>玫瑰总能够绽放</p>',
    '<p>梦想终能达成</p><p>找到心底的世界</p>'
  ]

  export default{
    data() {
      return {
        count: 7, // list长度
        timer: 0,  // 定时器
        speed: 150, // 速度
        times: 0,  // 当前roll次数
        cycle: 50, // roll次数
        prize: -1, // 中奖位置
        active: -1, // 亮起位置
        isRolling: false, // 启动标识
        hint: '',
        thankU: false, // 是否获得祝福语
        hasGift: false, // 是否已获得奖品
        giftIndex: -1,
        prizeName: '', // 奖品名称
        prizeImg: '', // 奖品图片
        isShowTip: false, // 显示奖品提示
        isNoChance: false, // 显示没有抽奖机会
        list: [
          {
            item: [
              {
                index: 0,
                picture: require('@assets/roll/1-0.png')
              },
              {
                index: 1,
                picture: require('@assets/roll/1-1.png')
              },
              {
                index: 2,
                picture: require('@assets/roll/1-2.png')
              }
            ]
          },
          {
            item: [
              {
                index: 7,
                picture: require('@assets/roll/1-4.png')
              },
              {
                index: '',
                picture: require('@assets/roll/lottery.png')
              },
              {
                index: 3,
                picture: require('@assets/roll/1-3.png')
              }
            ]
          },
          {
            item: [
              {
                index: 6,
                picture: require('@assets/roll/1-6.png')
              },
              {
                index: 5,
                picture: require('@assets/roll/1-5.png')
              },
              {
                index: 4,
                picture: require('@assets/roll/1-7.png')
              }
            ]
          }
        ]
      }
    },
    mounted() {
      // for test
      // this.thankU = true
      // this.giftIndex = 8
      // this.showTip()
      isLogin().then((data) => {
        console.log(data)
        if (Number(data) === 1) {
          console.log('login')
          verifyFetch({url: getGiftList, nativeParams: ['user_id']}).then((data) => {
            if (data.data.data.length) {
              this.hasGift = true
            }
          })
        }
      })
    },
    methods: {
      toggle(index) {
        if (index !== '') {
          return false
        }
        if (this.isRolling) {
          return false
        }
        verifyFetch({url: getDrawTimes, nativeParams: ['user_id']}).then((data) => {
          let chance = data.data.data.chance
          console.log(chance)
          if (chance && chance > 0) {
            this.start()
            return false
          }
          // TODO 抽奖次数用完的提示
          this.showNoChance()
        })
      },
      start() {
        this.raffle()
        this.isRolling = true
        // 获取数据
        this.stop()
      },
      stop() {
        this.getPrize()
      },
      getPrize() {
        // var url = 'http://103.28.215.253:181/Lottery/draw?developer=true&user_id=6969121'
        verifyFetch({url: drawLottery, nativeParams: ['user_id']}).then((data) => {
          if (data.data.data === 8) {
            this.thankU = true
          }
          // data.data.data = 2
          this.giftIndex = data.data.data
          this.prize = GIFT_LIST[data.data.data].index
          console.log(this.prize)
        }).catch((err) => {
          console.log(err)
        })
        // var math = 8
        // this.prize = math
        // console.log(this.prize)
      },
      showNoChance() {
        this.isNoChance = true
        // setTimeout(() => {
        //   this.isNoChance = false
        // }, 1500)
      },
      showTip() {
        let data = GIFT_LIST[this.giftIndex]
        this.prizeName = data.name
        if (this.thankU) {
          var num = Math.floor(Math.random() * 17)
          this.prizeName = WISH_LIST[num]
        }
        this.prizeImg = data.img
        this.isShowTip = true
      },
      /**
       * 旋转
      */
      raffle() {
        this.times += 1
        this.roll()
        if (this.times > this.cycle + 10 && this.prize === this.active) {
          // TODO 中奖提示弹窗
          setTimeout(() => {
            this.showTip()
          }, 200)
          // TODO 中奖右下角提示
          if (!this.thankU) {
            this.hasGift = true
          }
          this.reset()
          return false
        }
        this.speedFn()
        this.timer = setTimeout(() => {
          this.raffle()
        }, this.speed)
      },
      roll() {
        if (this.active + 1 > this.count) {
          this.active = 0
          return
        }
        this.active += 1
      },
      // 速度处理
      speedFn() {
        let speedDown = true
        if (this.times < this.cycle) {
          this.speed -= 10
          speedDown = false
        }
        if (this.prize === 8) {
          if (speedDown && (this.times > this.cycle + 10) && this.prize === this.active) {
            this.speed += 150
          } else if (speedDown) {
            this.speed += 30
          }
        }
        if (speedDown && (this.times > this.cycle + 10) && this.prize === this.active + 1) {
          this.speed += 150
        } else if (speedDown) {
          this.speed += 30
        }
        if (this.speed < 100) {
          this.speed = 100
        }
      },
      reset() {
        clearTimeout(this.timer)
          // this.prize = -1
        this.times = 0
        this.speed = 100
        this.isRolling = false
      }
    }
  }
</script>
<style lang="" scoped>
  #container{
    width:355px;
    box-sizing:border-box;
  }
  table{
    margin:20px 11px auto;
  }
	td{
    position:relative;
    width:106px;
    height:93px;
    text-align:center;
    color:#333;
    font-index:-999;
  }
  table tr td:nth-child(2){
    padding:0 10px;
  }
   table tr:nth-child(2) td img{
    padding:8px 0;
  }
	td img{
    display:block;
    width:106px;
    height:93px;
  }
	td a{
    width:106px;
    height:93px;
    display:block;
    text-decoration:none;
    background:url(../../assets/roll/lottery.png) no-repeat center center;
    background-size:106px 93px;
  }
	td a:active{
    background-image:url(../../assets/roll/lottery.png);
  }
	td.isactive .mask{
    display:block;
  }
  .mask{
		width:100%;
		height:100%;
		position:absolute;
		left:0;
		top:0;
	  background:url(../../assets/roll/mask.png) no-repeat center center;
		display:none;
    background-size:106px 93px;
	}
  .award{
    background: url(../../assets/roll/award.png) no-repeat center center;
    background-size: 60px 60px;
    width: 60px;
    height: 60px;
    position: fixed;
    bottom: 15px;
    right: 10px;
    animation: myfirst 2s ease-in-out infinite;
  }
  .content-mask{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
  }
  .content-container{
    position: absolute;
    width: 310px;
    height: 330px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #FFFFFF;
    border-radius: 10px;
    border: 4px solid yellow;
  }
  .content-close{
    position: absolute;
    right: 12.5px;
    top: 12.5px;
    width: 16px;
    height: 16px;
    background: url(../../assets/roll/close.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
  .content-img{
    width: 100%;
    height: 188px;
    background-position: center 30px;
    background-repeat: no-repeat;
    background-size: 140px auto;
  }
  .content-desc{
    text-align: center;
    color: #000;
    font-size: 18px;
  }
  .content-name{
    text-align: center;
    color: #F11;
    font-size: 16px;
    line-height: 32px;
  }
  .content-name2{
    margin-top: 30px;
    text-align: center;
    color: #F11;
    font-size: 18px;
    line-height: 32px;
  }
  .content-button{
    width: 125px;
    height: 42px;
    margin: 10px auto 0 auto;
    background-image: url(../../assets/roll/gift-btn.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
  .content-button:active{
    background-image: url(../../assets/roll/gift-btn-active.png);
  }
  .overlay{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0,0,0,0.5);
    background-image: url('../../assets/roll/share.png');
    background-position: 90px 0;
    background-size: 285px 145px;
    background-repeat: no-repeat;
    /*display: none;*/
  }
  /*.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }*/
  @keyframes myfirst {  
    0% {  
      transform: translate(0px, 0px);  
    }
    50% {  
      transform: translate(0px, -10px);  
    }
    100% {  
      transform: translate(0px, 0px);  
    }
  }
</style>
