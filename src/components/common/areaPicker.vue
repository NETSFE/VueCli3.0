<template>
  <div class="page page-with-padding">
    <div class="mainLint" @click="papersTypeShow = true">
      <span class="firstspan">所在城市</span>
      <i></i>
      <span class="secondspan">{{city}}</span>
    </div>
    <picker v-model="papersTypeShow" :slots="ticketSlots" @change="onAddressChange" @confirm="confirmAddress"></picker>
  </div>
</template>

<script>
import { Picker } from 'we-vue'
import 'we-vue/lib/style.css'
import chinaAreaData from 'china-area-data'
let provinces = Object.values(chinaAreaData[86])
// 获取某一省下的市
function getCities(province) {
  let provinceCode
  for (let i in chinaAreaData[86]) {
    if (province === chinaAreaData[86][i]) {
      provinceCode = i
      break
    }
  }
  switch (provinceCode) {
    case '110000':
      return ['北京市']
    case '120000':
      return ['天津市']
    case '310000':
      return ['上海市']
    case '500000':
      return ['重庆市']
    case '710000':
      return ['台湾省']
  }
  return Object.values(chinaAreaData[provinceCode])
}
export default {
  components: {
    picker: Picker
  },
  data() {
    return {
      papersTypeShow: false,
      ticketSlots: [
        {
          values: provinces
        },
        {
          values: []
        }
      ]
    }
  },
  props: ['citys'],
  methods: {
    onAddressChange(picker, value) {
      picker.setSlotValues(1, getCities(value[0]))
    },
    confirmAddress(picker) {
      const location = picker.getValues()
      this.city = location[1]
    }
  },
  computed: {
    city: {
      set: function(newValue) {
        this.citys = newValue
      },
      get: function() {
        return this.citys
      }
    }
  }
}
</script>
<style scoped>
.page{
  border-top: 10px solid rgb(239, 239, 244);
}
.mainLint{
  position: relative;
  line-height: 50px;
  box-sizing: border-box;
}
.mainLint>span{
  font-size: 14px;
  color: #171717;
  line-height: 50px;
}
.mainLint>.firstspan{
  margin-left: 12px;
}
.mainLint>.secondspan{
  position: absolute;
  right: 25px;
}
.mainLint>i{
  display: block;
  width: 6px;
  height: 12px;
  background: url(../../assets/choose.png) no-repeat;
  position: absolute;
  top: 18px;
  right: 12px;
}
</style>
