<template>
    <div>

        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">红包</h1>
            <div class="wenhao" @tap="hongBaoShuoMing()">
                <i class="icon iconfont icon-wenhao"></i>
            </div>
        </header>
        <div class="mui-content mui-fullscreen">
            <div></div>
            <ul class="mui-table-view box_1">
                <li class="mui-table-view-cell item">
                    <span class="title_1">红包类型：</span>
                    <span>店铺新人红包</span>
                </li>
                <li class="mui-table-view-cell item">
                    <span class="title_1">红包标题：</span>
                    <div class="input_1">
                        <input type="text" placeholder="请输入红包标题" v-model="Red_envelopes.headline">
                    </div>
                </li>
                <li class="mui-table-view-cell item">
                    <span class="title_1">有效期限：</span>
                    <span>长期有效</span>
                </li>
                <li class="mui-table-view-cell item">
                    <span class="title_1">红包金额：</span>
                    <div class="input_1">
                        <input type="text" placeholder="请输入红包金额" v-model="Red_envelopes.amount">
                    </div>
                    <span @tap="wenhao()" class="wenhao"><i class="icon iconfont icon-wenhao"></i></span>
                    <span>元</span>
                </li>
            </ul>
            <ul class="mui-table-view box_1">
                <li class="mui-table-view-cell item">
                    <div @click="change_radio_2(0)" class="radio_1" :class="{'active':Red_envelopes.deductionType==0}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span>可省支付金额的</span>
                    <div class="input_2">
                        <input type="text" v-model="Red_envelopes.percentage" />
                    </div>
                    <span>%</span>
                </li>
            </ul>

            <ul class="mui-table-view box_1">
                <li class="mui-table-view-cell item">
                    <div @click="change_radio_2(1)" class="radio_1" :class="{'active':Red_envelopes.deductionType==1}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span>每满</span>
                    <div class="input_2">
                        <input type="text" v-model="Red_envelopes.expire">
                    </div>
                    <span>元，可省</span>
                    <div class="input_2">
                        <input type="text" v-model="Red_envelopes.deduction">
                    </div>
                    <div>元</div>
                </li>
            </ul>

            <ul class="box_2">
                <li>提示：</li>
                <li>
                    1、店铺新人红包也为锁粉红包，为你拓展更多的客源，每个客户只能领取一次，红包使用期为长期有效。
                </li>
                <li>
                    2、省钱百分比和满减规则只在用户直接输入支付金额付款时有效，用户选择商品购买时以商品的可省金额为准。
                </li>
            </ul>

            <div @tap="Sure()" class="btn_1">确定</div>
        </div>

        <!-- 红包通用说明 -->
        <hongBaoShuoMing v-show="hongBaoShuoMing_show" />

    </div>
</template>

<script>
// 红包通用说明
import hongBaoShuoMing from "@/components/hongBaoShuoMing.vue";
import { mapGetters , mapActions } from "vuex";
export default {
    name: "",
    components: {
        hongBaoShuoMing
    },
    data() {
        return {
            hongBaoShuoMing_show: false,
            Red_envelopes: {
                id: "",
                shopid: "",
                type: "0", //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
                name: "新人红包", //名称
                headline: "店铺新人红包", //标题
                amount: "", //金额
                quantity: "", //数量
                startTime: "", //开始时间
                endTime: "", //截止时间
                // ================
                signInStartTime: "", //签到开始时间
                signInEndTime: "", //签到结束时间
                commodityId: "", //商品Id
                commodityName: "", //商品名称
                startAmount: "", //起始金额
                progressivelyAmount: "", //递增金额
                state: 1, //是否开启
                increaseDays: "", //递增天数
                cycleDays: "", //循环天数
                // ===================
                createTime: "",
                deductionType: 0, //省钱方式   0表示百分百 1表示满多少减多少
                percentage: "", //省钱百分比
                expire: "", //满多少
                deduction: "" //减多少
            }
        };
    },
    computed: {
        ...mapGetters({
            myshop:'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺:'getMyshop'
        }),
        change_radio_2(x) {
            this.Red_envelopes.deductionType = x;
        },
        //点击金额说明
        wenhao() {
            // wenhao
            var html = "";
            html =
                '<ul style="text-align:left;">' +
                '<li style="text-indent: 20px;">红包金额不管设置多大，都按照红包使用规则进行省钱。</li>' +
                "<li>如：发放800元的红包，省钱方式为“可省支付金额的10%”。</li>" +
                '<li style="text-indent: 20px;margin:0px 0px 10px;">1、顾客输入金额，支付100元，可用红包省钱10元。顾客还剩余790元的红包，可以下次购买时使用。</li>' +
                '<li style="text-indent: 20px;margin:0px 0px 10px;">2、顾客购买商品，该商品设置的可省金额为20元，那么顾客购买时可以用红包省钱20元。顾客还剩余780元的红包，可以下次购买时使用。</li>' +
                '<li style="text-indent: 20px;margin:0px 0px 10px;">红包具体金额可根据自己店铺情况设置，不宜太大，若太大，您以后再次发放节日红包或庆典红包时会失去关注度，客户还有大量的红包就不再次领取。建议红包金额为“新人专享商品”的可省价。</li>' +
                "</ul>";
            mui.alert(html, "如何设置红包金额？", "我知道了", () => { }, "div");
        },
        //显示红包说明
        hongBaoShuoMing() {
            this.hongBaoShuoMing_show = true;
            this.$router.push("?hongBaoShuoMing_show=1");
        },
        //点击确定
        Sure() {
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
            if (!this.Red_envelopes.headline) {
                mui.toast("请填写红包标题。", { duration: 2000, type: "div" });
                return;
            } else if (!this.Red_envelopes.amount) {
                mui.toast("请填写红包金额。", { duration: 2000, type: "div" });
                return;
            } else if (this.Red_envelopes.amount < 10) {
                mui.toast("红包金额不能小于10元。", { duration: 2000, type: "div" });
                return;
            } else if (
                !number_test.test(this.Red_envelopes.amount) ||
                this.Red_envelopes.amount < 0
            ) {
                mui.toast("红包金额有误。", { duration: 2000, type: "div" });
                return;
            } else if (!zhengshu_test.test(this.Red_envelopes.amount)) {
                mui.toast("红包金额不能有小数。", { duration: 2000, type: "div" });
                return;
            } else if (this.Red_envelopes.deductionType == 0) {
                if (
                    !this.Red_envelopes.percentage ||
                    !number_test.test(this.Red_envelopes.percentage)
                ) {
                    mui.toast("可省比例填写有误。", { duration: 2000, type: "div" });
                    return;
                }
            } else if (this.Red_envelopes.deductionType == 1) {
                if (
                    !this.Red_envelopes.expire ||
                    !number_test.test(this.Red_envelopes.expire) ||
                    !this.Red_envelopes.deduction ||
                    !number_test.test(this.Red_envelopes.deduction)
                ) {
                    mui.toast("满减金额填写有误。", { duration: 2000, type: "div" });
                    return;
                }
            }
            // this.Red_envelopes.shopid=this.myshop.shopid ? this.myshop.shopid : '';
            sessionStorage.Red_envelopes_0 = JSON.stringify(this.Red_envelopes);
            console.log(this.Red_envelopes);
            history.back();
        }
    },
    beforeCreate: function () {
        this.获取店铺()
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        console.log(sessionStorage.Red_envelopes_0);
        try {
            this.Red_envelopes = JSON.parse(sessionStorage.Red_envelopes_0);
        } catch (error) { }
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
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
        $route(to, from) {
            var query = this.$route.query;
            if (!query.hongBaoShuoMing_show) {
                this.hongBaoShuoMing_show = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.mui-bar {
    .wenhao {
        position: absolute;
        height: 44px;
        line-height: 44px;
        font-size: 22px;
        top: 0px;
        right: 15px;
        color: #ffffff;
    }
}
.box_1 {
    margin: 0px 0px 7px 0px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .mui-table-view-cell:after {
        right: 15px;
    }
    .item {
        display: flex;
        align-items: center;
        input {
            height: auto;
            padding: 0px 0px;
            margin: 0px;
            font-size: 14px;
            border: none;
        }
        .title_1 {
            width: 90px;
            flex-shrink: 0;
        }
        .input_1 {
            flex-grow: 1;
        }
        .radio_1 {
            margin: 0px 9px 0px 0px;
            flex-shrink: 0;
        }
        .input_2 {
            margin: 0px 7px;
            width: 88px;
            height: 25px;
            background-color: rgba(229, 229, 229, 1);
            input {
                height: 100%;
                background: none;
            }
        }
        .wenhao {
            color: #1894dc;
            margin: 0px 7px;
            flex-shrink: 0;
            font-size: 22px;
            width: 22px;
            height: 22px;
        }
    }
}

.box_2 {
    padding: 10px 14px 14px;
    color: rgba(128, 128, 128, 1);
    font-size: 12px;
}

.btn_1 {
    background: $header_background;
    height: 40px;
    width: 100%;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    color: #ffffff;
}
</style>
