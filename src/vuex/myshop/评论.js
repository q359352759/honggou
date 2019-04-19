import axios from "@/api/axios.js";
import qs from "qs";

import { api_查询评论列表 } from "@/api/评论接口.js";

import { b64EncodeUnicode , b64DecodeUnicode } from "@/assets/js/base64jiema.js";
const 评论={
    page_index:0,
    list:[],
    total:0,
    loading:true,
    query:{
        start:0,
        length:10,
        shopid:'',
        userid:''
    }
}
export default {
    namespaced: true,
    state: {
        评论:{
            page_index:0,
            list:[],
            total:0,
            loading:true,
            query:{
                start:0,
                length:10,
                shopid:'',
                userid:"",
            }
        }
    },
    getters: {
        评论(state){
            return state.评论
        }
    },
    mutations: {
        
    },
    actions: {
        初始化({state},客户id){
            state.评论=JSON.parse(JSON.stringify(评论));
            if(客户id){
                state.评论.query.userid=客户id
            }
        },
        查询评价({state , dispatch , rootGetters},query){
            // console.log('其他地方的state',rootState);
            // console.log(rootGetters['vip/get']) // 打印其他模块的 getters
            // dispatch('vip/get', {}, {root: true}) // 调用其他模块的 actions
            // commit('vip/receive', data, {root: true}) // 调用其他模块的 mutations
            var 店铺=rootGetters['get_myshop'];
            state.评论.query.shopid=店铺.shopid;
            state.评论.query.start=state.评论.page_index*state.评论.query.length;
            state.评论.loading=true;
            api_查询评论列表(state.评论.query).then(x=>{
                console.log('查询评论');
                if(x.data.code==200){
                    var list=x.data.data.data;
                    list.forEach(item => {
                        try {
                            item.remark=b64DecodeUnicode(item.remark)
                        } catch (error) {}
                        item.用户={};
                        dispatch('通过username查询用户',item)
                        item.shopCommodityCommentList.forEach(item_1=>{
                            try {
                                item_1.remark=b64DecodeUnicode(item_1.remark)
                            } catch (error) {}
                            item_1.用户={}
                            item_1.店员={}
                            dispatch('通过username查询用户',item_1);
                            dispatch('员工基本信息',item_1)
                        })
                    });
                    state.评论.list=state.评论.list.concat(list);
                    state.评论.total=x.data.data.total
                }
                state.评论.loading=false;
            }).catch(err=>{
                state.评论.loading=false;
            })
        },
        评价下一页({state,dispatch}){
            state.评论.page_index++;
            dispatch('查询评价')
        },
        //列表专用
        通过username查询用户({ }, item) {
            if(!item.userid) return;
            axios.get("/api-u/users/findByUserid/" + item.userid).then(x => {
                if(x.data.code==200){
                    item.用户=x.data.data;
                }
            }).catch(err => {});
        },
        //列表专用
        员工基本信息({ state }, item) {
            if(!item.clerksid) return;
            axios.get("/api-s/shops/findShopClerksByClerksid?clerksid=" + item.clerksid).then(x => {
                if(x.data.code==200){
                    item.店员 = x.data.data;
                }
            }).catch(err => {});
        }
    },
    modules: {}
};
