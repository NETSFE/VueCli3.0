<template>
  <div class="header-bg">
    <div class="header-pic">
      <img :src="items.url" alt="">
    </div>
    <div class="header-desc">
      <h2>{{ items.name }}<span>{{ items.count}}人投保</span></h2>
      <p>{{ items.desc }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['items']
}
</script>
<style>
.header-pic {
  width: 100%;
  height: 162px;
}
.header-pic img {
  width: 100%;
}
.header-desc {
  height: 56px;
  box-sizing: border-box;
  padding: 10px 17px;
  background: #fff;
}
.header-desc h2 {
  font-size: 14px;
  color: #F05A23;
  letter-spacing: 0.14px;
  font-weight: normal;
  margin-bottom: 2px;
  line-height: 1.6;
}
.header-desc h2 span {
  display: inline-block;
  float: right;
  font-size: 12px;
  color: #808080;
  letter-spacing: 0.21px;
}
.header-desc p {
  font-size: 12px;
  color: #616161;
  letter-spacing: 0.21px;
  line-height: 1.6;
}
</style>
