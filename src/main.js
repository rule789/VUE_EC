// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 習慣把第三方的套件網上放
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';

// 讓瀏覽器的全域環境可以使用到 $
import jQuery from 'jquery'
window.$ = window.jQuery = jQuery

// VeeValidate 3.0 使用方法＆導入中文語系
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import tw from "vee-validate/dist/locale/zh_TW.json";

// 安裝所有 VeeValidate 規則
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("zh_TW", tw);

// 註冊全域元件
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);



// 自己寫的往下放
import App from './App';
import router from './router'
import './bus'
import currencyFilter from './filters/currency'

Vue.config.productionTip = false

// 讓 cookies 可以在存在後端伺服器裡
axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios)

Vue.component('Loading', Loading);
Vue.component('ValidationProvider', ValidationProvider);
Vue.filter('currencyDollar', currencyFilter);

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
    axios.post(api).then((response) => {
      console.log('check', response.data)
      if(response.data.success){
        next();
      } else {
        next({ path: '/login' })
      }
    })
  } else {
    next();
  }
})