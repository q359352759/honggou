<template>
    <div class="转外快">
        <div class="背景">
            <img src="image/zhuanwaikuai.png" alt="" srcset="">
            <div class="内容">
                <ul class="介绍">
                    <li>
                        <div class="icon_box">
                            <i class="icon iconfont icon-fensi"></i>
                        </div>
                        <div class="text_1">推广会员</div>
                        <div class="text_1">可赚取10000元奖金</div>
                        <div class="text_2 margin_8">每邀请一个会员</div>
                        <div class="text_2">注册奖励10元分润</div>
                    </li>
                    <li>
                        <div class="icon_box">
                            <i class="icon iconfont icon-jinrudianpu"></i>
                        </div>
                        <div class="text_1">推广商家</div>
                        <div class="text_1">可赚取30000元奖金</div>
                        <div class="text_2 margin_8">每邀请一个商家</div>
                        <div class="text_2">入驻奖励1千~5千元分润</div>
                    </li>
                </ul>
                <div class="介绍1">邀请身边的朋友一起来赚外快!</div>
                <div class="按钮" @click="erweima()">马上邀请</div>
                <div class="赚钱秘籍">
                    <span @click="$router.push('/shizhe/zhuanqianmiji')">《赚钱秘籍》</span>
                </div>
            </div>
        </div>
        <ewm ref="ewm" :userInfo="userInfo" :shiming="实名信息"/>
    </div>
</template>

<script>

import ewm from '@/components/分享二维码/红购使者二维码.vue';

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import loading from "@/components/loading.vue";
import { mapGetters, mapActions } from "vuex";
import { dateFtt, openloading } from "@/assets/js/currency";
export default {
    name:"",
    data() {
        return {
            
        }
    },
    components:{
        ewm
    },
    computed: {
        ...mapGetters({
            实名信息: "红购使者/红购使者/实名信息",
            userInfo:'红购使者/红购使者/用户信息'
        })
    },
    methods: {
        erweima() {
            // this.$refs.fxewm.显示二维码()
            this.$refs.ewm.显示二维码();
        }  
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.转外快{
    .背景{
        position: relative;
        width: 302px;
        height: 435px;
        margin: 16px auto 14px;
        >img{
            width: 100%;
        }
    }
    .内容{
        position: absolute;
        width: 100%;
        top: 183px;
        left: 0px;
    }
    .介绍 {
        display: flex;
        text-align: center;
        color: #ffffff;
        padding: 0px 20px;
        > li {
            width: 50%;
        }
        .icon_box {
            i {
                font-size: 40px;
                line-height: 40px;
            }
        }
        .text_1 {
            font-size: 12px;
        }
        .text_2 {
            font-size: 10px;
        }
        .margin_8 {
            margin: 8px 0px 0px;
        }
    }
    .介绍1{
        margin: 29px 0px 15px;
        color: rgba(255, 255, 255, 1);
        font-size: 10px;
        text-align: center;
    }
    .按钮{
        width: 100px;
    	height: 28px;
        text-align: center;
        line-height: 28px;
        margin: 0px auto;
        font-size: 14px;
        color: $header_background;
        background: #ffffff;
        box-shadow: 0px 0px 2px 1px #ffffff;
        border-radius: 28px;
    }
    .赚钱秘籍{
        margin: 10px 0px 0px;
        text-align: center;
        color: rgba(255, 235, 59, 1);
    	font-size: 12px;
    }
}
</style>
