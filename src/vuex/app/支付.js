import axios from "@/api/axios.js";
import qs from "qs";

export default {
    namespaced: true,
    state: {
        支付通道:{}
        // {"alipay":{"id":"alipay","description":"支付宝","serviceReady":true},"wxpay":{"id":"wxpay","description":"微信","serviceReady":true}}
    },
    getters: {

    },
    mutations: {},
    actions: {
        获取支付通道({state}){
            if(window.plus){
                plusReady()
            }else{
                document.addEventListener('plusready', plusReady, false);
            }
			function plusReady(){
				plus.payment.getChannels(function(channels){
					for(var i in channels){
						var channel=channels[i];
						if(channel.id=='qhpay'||channel.id=='qihoo'){	// 过滤掉不支持的支付通道：暂不支持360相关支付
							continue;
						}
						state.支付通道[channel.id]=channel;
					}
				},function(e){
				});
			}
        },
        调用支付宝支付({state},str){
            return new Promise((resolve, reject) => {
                console.log(str);
                if(!state.支付通道.alipay || !state.支付通道.alipay.serviceReady){
                    reject(false)
                }
                plus.payment.request(state.支付通道.alipay,str,function(result){
                    resolve(result)
				},function(e){
                    reject(e)
                });
                
            }); 
        }
    },
    modules: {
    }
};

// store.commit( 'hongbao/...');
