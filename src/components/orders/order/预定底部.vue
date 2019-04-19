<template>
    <div class="预定底部">
        <div class="金额信息">
            <span v-if="订单详情.typeOne!=3 && 订单详情.state==0">实付：<b>{{订单详情.paymentAmount}}</b></span>
            <span v-if="订单详情.typeOne==3 && 订单详情.state==3">尾款：<b>{{剩余尾款}}</b></span>
        </div>
        <ul>

            <li class="灰色按钮" v-if="订单详情.typeOne==3 && 订单详情.state!=1" @click="取消()">取 消</li>
            <li class="蓝色按钮" @click="支付定金()" v-if="预定订单 && 预定订单.state==0">付订金</li>
            <li class="蓝色按钮" v-if="预定订单 && 预定订单.state!=0 && 订单详情.state==3" @click="支付订单金额()">支付尾款</li>

            <!-- 现金支付 -->
            <li v-show="订单详情.state==0 && 订单详情.typeOne!=3" @click="zhifu()" class="蓝色按钮">支付</li>
            <li class="蓝色按钮" v-if="订单详情.state==1 && 订单详情.orderType==1 && 已评价" @click="$router.push('/my/pingjia/xiangqing?ordersid='+订单详情.ordersid+'&id='+订单详情.id)">我的评价</li>
            <li class="蓝色按钮" v-if="订单详情.state==1 && 订单详情.orderType==1 && !已评价"  @click="$router.push('/my/pingjia/xianjinPingjia?orderid='+订单详情.id)">评价</li>

            <!-- 商品购买 -->
            <li class="蓝色按钮" v-if="订单详情.state==1 && 订单详情.orderType==0 && 已评价 && 已取货" @click="$router.push('/my/pingjia/xiangqing?ordersid='+订单详情.ordersid+'&id='+订单详情.id)">我的评价</li>
            <li class="蓝色按钮" v-if="订单详情.state==1 && 订单详情.orderType==0 && !已评价 && 已取货"  @click="$router.push('/my/pingjia/pingjia?orderid='+订单详情.id)">评价</li>

        </ul>
    </div>
    
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { api_取消订单 } from "@/api/订单接口.js";
import { api_修改预定订单 } from "@/api/预定接口.js";
import { openloading } from "@/assets/js/currency.js";
export default {
    name:"",
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            预定订单:"orders/order/预定订单",
            订单详情:"orders/order/dingdanxiangqing",
            已评价:'orders/order/已评价',
            已取货:'orders/order/已取货',
        }),
        剩余尾款(){
            var 剩余尾款=0;
                剩余尾款 = this.订单详情.paymentAmount - this.预定订单.deposit;
            return Math.round(剩余尾款*100)/100 ;
        }
    },
    methods: {
        ...mapActions({
            支付定金:"orders/order/支付定金",
            支付订单金额:"orders/order/shoppingCopy",
            查询预订订单:"orders/order/查询预订订单",
            findShopOrdersById:"orders/order/findShopOrdersById"
        }),
        zhifu(){
            this.支付订单金额();
        },
        取消(){
            if(this.预定订单.state==0){
                mui.confirm('您确定要取消预订吗','提示',['再想想','取消订单'],value=>{
                    if(value.index==1){
                        this.确定取消()
                    }
                })
            }else{
                mui.confirm('您确定要取消预订吗，取消不退还订金',['再想想','取消订单'],value=>{
                    if(value.index==1){
                        this.确定取消()
                    }
                })
            }
        },
        确定取消(){
            openloading(true)
            var 订单详情=Object.assign({},this.订单详情);
                if(this.预定订单.state==0){
                    订单详情.state=2
                }else{
                    订单详情.state=4
                }
            var 预定订单=Object.assign({},this.预定订单);
                预定订单.state=2
            Promise.all([
                api_取消订单(订单详情),
                api_修改预定订单(预定订单)
            ]).then(x=>{
                openloading(false);
                if(x[0].data.code==200 && x[1].data.code==200){
                    mui.toast("取消成功", { duration: 2000, type: "div" });
                }else{
                    if(x[0].data.code!=200){
                        mui.alert(x[0].data.msg ? x[0].data.msg : x[0].data.message, "提示", "我知道了", function () { }, "div");
                    }
                    if(x[1].data.code!=200){
                        mui.alert(x[1].data.msg ? x[1].data.msg : x[1].data.message, "提示", "我知道了", function () { }, "div");
                    }
                }
                this.查询预订订单();
                this.findShopOrdersById();
            }).catch(err=>{
                openloading(false);
                mui.toast("系统错误稍后再试", { duration: "long", type: "div" });
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.预定底部{
    height: 44px;
    background: #ffffff;
    display: flex;
    padding: 0px 18px;
    align-items: center;
    .金额信息{
        flex-grow: 1;
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        b{
            color: $header_background
        }
    }
    ul{
        display: flex;
    }
    li{
        margin: 0px 0px 0px 22px;
        width: 68px;
    	height: 24px;
        text-align: center;
        font-size: 12px;
        border-radius: 24px;
        line-height: 22px;
    }
    .灰色按钮{
        border:1px solid  rgba(128, 128, 128, 1);
        color:  rgba(128, 128, 128, 1);;
    }
    .蓝色按钮{
        color: rgba(0, 122, 255, 1);
        border: 1px solid rgba(0, 122, 255, 1);
    }
}
</style>
