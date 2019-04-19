
import { api_登录 , 根据access_token获取用户信息 } from "@/api/登录.js";
import { openloading } from "@/assets/js/currency.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
export default {
    namespaced: true,
    state: {
    },
    getters: {
        
    },
    mutations: {
        
    },
    actions: {
        登录({dispatch},obj){
            return new Promise((resolve, reject) => {
                window.scroll(0, 0);
                openloading(true);
                api_登录(obj).then(x=>{
                    if (x.data.code && x.data.code != 200) {
                        openloading(false);
                        if (x.data.error_description == "Bad credentials") {
                            mui.toast("密码错误", { duration: "long", type: "div" });
                        } else {
                            mui.alert(x.data.error_description ? x.data.error_description : x.data.message, "提示", "我知道了", function () { }, "div");
                        }
                        reject();
                    } else if (x.data.error) {
                        openloading(false)
                        mui.alert(x.data.error_description ? x.data.error_description : x.data.message, "提示", "我知道了", function () { }, "div");
                        reject();
                    } else {
                        console.log('登录成功')
                        localStorage.loginDate=JSON.stringify(x.data);
                        根据access_token获取用户信息(x.data.access_token).then(r1=>{
                            openloading(false);
                            localStorage.id = r1.data.id;
                            let userInfo = r1.data;
                            try {
                                userInfo.nickname = b64DecodeUnicode(userInfo.nickname);
                            } catch (error) { }
                            localStorage.userInfo = JSON.stringify(userInfo);
                            
                            dispatch('app/推送/登录推送', userInfo.username, {root: true})
                            dispatch('user/设置openid','',{root:true});
                            dispatch('用户点单排号/排号初始化',"",{root:true});
                            dispatch('查询专员信息',"",{root:true});
                            
                            
                            resolve()
                        }).catch(err1=>{
                            mui.toast("系统错误稍后再试", { duration: "long", type: "div" });                
                            openloading(false)
                            reject();
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                    mui.toast("系统错误稍后再试", { duration: "long", type: "div" });
                    openloading(false)
                    reject();
                })
            });
            
        }
    },
    modules: {}
};
