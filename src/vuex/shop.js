
import { api_根据shopid查询店铺, api_店铺添加人气 } from "@/api/店铺接口.js";
export default {
    namespaced: true,
    state: {
        shop: {}, //店铺
        isfenxiang: true
    },
    getters: {
        shop(state) {
            return state.shop;
        },
        isfenxiang(state) {
            return state.isfenxiang;
        }
    },
    mutations: {
        set_shop(state, obj) {
            state.shop = obj;
        }
    },
    actions: {
        //设置分享
        async set_isfenxiang({ state }, type) {
            return new Promise((resolve, reject) => {
                state.isfenxiang = type ? true : false;
            });
        },
        //根据店铺Id查询店铺
        async get_shop({ commit }, shopid) {
            commit("set_shop", {});
            return new Promise((resolve, reject) => {
                api_根据shopid查询店铺(shopid).then(x=>{
                    if (x.data.code == 200) {
                        commit("set_shop", x.data.data);
                    } else {
                        reject(x);
                    }
                    resolve();
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        添加店铺人气({ }, shopid) {
            try {
                var userInfo = JSON.parse(localStorage.userInfo);
            } catch (error) {
                return;
            }
            var obj = {
                shopid: shopid,
                userid: userInfo.username
            };
            api_店铺添加人气(obj).then(x=>{
                console.log("添加店铺人气", x);
            }).catch(err=>{})
        }
    },
    modules: {}
};
