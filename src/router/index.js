import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/hello'
import Login from '@/components/login'
import Main from '@/components/main'
import Monitor from '@/components/crumbs/monitor'
import Tablelist from '@/components/crumbs/tablelist1'
import Tablefoldlist from '@/components/crumbs/tablefoldlist1'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/monitor',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/',
          name: 'monitor',
          component: Monitor,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/tablelist',
          name: 'tablelist',
          component: Tablelist,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/tablefoldlist',
          name: 'tablefoldlist',
          component: Tablefoldlist,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: "*",
      redirect:"/"
    }
  ],
  linkActiveClass: 'active',
})


router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    var token = localStorage.getItem('token')
    if (token) {
      next();
    }
    else {
      alert('请重新登录！')
      next({
        path: '/login'
        // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})


export default router
