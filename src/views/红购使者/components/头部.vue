<template>
    <div class="容器">
        <ul class="头部">
            <li class="头像">
                <img v-show="!userInfo || !userInfo.headImgUrl" :src="WechatIMG311" alt="">
                <img v-show="userInfo && userInfo.headImgUrl" :src="userInfo.headImgUrl" alt="">
            </li>
            <li class="内容">
                <div class="name">
                    <span v-if="userInfo && !实名信息">{{userInfo.nickname}}</span>
                    <span v-if="实名信息">{{实名信息.name}}</span>
                    <i  @click="erweima()" class="icon iconfont icon-31erweima"></i>
                </div>
                <div class="地区">{{代理区域}}</div>
            </li>
            <!-- <div class="赚外快" @click="$router.push('/shizhe/tuiguangzhuanqian?userid='+userid)"> -->
            <div class="赚外快" @click="$router.push('/agent/tghb?userid='+userid)">
                <div>
                    <i class="icon iconfont icon-haibaoshengcheng"></i>
                </div>
                <div>推广海报</div>
            </div>
        </ul>


        <!-- <fxewm ref="fxewm" :分享地址="分享地址" :userInfo="userInfo" :分享显示名称="(userInfo && !实名信息) ? userInfo.nickname : 实名信息.name"/> -->

        <ewm ref="ewm" :userInfo="userInfo" :shiming="实名信息"/>
        

    </div>
</template>

<script>
// import fxewm from '@/components/分享二维码/分享1.vue'
import ewm from '@/components/分享二维码/红购使者二维码.vue';

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import loading from "@/components/loading.vue";
import { mapGetters, mapActions } from "vuex";
import { dateFtt, openloading } from "@/assets/js/currency";

export default {
    name: "",
    data() {
        return {
            WechatIMG311:WechatIMG311,
        };
    },
    components:{
        // fxewm,
        ewm
    },
    computed: {
        ...mapGetters({
            userid:'红购使者/红购使者/userid',
            红购使者信息: "红购使者/红购使者/红购使者信息",
            // 代理人信息: "agent/代理人信息",
            实名信息: "红购使者/红购使者/实名信息",
            userInfo:'红购使者/红购使者/用户信息'
        }),
        代理区域() {
            var list = [];
            if (this.红购使者信息.areaCode) {
                list = this.$store.getters.filter_area(this.红购使者信息.areaCode);
            }
            var str = "";
            list.forEach(item => {
                str += item.name + "/";
            });
            return str.substring(0, str.length - 1);
        },
        分享地址(){
            var url="";
            if(this.userInfo){
                url = 'http://m.lxad.vip/test/dist/index.html' +"#/BeInvited?pid=" +this.userInfo.username ;
            }
            return url
        }
    },
    methods: {
        ...mapActions({
            获取认证: "红购使者/红购使者/获取实名信息",
        }),
        erweima() {
            // this.$refs.fxewm.显示二维码()
            this.$refs.ewm.显示二维码();
        }
    },
    mounted() {
        
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.容器 {
    margin: 0px 0px 4px 0px;
}
.头部 {
    display: flex;
    background: #ffffff;
    padding: 10px 12px;
    .头像 {
        width: 44px;
        height: 44px;
        margin: 0px 7px 0px 0px;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 100%;
        }
    }
    .内容 {
        width: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .name {
            display: flex;
            align-items: center;
            span {
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
                font-weight: bold;
                margin: 0px 13px 0px 0px;
            }
            i {
                color: #747870;
                font-size: 18px;
                height: 18px;
            }
        }
        .地区 {
            color: rgba(128, 128, 128, 1);
            font-size: 10px;
            padding: 0px 10px 0px 0px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .赚外快 {
        flex-shrink: 0;
        text-align: center;
        > div:nth-child(1) {
            font-size: 22px;
            color: $header_background;
        }
        > div:nth-child(2) {
            // color: rgba(42, 130, 228, 1);
            color: rgba(128, 128, 128, 1);
            font-size: 10px;
        }
    }
}

</style>
