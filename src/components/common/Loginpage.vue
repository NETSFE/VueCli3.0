<template>
  <div class="login-mask" @touchmove.prevent >
    <loginbox :closeCallback="closeCallback" v-bind:loginCallback="loginCallback" />
  </div>
</template>
<script>
import loginbox from '@components/common/Loginbox'
export default {
  components: {
    loginbox
  },
  props: {
    loginCallback: Function,
    closeCallback: Function
  }
}
</script>
<style lang="css" scoped>
  .login-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
