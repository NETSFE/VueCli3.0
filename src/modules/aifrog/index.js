import Vue from 'vue'
import App from './App.vue'
import '@common/style/reset.less'
import 'lib-flexible'

new Vue({
  template: '<App/>',
  components: {App}
}).$mount('#app')
