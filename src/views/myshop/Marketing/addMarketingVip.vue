<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">添加专享商品</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="box_2" @click="select_1()">
                <div class="right_1 mui-pull-right">
                    <i class="mui-icon mui-icon-forward"></i>
                </div>
                <div class="tishi" v-if="!commodity.id">
                    <span>请选择已有商品</span>
                </div>
                <div class="commodity_box" v-if="commodity.id">
                    <div class="img_box">
                        <img v-if="commodity.img && commodity.img.split(',').length>0" :src="commodity.img.split(',')[0]" alt="" srcset="">
                    </div>
                    <div class="text_1">
                        <div class="name">{{commodity.name}}</div>
                        <div class="money">售价：{{commodity.sellingPrice}}元</div>
                        <div class="text_2">可省{{commodity.deduction}}元，佣金{{commodity.commission}}元</div>
                    </div>
                </div>
            </div>
            
            <ul class="选择专享信息">
                <li>
                    <div>
                        <i @click="change_radio_2(0)" :class="{'icon-choose':obj.type!=0,'icon-xuanze2':obj.type==0}" class="单选 icon iconfont"></i>
                        <span>新人专享</span>
                    </div>
                    <div>
                        <span>专享省：</span>
                        <input type="text" v-model.number="obj.deduction">
                        <span>元</span>
                    </div>
                </li>
                <li>
                    <div>
                        <i @click="change_radio_2(1)" :class="{'icon-choose':obj.type!=1,'icon-xuanze2':obj.type==1}" class="单选 icon iconfont"></i>
                        <span>生日专享</span>
                    </div>
                    <div>
                        <span>最多购买：</span>
                        <input type="text" v-model="obj.maxNumber" @blur="专享失去焦点()">
                        <span>份</span>
                    </div>
                </li>
            </ul>

            <ul class="box_4" v-if="obj.type==0">
                <li>说明：</li>
                <li class="indent_1">
                    新人专享商品，可以给店铺拓展客源，是一种促销略！在稳定老顾客的同时增加新客源，让你的店铺生意越来越红火，客源越来越多！
                </li>
                <li class="indent_1">
                    请选择利润高的商品，把原有商品可省金额调得更大一些。让新顾客能够感受到与众不同的专享特权，从而实现拓展新顾客的目标！
                </li>
            </ul>
            <ul class="box_4" v-if="obj.type==1">
                <li>说明：</li>
                <li class="indent_1">
                    生日专享商品，让顾客感受到你的温暖和体贴，从一个普通顾客转变为一个忠实顾客，通过一次生日专享消费，能够实现顾客在店铺增加多次的消费！
                </li>
                <li class="indent_1">
                    通过生日专享商品，提高顾客忠诚度，不仅能实现顾客多次消费，还能实现顾客的转介绍！
                </li>
                <li class="indent_1">
                    把已添加的商品，提高红包省金额，让每一个过生日的顾客能够感受到专享购物得特权和优越感。
                </li>
            </ul>

            <div @click="queding()" class="btn_1">确定</div>
        </div>

        <selectCommodity v-show="ShopClassification_show" v-on:setShow="setShow" leixing="发布专享商品" />
    </div>
</template>

<script>
import { api_添加专享 } from "@/api/专享接口.js";

import { openloading } from "@/assets/js/currency.js";
import selectCommodity from "@/components/selectCommodity.vue";
import { mapGetters, mapActions } from "vuex";

// commodityId:152
// createTime:"2019-02-12 19:08:41"
// deduction:6
// id:55
// shopid:"D5995964EE8D9AA3B630CAE96679253F"
// type:0
// typeName:"新人专享"
// updateTime:null

export default {
    name: "",
    components: {
        selectCommodity
    },
    data() {
        return {
            ShopClassification_show: false,
            obj: {
                shopid: "", //店铺id
                commodityId: "", //商品id
                type: 0, //0新人 1生日
                typeName: "", //
                deduction: "", //省钱金额
                percentage: "",
                maxNumber:""
            },
            commodity: {
                //商品
            }
        };
    },
    computed: {
        ...mapGetters({
            myshop: 'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺: "getMyshop"
        }),
        input_change(x) {
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            if (!this.commodity.sellingPrice || !this.obj[x] || !number_test.test(this.obj[x])) {
                if (x == "deduction") {
                    this.obj.percentage = "";
                } else {
                    this.obj.deduction = "";
                }
                return;
            }
            if (x == "deduction") {
                //金额
                this.obj.deduction = Math.floor(this.obj.deduction * 100) / 100;
                var percentage =
                    (this.obj.deduction / this.commodity.sellingPrice) * 100;
                this.obj.percentage = Math.floor(percentage * 10) / 10;
            }
            if (x == "percentage") {
                //百分比
                this.obj.percentage = Math.floor(this.obj.percentage * 10) / 10;
                var deduction =
                    (this.obj.percentage / 100) * this.commodity.sellingPrice;
                this.obj.deduction = Math.floor(deduction * 100) / 100;
            }
        },
        专享失去焦点(key) {
            var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
            var 转换后 = parseInt(this.obj.maxNumber);
            if (!zhengshu_test.test(转换后)) {
                this.obj.maxNumber = '';
            } else {
                this.obj.maxNumber = 转换后;
            }
        },
        //点击确定
        queding() {
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            if (!this.commodity || !this.commodity.id) {
                mui.toast("请选择商品。", { duration: "long", type: "div" });
                return;
            } else if (!number_test.test(this.obj.deduction)) {
                mui.toast("请输入可省金额。", { duration: "long", type: "div" });
                return;
            } else if (this.obj.deduction <= this.commodity.deduction) {
                mui.toast("可省金额需大于商品可省金额。", {duration: "long",type: "div"});
                return;
            } else if (this.obj.deduction > this.commodity.sellingPrice * 0.9) {
                mui.toast("可省金额不能大于商品金额的90%。", {duration: "long",type: "div"});
                return;
            }else if(!this.obj.maxNumber){
                mui.toast("请输入最大购买数量", {duration: "long",type: "div"});
                return;
            }else if(this.obj.maxNumber<1 || this.obj.maxNumber > 100){
                mui.toast("专享购买数量为1-100", {duration: "long",type: "div"});
                return;
            }
            this.obj.shopid = this.myshop.shopid;
            this.obj.commodityId = this.commodity.id;
            this.obj.typeName = this.obj.type == 0 ? "新人专享" : "生日专享";
            console.log(this.obj);
            api_添加专享(this.obj).then(x => {
                if (x.data.code == 200) {
                    mui.toast("添加成功。", { duration: "long", type: "div" });
                    history.back();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.messag, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err => {
                mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            })
        },
        //选择商品
        select_1() {
            this.ShopClassification_show = true;
            this.$router.push("?ShopClassification_show=1");
        },
        //选择类型
        change_radio_2(x) {
            this.obj.type = x;
        },
        //接受商品
        setShow(x) {
            console.log("收到参数", x);
            history.back();
            if (x) {
                this.commodity = x;
                // this.obj.deduction=x.deduction
                // this.input_change('deduction')
            }
        }
    },
    mounted() {
        if (!this.myshop || !this.myshop.shopid) {
            this.获取店铺()
        }
    },
    watch: {
        $route(to, from) {
            var query = this.$route.query;
            if (!query.ShopClassification_show) {
                this.ShopClassification_show = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.选择专享信息{
    background: #ffffff;
    margin: 3px 0px 0px;
    color: rgba(80, 80, 80, 1);
	font-size: 14px;
    padding: 5px 15px 1px;
    >li{
        display: flex;
        align-items: center;
        height: 30px;
        margin: 0px 0px 5px 0px;
        >div{
            display: flex;
            align-items: center;
        }
        >div:nth-child(1){
            flex-grow: 1;
        }
    }
    input{
        background: #e5e5e5;
        width: 92px;
    	height: 30px;
        margin: 0px;
        padding: 0px;
        text-align: center;
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        border: none;
        border-radius: 0px;
        margin: 0px 5px 0px 0px;
    }
    .单选{
        font-size: 20px;
        margin: 0px 16px 0px 0px;
        height: 20px;
    }
    .icon-xuanze2{
        color: #1894dc;
    }
}

.box_1 {
    background: #ffffff;
    height: 44px;
    position: relative;
    display: flex;
    > li {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
            margin: 0px 0px 0px 5px;
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
        }
    }
    > li:nth-child(1) {
        border-right: 1px solid #f6f6f6;
    }
}

.box_2 {
    position: relative;
    background: #ffffff;
    margin: 0px 0px 3px;
    height: 75px;
    padding: 7px 9px;
    .tishi {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(0, 122, 255, 1);
        font-size: 14px;
    }
    .commodity_box {
        height: 100%;
        display: flex;
        .img_box {
            margin: 0px 8px 0px 0px;
            width: 83px;
            height: 62px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .text_1 {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .name {
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
            }
            .money {
                color: rgba(128, 128, 128, 1);
                font-size: 12px;
            }
            .text_2 {
                color: rgba(166, 166, 166, 1);
                font-size: 12px;
            }
        }
    }
    .right_1 {
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        height: 100%;
        align-items: center;
        color: #c0bcbc;
    }
}

.box_3 {
    padding: 0px 17px;
    height: 44px;
    background: #ffffff;
    margin: 3px 0px 0px;
    display: flex;
    align-items: center;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    white-space: nowrap;
    .text_1 {
        padding: 0px 8px;
    }
    .input_box {
        flex-shrink: 1;
        flex-grow: 1;
        width: 87px;
        height: 30px;
        background-color: rgba(229, 229, 229, 1);
        input {
            font-size: 14px;
            text-align: center;
            margin: 0px;
            padding: 0px;
            height: 100%;
            background: none;
            border: none;
        }
    }
}
.box_4 {
    padding: 12px 16px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .indent_1 {
        text-indent: 20px;
    }
}

.btn_1 {
    width: 100%;
    height: 44px;
    line-height: 44px;
    background: $header_background;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    position: fixed;
    left: 0px;
    bottom: 0px;
}
</style>
