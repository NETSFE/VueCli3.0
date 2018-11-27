<template>
  <div class="info">
    <span class="label">被保人有无社保</span>
    <span class="name" @click="pickerShow = true">{{ item.has_security.label || '请选择' }}<i class="expand"></i></span>
    <wv-picker
      v-model="pickerShow"
      :slots="slots"
      value-key="label"
      @confirm="onConfirm">
    </wv-picker>
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
    'item',
    'inputs',
    'slots',
    'callback'
  ],
  data() {
    return {
      pickerShow: false
    }
  },
  methods: {
    onConfirm(picker) {
      console.log(picker.getValues()[0])
      this.inputs[this.item.no - 1].has_security = picker.getValues()[0]
      this.callback(this.inputs)
    }
  }
}
</script>
