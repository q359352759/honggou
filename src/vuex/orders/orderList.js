import { api_查询订单列表 , api_取消订单 , api_查询待评价订单} from "@/api/订单接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";

import { openloading } from "@/assets/js/currency.js";
// import qs from "qs";
const list_all={
    //全部
    loading: true,
    page_index: 0,
    list: [],
    total: 0,
    query: {
        start: 0,
        length: 10,
        // state:0,
        userid: ""
    }
}
const list_0={
    //带支付
    loading: true,
    page_index: 0,
    list: [],
    total: 0,
    query: {
        start: 0,
        length: 10,
        state: 0,
        userid: ""
    }
}
const 待取货={
    loading:true,
    page_index:0,
    list:[],
    total:0,
    query:{
        start: 0,
        length: 10,
        // state: 2,
        userid: "",
        logstatus:3
    }
}
const 待评价={
    //带评价
    loading: true,
    page_index: 0,
    list: [],
    total: 0,
    query: {
        start: 0,
        length: 10,
        state: 1,
        userid: ''
    }
}
export default {
    namespaced: true,
    state: {
        查看类型:0,     //0 全部 1 待付款 2 待发货 3 待收货 4 待评价 5 售后
        list_all: {
            //全部
            loading: true,
            page_index: 0,
            list: [],
            total: 0,
            query: {
                start: 0,
                length: 10,
                // state:0,
                userid: ""
            }
        },
        list_0: {
            //带支付
            loading: true,
            page_index: 0,
            list: [],
            total: 0,
            query: {
                start: 0,
                length: 10,
                state: 0,
                userid: ""
            }
        },
        待取货:{
            loading:true,
            page_index:0,
            list:[],
            total:0,
            query:{
                start: 0,
                length: 10,
                // state: 2,
                userid: "",
                logstatus:3
            }
        },
        待评价: {
            //带评价
            loading: true,
            page_index: 0,
            list: [],
            total: 0,
            query: {
                start: 0,
                length: 10,
                state: 2,
                userid: ""
            }
        }
    },
    getters: {
        查看类型(state){
            return state.查看类型
        },
        list_all(state) {
            return state.list_all;
        },
        list_0(state) {
            return state.list_0;
        },
        待取货(state){
            return state.待取货
        },
        待评价(state) {
            return state.待评价;
        }
    },
    mutations: {},
    actions: {
        设置类型({state},type){
            state.查看类型=type
        },
        //数据初始化
        async init_state({ state }) {
            return new Promise((resolve, reject) => {
                var userInfo = JSON.parse(localStorage.userInfo);
                state.list_all=JSON.parse(JSON.stringify(list_all));
                state.list_all.query.userid=userInfo.username
                
                state.list_0=JSON.parse(JSON.stringify(list_0));
                state.list_0.query.userid=userInfo.username
                
                state.待取货=Object.assign({},待取货);
                state.待取货.query.userid=userInfo.username;

                state.待评价=JSON.parse(JSON.stringify(待评价));
                state.待评价.query.userid=userInfo.username
                resolve();
            });
        },
        //获取数据
        async get_orderList({ dispatch, commit, state }, [obj, nextPage]) {
            if (nextPage) {
                obj.page_index++;
            }
            obj.query.start = obj.page_index * obj.query.length;
            obj.loading = true;
            return new Promise((resolve, reject) => {
                api_查询订单列表(obj.query).then(x => {
                    obj.list = obj.list.concat(x.data.data.data);
                    obj.total = x.data.data.total;
                    obj.loading = false;
                }).catch(err => {
                    console.log(err);
                });
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
                        state.list_all.list = state.list_all.list.filter(x => x.id != obj.id);
                        state.list_0.list = state.list_0.list.filter(x => x.id != obj.id);
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
        查询待评价订单({state}) {
            state.待评价.loading=true;
            state.待评价.query.start=state.待评价.page_index*state.待评价.query.length
            api_查询待评价订单(state.待评价.query).then(x=>{
                if(x.data.code==200){
                    var list=x.data.data.data;
                        list.forEach(item => {
                            item.店铺='';
                            if(item.shopid){
                                api_根据shopid查询店铺(item.shopid).then(r=>{
                                    item.店铺=r.data.code==200 ? r.data.data : '';
                                })
                            }
                        });
                    state.待评价.list=state.待评价.list.concat(list);
                    state.待评价.total = x.data.data.total;
                }
                state.待评价.loading=false;
            }).catch(err=>{
                state.待评价.loading=false;
            })
        },
        待评价下一页({state,dispatch}){
            state.待评价.page_index++;
            dispatch('查询待评价订单')
        }
    },
    modules: {}
};
