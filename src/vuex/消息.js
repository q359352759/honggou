
const 系统消息={
        query:{
            start:0,
            length:10,
            // issystemmsg:1,
            recipient:'' 
        },
        list:[],
        loading:true,
        total:0,
    }

import { api_查询消息列表 } from "@/api/消息接口.js";
export default {
    namespaced: true,
    state: {
        系统消息:系统消息,
        查看类型:0,     //0 系统消息 1 促销快讯 2 降价通知 3 好友消息
    },
    getters: {
        系统消息(state){
            return state.系统消息
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
        数据初始化({state}){
            var userInfo=JSON.parse(localStorage.userInfo);
            state.系统消息=JSON.parse(JSON.stringify(系统消息));
            state.系统消息.query.recipient=userInfo.username
        },
        获取系统消息({state}){
            api_查询消息列表(state.系统消息.query).then(x=>{
                if(x.data.code==200){
                    var list=x.data.data.data;
                    state.系统消息.list=state.系统消息.list.concat(list);
                    state.系统消息.total=x.data.data.total;
                }
                state.系统消息.loading=false;
            }).catch(err=>{
                state.系统消息.loading=false;
            })
        }
    },
    modules: {
    }
};
