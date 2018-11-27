<template>
  <div class="header">
    <p><i></i>保障范围</p>
    <div>
      <ul>
        <li v-for="(item, key) in rangeList" :class="{norbor:key==rangeList.length-1}">{{ item.title }}<span>{{ item.content }}</span></li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['rangeList']
  }
</script>
<style>
ul,li {
  list-style: none;
}
.header {
  background: #Fff;
  margin: 7px 0;
  border: 1px solid #EFEFF4;
}
.header p {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  color: #171717;
  letter-spacing: 0.14px;
  border-bottom: 1px solid #EFEFF4;
  padding-left: 17px;
}
.header p i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 2px solid #FF8028;
  display: inline-block;
  margin-right: 8px;
}
.header>div>ul {
  padding: 0 17px;
}
.header li {
  padding: 10px 0;
  font-size: 13px;
  color: #616161;
  letter-spacing: 0.19px;
  border-bottom: 1px solid #EFEFF4;
}
.header li.norbor {
  border-bottom: 0;
}
.header li:after {
  content: '';
  display: block;
  clear: both;
}
.header li span {
  float: right;
  text-align: right;
  max-width: 200px;
}
</style>
