<template>
  <div class="question" id="ques">
      <div class="question-title"><i class="circle"></i>常见问题</div>
      <ul class="question-list">
          <li class="question-item" :key="item.title" v-for="(item, index) in data" >
            <div class="question-item-firstline" @click="itemClick(index)" >
              <span class="que">Q{{index+1}}</span><span class="question-item-name"><p class="quetit">{{ item.title }}</p><i v-show="item.canExtend" :class="(show == index)?'up':'down'"></i></span>
            </div>
            <div v-show="show == index" class="question-item-summary" v-html="item.summary"></div>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'question',
  props: [
    'data'
  ],
  data() {
    return {
      show1: [],
      show: null
    }
  },
  methods: {
    itemClick(index) {
      if (this.show === index) {
        this.show = null
      } else {
        this.show = index
      }
    }
  }
}
</script>
<style scoped>
#ques{
	max-height:3000px;
}
.question{
    width: 375px;
    background: #FFFFFF;
		margin-bottom: 60px;
}
.circle {
  display: inline-block;
  width: 0;
  height: 0;
  padding: 3px;
  border: 2px solid #fe9041/*no*/;
  border-radius: 50%;
  margin-right: 2px;
}
.question {
  background-color: #fff;
}
.question-title {
  height: 13px;
  font-size: 14px;
  color: #171717;
  line-height: 13px;
  padding: 12px;
}
.question-title a{
	text-decoration: none;
}
.question-list {
  border-top: 1px solid #DDDDDD/*no*/;
}
.que{
	width: 28px;
	height: 20px;
	line-height: 20px;
	margin-right: 5px;
	margin-top: 2px;
	color: #FFFFFF;
	background: url(../../assets/eshengbao/wenti.png) no-repeat 0 0;
	background-size: 100% 100%; 
	text-align: center;
}
.question-item {
  padding: 6px;
  list-style: none;
}
.question-item:last-child {
  padding-bottom: 15px;
}
.question-item-firstline {
  padding: 0 12px 0 25px;
  display: flex;
  justify-content: space-between;
}
.question-item-name {
  font-size: 14px;
  color: #616161;
  width: 350px;
}
.question-item-name i{
    position: relative;
    float: right;
    right: 10px;
		display: block;
		top:4px;
}
.question-item-summary {
  padding: 0 30px 0 50px;
  color: #a9a9a9;
  margin-top: 10px;
	font-size: 14px;
}
.up{
	width: 12px;
	height: 12px;
	background: url(../../assets/eshengbao/shouqi.png) no-repeat 0 0;
	background-size: 100% auto;
}
.down{
	width: 12px;
	height: 12px;
	background: url(../../assets/eshengbao/zhankai.png) no-repeat 0 0;
	background-size: 100% auto;
}
.quetit{
	float: left;
	width: 275px;
}
</style>
