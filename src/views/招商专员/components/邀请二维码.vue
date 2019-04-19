<template>
    <div>

        <div class="生成容器">
            <div class="content_1" ref="printMe">
                <div class="title_1">
                    <div class="img_box">
                        <img v-show="头像_base64" class="head_img" :src="头像_base64" alt="">
                        <img v-show="!头像_base64" class="head_img" :src="WechatIMG311" alt="">
                    </div>
                    <div class="text_box">
                        <div v-if="实名信息">{{实名信息.name}}</div>
                        <div v-if="!实名信息" class="userName">{{userInfo.nickname}}</div>
                        <div class="text">{{title}}</div>
                        <!-- <div class="text">邀请你成为红购招商专员</div> -->
                    </div>
                </div>
                <div class="erweima_box">
                    <div class="head_img">
                        <img v-show="头像_base64" class="" :src="头像_base64" alt="">
                        <img style="border-radius:100%;" v-show="!头像_base64" class="" :src="WechatIMG311" alt="">
                    </div>
                    <div ref="qrcode">
                    </div>
                </div>
                <div class="tishi">长按识别二维码，免费成为招商专员与代理商共享收益！</div>
            </div>
        </div>

        <div class="显示二维码容器" v-show="显示分享二维码">
            <div class="mask"></div>
            <div class="content_1">
                <div class="close_1">
                    <div @click="显示分享二维码=false"><i class="icon iconfont icon-quxiao"></i></div>
                    <div></div>
                </div>
                <img :src="分享_base64" @click="点击分享()">
                <div class="二维码提示" @click="点击分享()">
                    {{ApplicationType =='app' ? '点击分享' :"长按二维码，点击“发送给朋友”"}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { openloading } from "@/assets/js/currency.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";

import { mapGetters , mapActions } from "vuex";
export default {
    name:"",
    props:{
        url:{
            default:""
        },
        title:{
            default:""
        }
    },
    data() {
        return {
            WechatIMG311:WechatIMG311,
            ApplicationType:ApplicationType,
            显示分享二维码:false,
            头像_base64:'',
            分享_base64:"",
            userInfo:'',

        }
    },
    filters:{
        fliter_phone(phone) {
            if (!phone) return "";
            return phone.substring(0, 3) + "***" + phone.substring(phone.length - 3);
        },
    },
    computed: {
        ...mapGetters({
            实名信息:"实名认证/实名信息",
        })
    },
    methods: {
        ...mapActions({
            分享图片: 'app/分享/分享图片'
        }),
        显示分享(){
            // if (this.分享_base64) {
            //     this.显示分享二维码 = true;
            // } else {
                openloading(true);
                if (!this.userInfo.headImgUrl) {
                    this.生成二维码();
                } else {
                    this.$axios.post("/api-u/users/imgtobase64", this.$qs.stringify({ url: this.userInfo.headImgUrl })).then(x => {
                        if (x.data.code == 200) {
                            this.头像_base64 = "data:image/jpeg;base64," + x.data.data;
                            this.生成二维码();
                        } else {
                            openloading(false);
                            mui.toast("生成二维码失败，稍后再试。", { duration: "long", type: "div" });
                        }
                    }).catch(err => {
                        openloading(false);
                        mui.toast("网络错误，稍后再试。", { duration: "long", type: "div" });
                    });
                }
            // }
        },
        生成二维码() {
            // var url = 'http://m.lxad.vip/test/dist/index.html' + "#/zhuanyuan/shenqing?pid=" + this.userInfo.username;
            var url=this.url;
            console.log(url);
            var el = this.$refs.qrcode;
            el.innerHTML = "";
            let qrcode = new QRCode(el, {
                width: 200,
                height: 200, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
                text: url, // 二维码内容
                // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                background: "#fff",
                foreground: "#fff"
            });
            setTimeout(() => {
                this.生成截图();
            }, 500);
        },
        生成截图() {
            const el = this.$refs.printMe;
            const options = {
                useCORS: true,
                logging: false
            };
            html2canvas(el, options).then(canvas => {
                this.分享_base64 = canvas.toDataURL();
                this.显示分享二维码 = true;
                openloading(false);
            });
        },
        开始按下() {
            if (ApplicationType == 'app') {
                this.分享图片(this.分享_base64)
            }
        },

    },
    mounted() {
        this.userInfo=JSON.parse(localStorage.userInfo)
    },
    watch: {
        url(){
            this.分享_base64=''
        }
    },
}
</script>

<style lang="scss" scoped>

.生成容器 {
    position: absolute;
    bottom: 0px;
    left: -100%;
    .content_1 {
        position: relative;
        z-index: 1;
        background: #ffffff;
        width: 270px;
        padding: 17px 25px 15px 25px;
        .title_1 {
            display: flex;
            align-items: center;
            .img_box {
                width: 40px;
                height: 40px;
                margin: 0px 14px 0px 0px;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 100%;
                }
            }
            .userName {
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
            }
            .text {
                color: rgba(80, 80, 80, 1);
                font-size: 10px;
            }
        }
        .erweima_box {
            width: 200px;
            height: 200px;
            margin: 15px auto 0px;
            position: relative;
            div {
                width: 100%;
                height: 100%;
            }
            img {
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 0;
            }
            .head_img {
                position: absolute;
                width: 44px;
                height: 44px;
                border-radius: 10px;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                margin: auto;
                z-index: 1;
                background: #ffffff;
                padding: 2px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                    border: 1px solid #cccccc;
                }
            }
        }
        .tishi {
            color: rgba(166, 166, 166, 1);
            font-size: 12px;
            text-align: center;
            width: 200px;
            margin: 14px auto 0px;
        }
    }
}


.显示二维码容器 {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
    .mask {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
    }
    .content_1 {
        > img {
            width: 100%;
        }
        position: relative;
        z-index: 1;
        width: 270px;
        .二维码提示 {
            height: 35px;
            color: rgba(56, 56, 56, 1);
            background-color: rgba(255, 255, 255, 1);
            border-radius: 35px;
            font-size: 14px;
            text-align: center;
            margin: 14px 0px 0px;
            line-height: 35px;
        }
        // padding: 17px 25px 15px 25px;
        .close_1 {
            width: 36px;
            height: 50px;
            position: absolute;
            top: -50px;
            right: 0px;
            > div:nth-child(1) {
                height: 36px;
                text-align: center;
                line-height: 36px;
                background: #ffffff;
                border-radius: 100%;
                position: relative;
                z-index: 1;
            }
            > div:nth-child(2) {
                position: absolute;
                width: 1px;
                height: 100%;
                background: #ffffff;
                top: 0px;
                right: 0px;
                left: 0px;
                margin: 0px auto;
            }
        }
    }
}
</style>
