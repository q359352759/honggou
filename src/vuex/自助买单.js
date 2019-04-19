

import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";
import { api_查询红包列表 , api_查询卡包 , api_获取用户平台红包} from "@/api/红包接口.js";
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import { openloading , 当前时间格式化 } from "@/assets/js/currency.js";

export default {
    namespaced: true,
    state: {
        店铺信息:{},
        shopid:"",
        userInfo:"",
        店铺红包:[],
        用户红包:[],
        用户平台红包:'',
        输入金额:"",
        用户实名信息:""
    },
    getters: {
        全部信息(state){
           return state;
        },
        //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
        店铺红包抵扣(state){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            var 输入金额=0;
            var 抵扣金额=0;
            if(number_test.test(state.输入金额)){
                输入金额=state.输入金额
            }
            var 店铺新人红包 = state.店铺红包.find(x=>x.type==0);
            var 用户新人红包 = state.用户红包.find(x=>x.type==0);
            var 新人红包余额 = (用户新人红包 && 用户新人红包.amount) ? 用户新人红包.amount : 0;
            if(店铺新人红包 && 新人红包余额>0){
                if(店铺新人红包.deductionType==0){ //百分比
                    var 最多可抵扣=输入金额*店铺新人红包.percentage/100;
                    抵扣金额=最多可抵扣 > 新人红包余额 ? 新人红包余额 : 最多可抵扣
                }else{      //满减
                    var 抵扣次数 = Math.floor(输入金额/店铺新人红包.expire);
                    var 最多可抵扣 = 抵扣次数*店铺新人红包.deduction;
                    抵扣金额=最多可抵扣 > 新人红包余额 ? 新人红包余额 : 最多可抵扣
                }
            }
            return Math.floor(抵扣金额*100)/100 
        },
        平台红包抵扣(state,getters){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            var 输入金额=0;
            var 抵扣金额=0;
            if(number_test.test(state.输入金额)){
                输入金额=state.输入金额
            }
            var 店铺新人红包 = state.店铺红包.find(x=>x.type==0);
            var 平台红包余额 = (state.用户平台红包 && state.用户平台红包.amount) ? state.用户平台红包.amount : 0
            if(店铺新人红包 && 平台红包余额>0){
                if(店铺新人红包.deductionType==0){ //百分比
                    var 最多可抵扣=输入金额*店铺新人红包.percentage/100;
                    var 剩余可抵扣=最多可抵扣 - getters.店铺红包抵扣;
                    抵扣金额=剩余可抵扣 > 平台红包余额 ? 平台红包余额 : 剩余可抵扣

                }else{      //满减
                    var 抵扣次数 = Math.floor(输入金额/店铺新人红包.expire);
                    var 最多可抵扣 = 抵扣次数*店铺新人红包.deduction;
                    var 剩余可抵扣=最多可抵扣 - getters.店铺红包抵扣;
                    抵扣金额=剩余可抵扣 > 平台红包余额 ? 平台红包余额 : 剩余可抵扣
                }
            }
            return 抵扣金额;
        },
        节日红包抵扣(state){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            var 输入金额=0;
            var 抵扣金额=0;
            if(number_test.test(state.输入金额)){
                输入金额=state.输入金额
            }
            var 当前时间 = 当前时间格式化('yyyy-MM-dd hh:mm')
            var 用户节日红包 = state.用户红包.find(x=>(x.type==2 && x.redStartTime<=当前时间 && x.redEndTime>=当前时间));
            var 节日红包余额 = (用户节日红包 && 用户节日红包.redAmount) ? 用户节日红包.redAmount : 0;
            if(节日红包余额>0){
                if(用户节日红包.redDeductionType == 0){ //百分比
                    var 最多可抵扣 = 输入金额*用户节日红包.redPercentage/100;
                    抵扣金额 = 最多可抵扣 > 节日红包余额 ? 节日红包余额 : 最多可抵扣
                }else{      //满减
                    var 抵扣次数 = Math.floor(输入金额/用户节日红包.redExpire);
                    var 最多可抵扣 = 抵扣次数*用户节日红包.redDeduction;
                    抵扣金额 = 最多可抵扣 > 节日红包余额 ? 节日红包余额 : 最多可抵扣
                }
            }
            return Math.floor(抵扣金额*100)/100 
        },
        签到红包抵扣(state){
            return 0
        },
        庆典红包抵扣(state){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            var 输入金额=0;
            var 抵扣金额=0;
            if(number_test.test(state.输入金额)){
                输入金额=state.输入金额
            }
            var 当前时间 = 当前时间格式化('yyyy-MM-dd hh:mm')
            var 用户庆典红包 = state.用户红包.find(x=>(x.type==4 && x.redStartTime<=当前时间 && x.redEndTime>=当前时间));
            var 庆典红包余额 = (用户庆典红包 && 用户庆典红包.redAmount) ? 用户庆典红包.redAmount : 0;
            if(庆典红包余额>0){
                if(用户庆典红包.redDeductionType == 0){ //百分比
                    var 最多可抵扣 = 输入金额*用户庆典红包.redPercentage/100;
                    抵扣金额 = 最多可抵扣 > 庆典红包余额 ? 庆典红包余额 : 最多可抵扣
                }else{      //满减
                    var 抵扣次数 = Math.floor(输入金额/用户庆典红包.redExpire);
                    var 最多可抵扣 = 抵扣次数*用户庆典红包.redDeduction;
                    抵扣金额 = 最多可抵扣 > 庆典红包余额 ? 庆典红包余额 : 最多可抵扣
                }
            }
            return Math.floor(抵扣金额*100)/100 
        },
        生日红包抵扣(state){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            var 输入金额=0;
            var 抵扣金额=0;
            if(number_test.test(state.输入金额)){
                输入金额=state.输入金额
            }
            var 当前时间 = 当前时间格式化('yyyy-MM-dd hh:mm')
            var 用户生日红包 = state.用户红包.find(x=>(x.type==5 && x.redStartTime<=当前时间 && x.redEndTime>=当前时间));
            var 生日红包余额 = (用户生日红包 && 用户生日红包.redAmount) ? 用户生日红包.redAmount : 0;
            if(生日红包余额>0){
                if(用户生日红包.redDeductionType == 0){ //百分比
                    var 最多可抵扣 = 输入金额*用户生日红包.redPercentage/100;
                    抵扣金额 = 最多可抵扣 > 生日红包余额 ? 生日红包余额 : 最多可抵扣
                }else{      //满减
                    var 抵扣次数 = Math.floor(输入金额/用户生日红包.redExpire);
                    var 最多可抵扣 = 抵扣次数*用户生日红包.redDeduction;
                    抵扣金额 = 最多可抵扣 > 生日红包余额 ? 生日红包余额 : 最多可抵扣
                }
            }
            return Math.floor(抵扣金额*100)/100 
        }
    },
    mutations: {
        
    },
    actions: {
        数据初始化({state , dispatch},shopid){
            state.shopid=shopid;
            state.店铺信息={};
            state.店铺红包=[];
            state.用户红包=[];
            state.用户平台红包="";
            state.用户实名信息="";
            state.输入金额="";
            try {
                state.userInfo=JSON.parse(localStorage.userInfo);
            } catch (error) {
                state.userInfo="";                
            }
            openloading(true)
            return new Promise((resolve, reject) => {
                var 查询红包_query={
                    start:0,
                    length:1000,
                    shopid:state.shopid,
                    // type:0,
                    ccc:1,
                }
                Promise.all([
                    api_根据shopid查询店铺(state.shopid),
                    api_查询红包列表(查询红包_query),
                    dispatch('获取用户红包')
                ]).then(x=>{
                    state.店铺信息=x[0].data.code==200 ? x[0].data.data : {};
                    state.店铺红包=x[1].data.code==200 ? x[1].data.data.data : [];
                    openloading(false)
                    resolve()
                }).catch(err=>{
                    openloading(false);
                    reject()
                })
            });
        },
        获取用户红包({state}){
            return new Promise((resolve, reject) => {
                if(!state.userInfo){
                    resolve()
                    return
                }
                var 用户卡包_query={
                        start: 0,   
                        length: 1000,
                        userid: state.userInfo.username,
                        shopid: state.shopid,
                        state: 0
                    }
                    api_获取实名信息(state.userInfo.username).then(x=>{
                        state.用户实名信息=(x.data.code==200 && x.data.data) ? x.data.data : "";
                    })
                Promise.all([
                    api_查询卡包(用户卡包_query),
                    api_获取用户平台红包(state.userInfo.username),
                    api_获取实名信息(state.userInfo.username)
                ]).then(x=>{
                    console.log(x);
                    state.用户红包=x[0].data.code==200 ? x[0].data.data.data : [];
                    state.用户平台红包=x[1].data.code==200 ? x[1].data.data : "";
                    state.用户实名信息=(x[2].data.code==200 && x[2].data.data) ? x[2].data.data : '';
                    resolve()
                }).catch(err=>{
                    reject()
                })
            });
        }

    },
    modules: {}
};
