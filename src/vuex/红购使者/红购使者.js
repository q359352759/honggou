import axios from "@/api/axios.js";
import qs from "qs";
import { api_根据userid查询代理人信息, api_通过电话获取代理人, api_获取商家分润列表, api_获取会员分润列表, api_查询代理人分润 } from "@/api/代理人接口.js";
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";

import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
export default {
    namespaced: true,
    state: {
        查看类型: 0,
        显示密码输入框: false,
        密码输入焦点: false,
        显示姓名输入框: false,
        收款账号: {},
        userid: '',
        红购使者信息: "",
        商家:{
            loading: true,
            list: [],
            total: 0,
            page_index: 0,
            query: {
                start: 0,
                length: 20,
                getShareProfitUser: '',
                state: 1,
                // phone: userInfo.phone
            }
        },
        会员:{
            loading: true,
            list: [],
            total: 0,
            page_index: 0,
            query: {
                start: 0,
                length: 20,
                agentId: '',
                state: 1
            }
        },
        代理人分润资产:'',
        实名信息:"",
        用户信息:""
    },
    getters: {
        userid(state){
            return state.userid;
        },
        查看类型(state) {
            return state.查看类型;
        },
        显示密码输入框(state) {
            return state.显示密码输入框;
        },
        密码输入焦点(state) {
            return state.密码输入焦点;
        },
        显示姓名输入框(state) {
            return state.显示姓名输入框;
        },
        收款账号(state) {
            return state.收款账号;
        },
        红购使者信息(state) {
            return state.红购使者信息;
        },
        商家(state){
            return state.商家
        },
        会员(state){
            return state.会员
        },
        代理人分润资产(state){
            return state.代理人分润资产
        },
        实名信息(state){
            return state.实名信息
        },
        用户信息(state){
            return state.用户信息
        }
    },
    mutations: {
        设置查看类型(state, type) {
            state.查看类型 = type;
        }
    },
    actions: {
        设置查看类型({ state, commit }, type) {
            // state.查看类型=type
            commit("设置查看类型", type);
        },
        设置密码输入框({ state, dispatch }, type) {
            state.显示密码输入框 = type;
            dispatch("设置密码输入焦点", type);
        },
        设置密码输入焦点({ state }, type) {
            state.密码输入焦点 = type;
        },
        设置姓名输入框({ state, dispatch }, type) {
            state.显示姓名输入框 = type;
        },
        数据初始化({ state }, userid) {
            state.userid = userid;
            state.收款账号 = {};
            state.代理人分润资产='';
            state.实名信息="";
            state.用户信息=""
            state.商家 = {
                loading: true,
                list: [],
                total: 0,
                page_index: 0,
                query: {
                    start: 0,
                    length: 20,
                    getShareProfitUser: userid,
                    state: 1,
                    // phone: userInfo.phone
                }
            };
            state.会员 = {
                loading: true,
                list: [],
                total: 0,
                page_index: 0,
                query: {
                    start: 0,
                    length: 20,
                    agentId: userid,
                    state: 1
                }
            };
        },
        //========
        获取实名信息({state}){
            api_获取实名信息(state.userid).then(x=>{
                console.log('实名信息接口',x)
                state.实名信息=x.data.code==200 ? x.data.data : '';
            }).catch(err=>{})
        },
        获取账号({ state }) {
            axios.get("/api-u/users/findAccount?userid=" + state.userid).then(x => {
                if (x.data.code == 200) {
                    state.收款账号 = x.data.data ? x.data.data : {};
                }
            }).catch(err => { });
        },
        获取红购使者({ state }) {
            return new Promise((resolve, reject) => {
                api_根据userid查询代理人信息(state.userid).then(x => {
                    if (x.data.code == 200) {
                        state.红购使者信息 = x.data.data;
                    }
                    resolve();
                }).catch(err => {
                    reject();
                })
            });
        },
        获取商家分润列表({ state }) {
            state.商家.loading = true;
            state.商家.query.start = state.商家.page_index * state.商家.query.length;
            api_获取商家分润列表(state.商家.query).then(x => {
                if (x.data.code == 200) {
                    state.商家.list = state.商家.list.concat(x.data.data.data);
                    state.商家.total = x.data.data.total;
                }
                state.商家.loading = false;
            }).catch(err => {
                state.商家.loading = false;
            });
        },
        获取会员分润列表({ state }) {
            state.会员.loading = true;
            state.会员.query.start = state.会员.page_index * state.会员.query.length;
            api_获取会员分润列表(state.会员.query).then(x => {
                if (x.data.code == 200) {
                    state.会员.list = state.会员.list.concat(x.data.data.data);
                    state.会员.total = x.data.data.total;
                }
                state.会员.loading = false;
            }).catch(err => {
                state.会员.loading = false;
            });
        },
        商家下一页({ dispatch, state }) {
            state.商家.page_index++;
            dispatch("获取商家分润列表");
        },
        会员下一页({ dispatch, state }) {
            state.会员.page_index++;
            dispatch("获取会员分润列表");
        },
        查询代理人分润({ state }) {
            var query = {
                userid: state.userid,
                userType: 1 //代理人
            };
            api_查询代理人分润(query).then(x => {
                if (x.data.code == 200) {
                    state.代理人分润资产 = x.data.data;
                }
            }).catch(err => { });
        },
        查询用户信息({state}){
            api_通过username查询用户(state.userid).then(x=>{
                console.log('查询用户信息',x);
                if(x.data.code==200){
                    var data=x.data.data;
                    try {
                        data.nickname= b64DecodeUnicode(data.nickname);                      
                    } catch (error) {
                    }
                    state.用户信息=data;
                }
            })
        }
    },
    modules: {}
};
