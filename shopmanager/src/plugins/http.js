// 发送请求

import axios from "axios"
import {
  Message
} from 'element-ui';


const Http = {}
Http.install = function(Vue) {

    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

    // 添加一个请求拦截器
    axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    //除非登录请求外的请求设置请求头
    if(config.url!=='login'){
         const AUTH_TOKEN=localStorage.getItem('token');
        // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        config.headers.Authorization=AUTH_TOKEN
    }
   
      return config;
    }, function (error) {
    // Do something with request error
      return Promise.reject(error);
    });


        // 响应拦截器
        axios.interceptors.response.use(function(response) {
          // 对响应数据做点什么
          console.log("拦截器-------");
  
          console.log(response);
          const {
              meta: {
                  msg,
                  status
              }
          } = response.data;
          // 统一处理所有非200和201的响应->提示框->之前所有请求中的else都不用写了
          if (status !== 200 && status !== 201) {
              // 提示
              Message.warning(msg);
  
          }
          return response;
      }, function(error) {
          // 对响应错误做点什么
          return Promise.reject(error);
      });
    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default Http