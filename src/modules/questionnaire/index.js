import Vue from 'vue'
import App from './App'
// import 'lib-flexible'
import '@common/style/reset.less' /* img去除content */
// import '@components/global.js'
/* eslint-disable-next-line */
import '@utils/viewportHack.exec.js'
import '@utils/registerServiceWorker'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
