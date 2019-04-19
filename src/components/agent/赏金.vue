<template>
    <div class="赏金">
        <ul class="List">
            <li class="hader_1" :class="{'active':fixed}">
                <div>商家</div>
                <div>商品</div>
                <div>剩余</div>
                <div>结束时间</div>
                <div>赏金</div>
                <div>操作</div>
            </li>
            <li v-for="(item, index) in 奖赏所有数据.奖赏商品.list" :key="index" >
                <div><div>{{item.店铺 ? item.店铺.name : ""}}</div></div>
                <div><div>{{item.商品 ? item.商品.name : ""}}</div></div>
                <div><div>{{item.surplusrewardnum}}</div></div>
                <div><div>{{item.expirationtime | filter_time('yyyy.MM.dd')}}</div></div>
                <div><div>{{item.firstrewardamount}}-{{item.generalrewardamount}}元</div></div>
                <div class="蓝色字体"><div @click="赚赏金(item)">赚赏金</div></div>
            </li>
        </ul>
        <loading :loadingtype="奖赏所有数据.奖赏商品.loading" :end="!奖赏所有数据.奖赏商品.loading && 奖赏所有数据.奖赏商品.total!=0 &&  奖赏所有数据.奖赏商品.list.length>=奖赏所有数据.奖赏商品.total" :nodata="!奖赏所有数据.奖赏商品.loading && 奖赏所有数据.奖赏商品.total==0"/>

        <ul class="footer_1">
            <li>获得奖赏：{{奖赏所有数据.奖赏收益.amount}}元</li>
            <li>
                <span @click="$router.push('/shizhe/xxjj?userid='+userid)">奖赏记录</span>
            </li>
        </ul>

        <spewm :shop="待生成二维码商品.店铺" :commodity="待生成二维码商品.商品" :专享="待生成二维码商品.专享" :分享者id="奖赏所有数据.代理商.userid" ref="spewm"/>
    </div>
</template>

<script>
import { dateFtt } from "@/assets/js/currency";
import { b64DecodeUnicode } from "@/assets/js/base64jiema";

import { mapGetters, mapActions } from "vuex";
import loading from "@/components/loading.vue";
import spewm from '@/components/分享二维码/商品二维码.vue';
export default {
    name: "",
    components: {
        loading,
        spewm
    },
    props: {
        fixed: {
            define: false
        },
        userid:''
    },
    data() {
        return {
            待生成二维码商品:{}
        }
    },
    // yyyy.MM.dd hh:mm
    filters: {
        filter_time(time, type) {
            if (!time) return time;
            return dateFtt(time, type);
        },
        // 名字转Base64
        filteer_name(name) {
            try {
                name = b64DecodeUnicode(name);
            } catch (error) { }
            return name;
        }
    },
    computed: {
        ...mapGetters({
            奖赏所有数据:"agent/奖赏/奖赏所有数据"
        })
    },
    methods: {
        赚赏金(item){
            if(!item.专享 || !item.商品 || !item.店铺){
                mui.toast("正在获取（专享，商品,店铺）等信息，稍后再试。", {duration: "long",type: "div"});
            }else{
                this.待生成二维码商品=item;
                this.$refs.spewm.qrcode='';
                this.$refs.spewm.显示二维码()
            }
        }
    },
    mounted() {
        // await
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.赏金 {
    padding: 0px 0px 50px;
}
.Header_1 {
    margin: 3px 0px 0px;
    line-height: 34px;
    display: flex;
    background: #ffffff;
    li {
        width: 100%;
        text-align: center;
        font-size: 14px;
        span {
            display: inline-block;
            padding: 0px 10px;
        }
    }
    .active {
        span {
            border-bottom: 2px solid $header_background;
        }
    }
}
.List {
    padding: 30px 0px 0px;
    margin: 3px 0px 0px;
    position: relative;
    li {
        display: flex;
        text-align: center;
        min-height: 30px;
        font-size: 10px;
        white-space: nowrap;
        > div {
            width: calc(100% / 6);
            overflow: hidden;
            text-overflow: ellipsis;
            border-left: 1px solid #f6f6f6;
            display: flex;
            justify-content: center;
            flex-direction: column;
            > div {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        > div:nth-child(1) {
            border: none;
        }
    }
    .hader_1.active {
        position: fixed;
        top: 44px;
    }
    .hader_1 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        color: #ffffff;
        background: $header_background;
    }
    li:nth-child(2n-1):not(.hader_1) {
        background: #f0f0f0;
    }
    li:nth-child(2n) {
        background: #ffffff;
    }
    .蓝色字体 {
        color: #2a82e4;
    }
}

.footer_1 {
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    display: flex;
    background: $header_background;
    color: rgba(255, 255, 255, 1);
    font-size: 11px;
    line-height: 32px;
    > li {
        width: 50%;
        text-align: center;
    }
}
</style>
