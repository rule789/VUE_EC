import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/dashboard'
import Login from '@/components/pages/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    // {
    //   path: '/admin',
    //   name: 'HelloWorld',
    //   component: Dashboard,
    //   meta: { requiresAuth: true }
    // },
  ]
})
