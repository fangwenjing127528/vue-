import Vue from 'vue'
import VueRouter from 'vue-router'
// 单独引入组件
import {
    Message
} from 'element-ui';


// import Login from '../components/login.vue'
// @符号->  src
// 路由的懒加载----》解决首屏加载慢--按需加载
const Login =()=>import('@/components/login.vue')
const Home =()=>import('@/components/home.vue')
const Users =()=>import('@/components/users.vue')
const Rights =()=>import('@/components/right.vue')
const Roles =()=>import('@/components/roles.vue')
// const MyBread =()=>import('@/components/cusBread.vue')
const GoodsList =()=>import('@/components/goodslist.vue')
const goodsAdd =()=>import('@/components/goodsadd.vue')
const cateParams =()=>import('@/components/cateparams.vue')
const goodsCate =()=>import('@/components/goodscate.vue')
const Order =()=>import('@/components/order.vue')
const Reports =()=>import('@/components/reports.vue')

Vue.use(VueRouter)

 const router = new VueRouter({
    routes: [{
            name: 'home',
            path: '/',
            component: Home,
            children:[{
                name:'users',
                path:'/users',
                component:Users
            },{
                name:'rights',
                path:'/rights',
                component:Rights
            },{
                name:'roles',
                path:'/roles',
                component:Roles
            },{
                name:'goods',
                path:'/goods',
                component:GoodsList
            },{
                name:'goodsadd',
                path:'/goodsadd',
                component:goodsAdd
            },{
                name:'params',
                path:'params',
                component:cateParams
            },{
                name:'categories',
                path:'/categories',
                component:goodsCate
            },{
                name:'orders',
                path:'/orders',
                component:Order
            },{
                name:'reports',
                path:'/reports',
                component:Reports
            }
        ]
          
        },
        {
            name: 'login',
            path: '/login',
            component: Login
        },
    ]
})
// 拦截路由配置
router.beforeEach((to, from, next) => {
    // ...
    // 如果要去的是登录 -> 继续执行路由配置 next()
    if (to.name === 'login') {
        next();
    } else {

        // 如果要去的是home -> 判断token -> 如果有token -> next() -> 如果没有token->回到login登录
        const token = localStorage.getItem('token');
        if (!token) {
            // js代码编程式导航->去login组件
            // this.$router->vm.路由对象 -> 路由对象.push
            // this.$message.warning("请先登录");
            Message.warning("请先登录");

            router.push({
                name: 'login'
            });
        } else {
            next();
        }
    }



})
export default router