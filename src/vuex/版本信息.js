

import axios from "@/api/axios.js";

export default {
    namespaced: true,
    state: {
        版本信息:{
            版本信息获取成功:false,
            详情:""
        },
        最新版本:'',
        更新描述:[]
    },
    getters: {
        更新描述(state){
            return state.更新描述
        },
        版本信息(state){
            return state.版本信息
        },
        是否通过审核(state){
            if(是否判断审核){
                if(state.版本信息.版本信息获取成功 && state.版本信息.详情 && state.版本信息.详情.state==1){
                    return true;
                }else{
                    return false;
                }
            }else{
                return true;
            }
        },
        当前版本号(state){
            return 当前版本号
        },
        最新版本(state){
            return state.最新版本
        }
    },
    mutations: {
    },
    actions: {
        获取版本信息({state,dispatch}){
            return new Promise((resolve, reject) => {
                var query={
                        versions:当前版本号,
                        start:0,
                        length:10
                    }
                axios.get('/api-u/users/findAppCheckAll',{params:query}).then(x=>{
                    // state.版本信息.版本信息获取成功
                    console.log('获取版本信息',x);
                    if(x.data.code==200){
                        if(x.data.data.data.length>0){
                            state.版本信息.版本信息获取成功=true;
                            state.版本信息.详情=x.data.data.data[0];
                        }else{
                            state.版本信息.版本信息获取成功=false
                        }
                    }else{
                        state.版本信息.版本信息获取成功=false
                    }
                    dispatch('主键设置/主键初始化','',{root: true})
                    resolve()
                }).catch(err=>{
                    state.版本信息.版本信息获取成功=false
                    reject()
                })
            });
        },
        获取最新版本号({state}){
            return new Promise((resolve, reject) => {
                axios.get('http://m.lxad.vip/test/app.json?t'+(new Date()).getTime()).then(x=>{
                    console.log('获取最新版本号',x);
                    if(x.data.version){
                        state.最新版本=x.data.version
                    }
                    state.更新描述=x.data.更新描述 ? x.data.更新描述 : []; 
                    resolve()
                }).catch(err=>{
                    reject()
                })
            });
        }
    },
    modules: {}
};
