<template>
    <div>        
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">订单详情</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="content_1" v-if="本店订单">
                <ul class="box_1">
                    <li ref="fuzhi_box" id="biao1">订单编号：{{obj.ordersid}}</li>
                    <li ref="fuzhi" class="btn1">复制</li>
                </ul>
                <ul class="box_2">
                    <li>
                        <div>顾客：{{guge.phone | filter_phone}}</div>
                        <div>{{obj.createTime | filter_time}}</div>
                    </li>
                    <li>
                        <div>店员：<span class="name">无</span></div>
                        <div  class="灰色字体">佣金0元</div>
                    </li>
                    <li>
                        <div>金额：￥{{obj.paymentAmount}}</div>
                        <div class="灰色字体">赏金{{奖赏金额}}元</div>
                    </li>
                    <!-- <li>
                        <div>红包省钱：{{obj.deduction}}元</div>
                        <div></div>
                    </li> -->
                    <li>
                        <div>服务费：￥{{obj.platformFee}}</div>
                        <!-- <div>实际到账：<span class="money">￥{{obj.turnover}}</span></div> -->
                        <div>实际到账：<span class="money">￥{{实际到账}}</span></div>
                    </li>
                </ul>
                <ul class="box_3" v-if="obj.orderType==0">
                    <li v-for="(item, index) in shangping_list" :key="index">
                        <div class="img_box"><img v-if="item.img && item.img.split(',').length>0" :src="item.img.split(',')[0]" alt="" srcset=""></div>
                        <div class="text_1">
                            <div class="header_1">
                                <div class="mui-pull-right">x{{item.number}}</div>
                                <div>{{item.name}}</div>
                            </div>
                            <div class="money">￥{{item.sellingPrice}}</div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="确认收货" v-show="显示确认收货按钮" @click="显示取货成功=true">
                确认
            </div>
        </div>

        <div  class="取货成功提示" v-show="显示取货成功">
            <ul>
                <li>
                    确认成功
                </li>
                <li>
                    顾客已取货
                </li>
                <li @click="确认取货成功()">
                    好
                </li>
            </ul>
        </div>
        
    </div>
</template>

<script>
import { api_商家确认取货 } from "@/api/订单接口.js";
import { api_查询奖赏记录 } from "@/api/奖赏接口.js";

import ClipboardJS from "clipboard";
import { openloading, dateFtt } from "@/assets/js/currency.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import $ from "jquery";
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "",
    data() {
        return {
            显示取货成功:false,
            显示确认收货按钮:false,
            id: "",
            obj: {},
            guge: {},
            本店订单:true,
            订单赏金记录:[]
        };
    },
    filters: {
        filter_phone(phone) {
            if (!phone) return phone;
            return phone.substring(0, 3) + "***" + phone.substring(phone.length - 3);
        },
        filter_time(time) {
            if (!time) return time;
            return dateFtt(time, "yyyy.MM.dd hh:mm:ss");
        }
    },
    computed: {
        ...mapGetters({
            myshop: "get_myshop",
        }),
        奖赏金额(){
            var 奖赏金额=0;
            this.订单赏金记录.forEach(item=>{
                奖赏金额 = Math.round((奖赏金额+item.rewardamount)*10000)/10000;
            })
            return 奖赏金额
        },
        实际到账(){
            if(this.obj.turnover){
                return Math.round((this.obj.turnover-this.奖赏金额)*10000)/10000
            }else{
                return 0
            }
        },
        shangping_list() {
            var list = [];
            if (this.obj.orderType == 1) {
                return list;
            }
            this.obj.shopOrderCommoditys.forEach(item => {
                var obj = list.find(x => x.commodityid == item.commodityid);
                if (obj) {
                    obj.number++;
                } else {
                    var newobj = Object.assign({}, item);
                    newobj.number = 1;
                    list.push(newobj);
                }
            });
            return list;
        }
    },
    methods: {
        ...mapActions({
            获取店铺: "getMyshop",
        }),
        
        确认取货成功(){
            api_商家确认取货(this.obj.id,this.myshop.shopid).then(x=>{
                if(x.data.code==200){
                    mui.toast("设置成功", { duration: "long", type: "div" });
                    setTimeout(()=>{
                        var agent = navigator.userAgent.toLowerCase();
                        if (agent.match(/MicroMessenger/i) == "micromessenger") {
                            WeixinJSBridge.call('closeWindow');
                        }else{
                            history.back();
                        }
                    },1000)
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err=>{
                mui.toast("系统错误。", { duration: "long", type: "div" });
            })
        },
        //查询订单详情
        findShopOrdersById() {
            openloading(true);
            return new Promise((resolve, reject) => {
                // this.$axios.get("/api-s/shops/findShopOrdersById/" + this.id).then(x => {
                this.$axios.get("/api-s/shops/orders/findShopOrdersByOrdersidMap?ordersid=" + this.id).then(x => {
                    console.log(x);
                    if (x.data.code == 200) {
                        var data=x.data.data;
                        if(this.myshop && this.myshop.shopid==data.shopid){
                            this.obj =data;
                            if(this.$route.query.th==1 && data.logstatus==3){
                                this.显示确认收货按钮=true;
                            }
                        }else{
                            this.本店订单=false;
                            var agent = navigator.userAgent.toLowerCase();
                            mui.alert('此订单不属于您的店铺','提示','确定',()=>{
                                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                                    WeixinJSBridge.call('closeWindow');
                                }else{
                                    history.back();
                                }
                            },'div');
                        }
                    }
                    openloading(false);
                    resolve(x);
                }).catch(err => {
                    openloading(false);
                    reject();
                });
            });
        },
        //获取消费者用户信息
        get_user(item) {
            this.$axios("/api-u/users/findByUserid/" + this.obj.userid).then(x => {
                // userInfo.nickname=b64DecodeUnicode(userInfo.nickname)
                console.log(x);
                if (x.data.code == 200) {
                    // item.user=x.data.data;
                    var user = x.data.data;
                    try {
                        user.nickname = b64DecodeUnicode(user.nickname);
                    } catch (error) { }
                    this.guge = user;
                }
            }).catch(err => { });
        },
        async init() {
            openloading(true);
            if(!this.myshop || !this.myshop.shopid){
                await this.获取店铺();
            }
            var 查询奖赏_query={
                    start:0,
                    length:1000,
                    ordersid:this.id
                }

            api_查询奖赏记录(查询奖赏_query).then(x=>{
                if(x.data.code==200){
                    this.订单赏金记录=x.data.data.data;
                }
            }).catch(err=>{})
            await this.findShopOrdersById();
            this.get_user();
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.init();
        var this_1 = this;
        var clipboard = new ClipboardJS(this.$refs.fuzhi, {
            text: function () {
                return this_1.obj.ordersid;
            }
        });
        clipboard.on("success", function (e) {
            mui.toast("复制成功。", { duration: "long", type: "div" });
        });
        clipboard.on("error", function (e) {
            mui.toast("复制失败，请手动复制。", { duration: "long", type: "div" });
        });
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';

.确认收货{
    position: absolute;
    width: 100%;
    left: 0px;
    bottom: 0px;
    background: $header_background;
    line-height: 44px;
    height: 44px;
	font-size: 14px;
    color: #ffffff;
    letter-spacing: 10px;
    padding-left: 10px;
    text-align: center;
}
.取货成功提示{
    background: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    position: fixed;
    top: 0px;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    >ul{
        width: 202px;
        background:rgba(255,255,255,0.95);
        font-size: 14px;
        border-radius: 16px;
        text-align: center;
        >li:nth-child(1){
            font-weight: bold;
            padding: 13px 0px 15px;
            color: #505050;
        }
        >li:nth-child(2){
            color: #505050;
            padding: 0px 0px 19px;
            border-bottom: 1px solid #e5e5e5;
        }
        >li:nth-child(3){
            height: 42px;
            line-height: 42px;
            color:#007aff;
        }
    }    
}
.content_1 {
    margin: 10px;
    background: #ffffff;
}
.box_1 {
    margin: 0px 5px;
    font-size: 12px;
    height: 32px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ededed;
    color: #505050;
    li:nth-child(1) {
        flex-grow: 1;
    }
    li:nth-child(2) {
        width: 67px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background: #2a82e4;
        color: #ffffff;
        border-radius: 5px;
    }
}
.box_2 {
    padding: 5px 0px;
    margin: 0px 5px;
    font-size: 12px;
    line-height: 25px;
    color: #505050;
    border-bottom: 1px solid #ededed;
    li {
        display: flex;
    }
    div:nth-child(1) {
        flex-grow: 1;
    }
    .name {
        color: #2a82e4;
    }
    .money {
        color: #d43030;
    }
    .灰色字体{
        color: rgba(166, 166, 166, 1);
    }
}

.box_3 {
    li {
        border-bottom: 1px solid #ededed;
        display: flex;
        padding: 7px 5px;
        .img_box {
            flex-shrink: 0;
            width: 91px;
            height: 68px;
            margin: 0px 10px 0px 0px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .text_1 {
            flex-grow: 1;
            width: 0;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .money {
                color: #d43030;
            }
        }
    }
}
</style>
