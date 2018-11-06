// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api'
import ElementUI from 'element-ui'
import './assets/css/ele.scss'
import './assets/css/iconfont.css'

import { getStore, setStore, removeStore, formatTime } from './assets/js/utils'
import dicTypeCode from './assets/js/typeConfigure'
Vue.prototype.$getStore = getStore
Vue.prototype.$setStore = setStore
Vue.prototype.$removeStore = removeStore
Vue.prototype.$formatTime = formatTime
Vue.prototype.$api = api
Vue.prototype.$dicTypeCode = dicTypeCode

Vue.prototype.$qiniu = 'http://qntest.lanshiyihui.com/'

Vue.use(ElementUI)

let userToken = getStore('userToken')
if (userToken && userToken.token) {
  store.state.userToken = userToken.token
  store.state.userStatus = userToken.status
  store.commit('getUserInfo')
}

if (/(iP(hone|od|ad))|Android/g.test(navigator.userAgent)) {
  store.state.userAgent = 1
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
