// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 習慣把第三方的套件網上放
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 自己寫的往下放
import App from './App';
import router from './router'

Vue.config.productionTip = false

// 讓 cookies 可以在存在後端伺服器裡
axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    const api = `${process.env.API_HOST}/api/user/check`;
    axios.get(api).then((response) => {
      console.log(response.data)
      if(response.data.success){
        next();
      } else {
        next({ path: '/login' })
      }
    })
  }
})