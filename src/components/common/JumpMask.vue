<template>
  <div v-show="showMask" class="mask" @touchmove.self.prevent>
    <div class="win">
      <p>页面跳转中...</p>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        showMask: false
      }
    },
    methods: {
      show: function(href) {
        this.showMask = true
        setTimeout(() => {
          this.hide()
          location.href = href
        }, 2000)
      },
      hide: function() {
        this.showMask = false
      }
    }
  }
</script>
<style lang="less" scoped>
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
  .win {
    position: absolute;
    margin: auto;
    width:  5.2rem;
    height: 1.0rem;
    display: block;
    filter: alpha(opacity=80);
    background: #000000;
    border-radius: 0.12rem;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #FFFFFF;
    text-align: center;
    font-size: 0.34rem;
    line-height: 1.0rem;
  }
</style>
