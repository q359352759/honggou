<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <!-- <a @tap="back_1()" class="mui-icon mui-icon-left-nav mui-pull-left"></a> -->
            <h1 class="mui-title">红包买单</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="box_1">您正在向{{shop.name}}付款</div>
            
            <ul class="box_2 type_1">
                <li class="icon_box" @click="select_money()">
                    <i :class="{'active':payment_type==0}" class="icon iconfont icon-xuanze1"></i>
                </li>
                <li class="title_1" @click="select_money()">金额：</li>
                <li class="money" @click="select_money()">￥</li>
                <li class="input_box money_input" >
                    <input type="text" v-model="money" @focus="select_money()" @blur="setmoney()">
                    <span class="tishi_1" v-show="!money && money!==0"><span>请输入金额</span></span>
                </li>
                <li class="title_2" @tap="dikou_show(true)">省钱方式</li>
                <li class="icon_2" @tap="dikou_show(true)"><i class="mui-icon mui-icon-forward"></i></li>
            </ul>

            <!-- <ul class="box_2 type_1" @click="select_shangping()">
                <li class="icon_box">
                    <i :class="{'active':payment_type==1}" class="icon iconfont icon-xuanze1"></i>
                </li>
                <li class="title_1">商品：</li>
                <li class="input_box shangPing_box">
                    <span v-if="shuliang==0" class="tishi_2">请选择商品</span>
                    <span v-if="shuliang!=0">已选择：{{shuliang}}件</span>
                </li>
                <li class="icon_2"><i class="mui-icon mui-icon-forward"></i></li>
            </ul> -->

            <ul class="box_2 type_2">
                <li class="title_1">实付金额：</li>
                <li class="money" v-show="payment_type==0">￥{{money_shijizhifu}}</li>
                <li class="youhui" v-show="payment_type==0">已省：{{money_zong_dikou}}</li>
                <li class="money" v-show="payment_type==1">￥{{shijizhifu}}</li>
                <li class="youhui" v-show="payment_type==1">已省：{{zong_dikou}}</li>
            </ul>
            
            <!-- <div class="box_3" @click="zhifu()">
                支&nbsp;&nbsp;付
            </div> -->

            <btn class="box_3" value="支付" @click.native="zhifu()"/>
            
            <!-- {{this.$store.state.clientX}}
            {{this.$store.state.shangPing.clientX}} -->

        </div>

        <!-- 输入金额选择省钱方式 -->
        <div class="dikou" v-show="dikou_box">
            <div class="mask" @tap="dikou_show(false)"></div>
            <ul>
                <li v-show="shengri_hongbao.length>0" @click="select_dikou(1)">
                    <div class="radio_1" :class="{'active':dikou_type==1}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <div class="name">生日红包</div>
                    <div class="money">-{{shengri_dikou}}元</div>
                </li>
                <li v-show="qingdian_hongbao.length>0" @click="select_dikou(2)">
                    <div class="radio_1" :class="{'active':dikou_type==2}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <div class="name">庆典红包</div>
                    <div class="money">-{{qingdian_dikou}}元</div>
                </li>
                <li v-show="jieri_hongbao.length>0" @click="select_dikou(4)">
                    <div class="radio_1" :class="{'active':dikou_type==4}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <div class="name">店铺节日红包</div>
                    <div class="money">-{{jieri_dikou}}元</div>
                </li>
                <!-- 判断是否发了新人红包 -->
                <li v-if="xinren_hongbao_2.length>0" v-show="xinren_hongbao.length>0 || this.invitedsutotal.sutotal>0" @click="select_dikou(6)">
                    <div class="radio_1" :class="{'active':dikou_type==6}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <div class="name">
                        <span v-if="xinren_hongbao.length>0 && this.invitedsutotal.sutotal==0">店铺新人红包</span>
                        <span v-if="xinren_hongbao.length==0 && this.invitedsutotal.sutotal>0">平台红包</span>
                        <span v-if="xinren_hongbao.length>0 && this.invitedsutotal.sutotal>0">
                            <span>店铺新人</span>
                            <span v-show="xinren_dikou<xingren_pingtai">+平台红包</span>
                        </span>
                    </div>
                    <div class="money">-{{xingren_pingtai}}元</div>
                </li>
            </ul>
        </div>

        <PurchaseChoice v-show="PurchaseChoice_show" ref="child" v-on:ChoiceChange="ChoiceChange" :shopid="shopid"/>

    </div>
</template>

<script>
// import {mapState,mapGetters,mapActions,mapMutations} from 'vuex';

import PurchaseChoice from "./components/PurchaseChoice.vue";
import { getDateStr } from "@/assets/js/currency.js";

import { openloading } from "@/assets/js/currency.js";
import { mapActions } from "vuex";
import btn from "@/components/button.vue";
export default {
    name: "",
    components: {
        PurchaseChoice,
        btn
    },
    data() {
        return {
            is_pingtai: false, //是否使用了平台红包
            payment_type: 0, //选择金额 选择产品
            dikou_box: false, //金额选择省钱
            shopid: "",
            money: "",

            PurchaseChoice_show: false, //选择商品
            SelectedCommodities: [],

            dikou_type: 1,

            shangpin_dikou: [], //商品省钱的商品
            qita_dikou: [], //其他红包省钱的商品
            zong_dikou: 0,
            Total_price: 0, //
            // shijizhifu:0,
            //红包
            hongbao: {
                list: []
            },
            shengri_hongbao: [],
            qingdian_hongbao: [],
            jieri_hongbao: [],
            xinren_hongbao: [],

            xinren_hongbao_2: [], //用于计算新人加店铺省钱规则
            invitedsutotal: {}, //平台红包信息

            shop: {} //店铺信息
        };
    },
    computed: {
        //判断是用于输入金额
        youwu_hongbao() {
            if (!this.invitedsutotal.sutotal && this.shengri_hongbao.length == 0 && this.qingdian_hongbao.length == 0 && this.jieri_hongbao.length == 0 && this.xinren_hongbao.length == 0) {
                return false;
            } else {
                return true;
            }
        },
        money_shijizhifu() {
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            var number = 0;
            if (this.payment_type == 0) {
                if (this.money && number_test.test(this.money)) {
                    number = this.money - this.money_zong_dikou;
                }
            }
            number = number ? Math.round(number * 100) / 100 : 0;
            return number;
        },
        money_zong_dikou() {
            var money = 0;
            if (this.dikou_type == 1) {
                money = this.shengri_dikou;
            } else if (this.dikou_type == 2) {
                money = this.qingdian_dikou;
            } else if (this.dikou_type == 4) {
                money = this.jieri_dikou;
            } else if (this.dikou_type == 6) {
                money = this.xingren_pingtai;
            }
            money = money ? Math.ceil(money * 100) / 100 : 0;
            return money;
        },
        shengri_dikou() {
            return this.jisuan_dikou("shengri_hongbao");
        },
        qingdian_dikou() {
            return this.jisuan_dikou("qingdian_hongbao");
        },
        jieri_dikou() {
            return this.jisuan_dikou("jieri_hongbao");
        },
        xinren_dikou() {
            return this.jisuan_dikou("xinren_hongbao");
        },
        //计算数量
        shuliang() {
            var n = 0;
            this.SelectedCommodities.forEach(item => {
                n += item.number;
            });
            return n;
        },
        //实际支付
        shijizhifu() {
            return Math.round((this.Total_price - this.zong_dikou) * 100) / 100;
        },
        xingren_pingtai() {
            var xingren_pingtai =
                this.xinren_dikou +
                (this.invitedsutotal ? this.invitedsutotal.sutotal : 0);
            var dikou = 0;
            var kedikou = 0;
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            if (
                this.xinren_hongbao_2.length > 0 &&
                this.money &&
                number_test.test(this.money)
            ) {
                if (this.xinren_hongbao_2[0].deductionType == 0) {
                    kedikou = (this.money * this.xinren_hongbao_2[0].percentage) / 100; //满减
                } else {
                    let number = Math.floor(this.money / this.xinren_hongbao_2[0].expire);
                    kedikou = number * this.xinren_hongbao_2[0].deduction;
                }
            }
            dikou = xingren_pingtai < kedikou ? xingren_pingtai : kedikou;
            return dikou;
        }
    },
    methods: {
        ...mapActions({
            set_isfenxiang: "shop/set_isfenxiang"
        }),
        zhifu() {
            let amount = 0;
            if (this.payment_type == 0) {
                amount = this.money_shijizhifu;
            } else {
                amount = this.shijizhifu;
            }
            if (amount == 0) {
                mui.toast(this.payment_type == 0 ? "请输入金额" : "请选择商品", {
                    duration: "long",
                    type: "div"
                });
                return;
            }

            if (this.payment_type == 0) {
                //输入金额买单
                var shopRedEnvelope = [];
                console.log(this.youwu_hongbao, this.money_zong_dikou);
                if (this.youwu_hongbao && this.money_zong_dikou && this.money_zong_dikou != 0) {
                    //使用了红包
                    if (this.dikou_type == 1) {
                        var hongbao = Object.assign({}, this.shengri_hongbao[0]);
                        hongbao.paymentAmount = this.money_zong_dikou;
                        shopRedEnvelope.push(hongbao);
                    } else if (this.dikou_type == 2) {
                        var hongbao = Object.assign({}, this.qingdian_hongbao[0]);
                        hongbao.paymentAmount = this.money_zong_dikou;
                        shopRedEnvelope.push(hongbao);
                    } else if (this.dikou_type == 4) {
                        var hongbao = Object.assign({}, this.jieri_hongbao[0]);
                        hongbao.paymentAmount = this.money_zong_dikou;
                        shopRedEnvelope.push(hongbao);
                    } else if (this.dikou_type == 6) {
                        if (this.xinren_dikou < this.xingren_pingtai) {
                            //使用了平台红包
                            if (this.xinren_hongbao.length > 0) {
                                var hongbao = Object.assign({}, this.xinren_hongbao[0]);
                                hongbao.paymentAmount = this.xinren_dikou;
                                shopRedEnvelope.push(hongbao);
                            }
                            var hongbao_1 = Object.assign({}, this.invitedsutotal);
                            hongbao_1.paymentAmount =
                                Math.round((this.money_zong_dikou - this.xinren_dikou) * 100) /
                                100;
                            shopRedEnvelope.push(hongbao_1);
                        } else {
                            var hongbao = Object.assign({}, this.xinren_hongbao[0]);
                            hongbao.paymentAmount = this.money_zong_dikou;
                            shopRedEnvelope.push(hongbao);
                        }
                    }
                }
                var submitCommodity = [];
                submitCommodity[0] = {
                    shopCommodity: {
                        shopRedEnvelope: shopRedEnvelope //使用的红包
                    },
                    deduction: this.money_zong_dikou,
                    actualPayment: this.money_shijizhifu //实际金额
                };
                let obj = {
                    orderType: 1, //输入金额支付
                    appUser: this.userInfo, //用户
                    shopBasics: this.shop, //店铺信息
                    amount: amount, //金额
                    submitCommodityList: submitCommodity //商品实体类
                };
                openloading(true);
                this.$request("/api-s/shops/createOrders", obj, "post").then(x => {
                    console.log("添加订单", x);
                    if (x.data.code == 200) {
                        this.$router.push({
                            name: "ordersOrder",
                            query: { ordreId: x.data.data.id },
                            params: { zhifu: 1 }
                        });
                    } else {
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false);
                }).catch(err => {
                    console.log("添加订单错误", err);
                    mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                    openloading(false);
                });
            } else {
                //购买商品生成订单
                var submitCommodity = [];
                //商品红包省钱的商品
                this.shangpin_dikou.forEach(item => {
                    var shangPingHongbao = item.hongbao;
                    shangPingHongbao.paymentAmount = item.dikou;
                    item.shopRedEnvelope = [shangPingHongbao];
                    if (item.dikou && item.dikou != 0) {
                        if (item.可享受新人专享 || item.可享受生日专享) {
                            item.exclusive = item.可享受新人专享 ? 1 : 2;
                        }
                    }
                    let obj = {
                        shopCommodity: item, //商品实体类
                        // shopRedEnvelope:[item.hongbao],              //红包实体类
                        deduction: item.dikou ? item.dikou : 0, //省钱金额
                        actualPayment: item.dikou ? Math.ceil((item.sellingPrice - item.dikou) * 100) / 100 : item.sellingPrice //单个商品的实际金额
                    };
                    submitCommodity.push(obj);
                });
                var a = 1;
                //其他红包或者没有省钱的商品
                this.qita_dikou.forEach(item => {
                    if (item.dikou > 0.8) {
                        console.log(item);
                    }
                    var shopRedEnvelope = [];
                    if (item.hongbao == 1 && this.shengri_hongbao.length > 0 && item.dikou) {
                        var hongbao = Object.assign({}, this.shengri_hongbao[0]);
                        hongbao.paymentAmount = item.dikou;
                        shopRedEnvelope.push(hongbao);
                    } else if (item.hongbao == 2 && this.qingdian_hongbao.length > 0 && item.dikou) {
                        var hongbao = Object.assign({}, this.qingdian_hongbao[0]);
                        hongbao.paymentAmount = item.dikou;
                        hongbao.aaaaaa = a;
                        shopRedEnvelope.push(hongbao);
                    } else if (item.hongbao == 4 && this.jieri_hongbao.length > 0 && item.dikou) {
                        var hongbao = Object.assign({}, this.jieri_hongbao[0]);
                        hongbao.paymentAmount = item.dikou;
                        shopRedEnvelope.push(hongbao);
                    } else if (item.hongbao == 6) {
                        if (item.dianpu && this.xinren_hongbao.length > 0) {
                            //店铺红包
                            var xinren_hongbao = Object.assign({}, this.xinren_hongbao[0]);
                            xinren_hongbao.paymentAmount = item.dianpu;
                            shopRedEnvelope.push(xinren_hongbao);
                        }
                        if (item.pingtai) {
                            var pingtai = Object.assign({}, this.invitedsutotal);
                            pingtai.paymentAmount = item.pingtai;
                            shopRedEnvelope.push(pingtai);
                        }
                    }

                    item.shopRedEnvelope = item.dikou ? shopRedEnvelope : [];

                    if (item.dikou && item.dikou != 0) {
                        if (item.可享受新人专享 || item.可享受生日专享) {
                            item.exclusive = item.可享受新人专享 ? 1 : 2;
                        }
                    }
                    let obj = {
                        shopCommodity: item,
                        // shopRedEnvelope:item.dikou ? shopRedEnvelope : [],
                        deduction: item.dikou ? item.dikou : 0,
                        actualPayment: item.dikou ? Math.ceil((item.sellingPrice - item.dikou) * 100) / 100 : item.sellingPrice //单个商品的实际金额
                    };
                    submitCommodity.push(obj);
                });
                let obj = {
                    orderType: 0, //0购买商品 1 表示输入金额
                    appUser: this.userInfo, //用户
                    shopBasics: this.shop, //店铺信息
                    amount: amount, //金额
                    submitCommodityList: submitCommodity //商品实体类
                };
                // console.log(JSON.stringify(obj));
                // return
                openloading(true);
                this.$request("/api-s/shops/createOrders", obj, "post").then(x => {
                    console.log("添加订单", x);
                    if (x.data.code == 200) {
                        this.$router.push({ name: "ordersOrder", query: { ordreId: x.data.data.id }, params: { zhifu: 1 } });
                    } else {
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false);
                }).catch(err => {
                    console.log("添加订单错误", err);
                    mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                    openloading(false);
                });
            }
        },
        //计算省钱
        jisuan_dikou(key) {
            // console.log(key)
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            var dikou = 0;
            if (this[key].length == 0 || !this.money || !number_test.test(this.money)) {
                return dikou;
            }
            //百分比省钱
            if (this[key][0].redDeductionType == 0) {
                dikou = (this.money * this[key][0].redPercentage) / 100;
            } else {
                //满减
                if (this[key][0].redExpire < this.money) {
                    dikou = this[key][0].redDeduction;
                }
            }
            var amount = 0;
            // amount
            if (this[key][0].type == 0) {
                amount = this[key][0].amount;
            } else {
                amount = this[key][0].redAmount;
            }
            dikou = amount < dikou ? amount : dikou;
            return dikou;
        },
        setmoney() {
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            if (this.money && !number_test.test(this.money)) {
                this.money = 0;
            } else if (this.money && number_test.test(this.money)) {
                this.money = Math.floor(this.money * 10) / 10;
            }
        },
        ChoiceChange(x) {
            console.log(x);
            this.zong_dikou = this.$refs.child.总优惠;
            this.Total_price = this.$refs.child.未抵扣价格;
            this.shangpin_dikou = this.$refs.child.商品红包抵扣商品;
            this.qita_dikou = this.$refs.child.未使用商品红包商品;
            console.log(JSON.stringify(this.qita_dikou));
            //获取其他红包省钱类型
            this.qita = this.$refs.child.dikou_type;
            //判断是否使用了店铺+平台  1表示只用了店铺 2表示店铺+平台
            this.dianpu_pingtai = this.$refs.child.dianpu_pingtai;
            // console.log(this.$refs.child.zong_dikou);
            // console.log(this.$refs.child.shangpin_dikou);
            // console.log(this.$refs.child.qita_dikou);
            this.SelectedCommodities = x;
        },
        //选择省钱方式
        select_dikou(x) {
            this.dikou_box = false;
            this.dikou_type = x;
        },
        //选择输入金额
        select_money() {
            this.payment_type = 0;
        },
        //金额选择省钱
        dikou_show(x) {
            this.payment_type = 0;
            if (this.youwu_hongbao) {
                this.dikou_box = x;
            } else {
                mui.toast("没有红包可省。", { duration: "long", type: "div" });
            }
        },
        //选商品
        select_shangping() {
            this.payment_type = 1;
            this.PurchaseChoice_show = true;
            this.$router.push("?shopid=" + this.shopid + "&PurchaseChoice_show=1");
        },
        test1(x) {
            console.log("获取商品测试", x);
        },
        //获取用户可省红包
        get_CardPackge() {
            console.log(this.shopid);
            var findDataUserCardPackge_query = {
                query: {
                    //
                    start: 0,
                    length: 1000,
                    userid: this.userInfo.username,
                    shopid: this.shopid,
                    state: 0
                },
                fc: this.CardPackge_return
            };
            this.$store.commit(
                "hongbao/findDataUserCardPackge",
                findDataUserCardPackge_query
            );
        },
        //红包返回值
        CardPackge_return(x) {
            console.log("红包返回值", x);
            if (x.code && x.code == 200) {
                this.hongbao.list = x.data.data;
                var list = x.data.data;
                //判断是优先使用哪种红包
                //生日红包
                // this.shengri_hongbao=this.hongbao.list.filter(x=>(x.type==5 && x.startTime<=getDateStr(0) && x.endTime>=getDateStr(0)));
                this.shengri_hongbao = this.hongbao.list.filter(x => x.type == 5);
                //庆典红包
                this.qingdian_hongbao = this.hongbao.list.filter(x => x.type == 4);
                //节日红包
                this.jieri_hongbao = this.hongbao.list.filter(x => x.type == 2);
                //店铺新人红包
                this.xinren_hongbao = this.hongbao.list.filter(
                    x => x.type == 0 && x.amount > 0
                );

                if (this.shengri_hongbao.length > 0) {
                    this.dikou_type = 1; //店铺生日红包
                } else if (this.qingdian_hongbao.length > 0) {
                    this.dikou_type = 2; //庆典红包
                } else if (this.jieri_hongbao.length > 0) {
                    this.dikou_type = 4; //节日红包
                } else {
                    this.dikou_type = 6; //店铺+平台红包
                }

                // 0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
                // 1、店铺生日红包
                // 2、店铺庆典红包
                // 3、店铺签到红包
                // 4、店铺节日红包
                // 5、平台节日红包
                // 6、店铺新人+ 平台红包
            }
        },
        //平台红包信息
        get_invitedsutotal() {
            this.$request(
                "/api-u/users/invitedsutotal/findByUserid/" + this.userInfo.username,
                "",
                "get"
            )
                .then(x => {
                    console.log("平台红包信息", x);
                    if (x.data.code == 200 && x.data.data && x.data.data != null) {
                        this.invitedsutotal = x.data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //获取新人红包省钱规则
        get_xinrenhongbao() {
            this.$request(
                "/api-s/shops/redenvelope/findAll?start=0&length=10&type=0&shopid=" +
                this.shopid,
                "",
                "get"
            )
                .then(x => {
                    console.log("获取新人红包", x);
                    if (x.data.code == 200) {
                        this.xinren_hongbao_2 = x.data.data.data;
                    }
                })
                .catch(err => { });
        },
        //查询店铺
        get_shop() {
            this.$request("/api-s/shops/findByShopid/" + this.shopid, "", "get")
                .then(x => {
                    console.log("获取店铺", x);
                    if (x.data.code == 200) {
                        this.shop = x.data.data;
                    }
                })
                .catch(err => { });
        }
    },
    beforeCreate: function () {
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        var query = this.$route.query;
        this.shopid = query.shopid;
        if (query.PurchaseChoice_show) {
            this.PurchaseChoice_show = true;
        }
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }

        //查询店铺
        this.get_shop();
        //获取用户可使用红包
        this.get_CardPackge();
        //获取用户平台红包金额
        this.get_invitedsutotal();
        //获取新人红包省钱规则
        this.get_xinrenhongbao();

        this.set_isfenxiang();
        // /shops/redenvelope/findAll
        // console.log(getDateStr(-7));
        // this.$store.commit('shangPing/get_shangping',150)

        // console.log("2018-12-13T00:00:00.000+0000"<=getDateStr(0),"2018-12-19T00:00:00.000+0000">=getDateStr(0));

        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted() { },
    watch: {
        $route(to, from) {
            var query = this.$route.query;
            if (!query.PurchaseChoice_show) {
                this.PurchaseChoice_show = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.box_1 {
    height: 38px;
    line-height: 38px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    padding: 0px 10px;
}
.box_2.type_1 {
    height: 75px;
}
.box_2.type_2 {
    height: 54px;
}
.box_2 {
    background: #ffffff;
    padding: 0px 18px 0px 12px;
    display: flex;
    align-items: center;
    margin: 0px 0px 12px 0px;
    .icon_box {
        font-size: 20px;
        margin: 0px 12px 0px 0px;
        height: 20px;
        color: #d0cccc;
        .active {
            color: #1894dc;
        }
    }
    .title_1 {
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        white-space: nowrap;
    }
    .input_box {
        position: relative;
        flex-grow: 1;
        input {
            padding: 0px;
            margin: 0px;
            border: none;
            position: relative;
            z-index: 1;
            background: none;
        }
        .tishi_1 {
            position: absolute;
            top: 0px;
            left: 0px;
            height: 100%;
            margin: auto;
            color: rgba(166, 166, 166, 1);
            font-size: 14px;
            display: flex;
            align-items: center;
        }
    }
    .money_input {
        input {
            font-size: 18px;
            color: rgba(212, 48, 48, 1);
        }
    }
    .shangPing_box {
        color: rgba(56, 56, 56, 1);
        font-size: 14px;
        .tishi_2 {
            color: #a6a6a6;
        }
        input {
            color: rgba(56, 56, 56, 1);
            font-size: 14px;
        }
    }
    .money {
        color: rgba(212, 48, 48, 1);
        font-size: 26px;
        font-weight: bold;
    }
    .title_2 {
        color: rgba(166, 166, 166, 1);
        font-size: 12px;
        white-space: nowrap;
    }
    .icon_2 {
        color: rgba(166, 166, 166, 1);
        i {
            font-size: 16px;
        }
    }
    .youhui {
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        text-align: right;
        flex-grow: 1;
    }
}

.box_3 {
    margin: 30px auto;
}

.dikou {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 11;
    .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
    }
    > ul {
        position: absolute;
        width: 100%;
        padding: 0px 0px 40px;
        background: #ffffff;
        left: 0px;
        bottom: 0px;
        > li {
            display: flex;
            align-items: center;
            height: 46px;
            padding: 0px 21px;
            border-bottom: rgba(246, 246, 246, 1);
            .radio_1 {
                margin: 0px 8px 0px 0px;
            }
            .name {
                flex-grow: 1;
                overflow: auto;
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
            }
            .money {
                color: rgba(212, 48, 48, 1);
                font-size: 14px;
            }
        }
    }
}
</style>
