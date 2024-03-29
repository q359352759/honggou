import axios from "@/api/axios.js";
import qs from "qs";

import { api_查询专享列表 } from "@/api/专享接口.js";

export default {
    namespaced: true,
    state: {
        专享: {
            page_index: 0,
            total: 0,
            loading: true,
            list: [],
            query: {
                start: 0,
                length: 10,
                state: 1,
                comName: "",
                order: "popularity", //sales 销量 popularity 人气 distance 距离 scoreAvg 评价
                orderType: "DESC"    //DESC
            }
        }
    },
    getters: {
        专享(state) {
            return state.专享;
        }
    },
    mutations: {},
    actions: {
        查询专享({ state }) {
            return new Promise((resolve, reject) => {
                state.专享.loading = true;
                state.专享.query.start = state.专享.page_index * state.专享.query.length;
                api_查询专享列表(state.专享.query).then(x=>{
                    if (x.data.code == 200) {
                        state.专享.list = state.专享.list.concat(x.data.data.data);
                        state.专享.total = x.data.data.total;
                    }
                    state.专享.loading = false;
                    resolve();
                }).catch(err=>{
                    state.专享.loading = false;
                    reject();
                })
            });
        },
        专享下一页({ state, dispatch }) {
            if (!state.专享.loading && state.专享.list.length < state.专享.total) {
                state.专享.page_index++;
                dispatch("查询专享");
            }
        },
        专享初始化({ state }, [comName, order, orderType]) {
            state.专享.page_index = 0;
            state.专享.list = [];
            state.专享.query.comName = comName;
            state.专享.query.order = order; //sales 销量 popularity 人气，
            state.专享.query.orderType = orderType; //DESC ASD
        }
    },
    modules: {}
};

// store.commit( 'hongbao/...');
