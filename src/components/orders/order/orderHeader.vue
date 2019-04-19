<template>
    <ul class="header">
        <li class="daipingjia mui-pull-right">
            <span v-if="dingdanxiangqing.state==0">待付款</span>
            <span v-if="dingdanxiangqing.state==1">
                <span class="蓝色字体" @click="跳转已评价()" v-if="已评价 && 已取货">已评价</span>
                <span v-if="!已评价 && 已取货">待评价</span>
                <span v-if="!已取货">待取货</span>
            </span>
        </li>
        <li class="shop">
            <i class="icon_shop icon iconfont icon-jinrudianpu"></i>
            <span @click="go_shop()">{{dingdanxiangqing.shopName}}</span>
            <i class="icon_right mui-icon mui-icon-arrowright"></i>
        </li>
        <div class="image"></div>
    </ul>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "",
    data() {
        return {
            state_list: ["待付款", "已付款", ""]
        };
    },
    computed: {
        ...mapGetters({
            dingdanxiangqing: "orders/order/dingdanxiangqing",
            已评价:'orders/order/已评价',
            已取货:'orders/order/已取货',
        }),
    },
    methods: {
        跳转已评价(){
            if(this.dingdanxiangqing.orderType==0){
                //商品
                this.$router.push('/my/pingjia/xiangqing?ordersid='+this.dingdanxiangqing.ordersid+'&id='+this.dingdanxiangqing.id)
            }else{
                this.$router.push('/my/pingjia/xiangqing?ordersid='+this.dingdanxiangqing.ordersid+'&id='+this.dingdanxiangqing.id)
            }
        },
        go_shop() {
            this.$router.push("/BusinessDetails?shopid=" + this.dingdanxiangqing.shopid);
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    background: #ffffff;
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
    .蓝色字体{
        color: rgba(0, 122, 255, 1)
    }
}
.image {
    width: 50px;
    height: 50px;
}
</style>
