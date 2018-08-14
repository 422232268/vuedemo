// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.axios = axios

// 给axios配置拦截器
// 添加请求拦截器
// 拦截器的作用:
// 在拦截器中可以获取到axios的配置,在config中修改东西
// axios.interceptors.request.use(function (config) {
// 发送请求之前都做什么
// console.log('我拦截了axios的请求', config)
// 只需要给config配置baseURl以及headers
// config.baseRUL='http://locahost:8888/api/private/v1/'
// config.headers.Authorization=localstrage.getItem('myToken')
// return config
// },function(error){
// 对请求错误做了些什么?
// retrun Promise.reject(error)
// }
// })
// 配置axios的通过配置
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
