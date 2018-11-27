/**
 * loading 组件 简称菊花
 * 注意事项: z-index为9999
 */

<template>
  <div class="loading">
  </div>
</template>

<style>
  .loading{
    z-index: 9999;
    position: absolute;
    width: 32px;
    height: 32px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: url('../../assets/loading.png');
    background-size: 100% 100%;
    animation: rotate 1.5s linear infinite;
  }
  
 @keyframes rotate {
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
 }
</style>
