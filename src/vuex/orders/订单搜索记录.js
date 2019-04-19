import { api_查询订单列表 , api_取消订单 , api_根据id查询订单} from "@/api/订单接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";

import { openloading } from "@/assets/js/currency.js";
// import qs from "qs";
const 订单={
    loading: true,
    page_index: 0,
    list: [],
    total: 0,
    query: {
        start: 0,
        length: 10,
        // state:0,
        userid: "",
        name:''
    }
}

export default {
    namespaced: true,
    state: {
        显示搜索记录:true,
        订单: {
            loading: true,
            page_index: 0,
            list: [],
            total: 0,
            query: {
                start: 0,
                length: 10,
                // state:0,
                userid: "",
                name:""
            }
        },
        搜索记录:[],
        点击索引:-1,    //-1表示没有点击
        点击的订单:''
    },
    getters: {
        显示搜索记录(state){
            return state.显示搜索记录
        },
        订单(state){
            return state.订单
        },
        搜索记录(state){
            return state.搜索记录;
        },
        点击索引(state){
            return state.点击索引;
        },
        点击的订单(state){
            return state.点击的订单
        }
    },
    mutations: {},
    actions: {
        重置数据({ state }){
            var userInfo = JSON.parse(localStorage.userInfo);
            state.订单=JSON.parse(JSON.stringify(订单));
            state.订单.query.userid=userInfo.username;      
            state.显示搜索记录=true;
            state.点击索引=-1
            var 搜索记录=[]
            try {
                搜索记录 = JSON.parse(localStorage.search_order);
            } catch (error) { }
            state.搜索记录=搜索记录;
        },
        点击搜索({state , dispatch}){
            if(!state.订单.query.name){
                mui.toast("请输入内容", { duration: "long", type: "div" });
                return
            }
            state.点击索引=-1
            state.显示搜索记录=false;
            var obj=state.搜索记录.find(x=>x==state.订单.query.name);
            if(!obj){
                state.搜索记录.unshift(state.订单.query.name);
                if(state.搜索记录.length>12){
                    state.搜索记录.splice(state.搜索记录.length-1);
                }
            }
            localStorage.search_order=JSON.stringify(state.搜索记录);
            state.订单.list=[];
            state.订单.page_index=0
            dispatch('查询订单')
        },
        点击记录({state , dispatch},name){
            state.点击索引=-1
            state.显示搜索记录=false;
            state.订单.list=[];
            state.订单.page_index=0
            state.订单.query.name=name;
            dispatch('查询订单')
        },
        清空记录({state}){
            state.搜索记录=[];
            localStorage.removeItem('search_order');
        },
        搜索框获取焦点({state}){
            state.显示搜索记录=true;
        },
        点击单个订单({state},index){
            state.点击索引=index;
        },
        更新单个订单({state}){
            if(state.点击索引!=-1){
                openloading(true)
                api_根据id查询订单(state.订单.list[state.点击索引].id).then(x=>{
                    if(x.data.code==200){
                        // state.点击的订单=x.data.data;
                        // state.订单.list[state.点击索引]=x.data.data;
                        var data=x.data.data;
                        state.订单.list.splice(state.点击索引, 1, data)
                    }
                    openloading(false)
                }).catch(err=>{
                    openloading(false)
                })
            }
        },
        查询订单({ dispatch, commit, state }) {
            state.订单.query.start=state.订单.page_index*state.订单.query.length;
            state.订单.loading = true;
            api_查询订单列表(state.订单.query).then(x => {
                if(x.data.code==200){
                    var list=x.data.data.data;
                    state.订单.list = state.订单.list.concat(list);
                    state.订单.total = x.data.data.total;
                }
                state.订单.loading = false;
            }).catch(err => {
                state.订单.loading=false;
            });
        },
        取消订单({ state }, obj) {
            openloading(true);
            return new Promise((resolve, reject) => {
                var newobj = Object.assign({}, obj);
                newobj.state = 2;
                api_取消订单(newobj).then(x => {
                    openloading(false);
                    if (x.data.code == 200) {
                        mui.toast("取消成功。", { duration: "long", type: "div" });

                    } else {
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    resolve();
                }).catch(err => {
                    console.log(err);
                    mui.toast("系统错误稍后再说。", { duration: "long", type: "div" });
                    openloading(false);
                    reject();
                });
            });
        },
        下一页({state,dispatch}){
            if(!state.订单.loading && state.订单.list.length<state.订单.total){
                state.订单.page_index++;
                dispatch('查询订单')
            }
        }
    },
    modules: {}
};
