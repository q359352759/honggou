<template>
    <ul>
        <li v-show="dingdanxiangqing.state==0">
            <div>输入金额：
                <span class="money">
                    <span v-if="dingdanxiangqing.shopOrderCommoditys.length>0">{{dingdanxiangqing.amount+dingdanxiangqing.shopOrderCommoditys[0].realDeduction}}元</span>
                    <span v-if="dingdanxiangqing.shopOrderCommoditys.length==0">{{dingdanxiangqing.amount}}元</span>
                </span>
            </div>
            <div class="mui-text-right">实付：
                <span class="money">{{dingdanxiangqing.amount}}</span>
            </div>
        </li>
        <li v-show="dingdanxiangqing.state==0">
            <div>
                <span v-show="shangpin_dikou_list.dikou_hongbao.length>0" v-for="(item, index) in shangpin_dikou_list.dikou_hongbao" :key="index">{{index==0 ? item.name : '+'+item.name}}</span>
                <span v-show="shangpin_dikou_list.dikou_hongbao.length==0">未使用红包</span>
                <i class="icon_font mui-icon mui-icon-arrowright"></i>
                <span class="money">-{{dingdanxiangqing.shopOrderCommoditys && dingdanxiangqing.shopOrderCommoditys.length>0 ? dingdanxiangqing.shopOrderCommoditys[0].realDeduction : 0}}元</span>
            </div>
            <div class="mui-text-right">
                <div v-show="dingdanxiangqing.state==0" @click="zhifu()" class="zhifu">支付</div>
                <span class="zhifu" v-if="dingdanxiangqing.state==1 && 已评价" @click="$router.push('/my/pingjia/xiangqing?ordersid='+dingdanxiangqing.ordersid+'&id='+dingdanxiangqing.id)">我的评价</span>
                <span class="zhifu" v-if="dingdanxiangqing.state==1 && !已评价"  @click="$router.push('/my/pingjia/xianjinPingjia?orderid='+dingdanxiangqing.id)">评价</span>
            </div>
        </li>

        <li v-show="dingdanxiangqing.state==1">
            <div>
            </div>
            <div class="mui-text-right">
                <span class="zhifu" v-if="dingdanxiangqing.state==1 && 已评价" @click="$router.push('/my/pingjia/xiangqing?ordersid='+dingdanxiangqing.ordersid+'&id='+dingdanxiangqing.id)">我的评价</span>
                <span class="zhifu" v-if="dingdanxiangqing.state==1 && !已评价"  @click="$router.push('/my/pingjia/xianjinPingjia?orderid='+dingdanxiangqing.id)">评价</span>
            </div>
        </li>



    </ul>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: "",
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            shangpin_dikou_list: "orders/order/shangpin_dikou_list",
            dingdanxiangqing: "orders/order/dingdanxiangqing",
            已评价: 'orders/order/已评价'
        })
    },
    methods: {
        ...mapActions({
            shoppingCopy: "orders/order/shoppingCopy", //调用支付接口
            // set_orderid_openid:'orders/order/set_orderid_openid',   //初始化 openid和 ordreId
            get_dikouxiangqing_show: "orders/order/get_dikouxiangqing_show" //显示框是否显示
        }),
        zhifu() {
            this.shoppingCopy();
        }
    }
};
</script>

<style lang="scss" scoped>
ul {
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    background: #ffffff;
    li {
        height: 42px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        padding: 0px 10px;
        > div {
            width: calc(100% / 2);
        }
    }
    .money {
        color: #d43030;
    }
    .icon_font {
        font-size: 14px;
    }
    .zhifu {
        display: inline-block;
        min-width: 68px;
        height: 24px;
        line-height: 22px;
        border: 1px solid #007aff;
        color: #007aff;
        border-radius: 24px;
        text-align: center;
        padding: 0px 15px;
    }
}
</style>
