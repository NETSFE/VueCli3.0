<template>
  <div class="info">
    <span class="label">{{ label }}</span>
    <span class="name" @click="openPicker('picker')">
      {{ datetimeFilter(birthday) || '请选择' }}
      <i class="expand"></i>
    </span>
    <wv-datetime-picker
      ref="picker"
      type="date"
      :start-date="new Date(start)"
      :end-date="new Date(end)"
      v-model="birthday"
      @confirm="onConfirm">
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
    'data',
    'label',
    'default',
    'start',
    'end',
    'callback'
  ],
  data() {
    return {
      birthday: new Date(this.default)
    }
  },
  methods: {
    openPicker(picker) {
      this.$refs[picker].open()
    },
    onConfirm(value) {
      this.birthday = value
      this.callback(this.birthday)
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
