<template>
  <div class="health-btn">
    <v-touch tag="div" v-on:tap="jumpUrl" class="health-item health-item-sub" >
      <span>{{ text }}</span>
    </v-touch>
  </div>
</template>
<script>
  export default {
    // methods: {
    //   jumpUrl: function() {
    //     window.location.href = this.location
    //   }
    // },
    props: {
      jumpUrl: {
        required: true
      },
      text: {
        required: true
      }
    }
  }
</script>
<style scoped>
  .health-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }
  .health-item{
    float: left;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .health-item:active{
    background: #F05A23;
  }
  .health-item-sub{
    background: #FF8028;
    color: #FFFFFF;
    font-size: 17px;
    line-height: 50px;
  }
</style>
