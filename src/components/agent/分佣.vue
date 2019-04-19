<template>
    <div class="赏金">
        <ul class="List">
            <li class="hader_1" :class="{'active':fixed}">
                <div>客户</div>
                <div>商家</div>
                <div>订单</div>
                <div>时间</div>
                <div>佣金</div>
            </li>
            <li v-for="(item, index) in 0" :key="index" >
                <div>客户</div>
                <div class="蓝色字体">商家</div>
                <div>订单</div>
                <div>时间</div>
                <div>佣金</div>
            </li>
        </ul>
        <loading :nodata="true"/>

        <ul class="footer_1">
            <li>会员：0人</li>
            <li>
                总分佣：0元
            </li>
        </ul>

    </div>
</template>

<script>
import { dateFtt } from "@/assets/js/currency";
import { b64DecodeUnicode } from "@/assets/js/base64jiema";

import { mapGetters, mapActions } from "vuex";
import loading from "@/components/loading.vue";
export default {
    name: "",
    components: {
        loading
    },
    props: {
        fixed: {
            define: false
        },
        userInfo:{
            userInfo:()=>{}
        }
    },
    data() {
        return {};
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
        
    },
    methods: {
        
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
        font-size: 12px;
        white-space: nowrap;
        > div {
            width: calc(100% / 3);
            overflow: hidden;
            text-overflow: ellipsis;
            border-left: 1px solid #f6f6f6;
            display: flex;
            justify-content: center;
            flex-direction: column;
            > div {
                width: 100%;
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
