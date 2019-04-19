<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">我的订单</h1>
            <span @click="搜索()">
                <i class="icon iconfont icon-chazhao"></i>
            </span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="box_1">
                <li>
                    <span @click="设置类型(0)" :class="{'active':查看类型==0}">全部</span>
                </li>
                <li>
                    <span @click="设置类型(1)" :class="{'active':查看类型==1}">待付款</span>
                </li>
                <li>
                    <span @click="设置类型(2)" :class="{'active':查看类型==2}">待发货</span>
                </li>
                <li>
                    <span @click="设置类型(3)" :class="{'active':查看类型==3}">待收货</span>
                </li>
                <li>
                    <span @click="设置类型(4)" :class="{'active':查看类型==4}">待评价</span>
                </li>
                <li>
                    <span @click="设置类型(5)" :class="{'active':查看类型==5}">售后</span>
                </li>
            </ul>
            <div class="content_1" @scroll="scroll($event)">
                <!-- 全部 -->
                <div v-show="查看类型==0">
                    <div v-for="(item, index) in list_all.list" :key="index">
                        <shangping v-if="item.orderType==0" :shangping="item" />
                        <xianjin v-if="item.orderType==1" :dingdan="item" />
                    </div>
                    <loading :loadingtype="list_all.loading" :nodata="!list_all.loading && list_all.total==0" :end="!list_all.loading && list_all.total!=0 && list_all.total==list_all.list.length" />
                </div>
                <!-- 待付款 -->
                <div v-show="查看类型==1">
                    <div v-for="(item, index) in list_0.list" :key="index">
                        <shangping v-if="item.orderType==0" :shangping="item" />
                        <xianjin v-if="item.orderType==1" :dingdan="item" />
                    </div>
                    <loading :loadingtype="list_0.loading" :nodata="!list_0.loading && list_0.total==0" :end="!list_0.loading && list_0.total!=0 && list_0.total==list_0.list.length" />
                </div>

                <!-- 待发货 -->
                <div v-show="查看类型==2">
                    <loading :nodata="true" />                    
                </div>
                <!-- 待收货 -->
                <div v-show="查看类型==3">
                    <div v-for="(item, index) in 待取货.list" :key="index">
                        <shangping v-if="item.orderType==0" :shangping="item" />
                        <!-- <xianjin v-if="item.orderType==1" :dingdan="item" /> -->
                    </div>
                    <loading :loadingtype="待取货.loading" :nodata="!待取货.loading && 待取货.total==0" :end="!待取货.loading && 待取货.total!=0 && 待取货.total==待取货.list.length" />
                </div>
                <!-- 待评价 -->
                <div v-show="查看类型==4">
                    <div v-for="(item, index) in 待评价.list" :key="index">
                        <daipingjiaShangping v-if="item.orderType==0" :shangping="item" />
                        <daipingjiaXianjing v-if="item.orderType==1" :dingdan="item" />
                    </div>
                    <loading :loadingtype="待评价.loading" :nodata="!待评价.loading && 待评价.total==0" :end="!待评价.loading && 待评价.total!=0 && 待评价.total==待评价.list.length" />
                </div>
                <!-- 售后 -->
                <div v-show="查看类型==5">
                    <loading :nodata="true" />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 商品订单
import shangping from "@/components/orders/orderList/shangping.vue";
// 输入金额订单
import xianjin from "@/components/orders/orderList/xianjin.vue";

import daipingjiaShangping from './components/待评论商品.vue';
import daipingjiaXianjing from './components/待评论现金支付.vue';

import loading from "@/components/loading.vue";
export default {
    name: "",
    components: {
        shangping,
        xianjin,
        loading,
        daipingjiaShangping,
        daipingjiaXianjing
    },
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters({
            list_all: "orders/orderList/list_all", //全部
            list_0: "orders/orderList/list_0", //待支付
            待取货: "orders/orderList/待取货",
            待评价: "orders/orderList/待评价",   //带评价
            查看类型:'orders/orderList/查看类型'
        })
    },
    methods: {
        ...mapActions({
            get_orderList: "orders/orderList/get_orderList",
            init_state: "orders/orderList/init_state",
            查询待评价订单:'orders/orderList/查询待评价订单',
            待评价下一页:'orders/orderList/待评价下一页',
            设置类型:'orders/orderList/设置类型',
            重置搜索数据:'orders/订单搜索记录/重置数据',
        }),
        搜索(){
            this.重置搜索数据();
            this.$router.push('/orders/sousuo')
        },
        order() {
            this.$router.push("/orders/order");
        },
        //下拉加载
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            // console.log(e)
            if (h + t >= sh - 10) {
                // 查看类型:0, //0 全部 1 待付款 2 待发货 3 待收货 4 待评价 5 售后
                if (this.查看类型 == 0 && !this.list_all.loading && this.list_all.list.length < this.list_all.total) {
                    this.get_orderList([this.list_all, true]);
                } else if ( this.查看类型 == 1 && !this.list_0.loading && this.list_0.list.length < this.list_0.total) {
                    this.get_orderList([this.list_0, true]);
                } else if (this.查看类型 == 2) {
                    
                } else if (this.查看类型 == 3) {
                    if(!this.待取货.loading && this.待取货.list.length<this.待取货.total){
                        this.get_orderList([this.待取货,true]);
                    }
                } else if (this.查看类型 == 4 && !this.待评价.loading && this.待评价.list.length < this.待评价.total) {
                    this.待评价下一页()
                } else {
                }

                // this.butie.page_index++;
                // //查看下级带来的收益
                // this.subsidies();
            }
        }
    },
    mounted() {
        this.init_state().then(() => {
            this.get_orderList([this.list_all, false]);
            this.get_orderList([this.list_0, false]);
            this.get_orderList([this.待取货,false])
            this.查询待评价订单();
        });
        
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.mui-bar{
    span{
        padding: 0px 14px;
        font-size: 20px;
        line-height: 44px;
        color: #ffffff;
        position: absolute;
        top: 0px;
        right: 0px;
    }
}
.mui-content {
    display: flex;
    flex-direction: column;
    .box_1 {
        flex-shrink: 0;
    }
    .content_1 {
        flex-grow: 1;
        overflow: auto;
    }
}
.box_1 {
    display: flex;
    text-align: center;
    line-height: 38px;
    background: #ffffff;
    background-color: rgba(255, 255, 255, 1);
    font-size: 14px;
    > li {
        width: calc(100% / 6);
    }
    span {
        display: inline-block;
        padding: 0px 3px;
    }
    span.active {
        border-bottom: 2px solid $header_background;
    }
}

</style>
