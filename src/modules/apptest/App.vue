<template>
  <div id="app">
    <img :data-src="item" class="imgLazyLoad" v-lazyload v-for="(item, index) in items" :key="index">
  </div>
</template>
<script>
import '@common/style/reset.less'
import img1 from '@assets/question/1.png'
import img2 from '@assets/question/2.png'
import img3 from '@assets/question/3.png'
import img4 from '@assets/question/4.png'
import img5 from '@assets/question/5.png'
import img6 from '@assets/question/6.png'
import img7 from '@assets/question/7.png'
import img8 from '@assets/question/icon.png'
import { lazyload } from '@mixins/lazyload'
export default {
  data() {
    return {
      items: [img1, img2, img3, img4, img5, img6, img7, img8]
    }
  },
  loadPart: true,
  mixins: [lazyload]
}
</script>
<style>
  body, ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  body {
    padding-top: 1rem;
  }
  a {
    text-decoration: none;
  }
  .divider{
    height: 0.5rem;
  }
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  img {
    display: block;
    margin-top: 100px;
  }
  .imgLazyLoad{
    width: 92px;
    height: 64px;
    background: url('../../assets/loading.png') no-repeat center center;
  }
</style>
