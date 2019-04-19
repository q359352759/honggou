import axios from "@/api/axios.js";
import qs from "qs";

import { openloading } from "@/assets/js/currency.js";

const 店铺特色={
    query:{
        start:0,
        length:10,
        shopid:"",
    },
    page_index:0,
    list:[]
}

export default {
	namespaced: true,
	state: {
		店铺特色:{
            query:{
                start:0,
                length:10,
                shopid:"",
            },
            page_index:0,
            list:[]
        }
	},
	getters: {
		店铺特色(state){
            return state.店铺特色
        }
	},
	mutations: {},
	actions: {
		async 初始化({state , dispatch, rootGetters}){
            openloading(true)
            var 店铺=rootGetters['get_myshop'];
            if(!店铺 || !店铺.shopid){
                await dispatch('getMyshop','',{root: true})
            }

            openloading(false);
        },
        添加列表({state}){
        }
	},
	modules: {}
};
