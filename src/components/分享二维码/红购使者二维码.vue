<template>
    <div>
        <div class="生成容器" ref="printMe">
            <div class="标题">
                <div class="标题1">
                    <span v-if="userInfo && !shiming">{{userInfo.nickname}}</span>
                    <span v-if="shiming">{{shiming.name}}</span>
                    <span>邀你来赚取</span>
                    <span class="钱">4万</span>
                    <span>元外快</span>
                </div>
                <div class="半圆"></div>
            </div>
            <div class="提示">免费注册、免费成为“红购使者”</div>
            <div class="提示">有分红、有奖赏，全民齐参与</div>
            <div class="图片容器">
                <div class="二维码容器" ref="二维码容器">
                    <img src="image/43.png" alt="" srcset="">
                </div>
                <div class="头像">
                    <img v-if="头像base64" :src="头像base64" alt="" srcset="">
                    <!-- <img v-if="!头像base64" src="image/WechatIMG311.png" alt="" srcset=""> -->
                    <img v-if="!头像base64" :src="WechatIMG311" alt="" srcset="">
                    
                </div>
            </div>
            <div class="半圆图片">
                <img :src="honggou6_base64" alt="" srcset="">
            </div>
            <div class="文本1">红购，一个专注省钱的消费平台</div>
        </div>

        <div class="分享显示框" v-show="是否分享">
            <div class="内容">
                <div class="关闭" @click="是否分享=false">
                    <i class="icon iconfont icon-quxiao"></i>
                </div>
                <div class="图片容器" @click="开始按下()">
                    <img :src="截图地址" alt="" srcset="">
                </div>
                <div class="文本" @click="开始按下()">{{ApplicationType =='app' ? '点击分享' :"长按二维码，点击“发送给朋友”"}}</div>
            </div>
        </div>
    </div>
</template>

<script>

import { openloading } from "@/assets/js/currency.js";

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";

import {红购二维码半圆} from '@/assets/image_base64/红购二维码.js'
import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'
import { mapActions } from "vuex";
export default {
    name:"",
    props:{
        userInfo:{
            default:()=>{}
        },
        shiming:"",


    },
    data() {
        return {
            ApplicationType:ApplicationType,
            是否分享:false,
            截图地址:"",
            头像base64:"",
            honggou6_base64:红购二维码半圆,
            WechatIMG311:WechatIMG311
        }
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
        显示二维码() {
            if (this.截图地址) {
                this.是否分享 = true;
            } else {
                openloading(true);
                console.log('没有现有图片开始生成');
                Promise.all([this.生成二维码(), this.生成头像()]).then(x => {
                    console.log('二维码和图像生成完成，开始截图')
                    setTimeout(()=>{
                        this.截图();
                    },300)
                }).catch(err => {
                    openloading(false);
                    mui.toast("生成二维码失败，稍后再试。", {duration: "long",type: "div"});
                });
            }
        },
        // http://m.lxad.vip/test/dist/index.html#/BeInvited?pid=A57877B220D6134FC6A15A2924E19908
        生成二维码() {
            return new Promise((resolve, reject) => {
                var url = 'http://m.lxad.vip/test/dist/index.html' + "#/BeInvited?pid=" + this.userInfo.username;
                console.log("二维码地址:"+url);
                var el = this.$refs.二维码容器;
                el.innerHTML = "";
                let qrcode = new QRCode(el, {
                    width: 200,
                    height: 200,    // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
                    text: url,      // 二维码内容
                    // render: 'canvas'     // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    background: "#fff",
                    foreground: "#fff"
                });
                setTimeout(() => {
                    el.querySelector("img").style.width = "100%";
                    resolve();
                }, 300);
            });
        },
        生成头像() {
            console.log('网络头像转base64:'+this.userInfo.headImgUrl)
            return new Promise((resolve, reject) => {
                this.$axios.post("/api-u/users/imgtobase64", this.$qs.stringify({ url: this.userInfo.headImgUrl })).then(x => {
                    if (x.data.code == 200) {
                        this.头像base64 = "data:image/jpeg;base64," + x.data.data;
                        resolve();
                    } else {
                        reject();
                    }
                }).catch(err => {
                    reject();
                });
            });
        },
        截图() {
            var el = this.$refs.printMe;
            const options = {
                useCORS: true,
                logging: false,
                scale:2
            };
            html2canvas(el, options).then(canvas => {
                this.截图地址 = canvas.toDataURL();
                this.是否分享 = true;
                openloading(false);
            }).catch(err=>{
                openloading(false);
            })
        },
    },
}
</script>

<style lang="scss" scoped>

.生成容器 {
    width: 245px;
    background-color: #e96969;
    position: fixed;
    bottom: 0px;
    left: -100%;
    // left: 0px;
    text-align: center;
    overflow: hidden;
    padding: 0px 0px 6px;
    .半圆 {
        background: #db4141;
        position: absolute;
        width: 200%;
        height: 500px;
        bottom: 0px;
        left: -50%;
        border-radius: 100%;
    }
    .提示 {
        color: rgba(255, 255, 255, 1);
        margin: 4px 0px 6px;
        text-shadow: rgba(0, 0, 0, 0.5) 0px 2px 2px;
        font-size: 13px;
    }
    .标题 {
        .标题1 {
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            z-index: 1;
        }
        padding: 10px 0px 26px;
        color: rgba(255, 255, 255, 1);
        font-size: 12px;
        position: relative;
        z-index: 1;
        .钱 {
            font-weight: bold;
            color: rgba(255, 195, 0, 1);
            font-size: 28px;
            margin: 0px 5px;
        }
    }
    .图片容器 {
        margin: 12px auto 0px;
        width: 113px;
        height: 113px;
        background: #ffffff;
        border-radius: 100%;
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 12px 0px rgba(212, 48, 48, 1);
        .二维码容器 {
            width: 76px;
            height: 76px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .头像 {
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            margin: auto;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            background: #ffffff;
            border-radius: 3px;
            img {
                border: 1px solid #cccccc;
                width: 100%;
                height: 100%;
                border-radius: 3px;
            }
        }
    }
    .半圆图片 {
        width: 211px;
        margin: 0px auto;
        height: 35px;
        position: relative;
        img {
            width: 100%;
            position: absolute;
            left: 0px;
            bottom: 0px;
        }
    }
    .文本1 {
        color: rgba(229, 229, 229, 1);
        font-size: 8px;
    }
}

.分享显示框 {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .内容 {
        width: 245px;
        position: relative;
        .关闭 {
            width: 36px;
            height: 36px;
            background: #ffffff;
            color: #999999;
            text-align: center;
            line-height: 36px;
            position: absolute;
            right: 0px;
            top: -50px;
            border-radius: 100%;
            ::after {
                position: absolute;
                left: 0px;
                right: 0px;
                bottom: -14px;
                margin: auto;
                height: 14px;
                width: 1px;
                content: "";
                background: #ffffff;
            }
        }
        .图片容器 {
            img {
                width: 100%;
            }
        }
        .文本 {
            height: 35px;
            line-height: 35px;
            color: rgba(56, 56, 56, 1);
            background-color: rgba(255, 255, 255, 1);
            font-size: 14px;
            border-radius: 35px;
            margin: 11px 0px;
            text-align: center;
        }
    }
}
</style>
