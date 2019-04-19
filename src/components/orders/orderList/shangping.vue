<template>
    <div class="box_2">
        <ul class="header">
            <li class="daipingjia mui-pull-right">
                <span class="红色字体" v-show="shangping.state==0">待付款</span>
                <span class="红色字体" v-show="shangping.state==3">待付尾款</span>
                <span v-show="shangping.state==2 || shangping.state==4">已取消</span>
                <span v-show="shangping.state==1 && !已取货">请到店取货</span>
                <span v-show="shangping.state==1 && 已取货">
                    <span v-if="已评价" >交易完成</span>
                    <span v-if="!已评价">待评价</span>
                </span>
            </li>
            <li class="shop">
                <i class="icon_shop icon iconfont icon-jinrudianpu"></i>
                <b @click="$router.push('/BusinessDetails?shopid='+shangping.shopid)">{{shangping.shopName}}</b>
                <!-- <i class="icon_right mui-icon mui-icon-arrowright"></i> -->
            </li>
        </ul>
        <ul class="shangpng" @click="xiangqing()">
            <li v-for="(item, index) in nuew_list" :key="index">
                <div class="img_box">
                    <img v-if="item.img.split(',').length>0" :src="item.img.split(',')[0]" alt="" srcset="">
                </div>
                <div class="text_box">
                    <div class="name">
                        {{item.name}}
                        <span class="数量 mui-pull-right">x{{item.number}}</span>
                    </div>
                    <div class="灰色字体">￥{{item.sellingPrice}}</div>
                    <div class="灰色字体">红包省{{item.deduction}}元</div>
                    <!-- <div v-show="item.state==0">可省：{{item.deduction}}元</div> -->
                    <!-- <div v-show="item.state!=0">红包省：{{item.dikou}}元</div> -->
                </div>
                <div class="zhuanxiang">
                    <img v-if="item.exclusive==1" src="image/xingren1.png" alt="" srcset="">
                    <img v-if="item.exclusive==2" src="image/shengri1.png" alt="" srcset="">
                </div>
            </li>
        </ul>
        <ul class="footer">
            <li class="text_1">{{shangping.shopOrderCommoditys.length}}件商品，{{ Math.round((shangping.paymentAmount+shangping.deduction)*100)/100 }}元，省{{shangping.deduction}}元</li>
            <!-- <li class="text_1" v-show="shangping.state==1">{{shangping.shopOrderCommoditys.length}}件商品，{{shangping.paymentAmount+shangping.deduction}}元，省{{shangping.deduction}}元</li> -->
            <li class="btn_1 quxiao" @click="取消()" v-if="shangping.state==0">取消</li>
            <li @click="zhifu()" class="btn_1 zhifu" v-show="shangping.state==0 || shangping.state==3">支付</li>
            <li class="btn_1 zhifu" v-show="shangping.state==1 && !已取货" @click="xiangqing()">自提码</span>
            <li class="btn_1 zhifu" v-if="shangping.state==1 && !已评价 && 已取货">
                <span v-if="!已评价" @click="$router.push('/my/pingjia/pingjia?orderid='+shangping.id)">评价</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        shangping: {
            default: {}
        }
    },
    name: "",
    data() {
        return {};
    },
    computed: {
        已评价(){
            var list = this.shangping.shopOrderCommoditys ? this.shangping.shopOrderCommoditys : [];
            var 未评价=list.find(x=>x.state==0);
            if(未评价){
                return false
            }else{
                return true
            }
        },
        已取货(){
            if(this.shangping.typeOne==2){
                return this.shangping.logstatus!=3
            }else{
                return true
            }
        },
        nuew_list() {
            var list = this.shangping.shopOrderCommoditys ? this.shangping.shopOrderCommoditys : [];
            var new_list = [];
            list.forEach(item => {
                let obj = new_list.find(x => x.commodityid == item.commodityid);
                if (obj) {
                    obj.number = obj.number + 1;
                    obj.dikou = obj.dikou + item.realDeduction;
                    if (item.exclusive) {
                        obj.exclusive = item.exclusive;
                    }
                } else {
                    item.number = 1;
                    item.dikou = item.realDeduction;
                    new_list.push(item);
                }
            });
            return new_list;
        }
    },
    methods: {
        ...mapActions({
            取消订单: "orders/orderList/取消订单"
        }),
        取消() {
            mui.confirm("确定要取消订单？", "提示", ["再想想", "是的"], val => {
                if (val.index == 1) {
                    this.取消订单(this.shangping);
                }
            }, "div");
        },
        //订单详情
        xiangqing() {
            this.$router.push("/orders/order?ordreId=" + this.shangping.id);
        },
        //支付
        zhifu() {
            console.log(123);
            this.$router.push({
                name: "ordersOrder",
                query: { ordreId: this.shangping.id },
                params: { zhifu: 1 }
            });
        }
    },
    mounted() {
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.box_2 {
    background: #ffffff;
    margin: 7px 7px 0px;
    padding: 5px 0px ;
    border-radius: 6px;
    .header {
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        padding: 0px 16px 0px 10px;
        height: 30px;
        line-height: 30px;
        .shop {
            display: flex;
            align-items: center;
            b{
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
            }
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
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            .红色字体{
                color: $header_background;
            }
        }
    }
    .shangpng {
        padding: 0px 16px 0px 10px;
        > li {
            padding: 7px 0px;
            display: flex;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            position: relative;
        }
        > li:last-child {
            border: none;
        }
        .img_box {
            flex-shrink: 0;
            width: 72px;
            height: 54px;
            margin: 0px 5px 0px 0px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
        }
        .text_box {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 12px;
            .灰色字体{
                color: rgba(128, 128, 128, 1);
            }
            .数量 {
                font-size: 14px;
                color: rgba(166, 166, 166, 1);
            }
        }
        .zhuanxiang {
            position: absolute;
            width: 20px;
            height: 20px;
            right: 0px;
            bottom: 7px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .footer {
        display: flex;
        align-items: center;
        height: 32px;
        padding: 0px 16px 0px 10px;
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
