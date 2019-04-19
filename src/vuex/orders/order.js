
import { api_根据id查询订单, api_微信内订单支付 , api_订单支付宝回调 } from "@/api/订单接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";
import { api_查询两点距离 } from "@/api/查询距离.js";
import { api_查询预订订单记录 , api_微信支付定金 , api_支付宝支付定金 } from "@/api/预定接口.js";

import { openloading } from "@/assets/js/currency.js";

import router from "@/router";
// import Vuex from "vuex" ;
export default {
    namespaced: true,
    state: {
        test: "order_state测试",
        list: [],
        ordreId: "",
        openid: "",
        dingdanxiangqing: {}, //订单详情 基本信息
        dikouxiangqing_show: false, //省钱详情显示框
        显示支付成功: false,
        显示支付成功不可评价:false,
        店铺信息:'',
        店铺距离:"",
        显示取货二维码:false,
        定时器:"",
        预定订单:{}
    },
    getters: {
        定时器(state){
            return state.定时器
        },
        dikouxiangqing_show(state) {
            return state.dikouxiangqing_show;
        },
        dingdanxiangqing(state) {
            return state.dingdanxiangqing;
        },
        已评价(state) {
            var list = state.dingdanxiangqing.shopOrderCommoditys ? state.dingdanxiangqing.shopOrderCommoditys : [];
            var 未评价 = list.find(x => x.state == 0);
            if (未评价) {
                return false
            } else {
                return true
            }
        },
        //展示的商品
        new_shangping_list(state) {
            var new_list = [];
            var list = state.dingdanxiangqing.shopOrderCommoditys ? state.dingdanxiangqing.shopOrderCommoditys : [];
            list.forEach(item => {
                var obj = new_list.find(x => x.commodityid == item.commodityid);
                if (obj) {
                    obj.number++;
                    var dikou = obj.dikou + (item.realDeduction ? item.realDeduction : 0);
                    dikou = Math.floor(dikou * 100) / 100;
                    item.shopOrderRedEnvelopeList.forEach(hongbao => {
                        obj.hongbao_list.push(hongbao);
                    });
                    obj.dikou = dikou;
                    if (item.exclusive) {
                        obj.exclusive = item.exclusive;
                    }
                    // obj.kedikou=obj.kedikou+(item.realDeduction ? item.realDeduction : 0)
                } else {
                    var newobj = Object.assign({}, item);
                    newobj.dikou = item.realDeduction ? item.realDeduction : 0;
                    newobj.hongbao_list = item.shopOrderRedEnvelopeList;
                    newobj.number = 1;
                    new_list.push(newobj);
                }
            });
            new_list.forEach(item => {
                item.filter_hongbao = [];
                item.hongbao_list.forEach(hongbao => {
                    var obj = item.filter_hongbao.find(
                        x => x.envelopeType == hongbao.envelopeType
                    );
                    if (obj) {
                        obj.money = obj.money + hongbao.paymentAmount;
                        obj.money = Math.round(obj.money * 100) / 100;
                    } else {
                        var newobj = Object.assign({}, hongbao);
                        newobj.money = newobj.paymentAmount;
                        item.filter_hongbao.push(newobj);
                    }
                });
            });
            return new_list;
        },
        //显示商品省钱的数据和其他省钱的数据
        shangpin_dikou_list(state) {
            var new_list = []; //商品省钱的数据
            var qita_list = []; //其他省钱或者没有省钱的数据
            var dikou_hongbao = [];
            var list = state.dingdanxiangqing.shopOrderCommoditys ? state.dingdanxiangqing.shopOrderCommoditys : [];
            list.forEach(item => {
                //计算使用了多少红包
                var hongbao_list = item.shopOrderRedEnvelopeList;
                hongbao_list.forEach(x => {
                    // 0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
                    if (x.envelopeType == 1) {
                        //商品红包不需要计算是否省钱 一个商品一个红包
                        dikou_hongbao.push({ name: "商品红包", type: x.envelopeType });
                    } else {
                        let obj = dikou_hongbao.find(e => e.type == x.envelopeType);
                        //判断红包是否有使用过除商品以外其他红包可以省钱多个商品
                        if (!obj) {
                            if (x.envelopeType == 0) {
                                dikou_hongbao.push({ name: "店铺红包", type: x.envelopeType });
                            } else if (x.envelopeType == 2) {
                                dikou_hongbao.push({ name: "节日红包", type: x.envelopeType });
                            } else if (x.envelopeType == 3) {
                                dikou_hongbao.push({
                                    name: "店铺签到红包",
                                    type: x.envelopeType
                                });
                            } else if (x.envelopeType == 4) {
                                dikou_hongbao.push({ name: "庆典红包", type: x.envelopeType });
                            } else if (x.envelopeType == 5) {
                                dikou_hongbao.push({ name: "生日红包", type: x.envelopeType });
                            } else if (x.envelopeType == 8) {
                                dikou_hongbao.push({ name: "平台", type: x.envelopeType });
                            }
                        }
                    }
                });

                //判断有没有使用商品红包
                if (item.shopOrderRedEnvelopeList.length > 0 && item.shopOrderRedEnvelopeList[0].envelopeType == 1) {
                    //判断 new_list 中是否有这个商品
                    var obj = new_list.find(x => x.commodityid == item.commodityid);
                    if (obj) {
                        obj.hongbao_number = obj.hongbao_number + 1;
                        obj.number = obj.number + 1;
                        obj.dikou = obj.dikou + item.realDeduction;
                        // obj.hongbao.push();
                    } else {
                        item.number = 1;
                        item.hongbao_number = 1;
                        item.dikou = item.realDeduction;
                        item.hongbao = [item.shopOrderRedEnvelopeList[0]];
                        new_list.push(item);
                    }
                } else {
                    var obj = qita_list.find(x => x.commodityid == item.commodityid);
                    // var newobj=Object.assign({}, item.shopOrderCommoditys)
                    if (obj) {
                        obj.hongbao_number = obj.hongbao_number + 1;
                        obj.number = obj.number + 1;
                        obj.dikou = obj.dikou + item.realDeduction;
                    } else {
                        item.number = 1;
                        item.hongbao_number = 1;
                        item.dikou = item.realDeduction;
                        item.hongbao = item.shopOrderRedEnvelopeList;
                        qita_list.push(item);
                    }
                }
            });
            var obj = {
                shangpin_dikou_list: new_list,
                qita_dikou_list: qita_list,
                dikou_hongbao: dikou_hongbao
            };
            return obj;
        },
        显示支付成功(state) {
            return state.显示支付成功;
        },
        显示支付成功不可评价(state){
            return state.显示支付成功不可评价
        },
        店铺信息(state){
            return state.店铺信息
        },
        店铺距离(state){
            return state.店铺距离
        },
        显示取货二维码(state){
            return state.显示取货二维码
        },
        已取货(state){
            if(state.dingdanxiangqing.typeOne==2){
                if(state.dingdanxiangqing.logstatus==3){
                    return false
                }else{
                    return true;
                }
            }else{
                //当面付 不需要提货
                return true;
            }
        },
        预定订单(state){
            return state.预定订单
        }
    },
    mutations: {
        set_orderid_openid(state, obj) {
            console.log("数据初始化", obj);
            state.ordreId = obj.ordreId;
            state.openid = obj.openid;
            state.dingdanxiangqing={};
            state.店铺信息='';
            state.显示取货二维码=false;
            state.预定订单={}
            try {
                clearInterval(state.定时器)
            } catch (error) {}
        }
    },
    actions: {
        设置支付成功弹出框({ state }, type) {
            state.显示支付成功 = type;
        },
        设置成功不评价弹出框({state},type){
            state.显示支付成功不可评价=type
        },
        //设置弹出来是否显示
        get_dikouxiangqing_show({ state }, type) {
            state.dikouxiangqing_show = type;
        },
        async set_list({ dispatch, commit }, data) {
            await dispatch("get_list", data);
        },
        //openid和orderid初始化
        async set_orderid_openid({ dispatch, commit, state }, obj) {
            return new Promise((resolve, reject) => {
                commit("set_orderid_openid", obj);
                resolve();
            });
        },
        //查询订单下面面的信息
        async findShopOrdersById({ state , rootGetters , dispatch }) {
            openloading(true);
            var 当前位置=rootGetters['当前位置'];
            if(!当前位置 || 当前位置.x=='' || 当前位置.y==''){
                await dispatch('获取位置/获取位置','',{root: true});
            }
            return new Promise((resolve, reject) => {
                api_根据id查询订单(state.ordreId).then(x => {
                    if (x.data.code == 200) {
                        var data=x.data.data
                        state.dingdanxiangqing = data;
                        dispatch('查询店铺生成二维码');
                        if(data.state==1){
                            if(data.typeOne==2 && data.logstatus==3){
                                // dispatch('查询店铺生成二维码');
                                dispatch('更新取货状态');
                            }
                        }else if(data.state==2){
                            // mui.alert('该订单已失效','提示',()=>{
                            //     history.back()
                            // })
                            reject();
                        }
                        resolve(x);
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                        reject();
                    }
                    openloading(false);
                }).catch(err => {
                    openloading(false);
                    reject();
                });
            });
        },
        查询预订订单({state}){
            return new Promise((resolve, reject) => {
                var query={
                        start:0,
                        length:10,
                        commodityorderid:state.dingdanxiangqing.ordersid
                    }
                api_查询预订订单记录(query).then(x=>{
                    if(x.data.code==200){
                        state.预定订单=x.data.data.data.length>0 ? x.data.data.data[0] : {};
                    }
                    resolve()
                }).catch(err=>{
                    reject()
                })
            });
        },
        async 更新预定订单状态({state,dispatch}){
            openloading(true)
            var 定时器=setInterval(()=>{
                dispatch('查询预订订单').then(()=>{
                    if(state.预定订单.state==1){
                        dispatch('findShopOrdersById');
                        clearInterval(定时器);
                        openloading('false');
                    }
                })
            },1000)
        },
        支付定金({state,dispatch}){
            console.log('支付定金');
            openloading(true);
            var 支付类型="";
            if(ApplicationType=='app'){
                if(AppType=="ios"){
                    支付类型="ios"
                }else{
                    支付类型="安卓"
                }
            }else{
                let agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                    支付类型="微信"
                }else{
                    支付类型="非微信浏览器";
                }
            }
            var query = {
                // ordreId:state.ordreId,
                openid: state.openid,
                orderId: state.预定订单.orderid,
                identifyin: 支付类型
            };
            if(ApplicationType=='app'){
                api_支付宝支付定金(query).then(x=>{
                    if(state.预定订单.deposit>0){
                        console.log('微信支付定金')
                        dispatch('app/支付/调用支付宝支付', x.data.data, {root: true}).then(x=>{
                            dispatch('更新预定订单状态')
                        }).catch(err=>{
                            if(!err){
                                mui.toast("未检查到支付宝，或支付宝版本过低，稍后再试。", { duration: 2000, type: "div" });
                            }
                        })
                    }else{
                        
                        dispatch('更新预定订单状态')
                    }
                }).catch(err=>{
                    mui.toast("系统错误", { duration: 2000, type: "div" });
                })
            }else{
                api_微信支付定金(query).then(x=>{
                    openloading(false);
                    if(state.预定订单.deposit>0){
                        var data = x.data;
                        wx.chooseWXPay({
                            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: data.paysign, // 支付签名
                            success: function (res) {
                                dispatch('更新预定订单状态')
                            }
                        });
                    }else{
                        dispatch('更新预定订单状态')
                    }
                }).catch(err=>{
                    mui.toast("系统错误", { duration: 2000, type: "div" });
                })
            }
        },
        查询店铺生成二维码({state , rootGetters}){
            return new Promise((resolve, reject) => {
                var 当前位置=rootGetters['当前位置'];
                    api_根据shopid查询店铺(state.dingdanxiangqing.shopid).then(x=>{
                        if(x.data.code==200){
                            state.店铺信息=x.data.data;
                            var 查询距离={
                                    destinations:  当前位置.y+"," + 当前位置.x, //起点
                                    origins: state.店铺信息.y + "," + state.店铺信息.x    //终点
                                }
                            api_查询两点距离(查询距离).then(r=>{
                                if(r.data.status==0 && r.data.result.length>0){
                                    var value=r.data.result[0].distance.value;
                                    state.店铺距离=value>500 ? (value/1000).toFixed(1)+'km' : value+'m';
                                }
                            }).catch(err=>{})
                        }
                        resolve();
                    }).catch(err=>{
                        reject(err);
                    })
                if(state.dingdanxiangqing.state==1 && state.dingdanxiangqing.typeOne==2 && state.dingdanxiangqing.logstatus==3){
                    state.显示取货二维码=true;
                }else{
                    state.显示取货二维码=false;
                }
            });
        },
        //调用支付接口
        async shoppingCopy({ dispatch, commit, state }) {
            console.log('调用支付接口');
            openloading(true);
            try {
                await dispatch('findShopOrdersById')
            } catch (error) {
                return
            }

            return new Promise((resolve, reject) => {
                var 支付类型="";
                if(ApplicationType=='app'){
                    if(AppType=="ios"){
                        支付类型="ios"
                    }else{
                        支付类型="安卓"
                    }
                }else{
                    let agent = navigator.userAgent.toLowerCase();
                    if (agent.match(/MicroMessenger/i) == "micromessenger") {
                        支付类型="微信"
                    }else{
                        支付类型="非微信浏览器";
                    }
                }
                var query = {
                    // ordreId:state.ordreId,
                    openid: state.openid,
                    orderId: state.dingdanxiangqing.ordersid,
                    identifyin: 支付类型
                };
                if(ApplicationType=='app'){
                    api_订单支付宝回调(query).then(x=>{
                        console.log(x);
                        if(x.data.code==200){
                            dispatch('app/支付/调用支付宝支付', x.data.data, {root: true}).then(x=>{
                                dispatch('更新支付状态')
                                // dispatch("设置支付成功弹出框", true);
                                // openloading(true);
                                // setTimeout(() => {
                                //     dispatch("findShopOrdersById");
                                // }, 2000);
                            }).catch(err=>{
                                if(!err){
                                    mui.toast("未检查到支付宝，或支付宝版本过低，稍后再试。", { duration: "long", type: "div" });
                                }
                                // mui.alert(err.message, "提示", "我知道了", function () { }, "div");
                            })
                        }else{
                            mui.toast(x.data.msg ? x.data.msg : x.data.message, { duration: "long", type: "div" });
                        }
                        openloading(false);
                        resolve(x);
                    }).catch(err=>{
                        openloading(false)
                        mui.toast("系统错误", { duration: "long", type: "div" });
                        reject(err);
                    })
                }else{
                    api_微信内订单支付(query).then(x => {
                        console.log(x);
                        openloading(false);
                        var data = x.data;
                        wx.chooseWXPay({
                            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: data.paysign, // 支付签名
                            success: function (res) {
                                // 支付成功后的回调函数
                                dispatch('更新支付状态')
                                // dispatch("设置支付成功弹出框", true);
                                // openloading(true);
                                // setTimeout(() => {
                                //     dispatch("findShopOrdersById");
                                // }, 2000);
                            }
                        });
                        resolve(x);
                    }).catch(err => {
                        openloading(false)
                        mui.toast("系统错误", { duration: "long", type: "div" });
                        reject(err);
                    });
                }
            });
        },
        更新支付状态({state,dispatch}){
            openloading(true);
            state.定时器=setInterval(()=>{
                api_根据id查询订单(state.ordreId).then(x => {
                    if (x.data.code == 200) {
                        var data=x.data.data
                        state.dingdanxiangqing = data;
                        if(data.state==0){

                        }else if(data.state==1){
                            if(data.typeOne==1 || data.typeOne==3){
                                openloading(false);
                                clearInterval(state.定时器);
                                dispatch("设置支付成功弹出框", true);
                            }else if(data.typeOne==2){
                                openloading(false);
                                clearInterval(state.定时器)
                                dispatch('设置成功不评价弹出框',true);
                                dispatch('查询店铺生成二维码');
                                dispatch('更新取货状态')
                            }
                        }else if(data.state==2){
                            clearInterval(state.定时器)
                            openloading(false);
                            // mui.alert('该订单已失效','提示',()=>{
                            //     history.back()
                            // })
                        }
                    }
                }).catch(err => {});
            },2000)
        },
        更新取货状态({state,dispatch}){
            state.定时器=setInterval(()=>{
                api_根据id查询订单(state.ordreId).then(x => {
                    if (x.data.code == 200) {
                        var data=x.data.data
                        state.dingdanxiangqing = data;
                        if(data.state==0){

                        }else if(data.state==1){
                            if(data.typeOne==1){
                                
                            }else if(data.typeOne==2 && data.logstatus==1){
                                clearInterval(state.定时器)
                                dispatch("设置支付成功弹出框", true);
                                state.显示取货二维码=false
                            }
                        }else if(data.state==2){
                            clearInterval(state.定时器)
                            // mui.alert('该订单已失效','提示',()=>{
                            //     history.back()
                            // })
                        }
                    }
                }).catch(err => {});
            },2000)
        },
        根据订单id查询({ }, id) {
            return new Promise((resolve, reject) => {
                api_根据id查询订单(id).then(x => {
                    resolve(x);
                }).catch(err => {
                    openloading(false);
                    reject();
                });
            });
        }
    },
    modules: {}
};
