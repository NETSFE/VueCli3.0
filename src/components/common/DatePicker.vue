<template>
  <div>
    <div class="mainLint" @click="openPicker">
        <span>{{publicList.rtitle}}</span>
        <i></i>
        <input type="text" v-bind:value="publicList.rkey" readonly unselectable="on" @focus="eblur()" ref="eblur">
    </div>  
    <wvdatetime :start-date="publicDate.startDate" :end-date="publicDate.endDate" ref="picker" type="date" @confirm="handleConfirm"></wvdatetime>
  </div>
</template>
<script>
import { DatetimePicker } from 'we-vue'
export default {
  components: {
    wvdatetime: DatetimePicker
  },
  props: ['publicDate'],
  data() {
    return {
      publicList: this.publicDate || ''
    }
  },
  methods: {
    handleConfirm(value) {
      // console.log(value.toString())
      let tt = new Date(value.toString())
      let getMon = (tt.getMonth() + 1)
      let getDa = tt.getDate()
      if (getMon < 10) {
        getMon = '0' + getMon
      }
      if (getDa < 10) {
        getDa = '0' + getDa
      }
      let date = tt.getFullYear() + '-' + getMon + '-' + getDa
      this.publicList.rkey = date
    },
    openPicker() {
      this.$refs.picker.open()
    },
    eblur() {
      this.$refs.eblur.blur()
    }
  }
}
</script>
<style scoped>
.mainLint{
  position: relative;
  line-height: 50px;
  box-sizing: border-box;
}
.mainLint>span{
  font-size: 14px;
  color: #171717;
}
.mainLint>input{
  border: 0;
  height: 16px;
  float: right;
  text-align: right;
  margin-top: 6px;
  font-size: 14px;
  color: #808080;
  margin-right:17px;
  padding: 10px 5px;
}
.mainLint>i{
  display: block;
  width: 6px;
  height: 12px;
  background: url(../../assets/choose.png) no-repeat;
  position: absolute;
  top: 19px;
  right: 4px;
}
</style>
