// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import moment from 'moment'

Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.prototype.axios = axios
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(format)
})

// 给axios配置拦截器
// 添加请求拦截器
// 拦截器的作用:
// 在拦截器中可以获取到axios的配置,在config中修改东西
axios.interceptors.request.use(function (config) {
  // 发送请求之前都做什么
  // console.log('我拦截了axios的请求', config)
  // 只需要给config配置baseURl以及headers
  config.baseURL = 'http://localhost:8888/api/private/v1/'
  config.headers.Authorization = localStorage.getItem('myToken')
  return config
}, function (error) {
  // 对请求错误做了些什么?
  return Promise.reject(error)
})
// 在发送请求之前做些什么
// console.log('哈哈，我拦截到了请求', config)
// 只需要给config配置baseURL 以及 headers
// 配置axios的通过配置
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('myToken')

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
