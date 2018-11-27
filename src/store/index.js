import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import order from './modules/order'
import myorder from './modules/myorder'
import premiumMeasure from './modules/premium-measure'
import userinfo from './modules/userinfo'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  modules: {
    order: order,
    myorder: myorder,
    premiumMeasure: premiumMeasure,
    userinfo: userinfo
  },
  strict: debug
})
