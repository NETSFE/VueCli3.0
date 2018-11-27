<template>
  <div class="guarantee">
      <div class="guarantee-title"><i class="circle"></i>保障范围</div>
      <ul class="guarantee-list">
          <li class="guarantee-item" :key="item.title" v-for="item in data">
            <div class="guarantee-item-firstline">
              <span class="guarantee-item-name">
                {{ item.title }}
                <i v-show="item.canExtend" @click="toggle(item.no)" class="guarantee-question">?</i>
              </span>
              <span class="guarantee-item-insure">{{ item.insuredAmount }}</span>
            </div>
            <div v-show="item.isShow" :class="`q${item.no}`" v-html="item.summary" class="guarantee-item-summary"></div>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
  props: [
    'data'
  ],
  methods: {
    // 计算属性传进来后，问号无法切换，出此下策
    toggle(no) {
      const styles = document.querySelector(`.q${no}`).style
      if (styles.display === 'none') {
        styles.display = 'block'
      } else {
        styles.display = 'none'
      }
    }
  }
}
</script>

<style scoped>
ul, li {
  list-style: none;
}
.circle {
  display: inline-block;
  width: 0;
  height: 0;
  padding: 3px;
  border: 2px solid #fe9041/*no*/;
  border-radius: 50%;
  margin-right: 8px;
}
.guarantee {
  background-color: #fff;
  max-height: 3000px;
}
.guarantee-title {
  height: 13px;
  font-size: 14px;
  color: #171717;
  line-height: 13px;
  padding: 12px;
}
.guarantee-list {
  border-top: 1px solid #ddd/*no*/;
}
.guarantee-item {
  list-style: none;
  margin: 15px 0;
  font-size: 12px;
}
.guarantee-item:last-child {
  padding-bottom: 15px;
}
.guarantee-item-firstline {
  padding: 0 12px 0 25px;
  display: flex;
  justify-content: space-between;
}
.guarantee-item-name {
  font-size: 13px;
  color: #616161;

}
.guarantee-item-summary {
  padding: 0 25px;
  color: #a9a9a9;
  margin-top: 10px;
  height: 100%;
}
.guarantee-question {
  display: inline-block; 
  width: 13px;
  height: 13px;
  line-height: 13px;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-family: 'Helvetica','SanFrancisco','Microsoft Yahei';
  border-radius: 50%;
  border: 2px solid #a9a9a9/*no*/;
  color: #fff;
  background-color: #a9a9a9;
  margin-left: 5px;
}
</style>
