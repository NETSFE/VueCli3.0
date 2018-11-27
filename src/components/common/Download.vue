<template>
  <div id="download" v-bind:class="{ display: isdisplay }" v-if="this.query.share">
    <img src="../../assets/download/close.png" alt="" v-on:click="modifyParentClass">
    <img src="../../assets/download/logo.png" alt="">
    <span>用客户端了解更多精彩!</span>
    <a v-on:click="jump" href="javascript:void(0)">下载App</a>
  </div>
</template>

<script>
import { getQuery } from '@utils/util'
export default {
  data() {
    return {
      isdisplay: false
    }
  },
  methods: {
    modifyParentClass() {
      this.isdisplay = true
    },
    jump() {
      let link = './guidance.html' + (this.query.share ? '?share=' + this.query.share : '')
      window.location = link
    }
  },
  computed: {
    query: function() {
      return getQuery()
    }
  }
}
</script>
<style scoped>
.display{
  display:none;
}
#download{
  background:#FFFCE5;
  width:375px;
  height:50px;
  line-height:50px;
  font-size: 13px;
  color: #616161;
}
#download img:nth-child(1){
  display:inline-block;
  width:20px;
  height:20px;
  vertical-align:middle;
  margin:0 12px;
}
#download img:nth-child(2){
  display:inline-block;
  width:32px;
  height:32px;
  vertical-align:middle;
}
#download span:nth-child(3){
  margin:0 64px 0 8px;
}
#download a{
  text-decoration:none;
  color:#F05A23;
  padding:6px 10px;
  border:1px solid #F05A23;
  border-radius:2px;
}
</style>
