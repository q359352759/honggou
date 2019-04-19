<template>
    <div>
        <ul class="招商收益 定位" v-show="是否定位">
            <li class="header_1">
                <div><span>代理商</span></div>
                <div><span>区域</span></div>
                <div><span>日期</span></div>
                <div><span>可得分红</span></div>
                <div><span>代理商收益</span></div>
                <div><span>已得分红</span></div>
            </li>
        </ul>
        <ul class="招商收益">
            <li class="header_1">
                <div><span>代理商</span></div>
                <div><span>区域</span></div>
                <div><span>日期</span></div>
                <div><span>可得分红</span></div>
                <div><span>代理商收益</span></div>
                <div><span>已得分红</span></div>
            </li>
            <li v-for="(item, index) in 0" :key="index">
                <div><span>张三</span></div>
                <div class="地址"><span>四川省/成都市/武侯区</span></div>
                <div><span>2018.11.10</span></div>
                <div><span>20000000000</span></div>
                <div><span>15000</span></div>
                <div><span>22000</span></div>
            </li>
        </ul>
        
        <loading :nodata="true"/>
    </div>
</template>

<script>
import loading from '@/components/loading.vue';
import { mapGetters } from "vuex";
export default {
    name:"",
    components:{
        loading
    },
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            是否定位:'招商专员/招商管理/是否定位'
        })
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.招商收益.定位{
    position: fixed;
    top: 44px;
    left: 0px;
    width: 100%;
}
.招商收益{
    li{
        font-size: 10px;
        color: #000000;
        display: flex;
        min-height: 32px;
        div{
            width: calc(100% / 6);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-left: 1px solid #F6F6F6;
            padding: 3px 0px;
        }
        div:not(.地址){
            span{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        >div:nth-child(1){
            border-left: none;
        }
    }
    .header_1{
        background: $header_background;
        color: #ffffff;
    }
    >li:nth-child(2n){
        // background: #F0F0F0;
        background: #ffffff;
    }
}
</style>
