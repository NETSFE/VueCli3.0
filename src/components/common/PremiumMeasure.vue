<template>
  <div class="measure">
    <div class="measure-title"><i class="circle"></i>保费测算</div>
    <common-picker
     v-if="isPlansShow"
     label="保障计划"
     :slots="planSlots"
     :callback="planHandler"
     :defaultValue="defaultPlan"
     valueKey="title"
    />
    <div class="info" v-if="isPlanShow">
      <span class="label">保障计划</span>
      <span class="name">全面保障计划</span>
    </div>
    <ul class="measure-list" v-if="isListShow">
      <li class="measure-item" :key="item.no" v-for="item in inputs">
        <list-birthday
          :item="item"
          :inputs="inputs"
          :datetimeFilter="datetimeFilter"
          :start="start"
          :end="end"
          :callback="listHandler"
        />
        <list-social-security
         :item="item"
         :inputs="inputs"
         :slots="socialSlots"
         :callback="listHandler"
        />
      </li>
      <div class="operation">
        <i class="remove" @click="remove"></i>
        增删被保人
        <i class="add" @click="add"></i>
      </div>
      <common-picker
       label="是否共享保额"
       :slots="shareSlots"
       :callback="shareHandler"
       valueKey="label"
       defaultValue="是"
      />
    </ul>
    <common-picker
     v-if="isPeriodsShow"
     label="保障期间"
     :slots="periodSlots"
     :callback="periodHandler"
     valueKey="label"
     :defaultValue="defaultPeriod"
     ref="setPlan"
    />
    <birthday
      v-if="isEffectiveDateShow"
      label="生效日期"
      :start="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+5)"
      :end="new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())"
      :callback="effectivedate"
    />
    <common-picker
     v-if="isHospitalShow"
     label="专属私立医院"
     :slots="planSlots"
     :callback="hospitalHandler"
     valueKey="title"
     :defaultValue="defaultPlan"
    />
    <div class="info" v-if="isAmountShow">
      <span class="label">年度保额</span>
      <span class="name">{{ sum_insured || "--" }}</span>
    </div>
    <birthday
      v-if="isBirthdayShow"
      :callback="birthdayHandler"
      label="被保人生日"
      :start="start"
      :end="end"
      :default="birthday"
    />
    <div class="info" v-if="isPeriodShow">
      <span class="label">保障期间</span>
      <span class="name">{{ singlePeriod || "--" }}</span>
    </div>
    <common-picker
      v-if="isGenderShow"
      label="性别"
      :slots="genderSlots"
      :callback="genderHandler"
      defaultValue="男"
      valueKey="label"
    />
    <common-picker
      v-if="isSecurityShow"
      label="被保人有无社保"
      :slots="socialSlots"
      :callback="securityHandler"
      defaultValue="有"
      valueKey="label"
    />
    <div class="fee">
      <span class="label">保费：</span>
      <span class="money">{{ fee }}</span>
      <span class="unit">元</span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import 'we-vue/lib/style.css'
import { DatetimePicker, Picker } from 'we-vue'
Vue.component(Picker.name, Picker)
Vue.component(DatetimePicker.name, DatetimePicker)
import { getProductParams, calculatePremium } from '@utils/urls'
import { fetchData } from '@utils/utils'
import Birthday from '@components/common/PremiumItems/Birthday'
import ListSocialSecurity from '@components/common/PremiumItems/ListSocialSecurity'
import ListBirthday from '@components/common/PremiumItems/ListBirthday'
import CommonPicker from '@components/common/PremiumItems/CommonPicker'
import { config } from '@components/common/PremiumItems/config'
export default {
  props: [
    'productId'
  ],
  components: {
    wvPicker: Picker,
    wvDatetimePicker: DatetimePicker,
    Birthday,
    ListSocialSecurity,
    CommonPicker,
    ListBirthday
  },
  data() {
    return {
      inputs: [],
      number: 2,
      insurants: [],
      fee: '--',
      plan: '',
      period: '',
      periods: [],
      periodLabel: '',
      isShare: '',
      start: '',
      end: '',
      level: '',
      title: '',
      birthday: '',
      eff_date: '',
      hasSecurity: 'Y',
      gender: 'M',
      is_shared: 'Y',
      sum_insured: '',
      singlePeriod: '',
      defaultPlan: '',
      defaultPeriod: '',
      // 控制组件显示与否
      isBirthdayShow: config[this.productId].birthday,
      isListShow: config[this.productId].list,
      isHospitalShow: config[this.productId].hospital,
      isEffectiveDateShow: config[this.productId].effectiveDate,
      isGenderShow: config[this.productId].gender,
      isPlansShow: config[this.productId].plans,
      isPlanShow: config[this.productId].plan,
      isPeriodShow: config[this.productId].period,
      isPeriodsShow: config[this.productId].periods,
      isAmountShow: config[this.productId].amount,
      isSecurityShow: config[this.productId].security,
      levels: [],
      planSlots: [
        {
          values: [],
          defaultIndex: 0
        }
      ],
      periodSlots: [
        {
          values: [],
          defaultIndex: 0
        }
      ],
      socialSlots: [
        {
          values: [
            {
              label: '有',
              val: 'Y'
            },
            {
              label: '无',
              val: 'N'
            }
          ],
          defaultIndex: 0
        }
      ],
      genderSlots: [
        {
          values: [
            {
              label: '男',
              val: 'M'
            },
            {
              label: '女',
              val: 'F'
            }
          ],
          defaultIndex: 0
        }
      ],
      shareSlots: [
        {
          values: [
            {
              label: '是',
              val: 'Y'
            },
            {
              label: '否',
              val: 'N'
            }
          ],
          defaultIndex: 0
        }
      ]
    }
  },
  mounted() {
    const opts = {
      url: getProductParams,
      method: 'get',
      params: {
        product_id: this.productId
        // timestamp: parseInt(String(Date.parse(new Date())).substr(0, 10))
      }
    }
    fetchData(opts).then((res) => {
      const data = res.data.data
      this.$store.commit('premiumMeasure/plans', data)
      this.start = new Date(data.ages.max)
      this.end = new Date(data.ages.min)
      this.birthday = new Date(data.ages.max)
      this.sum_insured = data.levels[0].sum_insured
      this.singlePeriod = data.levels[0].period[0].label
      this.planSlots[0].values = data.levels
      if (this.productId === 'A000000004') {
        this.eff_date = this.datetimeFilter(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5))
      }
      // else {
      //   this.eff_date = this.datetimeFilter(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1))
      // }
      // e家保默认
      this.inputs = [
        {
          no: 1,
          birth_date: this.end,
          sex: 'M',
          has_security: {
            label: '有',
            val: 'Y'
          }
        },
        {
          no: 2,
          birth_date: this.end,
          sex: 'M',
          has_security: {
            label: '有',
            val: 'Y'
          }
        }
      ]
      const birthDate = this.datetimeFilter(this.end)
      this.insurants = [
        {
          birth_date: birthDate,
          has_security: 'Y',
          sex: 'M'
        },
        {
          birth_date: birthDate,
          has_security: 'Y',
          sex: 'M'
        }
      ]
      // 设置默认值
      this.defaultPlan = data.levels[0].title
      this.level = data.levels[0].level
      this.periodSlots[0].values = data.levels[0].period
      this.defaultPeriod = data.levels[0].period[0].label
      this.period = data.levels[0].period[0].val
      this.calculate()
    })
  },
  methods: {
    add() {
      const info = {
        no: ++this.number,
        birth_date: this.end,
        sex: 'M',
        has_security: {
          label: '有',
          val: 'Y'
        }
      }
      this.inputs.push(info)
      this.insurants[this.number - 1] = {
        birth_date: this.datetimeFilter(this.end),
        has_security: 'Y',
        sex: 'M'
      }
      // console.log(this.inputs)
      this.calculate()
    },
    remove() {
      if (this.number > 2) {
        this.inputs.pop()
        this.number--
        // console.log(this.inputs)
        delete this.insurants[this.number]
        this.calculate()
      }
    },
    calculate() {
      let info = {
        birth_date: this.datetimeFilter(this.birthday),
        sex: this.gender || 'M',
        has_security: this.hasSecurity
      }
      if (this.productId !== 'A000000003') {
        this.insurants = []
        this.insurants.push(info)
      }
      const params = {
        product_id: this.productId,
        insurants: this.insurants,
        level: this.level,
        period_value: this.period,
        is_shared: this.is_shared
      }
      const selectedData = {
        ...params,
        title: this.title || this.defaultPlan,
        periods: this.periodSlots[0].values,
        period_label: this.periodLabel || this.defaultPeriod,
        eff_date: this.eff_date
      }
      this.$store.commit('premiumMeasure/params', selectedData)
      const opts = {
        url: calculatePremium,
        method: 'post',
        data: params
      }
      fetchData(opts).then((res) => {
        if (res.data.code === 0) {
          // console.log('res', res.data.data.ranges)
          const ranges = res.data.data.ranges
          this.$store.commit('premiumMeasure/ranges', ranges)
          this.fee = res.data.data.totalPrem || '--'
        } else {
          this.fee = '--'
        }
        this.$store.commit('premiumMeasure/fee', this.fee)
        console.log('state:', this.$store.state)
      })
    },
    // selectHandler(type, data) {
    //   this[type] = data.val
    //   this.calculate()
    // },
    securityHandler(data) {
      this.hasSecurity = data.val
      this.calculate()
    },
    genderHandler(data) {
      this.gender = data.val
      this.calculate()
    },
    birthdayHandler(birthday) {
      this.birthday = birthday
      this.calculate()
    },
    effectivedate(effdate) {
      this.eff_date = this.datetimeFilter(effdate)
      this.calculate()
    },
    listHandler(data) {
      this.insurants = []
      for (let item of data) {
        let obj = {
          birth_date: this.datetimeFilter(item.birth_date),
          has_security: item.has_security.val,
          sex: item.sex
        }
        this.insurants.push(obj)
      }
      this.calculate()
    },
    planHandler(data) {
      // console.log(data)
      const period = data.period
      this.periodSlots[0].values = period
      this.period = period[0].val
      this.periodLabel = this.defaultPeriod = period[0].label
      this.level = data.level
      this.title = data.title
      if (this.productId === 'A000000004') {
        this.$refs.setPlan.onConfirm(period[0])
      }
      this.calculate()
    },
    periodHandler(data) {
      console.log(data)
      this.period = data.val
      this.periodLabel = data.label
      this.calculate()
    },
    shareHandler(data) {
      this.is_shared = data.val
      this.calculate()
    },
    hospitalHandler(data) {
      // console.log(data.item)
      this.level = data.level
      this.title = data.title
      this.calculate()
    },
    datetimeFilter(date) {
      if (date !== null && typeof date === 'object') {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        return `${year}-${month}-${day}`
      } else {
        return date
      }
    }
  }
}
</script>
<style>
.circle {
  display: inline-block;
  width: 0;
  height: 0;
  padding: 3px;
  border: 2px solid #fe9041/*no*/;
  border-radius: 50%;
  margin-right: 8px;
}
.measure {
  background-color: #fff;
  max-height: 3000px;
  font-family: "PingFangSC-Regular";
  font-size: 13px;
  color: #171717;
  letter-spacing: 0.17px;
  width: 100%;
  overflow-x: hidden;
  margin-top: 12px;
}
.measure-title {
  height: 13px;
  font-size: 14px;
  color: #171717;
  line-height: 13px;
  padding: 12px;
  border-bottom: 1px solid #EFEFF4/*no*/;
}
.measure-list {
  width: 351px;
  margin: 0 auto;
}
.measure-item {
  list-style: none;
  margin: 0 auto 11px auto;
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 0 4px 0 rgba(179,179,179,0.50);
  border-radius: 5px;
}
.info:first-child {
  border-bottom: 1px solid #EFEFF4/*no*/;
}
.plan, .info, .share {
  display: flex;
  justify-content: space-between;
  height: 44px;
  line-height: 44px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
}
.plan, .share, .fee, .info {
  width: 351px;
  margin: 0 auto;
}
.info, .plan {
  border-bottom: 1px solid #EFEFF4/*no*/;
}
.share {
  border-bottom: 1px solid #EFEFF4/*no*/;
  border-top: 1px solid #EFEFF4/*no*/;
}
.fee {
  padding: 0 27px;
  height: 44px;
  line-height: 44px;
}
.name {
  color: #9A9A9A;
  position: absolute;
  right: 0;
  margin-right: 24px;
}
.expand {
  background: url(../../assets/choose.png) no-repeat;
  background-size: contain;
  display: inline-block;
  width: 6px;
  height: 12px;
  margin-left: 8px;
}
.add {
  background: url(../../assets/add.png) no-repeat;
  background-size: contain;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-left: 12px;
}
.remove {
  background: url(../../assets/remove.png) no-repeat;
  background-size: contain;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 12px;
}
.operation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 44px;
  line-height: 44px;
  margin-right: 24px;
}
.info .weui-mask {
  background: rgba(0, 0, 0, 0);
}
.fee .label {
  color: #9A9A9A;
}
.money {
  font-size: 20px;
  color: #F05A23;
  letter-spacing: 0.17px;
  line-height: 18px;
}
.unit {
  font-size: 13px;
  color: #F05A23;
}
</style>
