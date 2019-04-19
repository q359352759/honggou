

import { api_获取商品列表 , api_根据id查询商品 , api_添加商品 , api_修改商品 , api_删除商品} from "@/api/商品接口.js";
import { api_查询专享列表 , api_添加专享 , api_修改专享 , api_删除专享 , api_根据商品id查询专享} from "@/api/专享接口.js";

import 评论 from "./商品/评论.js";
export default {
    namespaced: true,
    state: {},
    getters: {
        // doneTodos(state, getters) {
        //     return state.todos.filter(todo => todo.done);
        // },
    },
    mutations: {
        //获取商品
        get_shangping(state, obj) {
            obj.loading = true;
            api_获取商品列表(obj.query).then(x=>{
                if (x.data.code == 200) {
                    obj.list = obj.list.concat(x.data.data.data);
                    obj.total = x.data.data.total;
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.messag,"提示","我知道了",function () { },"div");
                }
                obj.loading = false;
            }).catch(err=>{
                obj.loading = false;
                mui.toast("获取商品失败", { duration: 2000, type: "div" });
            })
        },
        //根据id查询商品
        get_shangping_1(state, obj) {
            api_根据id查询商品(obj.id).then(x=>{
                if (x.data.code == 200) {
                    obj.fc(x.data.data);
                }
            }).catch(err=>{})
        },
        get_shangping_2(state, id) {
            return new Promise((resolve, reject) => {
                api_根据id查询商品(id).then(x=>{
                    if (x.data.code == 200) {
                        resolve(x);
                    } else {
                        reject(x);
                    }
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        test(state) {
            console.log(123123);
            return 1111111;
        }
    },
    actions: {
        获取商品(state, obj) {
            obj.loading = true;
            return new Promise((resolve, reject) => {
                api_获取商品列表(obj.query).then(x=>{
                    if (x.data.code == 200) {
                        obj.list = obj.list.concat(x.data.data.data);
                        obj.total = x.data.data.total;
                    } else {
                        mui.alert(x.data.msg ? x.data.msg : x.data.messag,"提示","我知道了",function () { },"div");
                    }
                    obj.loading = false;
                    resolve();
                }).catch(err=>{
                    obj.loading = false;
                    mui.toast("获取商品失败", { duration: 2000, type: "div" });
                    reject();
                })
            });
        },
        // get_shangping_3 ({ dispatch, commit }) {
        get_shangping_3({ dispatch, commit }, context) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("根据商品Id获取店铺" + context);
                }, 3000);
            });
        },
        //根据id查询商品
        get_shangping_2(state, id) {
            return new Promise((resolve, reject) => {
                api_根据id查询商品(id).then(x=>{
                    if (x.data.code == 200) {
                        resolve(x);
                    } else {
                        reject(x);
                    }
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        添加商品({ }, 商品) {
            return new Promise((resolve, reject) => {
                api_添加商品(商品).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        修改商品({ }, 商品列表) {
            return new Promise((resolve, reject) => {
                var loginDate = JSON.parse(localStorage.loginDate);
                api_修改商品(商品列表).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        删除商品({ }, 商品) {
            return new Promise((resolve, reject) => {
                api_删除商品(商品.id).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        查询店铺专享({ }, shopid) {
            return new Promise((resolve, reject) => {
                var query={
                        start:0,
                        length:1000,
                        shopid:shopid
                    }
                api_查询专享列表(query).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        添加专享({ }, 专享) {
            return new Promise((resolve, reject) => {
                api_添加专享(专享).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        修改专享({ }, 专享) {
            return new Promise((resolve, reject) => {
                api_修改专享(专享).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        删除专享({ }, id) {
            return new Promise((resolve, reject) => {
                api_删除专享(id).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        商品查询专享({ }, 商品id) {
            return new Promise((resolve, reject) => {
                api_根据商品id查询专享(商品id).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    reject(err);
                })
            });
        }
    },
    modules: {
        评论:评论
    }
};
// store.commit( 'shangPing/...');
