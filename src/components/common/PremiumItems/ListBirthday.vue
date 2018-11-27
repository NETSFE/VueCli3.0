<template>
  <div class="info">
    <span class="label">被保人{{ item.no }}</span>
    <span class="name" @click="openPicker('picker')">
      {{ datetimeFilter(item.birth_date) || '请选择' }}
      <i class="expand"></i>
    </span>
    <wv-datetime-picker
      ref="picker"
      type="date"
      :start-date="start"
      :end-date="end"
      v-model="item.birth_date"
      @confirm="onConfirm(item.birth_date, item.no)">
    </wv-datetime-picker>
  </div>
</template>
<script>
import Vue from 'vue'
import { DatetimePicker } from 'we-vue'
Vue.component(DatetimePicker.name, DatetimePicker)

export default {
  components: {
    wvDatetimePicker: DatetimePicker
  },
  props: [
    'item',
    'inputs',
    'datetimeFilter',
    'start',
    'end',
    'callback'
  ],
  created() {
    console.log(this.item)
  },
  methods: {
    openPicker(picker) {
      this.$refs[picker].open()
    },
    onConfirm(value, no) {
      this.inputs[no - 1].birth_date = value
      this.callback(this.inputs)
      console.log('inputs:', this.inputs)
    }
  }
}
</script>
