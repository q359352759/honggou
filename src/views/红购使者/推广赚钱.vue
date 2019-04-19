<template>
    <div class="推广赚钱">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">推广赚钱</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="红包">
                <img src="image/honggou4.png" class="背景" alt="" srcset="">
                <img src="image/honggou5.png" @click="邀请好友()" class="按钮" alt="" srcset="">
                <div class="秘籍">
                    <span @click="$router.push('/shizhe/zhuanqianmiji')">《赚钱秘籍》</span>
                </div>
            </div>
            <ul class="介绍">
                <li>
                    <div class="icon_box">
                        <i class="icon iconfont icon-fensi"></i>
                    </div>
                    <div class="text_1">推广会员</div>
                    <div class="text_1">可赚取10000元奖金!!!</div>
                    <div class="text_2 margin_8">每邀请一个会员</div>
                    <div class="text_2">注册奖励10元分润</div>
                </li>
                <li>
                    <div class="icon_box">
                        <i class="icon iconfont icon-jinrudianpu"></i>
                    </div>
                    <div class="text_1">推广商家</div>
                    <div class="text_1">可赚取30000元奖金!!!</div>
                    <div class="text_2 margin_8">每邀请一个商家</div>
                    <div class="text_2">入驻奖励1000~5000元分润</div>
                </li>
            </ul>

        </div>

        <ewm ref="ewm" :userInfo="userInfo" :shiming="实名信息"/>
    </div>
</template>

<script>
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { openloading } from "@/assets/js/currency.js";

import ewm from '@/components/分享二维码/红购使者二维码.vue';

import { mapActions, mapGetters } from "vuex";
export default {
    name: "",
    data() {
        return {
            ApplicationType:ApplicationType,
            userid:'',
            userInfo: "",
            是否分享: false,
            头像base64: "",
            截图地址: "",
            实名信息:"",
            WechatIMG311:WechatIMG311
        };
    },
    components:{
        ewm
    },
    computed: {
    },
    methods: {
        ...mapActions({
            分享图片: 'app/分享/分享图片'
        }),
        开始按下(){
            if (ApplicationType == 'app') {
                this.分享图片(this.截图地址)
            }
        },
        邀请好友() {
            this.$refs.ewm.显示二维码();
        },
    },
    mounted() {
        if(this.$route.query.userid){
            this.userid=this.$route.query.userid;
            console.log('存在')
        }else{
            console.log('不纯在')
            try {
                var userInfo=JSON.parse(localStorage.userInfo);
                this.userid=userInfo.username
            } catch (error) {
                console.log(error)
            }
        }
        openloading(true)
        Promise.all([api_获取实名信息(this.userid),api_通过username查询用户(this.userid)]).then(x=>{
            console.log(x);
            if(x[0].data.code==200){
                this.实名信息=x[0].data.data;
            }
            if(x[1].data.code==200){
                var 用户信息=x[1].data.data;
                try {
                    用户信息.nickname=b64DecodeUnicode(用户信息.nickname);
                } catch (error) {
                }
                this.userInfo=用户信息
            }
            openloading(false)
        }).catch(err=>{

        })


        

    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.推广赚钱 {
    background: $header_background;
    height: 100%;
}
.mui-bar {
    background: none;
    box-shadow: none;
}
.mui-content {
    background: none;
}
.红包 {
    width: 2.66rem;
    height: 3.6rem;
    margin: 0px auto;
    position: relative;
    .背景 {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .按钮 {
        position: absolute;
        top: 2.3rem;
        width: 1rem;
        left: 0px;
        right: 0px;
        margin: auto;
    }
    .秘籍 {
        position: absolute;
        width: 100%;
        left: 0px;
        bottom: 44px;
        text-align: center;
        color: rgba(255, 235, 59, 1);
        font-size: 12px;
    }
}

.介绍 {
    display: flex;
    text-align: center;
    color: #ffffff;
    margin: 38px 0px 50px 0px;
    > li {
        width: 50%;
    }
    .icon_box {
        margin: 0px 0px 13px;
        i {
            font-size: 40px;
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

</style>
