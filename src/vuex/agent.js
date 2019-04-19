
import { api_根据userid查询代理人信息 , api_通过电话获取代理人 } from "@/api/代理人接口.js";

import ShopBonus from "@/vuex/agent/ShopBonus.js";
//代理商
import RegionalAgent from "@/vuex/agent/RegionalAgent.js";
import 分润 from "@/vuex/agent/分润.js";
import 提现 from "@/vuex/agent/提现.js";
import 奖赏 from "@/vuex/agent/奖赏.js";
export default {
    namespaced: true,
    state: {
        代理人信息: "",
        提现中: false,
        显示提现框: false,
        查看类型:1,
    },
    getters: {
        代理人信息(state) {
            return state.代理人信息;
        },
        提现中(state) {
            return state.提现中;
        },
        显示提现框(state) {
            return state.显示提现框;
        },
        查看类型(state){
            return state.查看类型
        }
    },
    mutations: {},
    actions: {
        设置查看类型({state},type){
            state.查看类型=type;
        },
        设置提现状态({ state }, type) {
            state.提现中 = type;
        },
        设置显示提现框({ state }, type) {
            state.显示提现框 = type;
        },
        //通过电话号码获取代理人信息
        get_agentUser_phone({ state }, phone) {
            return new Promise((resolve, reject) => {
                api_通过电话获取代理人(phone).then(x => {
                    state.代理人信息 = x;
                    resolve(x);
                }).catch(err => {
                    reject(err);
                });
            });
        },
        获取代人信息({ state }) {
            return new Promise((resolve, reject) => {
                var userInfo = JSON.parse(localStorage.userInfo);
                api_根据userid查询代理人信息(userInfo.username).then(x => {
                    if (x.data.code == 200) {
                        state.代理人信息 = x.data.data;
                    }
                    resolve(x);
                }).catch(err => {
                    reject(err);
                })
            });
        },
    },
    modules: {
        ShopBonus: ShopBonus,
        RegionalAgent: RegionalAgent,
        分润: 分润,
        提现: 提现,
        奖赏: 奖赏
    }
};
