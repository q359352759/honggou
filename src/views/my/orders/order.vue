<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <!-- <h1 class="mui-title" @click="查询店铺生成二维码()">订单详情</h1> -->
            <h1 class="mui-title">订单详情</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="content_1">
                <ydtb v-if="dingdanxiangqing.typeOne==3 && dingdanxiangqing.state==3 && 预定订单.state==1"/>
                <!-- <ydtb v-if="dingdanxiangqing.typeOne==3 && 预定订单.state==1"/> -->
                <!-- 取货二维码 -->
                <quhuoma v-if="显示取货二维码"/>
                <!-- 头部 -->
                <orderHeader />
                <!-- 商品 -->
                <shangping v-if="dingdanxiangqing.orderType==0" />
                
                <ydbz v-if="dingdanxiangqing.typeOne==3 && (预定订单.remark || 预定订单.reply)"/>
                <!-- 订单详情 -->
                <dingdanxiangqing />

            </div>
            <div class="footer_1">
                <!-- 输入金额底部 -->
                <!-- <dangmianzhifu v-if="dingdanxiangqing.orderType==1 && dingdanxiangqing.typeOne!=3" /> -->
                <!-- 商品支付底部 -->
                <!-- <shangpingzhifu v-if="dingdanxiangqing.orderType==0 && dingdanxiangqing.typeOne!=3" /> -->
                <!-- 预定底部 -->
                <yddb v-show="dingdanxiangqing.state!=2 && dingdanxiangqing.state!=4"/>
            </div>
        </div>
        <!-- 省钱详情 -->
        <dikouxiangqing v-if="dingdanxiangqing.orderType==0" />
        
        <!-- <zhifuchenggong v-show="显示支付成功" /> -->
        <zhifuchenggong v-show="显示支付成功" />
        
        <!-- 自取取支付成功 -->
        <zfcgkpj v-show="显示支付成功不可评价" />

    </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import quhuoma from '@/components/orders/order/到店自取二维码.vue'
// 输入金额底部
import dangmianzhifu from "@/components/orders/order/dangmianzhifu.vue";
//订单详情
import dingdanxiangqing from "@/components/orders/order/dingdanxiangqing.vue";
//头部
import orderHeader from "@/components/orders/order/orderHeader.vue";
// 商品
import shangping from "@/components/orders/order/shangping.vue";
//商品支付底部
import shangpingzhifu from "@/components/orders/order/shangpingzhifu.vue";
//省钱详情
import dikouxiangqing from "@/components/orders/order/dikouxiangqing.vue";
import yddb from '@/components/orders/order/预定底部.vue';
import ydtb from "@/components/orders/order/预定头部.vue";
import ydbz from '@/components/orders/order/预定备注.vue';

import zhifuchenggong from "@/components/orders/order/支付成功.vue";
import zfcgkpj from "@/components/orders/order/支付成功可评价.vue";
export default {
    name: "ordersOrder",
    components: {
        orderHeader,
        dangmianzhifu,
        dingdanxiangqing,
        shangping,
        shangpingzhifu,
        dikouxiangqing,
        zhifuchenggong,
        quhuoma,
        zfcgkpj,
        yddb,
        ydtb,
        ydbz
    },
    data() {
        return {
            weixin: ""
        };
    },
    computed: {
        ...mapGetters({
            dingdanxiangqing: "orders/order/dingdanxiangqing", //订单基本信息
            显示支付成功: "orders/order/显示支付成功",
            显示取货二维码:'orders/order/显示取货二维码',
            显示支付成功不可评价:'orders/order/显示支付成功不可评价',
            预定订单:'orders/order/预定订单',
            定时器:'orders/order/定时器',
        })
    },
    methods: {
        ...mapActions({
            get_shop: "shop/get_shop", //查询店铺
            order_set_lsit: "orders/order/set_list",
            shoppingCopy: "orders/order/shoppingCopy", //调用支付接口
            set_orderid_openid: "orders/order/set_orderid_openid", //初始化 openid和 ordreId
            findShopOrdersById: "orders/order/findShopOrdersById", //订单详情
            获取支付通道: "app/支付/获取支付通道",
            查询店铺生成二维码:"orders/order/查询店铺生成二维码",
            查询预订订单:'orders/order/查询预订订单',
            支付定金:"orders/order/支付定金"
        }),
    },
    mounted() {
        this.获取支付通道()
        console.log(this.$route);
        console.log(this.$route.params.zhifu);
        if (this.$route.params.zhifu) {
            console.log("调用支付接口");
        }

        try {
            this.weixin = JSON.parse(localStorage.weixin);
        } catch (error) { }
        //调用支付接口
        var query = {
            ordreId: this.$route.query.ordreId,
            openid: this.weixin.openid
            // openid:'oBfSm1MUjRgdHwvS9pKzikrMXlYg'
        };
        //vuex  初始化 openid和 ordreId
        this.set_orderid_openid(query).then(x => {
            //查询订单详情
            this.findShopOrdersById().then(x => {
                console.log("订单详情", this.dingdanxiangqing);
                //预定
                if(this.dingdanxiangqing.typeOne==3){
                    this.查询预订订单().then(()=>{
                        if (this.$route.params.zhifu) {
                            if(this.预定订单.state==0){
                                this.支付定金()
                            }else if(this.dingdanxiangqing.state==3){
                                this.shoppingCopy();
                            }
                        }
                    })
                }else{
                    if (this.$route.params.zhifu) {
                        console.log('收到支付参数');
                        //支付
                        this.shoppingCopy();
                    }
                }
            });
        }).catch(err => { });
    },
    beforeDestroy: function () {
        try {
            clearInterval(this.定时器)
        } catch (error) {}
        // console.group('beforeDestroy 销毁前状态===============》');
    },

    
};
</script>

<style lang="scss" scoped>
.mui-content {
    display: flex;
    flex-direction: column;
}
.content_1 {
    flex-grow: 1;
    overflow: auto;
}
.footer_1 {
    flex-shrink: 0;
}
</style>
