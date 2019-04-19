import Vue from "vue";
import App from "./App.vue";

import VCharts from "v-charts";
Vue.use(VCharts);

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo)


import router from "./router";

// import VueHtml5Editor from 'vue-html5-editor'
// Vue.use(VueHtml5Editor,{});

import axios from "axios";
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 60000;
// axios.defaults.baseURL = "http://192.168.1.11:8080";
// axios.defaults.baseURL = 'http://172.20.10.2:8080';

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN AUTH_TOKENAUTH_TOKENAUTH_TOKENAUTH_TOKENAUTH_TOKENAUTH_TOKENAUTH_TOKENAUTH_TOKENAUTH_TOKEN';
// axios.defaults.baseURL = 'http://local.register.com:8761/';

Vue.prototype.$axios = axios;
//拦截器
// axios.interceptors.request.use(
//     config => {
//         try {
//             var loginDate = JSON.parse(localStorage.loginDate);
//             config.headers.Authorization = "Bearer " + loginDate.access_token;
//         } catch (error) {}
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     }
// );
axios.interceptors.response.use(
    function (response) {
        // console.log(response);
        if (response.data.error && response.data.error == "invalid_token") {
            var path=router.history.current.path;
            var 弹框长度=document.querySelectorAll('.mui-popup').length;
            if(path!='/login' && 弹框长度==0){
                mui.confirm("此操作需要登录,你的登录已过期，是否重新登录？","提示",["取消", "是的"],value => {
                        if (value.index == 1) {
                            router.push("/login");
                        }
                    }
                );
            }
        } else if(response.data.error && response.data.status==500 && response.data.message == "GENERAL"){
            var 弹框长度=document.querySelectorAll('.mui-popup').length;
            if(弹框长度==0){
                mui.alert('服务器临时维护中，稍后再试！', "提示", "我知道了", function () { }, "div");
            }
        } else{
            return response;
        }
    },
    function (error) {
        if (error && error.response) {
            return error.response;
        }
        return Promise.reject(error); // 返回接口返回的错误信息
    }
);
import qs from "qs";
Vue.prototype.$qs = qs;

import store from "./store";
Vue.config.productionTip = false;

//封装后的请求接口
import request from "@/api/request.js";
Vue.prototype.$request = request;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");


// router.beforeResolve((to, from, next)=>{
//     console.log('全局解析守卫');
//     next();
// })

router.beforeEach((to, from, next) => {
    console.log('全局前置守卫',to)
    document.getElementById("loading2").style.opacity = "1";
    document.getElementById("loading2").style.display = "block";
    var meta=to.meta;
        if(to.query.pid){
            localStorage.backUrl=to.fullPath
        }
        if(meta.无需登录){
            // console.log('跳转需要登录页面')
            next();
        }else{
            var userInfo=localStorage.userInfo;
            if(!userInfo || userInfo == null || userInfo == "null" || userInfo == undefined){
                next({ path: "/login" });
                // router.replace('/login')
                console.log('全局后置钩子')
                document.getElementById("loading2").style.opacity = "0";
                setTimeout(()=>{
                    document.getElementById("loading2").style.display = "none";
                },300)
            }else{
                next();
            }
        }
    document.getElementById("loading").style.opacity = "0";
    document.getElementById("loading").style.display = "none";
});


router.afterEach((to, from) => {
    var path=to.path;
    console.log(to)
    if(window.history.length==1){
        history.replaceState(null,null,'#/');
        window.history.pushState(null,null,'#/'+to.fullPath);
        window.history.forward();
        console.log('添加一条历史记录')
    }
    
    // history.replaceState('a',null,'#/b=1');
    // window.history.pushState('a',null,'#/b=2');
    // window.history.forward();
    
    //设置是否显示买单按钮;
        router.app.$store.dispatch('商家点单/设置显示买单按钮',path!='/sjdd/qrzf')
        router.app.$store.dispatch('设置下拉刷新',to.meta.可以下拉刷新==true)
    setTimeout(function () {
        console.log('全局后置钩子')
        document.getElementById("loading2").style.opacity = "0";
        setTimeout(()=>{
            document.getElementById("loading2").style.display = "none";
        },300)
    }, 500);
    // openloading(false);
})
