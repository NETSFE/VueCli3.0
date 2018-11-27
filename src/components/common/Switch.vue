<template>
  <div class='myswitch'>
    <wvswitch @change="emmitChange" :title="item.name" v-model="key"></wvswitch>
  </div>
</template>
<script>
import { Switch } from 'we-vue'
import 'we-vue/lib/style.css'

export default {
  components: {
    wvswitch: Switch
  },
  props: {
    item: {
      name: '开关',
      key: false
    }
  },
  data() {
    return {
      key: this.item.key || false
    }
  },
  methods: {
    toggleSwitch() {
      this.key = !this.key
    },
    close() {
      this.key = false
    },
    open() {
      this.key = true
    },
    getValue() {
      return this.key
    },
    emmitChange(data) {
      this.$emit('change', data)
    }
  }
}
</script>
<style scoped>
.myswitch {
  position: relative;
}
input.hidden {
  position: absolute;
  top: 0 ;
  right: 0;
  width: 0;
  height: 0;
  border: 0;
  overflow: hidden;
}
.myswitch .weui-cell {
  padding-left: 0;
}
</style>
