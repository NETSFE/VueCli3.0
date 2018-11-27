<template>
    <div id="tab" class="tab">
      <ul iclass="app1 clear" id="app1">  
        <li v-for="(tab, index) in tabs" v-on:click="toggle(index, tab.view)" :class="{active:active==index}">
        {{tab.type}}  
        </li>
      </ul>
      <ul id="fix-header" class="app1 clear fix">  
        <li v-for="(tab, index) in tabs" v-on:click="toggle(index, tab.view)" :class="{active:active==index}">
        {{tab.type}}  
        </li>
      </ul> 
      <component :is="currentView" id="cp"></component>
    </div>
</template>
<script>
export default {
  name: 'mytab',
  props: ['child1', 'child2', 'child3'],
  data() {
    return {
      active: 0,
      currentView: this.child1,
      tabs: [
        {
          type: '产品介绍',
          view: this.child1
        },
        {
          type: '保险案例',
          view: this.child2
        },
        {
          type: '理赔流程',
          view: this.child3
        }
      ]
    }
  },
  methods: {
    toggle(index, v) {
      this.currentView = v
      this.active = index
      this.scrollFuc()
    },
    scrollFuc() {
      var scolltop = document.body.scrollTop
      var tabid = document.getElementById('tab')
      var tabtop = tabid.offsetTop
      var top = scolltop - tabtop
      var head = document.getElementById('fix-header')
      if (top >= 0) {
        head.style.display = 'block'
      } else {
        head.style.display = 'none'
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollFuc)
  }
}
</script>
<style scoped>
.clear{
  *zoom: 1;
}
.clear::after{
  content: '\200B';
  clear: both;
  height: 0;
  display: block;
}
.fix{
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  background: #FFFFFF;
  z-index: 999;
  width: 375px;
  list-style-type: none;
  border-bottom: 0.026667rem solid #DDDDDD;
}
.tab{
  width:375px;
  background: #FFFFFF;
  margin-bottom: 60px;
}
.cur{
  position: fixed;
  top:0;
  z-index:10;
  background: #FFFFFF;
}
#app1{
  width:100%;
  height:50px;
  border-bottom: 1px solid #DDDDDD/*no*/;
  list-style-type:none;
}
li{
  float:left;
  width:22%;
  font-size: 14px;
  color: #616161;
  letter-spacing: 0.14px;
  line-height: 49px;
  text-align:center;
  margin: 0 20px;
}
.active{
  color: #F05A23;
  border-bottom: 2px solid #F05A23/*no*/;
}
.loan-application{
  position: fixed;
  bottom:0;
  width:100%;
  height:70px;
  background: #FFFFFF;
  border-top: 1px solid #CCCCCC/*no*/;
  height:50px;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0.14px;
  line-height: 50px;
  background: #FF8028;
  border:1px solid #FF8028;
  text-align: center;
}
.loan-application:active{
  background: #EA5D03;
}
</style>
