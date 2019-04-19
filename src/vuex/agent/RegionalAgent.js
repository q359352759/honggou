import axios from "@/api/axios.js";

import { api_获取代理商信息 } from "@/api/代理商接口.js";
//代理商
import ShopBonus from "@/vuex/agent/RegionalAgent/ShopBonus.js";

export default {
    namespaced: true,
    state: {
        代理商信息:{
            获取成功:false,
            详情:""
        }
    },
    getters: {
        代理商信息(state){
            return state.代理商信息
        }
    },
    mutations: {},
    actions: {
        获取代理商信息({state}){
            return new Promise((resolve, reject) => {
                try {
                    var userInfo = JSON.parse(localStorage.userInfo)
                } catch (error) {
                    var userInfo={};
                }
                api_获取代理商信息(userInfo.username).then(x=>{
                    if(x.data.code==200){                    
                        state.代理商信息.获取成功=true
                        state.代理商信息.详情=(x.data.data && x.data.data!=null ) ? x.data.data : ""; 
                    }else{
                        state.代理商信息.获取成功=false
                    }
                    resolve()
                }).catch(err=>{
                    state.代理商信息.获取成功=false
                    reject()
                })
            });
        }
    },
    modules: {
        ShopBonus: ShopBonus
    }
};
