/***
*   带 >  Picker 需传入固定格式
*   如：publicList: {
*        rtitle: '保障计划',   //左侧标题
*        rkey: '500万',       //默认显示值（values中要有此值）
*        ticketSlots: [
*          {
*            values: [       //备选数组列表
*              '200万',
*              '400万',
*              '1000万'
*            ]
*          }
*        ]
*      }
***/
<template>
  <div class="page page-with-padding">
    <div class="mainLint" @click="papersTypeShow = true">
      <span>{{publicList.rtitle}}</span>
      <i></i>
      <input type="text" v-bind:value="publicList.rkey" readonly unselectable="on" @focus="eblur()" ref="eblur">
    </div>
    <vpicker v-model="papersTypeShow" :slots="publicList.ticketSlots" @confirm="papersChange"></vpicker>
  </div>
</template>

<script>
import { Picker } from 'we-vue'
export default {
  components: {
    vpicker: Picker
  },
  props: ['listData'],
  data() {
    return {
      papersTypeShow: false,
      publicList: this.listData
    }
  },
  methods: {
    papersChange(picker, value) {
      this.$nextTick(() => {
        this.publicList.rkey = picker.getValues()
        this.publicList.rxian = this.publicList.rkey
      })
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
