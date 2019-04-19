<template>
    <div class="Xianjingzhifu">
        <ul class="header">
            <li class="daipingjia mui-pull-right">
                <span v-show="dingdan.state==0">待支付</span>
                <span v-show="dingdan.state==1">待评价</span>
            </li>
            <li class="shop">
                <i class="icon_shop icon iconfont icon-jinrudianpu"></i>
                <!-- <span @click="$router.push('/sjzst2?shopid='+dingdan.shopid)">{{dingdan.shopName}}</span> -->
                <span @click="$router.push('/sjzst2?shopid='+dingdan.shopid)" v-if="dingdan.shopName">{{dingdan.shopName}}</span>
                <span @click="$router.push('/sjzst2?shopid='+dingdan.shopid)" v-if="!dingdan.shopName && dingdan.店铺">{{dingdan.店铺.name}}</span>
                <!-- <i class="icon_right mui-icon mui-icon-arrowright"></i> -->
            </li>
        </ul>
        <ul class="money_box" @click="$router.push('/orders/order?ordreId='+dingdan.id)">
            <li>金额：￥{{ Math.round((dingdan.paymentAmount + dingdan.deduction)*100)/100 }}</li>
        </ul>
        <ul class="footer">
            <li class="text_1">
                {{dingdan.paymentAmount}}元，优惠{{dingdan.deduction}}元。
            </li>
            <li class="btn_1 quxiao" @click="取消()" v-if="dingdan.state==0">取消</li>
            <li @click="zhifu()" class="btn_1 zhifu" v-if="dingdan.state==0">支付</li>
            <li class="btn_1 zhifu" @click="$router.push('/my/pingjia/xianjinPingjia?orderid='+dingdan.id)" v-if="dingdan.state==1">评价</li>
        </ul>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "",
    props: {
        dingdan: {
            default: {}
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        ...mapActions({
            取消订单: "orders/orderList/取消订单"
        }),
        //支付
        zhifu() {
            console.log(123);
            this.$router.push({
                name: "ordersOrder",
                query: { ordreId: this.dingdan.id },
                params: { zhifu: 1 }
            });
        },
        取消() {
            mui.confirm(
                "确定要取消订单？",
                "提示",
                ["再想想", "是的"],
                val => {
                    if (val.index == 1) {
                        this.取消订单(this.dingdan);
                    }
                },
                "div"
            );
        }
    },
    mounted() { }
};
</script>

<style lang="scss" scoped>
.Xianjingzhifu {
    background: #ffffff;
    margin: 3px 0px 0px;
    .header {
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        padding: 0px 10px;
        border-bottom: 1px solid rgba(246, 246, 246, 1);
        // display: flex;
        height: 30px;
        line-height: 30px;
        .shop {
            display: flex;
            align-items: center;
        }
        .icon_shop {
            color: #e86434;
            font-size: 20px;
            margin: 0px 5px 0px 0px;
        }
        .icon_right {
            font-size: 12px;
        }
        .daipingjia {
            color: #505050;
        }
    }
    .money_box {
        padding: 0px 10px;
        height: 50px;
        display: flex;
        align-items: center;
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
    }
    .footer {
        display: flex;
        align-items: center;
        height: 32px;
        padding: 0px 11px;
        .text_1 {
            width: 0;
            flex-grow: 1;
            white-space: nowrap;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
        }
        .btn_1 {
            width: 55px;
            height: 20px;
            line-height: 18px;
            text-align: center;
            border-radius: 20px;
            font-size: 12px;
            margin: 0px 0px 0px 10px;
        }
        .quxiao {
            color: rgba(166, 166, 166, 1);
            border: 1px solid rgba(166, 166, 166, 1);
        }
        .zhifu {
            color: #007aff;
            border: 1px solid #007aff;
        }
    }
}
</style>
