import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'
import Rights from '@/components/Rights'
import Roles from '@/components/Roles'
import demo from '@/components/demo'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    children: [{
      path: '/users',
      name: 'users',
      component: Users
    }, {
      path: '/rights',
      name: 'rights',
      component: Rights
    }, {
      path: '/Roles',
      name: 'Roles',
      component: Roles
    }, {
      path: '/demo',
      name: 'demo',
      component: demo
    }]
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }]
})
// 给router配置导航首位
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('myToken')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
