// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import Http from './plugins/http'
// console.log(Http);
//格式化时间
import moment from 'moment'
import App from './App'
import router from './router'

import MyBread from '@/components/cusBread.vue'

Vue.use(Http)
    // Vue.use(VueRouter)
Vue.use(ELEMENT)
Vue.component(MyBread.name,MyBread)
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.filter('fmtDate',(v)=>{
    return moment(v).format('YYYY-MM-DD');
})
new Vue({
    el: '#app',
    router,
    // 下面这两行和之前的render作用是一样的
    components: {
        App
    },
    template: '<App/>'
})