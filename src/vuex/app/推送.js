import { api_绑定推送 , api_退出推送 } from "@/api/绑定推送接口.js";

export default {
    namespaced: true,
    state: {
    },
    getters: {

    },
    mutations: {},
    actions: {
        ios获取推送标识信息(){
            // getGetuiClientId 和 百度地图一样
            function setupWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) { 
                    return callback(WebViewJavascriptBridge); 
                }
                if (window.WVJBCallbacks) { 
                    return window.WVJBCallbacks.push(callback); 
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'https://__bridge_loaded__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
            }
            return new Promise((resolve, reject) => {
                setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('getGetuiClientId', { 'foo': 'bar' }, function (response) {
                        // alert(JSON.stringify(response));
                        console.log(JSON.stringify(response))
                        resolve(response.clientId)
                    })
                })
            });
        },
        登录推送({dispatch},userid){
            if(ApplicationType=='app'){
                if(AppType=='ios'){
                   dispatch('ios获取推送标识信息').then(x=>{
                       console.log(x);
                    var obj={
                            userid:userid,
                            usercid:x
                        }
                        console.log('开始调用接口：'+JSON.stringify(obj));
                        api_绑定推送(obj)
                   })
                }else{
                    var info = plus.push.getClientInfo();
                    var obj={
                        userid:userid,
                        usercid:info.clientid
                        // usercid:"e410b3f317a58d3dc65500f1227f78df"
                    }
                    api_绑定推送(obj)
                }
            }
        },
        退出推送({},userid){
            return api_退出推送(userid)
        }
    },
    modules: {
    }
};

// store.commit( 'hongbao/...');
