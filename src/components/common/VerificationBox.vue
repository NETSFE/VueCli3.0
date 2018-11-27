<template>
  <div class="verification-box">
    <div class="content">
      <div class="title">为了您的账号安全，请进行身份验证！</div>
      <div class="code-box">
        <input class="code" type="number" maxlength="6" placeholder="请注意区分大小写">
        <span class="get-code">
          <div class="pic-code">
            <!-- <img width="100%" height="100%" :src="imgSrc" />  -->
          </div>
        </span>
      </div>
      <div class="tip">点击更换验证码</div>
      <a href="" class="confirm">确认</a>
    </div>
    <div class="mask"></div>
  </div>
</template>

<style scoped>
.content {
  width: 330px;
  height: 195px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #FFFFFF;
  border-radius: 2px;
  z-index: 2;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  margin-top: 142px;
}
.title {
  font-size: 15px;
  color: #171717;
  margin-top: 26px;
}
.mask {
  position: absolute;
  width: 375px;
  height: 667px;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.code-box {
  width: 305px;
  border-radius: 2px;
  /* background: #F7F7F7; */
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.code-box {
  margin-top: 26px;
}
.code {
  width: 192px;
}
input {
  box-sizing: border-box;
  outline: none;
  height: 30px;
  line-height: 30px;
  /* background: #F7F7F7; */
  border: none;
  padding-left: 14px;
  border-bottom: 1px solid #DDDDDD;
  font-size: 14px;
  color: #171717;
}
::-webkit-input-placeholder {
  color: #9A9A9A;
}
.pic-code {
  width: 85px;
  height: 30px;
  background: #F7F7F7;
}
.tip {
  width: 280px;
  text-align: right;
  font-size: 12px;
  color: #616161;
}
.get-code {
  font-size: 16px;
  color: #383C44;
  line-height: 16px;
}
.confirm {
  width: 305px;
  height: 44px;
  line-height: 44px;
  margin-top: 20px;
  text-align: center;
  background: #D72121;
  border-radius: 100px;
  font-size: 17px;
  color: #FFFFFF;
  letter-spacing: 0;
}
</style>
