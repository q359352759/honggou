<template>
    <div id="ApplicationAgent">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-icon mui-action-back mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">申请成为业务代理人</h1>
        </header>

        <div class="mui-content  mui-fullscreen">
            <form @submit.prevent="selectOne()">
                <table class="table_1">
                    <tbody>
                        <tr>
                            <td>申请人：</td>
                            <td>
                                <input type="text" v-model="realName" placeholder="实名认证后自动填入" maxlength="10" readonly>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td>推荐人：</td>
                            <td>
                                <input type="text" v-model="referrerPhone" pattern="^1\d{10}$" placeholder="推荐人电话号码">
                            </td>
                        </tr> -->
                        <tr>
                            <td>实名认证：</td>
                            <td @click="renzheng()">
                                <span class="Authentication" :class="{'active':!Authentication}">{{Authentication ? '已认证' : '未认证'}}</span>
                                <i class="mui-icon mui-icon-arrowright mui-pull-right"></i>
                            </td>
                        </tr>
                        <tr>
                            <td>申请区域：</td>
                            <td @click="change_city()">
                                <div class="Surplus mui-pull-right">
                                    <!-- <span>剩余234个</span> -->
                                    <i class="mui-icon mui-icon-arrowright "></i>
                                </div>
                                <span class="region">
                                    {{city.length==0 ? '选择区域' :''}}
                                    {{city[0] ? city[0].text : ''}}
                                    {{city[1] && city[1].text ? ' '+city[1].text : ''}}
                                    {{city[2] && city[2].text ? ' '+city[2].text : ''}}
                                </span>

                            </td>
                        </tr>
                        <tr>
                            <td>费&nbsp;&nbsp;用：</td>
                            <td class="money" style="padding:0px;">
                                <div class="money_1">
                                    <span class="text_1">￥198</span>
                                    <s class="text_2">258</s>
                                    <span class="text_3">（广告365条，时长365天）</span>
                                </div>
                                <!-- <span @click="$router.push('/AgencyCost')" class="mui-pull-right"><i class="icon iconfont icon-help"></i></span> -->
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="box_2">
                    <span>活动：前1000名代理人免费赠送价值198元的广告机套餐！</span> -->
                    　　说明：为证明你具备业务代理人的业务拓展能力及资格，平台需要你个人承销一个广告机套餐，此套餐需要销售给商家。
                    　　支付成功后系统会给你一个激活码，已激活时间为准。
                </div>
                <ul class="box_3">
                    <li @click="change_radio_1(1)">
                        <div class="radio_1 " :class="{'active':radio_type_1==1}">
                            <i class="icon iconfont icon-xuanze"></i>
                        </div>
                        <i class="icon iconfont icon-weixin weixin"></i>
                        <span>微信支付</span>
                    </li>
                </ul>

                <div class="box_4">
                    <div @click="change_radio_2()" class="radio_1" :class="{'active':radio_type_2}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span @click="change_radio_2()">我也阅读并同意</span>
                    <span @click="$router.push('/BusinessAgreement?name='+realName)">《业务代理合作协议》</span>
                </div>

                <div class="btn_1">
                    <btn type="submit"/>
                </div>
                <!-- <button type="button" @click="add_angentActivation()">添加代理人激活码测试</button>-->
            </form>

        </div>
        <div class="msg" v-show="loading">
            <span>数据获取中</span>
        </div>
    </div>
</template>

<script>

import { api_申请代理人支付宝支付 , api_红购使者申请代理人支付宝支付 , api_红购使者申请代理人微信支付 } from "@/api/代理人接口.js";

import { openloading } from "@/assets/js/currency";
import btn from "@/components/button.vue";
import { mapGetters , mapActions } from "vuex";
export default {
    name: "ApplicationAgent",
    components: {
        btn
    },
    data() {
        return {
            loading: true,
            radio_type_1: 1,
            radio_type_2: true,
            cityPicker3: "", //地区3级联动
            city: [], //所选择的地区
            realName: "", //真实姓名
            referrerPhone: "", //荐人电话号码
            areaCode: "", //区域code
            mo: 0.1,
            userInfo: "",
            // weixinobj:{},   //微信的授权信息
            Authentication: "" //认证的信息    没有数据就是没有认证信息
        };
    },
    computed: {
        ...mapGetters({
            代理人信息:'g_agentUser'
        }),
        weixinobj() {
            return this.$store.state.weixinobj;
        }
    },
    methods: {
        ...mapActions({
            actions_agentUser: "actions_agentUser", //获取代理商信息
            查询认证情况: "实名认证/查询认证情况",
            获取支付通道:"app/支付/获取支付通道",
            调用支付宝支付:"app/支付/调用支付宝支付"
        }),
        //添加代理人激活码测试
        add_angentActivation() {
            var tishi = "恭喜您已成为代理人，成功获得价值198元的广告机套餐，在我的/广告套餐右上角点击激活。";
            var tishi1 = "恭喜您已成为代理人，广告机未成功获取，请联系客服。";
            var name = this.userInfo.nickname;
            var obj = {
                username: this.userInfo.username,
                name: this.realName,
                remarks: "代理人注册自动赠送"
            };
            this.$axios.post("http://www.lxad.vip/api/add_angentActivation.php", this.$qs.stringify(obj)).then(x => {
                console.log(x);
                mui.alert(x.data == true ? tishi : tishi1, "提示", () => {
                    this.$store.commit("setagentUser"); //更新代理人信息
                    this.$router.push("/Agent");
                }, "div");
            }).catch(err => {
                mui.alert(tishi1, "提示", () => {
                    this.$store.commit("setagentUser"); //更新代理人信息
                    this.$router.push("/Agent");
                }, "div");
                console.log(err);
            });
        },
        //添加广告机
        addguanggaoji() {
            var this_1 = this;
            var tishi = "恭喜您已成为代理人，成功获得价值198元的广告机套餐，点击公众号内的“广告管理”使用，初始账号为您的手机号，密码为手机号后6位，请在广告机内点击“会员服务”修改密码（请勿在红包乐购中修改）。";
            var tishi1 = "恭喜您已成为代理人，成功获得价值198元的广告机套餐，已经叠加到您的广告机账户。";
            var obj = {
                username: this.userInfo.nickname ? this.userInfo.nickname : "红包乐购",
                pwd: this.userInfo.phone.substring(this.userInfo.phone.length - 6),
                repwd: this.userInfo.phone.substring(this.userInfo.phone.length - 6),
                qq: "",
                anums: "365", //文章条数 增加的
                userid: this.userInfo.phone, //手机号码
                beizhu1: "365", //备注 到期天数  增加
                beizhu2: "红包乐购代理人注册",
                shuyu: "admin", //您的上级ID
                adnums: 20 //广告条数
            };
            this.$axios({
                method: "post",
                // http://www.lxad.vip/index.php
                url: "http://www.lxad.vip/api_register.php",
                data: this.$qs.stringify(obj)
            }).then(x => {
                openloading(false);
                console.log(x);
                //x.data==1 表示 新增加 x.data==0表示已经有了修改了数据
                if (x.data == 0 || x.data == 1) {
                    mui.alert(x.data == 1 ? tishi : tishi1, "提示", function () {
                        this_1.$store.commit("setagentUser"); //更新代理人信息
                        this_1.$router.push("/Agent");
                    }, "div");
                } else {
                    mui.alert("注册成功代理人,赠送广告机失败，请联系客服。", "提示",
                        function () {
                            this_1.$store.commit("setagentUser"); //更新代理人信息
                            this_1.$router.push("/Agent");
                        }, "div");
                }
                openloading(true);
            }).catch(error => {
                openloading(false);
                mui.alert("注册成功代理人,赠送广告机失败，请联系客服。", "提示",
                    function () {
                        this_1.$store.commit("setagentUser"); //更新代理人信息
                        this_1.$router.push("/Agent");
                    }, "div");
                console.log(error);
            });
        },
        //返回首页
        back() {
            this.$router.push("/my");
        },
        //跳转至认证
        renzheng() {
            if (this.userInfo.iaiState != 1) {
                this.$router.push("/RealName");
            } else {
                this.$router.push("/AlreadyRealName");
            }
        },
        //选择支付类型
        change_radio_1(x) {
            this.radio_type_1 = x;
        },
        change_radio_2() {
            this.radio_type_2 = !this.radio_type_2;
        },
        //选择区域
        change_city() {
            // console.log(this.cityPicker3)
            var this_1 = this;
            this.cityPicker3.show(function (items) {
                this_1.city = items;
                //return false;
            });
        },
        //查询有没有这个代理人
        selectOne() {
            if (!this.Authentication) {
                mui.toast("请先实名认证。", { duration: 2000, type: "div" });
                return;
            }else if (this.city.length == 0) {
                mui.toast("请选择区域", { duration: 2000, type: "div" });
                return;
            }else if (!this.radio_type_2) {
                mui.toast("请同意业务代理合作协议!", { duration: 2000, type: "div" });
                return;
            }
            openloading(true);
            this.$axios({
                method: "get",
                url: "/api-u/agentUser/selectOne?phone=" + this.referrerPhone
            }).then(x => {
                if (x.data.code == 200 && x.data.data != null && x.data.data != "null") {
                    this.add(); //添加
                } else {
                    openloading(false);
                    mui.toast("没有此推荐人。", { duration: 2000, type: "div" });
                }
            }).catch(error => {
                openloading(false);
                mui.toast("系统错误，请稍后再试。", { duration: 2000, type: "div" });
            });
        },
        //注册
        async add() {
            var 认证情况 = await this.查询认证情况(this.Authentication.idNumber);
            //查询是否可以申请
            if (认证情况.data.code != 200) {
                mui.alert(认证情况.data.msg ? 认证情况.data.msg : 认证情况.data.message, "提示", "我知道了", function () { }, "div");
                openloading(false);
                return;
            }
            var this_1 = this;
            var areaCode = "";
            if (this.city[2].value) {
                areaCode = this.city[2].value;
            } else if (this.city[1].value) {
                areaCode = this.city[1].value;
            } else if (this.city[0].value) {
                areaCode = this.city[0].value;
            }
            var obj = {
                referrerPhone: this.referrerPhone, //推荐人电话号码
                areaCode: areaCode, //区域code
                realName: this.realName, //真实姓名
                userid: this.userInfo.username,
                phone: this.userInfo.phone,
                openid: this.weixinobj.openid
            };
            if(ApplicationType=='app'){
                this.app支付(obj)                
            }else{
                this.公众号支付(obj)
            }
        },
        app支付(obj){
            var this_1=this;
            if(!this.代理人信息){
                api_申请代理人支付宝支付(obj).then(x=>{
                    console.log(x);
                    if(x.data.code==200){
                        this.调用支付宝支付(x.data.data).then(r=>{
                            this_1.add_angentActivation();
                        }).catch(err=>{})
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false);
                }).catch(err=>{
                    openloading(false);
                    mui.toast("系统错误，请稍后再试。", { duration: 2000, type: "div" });
                })
            }else{
                var areaCode = "";
                if (this.city[2].value) {
                    areaCode = this.city[2].value;
                } else if (this.city[1].value) {
                    areaCode = this.city[1].value;
                } else if (this.city[0].value) {
                    areaCode = this.city[0].value;
                }
                var 代理人信息=Object.assign({},this.代理人信息);
                    代理人信息.areaCode=areaCode
                    代理人信息.referrerPhone=this.referrerPhone;
                api_红购使者申请代理人支付宝支付(代理人信息).then(x=>{
                    if(x.data.code==200){
                        this.调用支付宝支付(x.data.data).then(r=>{
                            this_1.add_angentActivation();
                        }).catch(err=>{})
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                }).catch(err=>{
                    openloading(false);
                    mui.toast("系统错误，请稍后再试。", { duration: 2000, type: "div" });
                })
            }
        },
        公众号支付(obj){
            var this_1=this;
            if(!this.代理人信息){
                this.$axios.post("/api-u/users/weixinpay/order",this.$qs.stringify(obj)).then(x => {
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
                            openloading(true);
                            setTimeout(() => {
                                this_1.actions_agentUser().then(r => {
                                    if (r.data.code == 200) {
                                        this_1.add_angentActivation();
                                    } else {
                                        openloading(false);
                                        mui.alert(r.data.msg ? r.data.msg : r.data.message, "提示", "我知道了", function () { }, "div");
                                    }
                                }).catch(err => {
                                    openloading(false);
                                    mui.alert("系统繁忙，稍后再试。", "提示", "我知道了", function () { }, "div");
                                });
                            }, 1000);
                        }
                    });
                }).catch(err => {
                    openloading(false);
                    mui.toast("系统错误，请稍后再试。", { duration: 2000, type: "div" });
                });
            }else{
                var areaCode = "";
                if (this.city[2].value) {
                    areaCode = this.city[2].value;
                } else if (this.city[1].value) {
                    areaCode = this.city[1].value;
                } else if (this.city[0].value) {
                    areaCode = this.city[0].value;
                }
                var 代理人信息=Object.assign({},this.代理人信息);
                    代理人信息.areaCode=areaCode;
                    代理人信息.referrerPhone=this.referrerPhone;
                api_红购使者申请代理人微信支付(代理人信息).then(x=>{
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
                            openloading(true);
                            setTimeout(() => {
                                this_1.actions_agentUser().then(r => {
                                    if (r.data.code == 200) {
                                        this_1.add_angentActivation();
                                    } else {
                                        openloading(false);
                                        mui.alert(r.data.msg ? r.data.msg : r.data.message, "提示", "我知道了", function () { }, "div");
                                    }
                                }).catch(err => {
                                    openloading(false);
                                    mui.alert("系统繁忙，稍后再试。", "提示", "我知道了", function () { }, "div");
                                });
                            }, 1000);
                        }
                    });
                }).catch(err=>{
                    openloading(false);
                    mui.toast("调用使者转代理人错误，稍后再试", { duration: 2000, type: "div" });
                })
            }
        }
    },
    beforeCreate: function () {
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        this.获取支付通道()
        // var str="alipay_sdk=alipay-sdk-java-3.3.87.ALL&app_id=2019012863180271&biz_content=%7B%22out_trade_no%22%3A%221000001988389361%22%2C%22product_code%22%3A%22QUICK_WAP_PAY%22%2C%22subject%22%3A%22%E4%BB%A3%E7%90%86%E4%BA%BA%E6%94%AF%E4%BB%98%22%2C%22total_amount%22%3A%220.01%22%7D&charset=UTF-8&format=json&method=alipay.trade.app.pay&sign=F4HDTHjupP63NgZCbILQIf2%2BqSz%2B0GRgSf%2BiaOkoukHCVGz%2BRjfV0Rah8SGTvdz%2FpNBey0d1tiveZcLQROgq%2BxR5aZs1DMnb%2Bd43MTF9uAODie9hX22x5msxoWbf92LC6ncJZtbCp5kWC4rkeRoI0FrKKiDGOpICcU0mP4nRIfLT4ZgKgQfHkUNRFFK7AH7o35Z5G%2FmIPblXR67K4q1kNmlKQeuB2F5fCiibHXEzKbb%2BEHLztchPLHDWdhnQBU0duNa9%2BF2O8FHJ5VCD80bll2FiKHn2C2BHBUrGq5sNQ1SrhrAlI3Wc5UdEGE%2FdUxY0iS9G2te1SNIWC1lT5A5zSQ%3D%3D&sign_type=RSA2&timestamp=2019-02-18+16%3A34%3A32&version=1.0"
        
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);            
        } catch (error) {}

        this.referrerPhone = this.$route.query.phone;
        if (!this.referrerPhone) {
            this.$router.push("/agent/ApplicationNotes");
        }

        //获取代理人信息
        this.actions_agentUser().then(x => {
            console.log("获取用户代理人信息", x);
            if (x.data.code == 200 && x.data.data.type == 1) {
                this.$router.push("/Agent");
            } else {
                this.loading = false;
            }
        }).catch(err => {
            this.loading = false;
        });

        //获取认证信息
        this.$axios({
            method: "get",
            url: "/api-u/certification/findByUserid?userid=" + this.userInfo.username
        }).then(x => {
            console.log("获取认证信息", x);
            if (x.data.code==200 && x.data.data != "") {
                this.Authentication = x.data.data;
                this.realName = x.data.data.name;
            }
        }).catch(error => {
            console.log("获取认证信息错误", error);
        });

        //获取区域
        this.$axios({
            method: "get",
            url: "/api-u/area/findAll",
            params: {
                start: 0,
                length: 30000
            }
        }).then(x => {
            function convert(arr, id) {
                // return 'sdfsad';
                var res = [];
                for (var i = 0; i < arr.length; i++) {
                    arr[i].value = arr[i].id;
                    arr[i].text = arr[i].name;
                    if (arr[i].parentid == id) {
                        res.push(arr[i]);
                        // var func = eval(arguments.callee.name);
                        arr[i].children = convert(arr, arr[i].id);
                    }
                }
                return res;
            }
            var cityData3 = convert(x.data.data, null);
            this.cityPicker3 = new mui.PopPicker({
                layer: 3
            });
            this.cityPicker3.setData(cityData3);
            // console.log("递归后的数据", cityData3);
        }).catch(err => { });
        // console.group('------mounted 挂载结束状态------');
    },
    beforeUpdate: function () {
        // console.group('beforeUpdate 更新前状态===============》');
    },
    updated: function () {
        // console.group('updated 更新完成状态===============》');
    },
    beforeDestroy: function () {
        // console.group('beforeDestroy 销毁前状态===============》');
    },
    destroyed: function () {
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {
        userInfo(x) {
            console.log(x);
        }
    }
};
</script>

<style lang="scss">
@import "@/assets/css/config.scss";
#ApplicationAgent {
    height: 100%;
    // .mui-content{
    //     height: 100%;
    // }
}

#ApplicationAgent .mui-bar {
    background: $header_background;

    a {
        color: #ffffff;
    }
}

#ApplicationAgent .mui-title {
    color: #ffffff;
}

#ApplicationAgent .table_1 {
    width: 100%;
    background: #ffffff;
    margin: 0.15rem 0px 0px;

    tr {
        border-bottom: 1px solid #ececec;
        height: 40px;

        > td:nth-child(1) {
            padding: 0px 20px 0px;
            width: 1px;
            white-space: nowrap;
            font-size: 14px;
        }

        > td:nth-child(2) {
            padding: 0px 20px 0px 0px;
        }
    }

    i {
        color: rgba(166, 166, 166, 1);
        font-size: 20px;
    }

    input {
        margin: 0px;
        padding: 0px;
        height: auto;
        border: none;
        font-size: 14px;
        opacity: 0.8;
    }

    .Authentication {
        font-size: 14px;
        color: rgba(58, 182, 237, 1);
    }
    .Authentication.active {
        color: #313131;
    }
    .region {
        max-width: 2.2rem;
        display: block;
        font-size: 14px;
        color: rgba(166, 166, 166, 1);
        white-space: nowrap;
        overflow: hidden;
        // text-orientation:
        text-overflow: ellipsis;
    }

    .Surplus {
        display: flex;
        align-items: center;

        span {
            font-size: 12px;
            color: rgba(166, 166, 166, 1);
        }
    }

    .money {
        line-height: 38px;
        .money_1 {
            .text_1 {
                color: red;
                font-weight: bold;
                font-size: 19px;
            }
            .text_2 {
                color: rgba(166, 166, 166, 1);
                font-size: 14px;
            }
            .text_3 {
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
            }
        }
    }
}

#ApplicationAgent .box_2 {
    color: rgba(80, 80, 80, 1);
    font-size: 12px;
    line-height: 150%;
    padding: 7px 13px;
}

#ApplicationAgent .box_3 {
    display: flex;
    background: #ffffff;
    padding: 10px 20px;
    justify-content: space-between;
    span {
        font-size: 14px;
    }

    li {
        width: 50%;
        display: flex;
        align-items: center;
    }
    .haochu {
        text-align: right;
        color: #3ab6ed;
        font-size: 14px;
        width: auto;
    }
    .weixin {
        font-size: 26px;
        margin: 0px 0.1rem;
        color: $header_background;
    }

    .zhifubao {
        font-size: 26px;
        margin: 0px 0.1rem;
        color: rgba(58, 182, 237, 1);
    }
}

#ApplicationAgent .box_4 {
    display: flex;
    padding: 0px 20px;
    font-size: 14px;
    align-items: center;
    margin: 20px 0px;

    > span:nth-child(2) {
        margin: 0px 0px 0px 5px;
    }

    > span:nth-child(3) {
        color: rgba(58, 182, 237, 1);
    }
}

#ApplicationAgent .msg {
    display: flex;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 11;
    background: #ffffff;
    align-items: center;
    justify-content: center;
}

// 单选
#ApplicationAgent .radio_1 {
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 16px;
    border-radius: 100%;
    border: 2px solid #cccccc;
    overflow: hidden;
    i {
        font-size: 8px;
        display: none;
    }
}

#ApplicationAgent .radio_1.active {
    background: rgba(58, 182, 237, 1);
    border: 2px solid rgba(58, 182, 237, 1);
    color: #ffffff;
    i {
        display: inherit;
    }
}
</style>
