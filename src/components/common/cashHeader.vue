<template>
  <div id="header">
      <div class="loan-title">
          <div class="h-name">{{seller.h_name}}</div>
          <div class="h-text">{{seller.h_text}}</div>
      </div>
      <div class="loan-title2">
          <div class="loan-left">
            <p>{{seller.loan_left}} </p>
            <span>{{seller.loan_left_num}}</span>
          </div>
          <div class="loan-right">
              <p>{{seller.loan_right}}</p>
              <span>{{seller.loan_right_num}}</span>
          </div>
      </div>
  </div>
</template>

<script>
  export default {
    props: [
      'seller'
    ]
  }
</script>

<style scoped>
  #header{
    width: 375px;
    position: relative;
    font-family: 'Microsoft Yahei';
  }
  .loan-title{
    height: 58px;
    padding-left: 20px;
    background: #F05A23;
  }
  .h-name{
    padding-top:10px;
    font-size: 14px;
    color: #fff;
  }
  .h-text{
    font-size:12px;
    color: #FFFFFF;
  }
  .loan-title2{
    height: 86px;
    background: #fff;
  }
  .loan-right,.loan-left{
    width:185px;
    height: 52px;
    float:left;
    text-align: center;
    margin-top: 20px;
    padding-bottom: 5px;
  }
  .loan-left p,.loan-right p{
    color: #616161;
  }
  .loan-left span,.loan-right span{
    color: #F05A23 ;
    font-size: 26px;
    letter-spacing: 0.006933rem;
    font-weight: normal;
  }
  .loan-left sub{
      color: #F05A23 ;
    vertical-align: top;
      font-size: 26px;
  }
  .loan-right{
    border-left:1px solid #ddd;
  }
</style>
