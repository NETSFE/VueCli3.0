import Vue from 'vue'
import App from './App'
import 'lib-flexible'

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
// render: h => h(App),
})
