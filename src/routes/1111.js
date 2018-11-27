import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@components/1111/index'))
        }, 'index')
      },
      meta: {
        title: '平安理财,平安贷款感恩社会'
      }
    }, {
      path: '/gp',
      name: 'grouppurchase',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@components/1111/Grouppurchase'))
        }, 'grouppurchase')
      },
      meta: {
        title: '保险产品'
      }
    }, {
      path: '/gps',
      name: 'grouppurchasestatus',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@components/1111/Gpstatus'))
        }, 'gpstatus')
      },
      meta: {
        title: '团购详情'
      }
    }, {
      path: '/licai',
      name: 'licai',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@components/1111/licai'))
        }, 'licai')
      },
      meta: {
        title: '理财产品'
      }
    }, {
      path: '/daikuan',
      name: 'daikuan',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('@components/1111/daikuan'))
        }, 'daikuan')
      },
      meta: {
        title: '贷款产品'
      }
    }
  ]
})
