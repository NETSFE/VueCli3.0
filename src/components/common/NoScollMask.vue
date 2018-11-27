<template>
  <div v-show="showMask" class="mask" @touchmove.self.prevent>
    <slot></slot>
  </div>
</template>
<script>
  import '@common/style/reset.less'
  export default {
    data() {
      return {
        showMask: false
      }
    },
    methods: {
      show: function() {
        this.showMask = true
      },
      hide: function() {
        this.showMask = false
      }
    }
  }
</script>
<style lang="css" scoped>
  .mask {
    /*display: none;*/
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
</style>
