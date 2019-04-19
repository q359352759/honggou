<template>
    <div>
        <div class="生成容器" ref="生成容器">
            <div class="标题">
                <div class="标题1">
                    红购：一个专注省钱的同城电商平台
                </div>
                <div class="半圆"></div>
            </div>
            <div class="钱">
                <span class="大写">50</span>
                <span class="小写">元</span>
            </div>
            <div class="提示">
                <span>{{分享显示名称}}邀你领取红包</span>
            </div>
            <div class="图片容器">
                <div class="二维码容器" ref="二维码容器">
                </div>
                <div class="头像">
                    <img v-if="头像base64" :src="头像base64" alt="" srcset="">
                    <img v-if="!头像base64" :src="WechatIMG311" alt="" srcset="">
                </div>
            </div>
            <div class="文本1">长按识别图中二维码，领取红包</div>
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

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { dateFtt, openloading } from "@/assets/js/currency";
import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'
import { mapActions } from "vuex";
export default {
    name:"",
    props:{
        分享显示名称:{
            default:""
        },
        userInfo:{
            default:()=>{}
        },
        分享地址:{
            default:""
        }
        
    },
    data() {
        return {
            WechatIMG311:WechatIMG311,
            ApplicationType:ApplicationType,
            是否分享:false,
            头像base64:"",
            截图地址:"",
        }
    },
    methods: {
        ...mapActions({
            分享图片: 'app/分享/分享图片'
        }),
        开始按下() {
            if (ApplicationType == 'app') {
                this.分享图片(this.截图地址)
            }
        },
        显示二维码() {
            if (this.截图地址) {
                this.是否分享 = true;
            } else {
                openloading(true);
                Promise.all([this.生成二维码(), this.生成头像()]).then(x => {
                    this.截图();
                }).catch(err => {
                    openloading(false);
                    mui.toast("生成二维码失败，稍后再试。", {
                        duration: "long",
                        type: "div"
                    });
                });
            }
        },
        生成二维码() {
            return new Promise((resolve, reject) => {
                // var url = 'http://m.lxad.vip/test/dist/index.html' + "#/BeInvited?pid=" + this.userInfo.username + "&invitationtype=1";
                var url=this.分享地址
                console.log(url);
                var el = this.$refs.二维码容器;
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
                    el.querySelector("img").style.width = "100%";
                    resolve();
                }, 300);
            });
        },
        生成头像() {
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
            const el = this.$refs.生成容器;
            const options = {
                useCORS: true,
                logging: false
            };
            html2canvas(el, options).then(canvas => {
                this.截图地址 = canvas.toDataURL();
                this.是否分享 = true;
                openloading(false);
            });
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
    text-align: center;
    overflow: hidden;
    .半圆 {
        background: #db4141;
        position: absolute;
        width: 200%;
        height: 400px;
        bottom: 0px;
        left: -50%;
        border-radius: 100%;
    }
    .提示 {
        color: rgba(255, 255, 255, 1);
        font-size: 10px;
        margin: 4px 0px 8px;
    }
    .标题 {
        .标题1 {
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            z-index: 1;
        }
        padding: 20px 0px 30px;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        position: relative;
        z-index: 1;
    }
    .钱{
        color: #ffffff;
        margin: 3px 0px -5px;
        .大写{
            font-size: 65px;
            font-weight: bold;
            margin: 0px 3px 0px 0px;
            line-height: 65px;
        }
        .小写{
            font-size: 20px;
        }
    }
    .图片容器 {
        margin: 0px auto 0px;
        width: 120px;
        height: 120px;
        position: relative;
        .二维码容器 {
            width: 100%;
            height: 100%;
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
            width: 30px;
            height: 30px;
            border: 2px solid #ffffff;
            background: #ffffff;
            border-radius: 8px;
            img {
                border: 1px solid #cccccc;
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
        }
    }
    .文本1 {
        color: rgba(229, 229, 229, 1);
        font-size: 10px;
        padding: 8px 0px;
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

