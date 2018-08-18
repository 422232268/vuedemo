import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Categories from '@/components/product/Categories'
import Goods from '@/components/product/Goods'
import GoodsAdd from '@/components/product/Add'
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
      path: '/categories',
      name: 'categories',
      component: Categories
    }, {
      path: '/demo',
      name: 'demo',
      component: demo
    }, {
      path: '/goods',
      name: 'goods',
      component: Goods
    }, {
      path: '/good-add',
      name: 'goodAdd',
      component: GoodsAdd
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
