import axios from "@/api/axios.js";
import qs from "qs";

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        获取位置({ dispatch }) {
            return new Promise((resolve, reject) => {
                var agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                    dispatch('微信获取位置').then(x => {
                        resolve()
                    })
                    // dispatch('百度地图获取位置').then(x => {
                    //     resolve()
                    // })
                } else {
                    console.log('ApplicationType:'+ApplicationType)
                    if (ApplicationType == 'app') {
                        if(AppType=='ios'){
                            dispatch('ios获取位置').then(x=>{
                                resolve();
                            })
                        }else{
                            dispatch('百度sdk获取位置').then(x => {
                                console.log('获取位置完成')
                                resolve();
                            })
                        }
                    } else {
                        dispatch('百度地图获取位置').then(x => {
                            resolve()
                        })
                    }
                }
            });

            // console.log('其他地方的state',rootState);
            // console.log(rootGetters['vip/get']) // 打印其他模块的 getters
            // dispatch('vip/get', {}, {root: true}) // 调用其他模块的 actions
            // commit('vip/receive', data, {root: true}) // 调用其他模块的 mutations
        },
        微信获取位置({ dispatch, rootState }) {
            console.log('微信获取位置')
            return new Promise((resolve, reject) => {
                function 获取位置() {
                    if (rootState.weixin_ready) {
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                // var latitude = res.latitude;    // 纬度，浮点数，范围为90 ~ -90
                                // var longitude = res.longitude;  // 经度，浮点数，范围为180 ~ -180。
                                // var speed = res.speed;          // 速度，以米/每秒计
                                // var accuracy = res.accuracy;    // 位置精度
                                dispatch('地图坐标转换', res).then(x => {
                                    resolve()
                                })
                            }
                        });
                    } else {
                        setTimeout(x => {
                            获取位置()
                        }, 1000)
                    }
                }
                获取位置()
            });
        },
        地图坐标转换({ rootState }, res) {
            console.log('坐标转换')
            return new Promise((resolve, reject) => {
                var x = res.longitude;
                var y = res.latitude
                var ggPoint = new BMap.Point(x, y);
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(ggPoint);
                convertor.translate(pointArr, 1, 5, data => {
                    rootState.my_position.x = data.points[0].lng;
                    rootState.my_position.y = data.points[0].lat;
                    resolve()
                })
            });

        },
        百度地图获取位置({ rootState }) {
            console.log('使用百度地图获js取位置');
            return new Promise((resolve, reject) => {
                try {
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (r) {
                        console.log(r);
                            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                rootState.my_position.x = r.point.lng;
                                rootState.my_position.y = r.point.lat;
                            }
                            resolve()
                        },
                        { enableHighAccuracy: true }
                    );
                } catch (error) {
                    console.log(JSON.stringify('使用百度地图js获取位置错误', error))
                    resolve()
                }
            });
        },
        百度sdk获取位置({rootState}) {
            return new Promise((resolve, reject) => {
                console.log('准备使用百度sdk获取位置')
                function 获取地图() {
                    console.log('开始使用百度sdk获取位置')
                    plus.geolocation.getCurrentPosition(function(p){
                        console.log('获取位置正确：' + JSON.stringify(p))
                        var x = p.coords.longitude
                        var y = p.coords.latitude;
                        // rootState.my_position.x = p.coords.longitude;
                        // rootState.my_position.y = p.coords.latitude;
                        var ggPoint = new BMap.Point(x, y);
                        var convertor = new BMap.Convertor();
                        var pointArr = [];
                        pointArr.push(ggPoint);
                        convertor.translate(pointArr, 1, 5, data => {
                            rootState.my_position.x = data.points[0].lng;
                            rootState.my_position.y = data.points[0].lat;
                            resolve()
                        })
                    }, function(e){
                        console.log('获取位置错误:' + JSON.stringify(e));
                        resolve()
                    });
                    // {provider:'baidu'}
                }
                if (window.plus) {
                    获取地图();
                } else {
                    document.addEventListener('plusready', 获取地图, false);
                }
            });
        },
        ios获取位置({dispatch , rootState}){
            console.log('使用ios获取位置')
            return new Promise((resolve, reject) => {
                function setupWebViewJavascriptBridge(callback) {
                    if (window.WebViewJavascriptBridge) { 
                        return callback(WebViewJavascriptBridge); 
                    }
                    if (window.WVJBCallbacks) { 
                        return window.WVJBCallbacks.push(callback); 
                    }
                    window.WVJBCallbacks = [callback];
                    var WVJBIframe = document.createElement('iframe');
                    WVJBIframe.style.display = 'none';
                    WVJBIframe.src = 'https://__bridge_loaded__';
                    document.documentElement.appendChild(WVJBIframe);
                    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
                }
                setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('getLocation', { 'foo': 'bar' }, function (response) {
                        // alert(JSON.stringify(response));
                        dispatch('地图坐标转换', response).then(x => {
                            resolve()
                        })
                        // rootState.my_position.x = response.longitude ? response.longitude : '';
                        // rootState.my_position.y = response.latitude ? response.latitude : '';
                        // resolve()
                    })
                })
            });
        }
    },
    modules: {
    }
};
