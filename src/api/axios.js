
import router from "@/router";
import axios from "axios";

axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 60000;

//拦截器
axios.interceptors.response.use(
    response=> {
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
                mui.alert('服务器已经关闭，稍后再试！', "提示", "我知道了", function () { }, "div");
            }
        } else{
            return response;
        }
    },
    error => {
        if (error && error.response) {
            return error.response;
        }
        return Promise.reject(error); // 返回接口返回的错误信息
    }
);

// 输出方法
export default axios;
