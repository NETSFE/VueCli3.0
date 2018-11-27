import Vue from 'vue'
import App from './App'
import 'lib-flexible'
import '@common/style/reset.less' /* img去除content */
/* eslint-disable-next-line */
import '@utils/viewportHack.exec.js'
// import '@utils/registerServiceWorker' /* pwa */
Vue.config.performance = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
