

import { api_查询制作员列表 } from "@/api/点单接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";
export default {
    namespaced: true,
    state: {
        制作员身份:"",
        制作员店铺:"",
    },
    getters: {
        制作员身份(state){
            return state.制作员身份
        },
        制作员店铺(state){
            return state.制作员店铺
        }
    },
    mutations: {},
    actions: {
        查询制作员身份({state}){
            return new Promise((resolve, reject) => {
                var userInfo=""
                try {
                    userInfo=JSON.parse(localStorage.userInfo);
                } catch (error) {
                    reject();
                    return
                }
                var query={
                        producerid:userInfo.username,
                        start:0,
                        length:10
                    }
                api_查询制作员列表(query).then((x) => {
                    if(x.data.code==200){
                        state.制作员身份=x.data.data.data.length>0 ? x.data.data.data[0] : ''
                    }else{
                        state.制作员身份=""
                    }
                    resolve();
                }).catch((err) => {
                    state.制作员身份=""
                    reject()
                });
            });
        },
        查询制作员店铺({state}){
            return new Promise((resolve, reject) => {
                if(!state.制作员身份){
                    resolve()
                    return
                }
                api_根据shopid查询店铺(state.制作员身份.shopid).then(x=>{
                    state.制作员店铺=x.data.code==200 ? x.data.data : '';
                    resolve()
                }).catch(err=>{
                    state.制作员店铺="";
                    reject();
                })
            });
        }
    },
    modules: {}
};
