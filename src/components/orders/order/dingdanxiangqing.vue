<template>
    <div class="box">
        <div class="header">订单信息</div>
        <ul>
            <li>订单编号：{{dingdanxiangqing.ordersid}}</li>
            <li>下单时间：{{dingdanxiangqing.createTime | fitler_time}}</li>
            <li>支付方式：{{dingdanxiangqing.payName}}</li>
            
            <li>订单金额：{{Math.round((dingdanxiangqing.paymentAmount+dingdanxiangqing.deduction)*100)/100}}元</li>
            <li v-if="dingdanxiangqing.state==1">
                红包省钱：{{dingdanxiangqing.deduction}}元
                <span v-if="dingdanxiangqing.typeOne!=3" class="实际支付 mui-pull-right">实际支付：{{dingdanxiangqing.paymentAmount}}元</span>
            </li>
            <li v-if="dingdanxiangqing.typeOne==3 && 预定订单" class="预定金额">
                <b v-if="预定订单.state==0" class="红色字体">待付订金：{{预定订单.deposit}}元</b>
                <span v-if="预定订单.state==1">支付方式：{{预定订单.paytype}}</span>

                <b v-if="预定订单.state==1 && dingdanxiangqing.state!=1" class="黑色字体">已付订金：{{预定订单.deposit}}元</b>
                <b v-if="dingdanxiangqing.state==1" class="黑色字体">实付：{{dingdanxiangqing.paymentAmount}}元</b>
            </li>
        </ul>
        <!-- <div class="img"></div> -->
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { dateFtt } from "@/assets/js/currency.js";
export default {
    name: "",
    data() {
        return {};
    },
    filters: {
        fitler_time(time) {
            if (!time) {
                return time;
            }
            return dateFtt(time, " yyyy.MM.dd hh:mm:ss");
        }
    },
    computed: {
        ...mapGetters({
            dingdanxiangqing: "orders/order/dingdanxiangqing",
            预定订单:"orders/order/预定订单"
        }),
        剩余尾款(){
            var 剩余尾款=0;
                剩余尾款 = this.dingdanxiangqing.paymentAmount - this.预定订单.deposit;
            return 剩余尾款;
            // Math.round((dingdanxiangqing.paymentAmount+dingdanxiangqing.deduction)*100)/100
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.box {
    background: #ffffff;
    font-size: 12px;
    margin: 3px 0px 0px;
    .header {
        padding: 0px 11px;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #f6f6f6;
    }
    ul {
        padding: 5px 11px;
        color: #808080;
    }
    .实际支付 {
        color: #505050;
        font-weight: bold;
    }
    .红色字体{
        color: $header_background;
    }
    .黑色字体{
        color: rgba(80, 80, 80, 1);
    }
    .预定金额{
        display: flex;
        justify-content: space-between;
        align-items: center;

    }
}
// .img{
//     width: 50px;
//     height: 50px;
//     background: url('~@/assets/image/2.png');
// }
</style>
