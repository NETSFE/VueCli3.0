<template>
  <div class="tab">
    <ul class="type-list"> 
      <li :class="{curr:key==nowIndex}" v-for="(item, key) in content" @click="toggleIndex(key)">{{ item.Itemtype }}</li>
    </ul>
    <ul> 
      <li v-for="(item, key) in content" v-show="nowIndex==key" v-html="item.Itemcontent"></li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nowIndex: 0
    }
  },
  props: ['content'],
  methods: {
    toggleIndex: function(index) {
      this.nowIndex = index
    }
  }
}
</script>
<style>
.tab {
  margin-top: 7px;
  background: #fff;
}
.type-list {
  height: 47px;
  border-bottom: 1px solid #ddd;
  padding: 0 10px;
}
.type-list li {
  float: left;
  line-height: 47px;
  width: 80px;
  font-size: 14px;
  color: #616161;
  letter-spacing: 0.14px;
  margin: 0 18px;
  text-align: center;
}
.type-list li.curr {
  font-size: 14px;
  color: #F05A23;
  border-bottom: 2px solid #F05A23;
}
</style>
