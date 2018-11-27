<template>
  <div class="plan">
    <span class="label">{{ label }}</span>
    <span class="name" @click="pickerShow = true">{{ item[valueKey] || defaultValue || '请选择' }}<i class="expand"></i></span>
    <wv-picker v-model="pickerShow" :slots="slots" value="Y" :value-key="valueKey" @confirm="onConfirm"></wv-picker>
  </div>
</template>
<script>
import Vue from 'vue'
import { Picker } from 'we-vue'
Vue.component(Picker.name, Picker)

export default {
  components: {
    wvPicker: Picker
  },
  props: [
    'label',
    'slots',
    'callback',
    'valueKey',
    'defaultValue'
  ],
  data() {
    return {
      item: '',
      pickerShow: false
    }
  },
  methods: {
    onConfirm(picker) {
      if (typeof picker.getValues === 'function') {
        this.item = picker.getValues()[0]
        this.callback(this.item)
      } else {
        this.item = picker
        this.callback(picker)
      }
    }
  }
}
</script>
