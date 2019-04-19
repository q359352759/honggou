<template>
    <ul class="预定头部">
        <li>
            <span>请在</span><b class="红色字体">{{预定订单.reservationtime | 时间格式化}}</b><span>到店消费</span>
        </li>
        <li>
            <span>地址：{{店铺信息 ? 店铺信息.address : ''}}</span>
            <span class="红色字体">{{店铺距离}}</span>
            <i @click="导航()" class="icon iconfont icon-daohang"></i>
        </li>
    </ul>
</template>

<script>
import { dateFtt } from "@/assets/js/currency.js";
import { 跳转地图 } from "@/assets/js/跳转地图.js";
import { mapGetters } from 'vuex';
export default {
    name:"",
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            预定订单:'orders/order/预定订单',
            店铺信息:"orders/order/店铺信息",
            店铺距离:"orders/order/店铺距离",
            当前位置:'当前位置',
        }),
    },
    filters:{
        时间格式化(time){
            if(!time) return '';
            return dateFtt(time,'yyyy-MM-dd hh:mm')
        }
    },
    methods: {
        导航(){
            跳转地图(this.当前位置,this.店铺信息,this.店铺信息.name,this.店铺信息.address)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.预定头部{
    background: #ffffff;
    margin: 0px 0px 3px 0px;
    padding: 10px 10px;
    font-size: 12px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    li{
        display: flex;
        align-items: center;
    }
    .红色字体{
        color:$header_background;
        margin: 0px 5px;
    }
    .icon-daohang{
        font-size: 16px;
        line-height: 16px;
        height: 16px;
        color: $header_background;
    }
}
</style>
