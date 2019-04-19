<template>
    <div>
        <!-- 二维码容器 -->
            <div class="QRCode rongqi">
                <div class="content_1" ref="printMe">
                    <div class="title_3">
                        <img class="店铺logo" :src="店铺logo_base64" alt="" srcset="">
                        <div class="店铺信息">
                            <div>{{shop.name}}</div>
                            <div>{{shop.address}}</div>
                        </div>
                    </div>
                    <div class="img_box">
                        <img :src="img_base64" alt="">
                    </div>
                    <ul class="cont_1">
                        <li>
                            <div class="title_1">{{commodity.name}}</div>
                            <div>
                                <span class="sellingPrice">￥{{commodity.sellingPrice}}</span>
                                <span class="marketPrice"><s>{{commodity.marketPrice}}</s></span>
                                <span class="danwei">{{commodity.unit}}</span>
                            </div>
                            <div class="hongbao">
                                <!-- <i class="icon_1 icon iconfont icon-hongbao1"></i> -->
                                <img class="icon_1" :src="分享商品小红包" alt="" srcset="">
                                <span class="qian" v-if="专享 && 专享.type==0">新人再省：{{专享.deduction}}元</span>
                                <span class="qian" v-if="专享 && 专享.type==1">生日再省：{{专享.deduction}}元</span>
                                <span class="qian" v-if="!专享">再省：{{commodity.deduction}}元</span>
                            </div>
                        </li>
                        <li class="erweima_box" ref="qrcode">
                            <!-- <img v-if="img_list.length>0" :src="img_list[0]" alt=""> -->
                        </li>
                    </ul>
                    <div class="tishi">长按识别二维码，购买此商品</div>
                    <div class="title_2">
                        <div class="text_1">红购：领红包，去付款，立即省钱</div>
                    </div>
                </div>
            </div>

            <div class="QRCode content" v-show="显示">
                <div class="mask"></div>
                <div class="content_1">
                    <div class="close_1">
                        <div @click="显示=false"><i class="icon iconfont icon-quxiao"></i></div>
                        <div></div>
                    </div>
                    <div class="img_box1" @click="开始按下()">
                        <img :src="qrcode" alt="">
                    </div>
                    <div class="二维码提示" @click="开始按下()">
                        {{ApplicationType=='app' ? "点击分享" : '长按二维码，点击“发送给朋友”'}}
                    </div>
                </div>
            </div>
    </div>
</template>

<script>

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";

import { openloading } from "@/assets/js/currency.js";

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'
import {分享商品小红包} from '@/assets/image_base64/分享商品小红包.js'
import { mapActions } from "vuex";
export default {
    name:"",
    props:{
        //店铺
        shop:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        //商品
        commodity:{
            default:()=>{
                return {}
            }
        },
        专享:{
            default:()=>{
                return {}
            }
        },
        分享者id:""
    },
    data() {
        return {
            分享商品小红包:分享商品小红包,
            WechatIMG311:WechatIMG311,
            ApplicationType:ApplicationType,
            店铺logo_base64:"",
            img_base64:"",
            显示:false,
            qrcode:"",
        }
    },
    computed: {
        
    },
    methods: {
        ...mapActions({
            分享图片: 'app/分享/分享图片',
        }),
        开始按下(){
            if (ApplicationType == 'app') {
                this.分享图片(this.qrcode)
            }
        },
        //获取图片base64
        imgtobase64() {
            var img=(this.commodity.img && this.commodity.img.split(',').length>0) ? this.commodity.img.split(',')[0] : ''
            return new Promise((resolve, reject) => {
                this.$request("/api-u/users/imgtobase64",{ url: img },"post",true).then(x => {
                    if (x.data.code == 200) {
                        this.img_base64 = "data:image/jpeg;base64," + x.data.data;
                        resolve(x);
                    } else {
                        reject("获取图片base64错误1");
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        },
        生成二维码() {
            if(this.分享者id){
                var url='http://m.lxad.vip/test/dist/index.html'+'#/commodity/CommodityDetails?id='+this.commodity.id+"&fenxiang=1&userid="+this.分享者id;
            }else{
                var url='http://m.lxad.vip/test/dist/index.html'+'#/commodity/CommodityDetails?id='+this.commodity.id+"&fenxiang=1";
            }
            
            console.log(url)
            return new Promise((resolve, reject) => {
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
                    el.querySelector("img").style.width = "100%";
                    setTimeout(()=>{
                        resolve("生成二维码");
                    },200)
                }, 300);
            });
        },
        显示二维码() {
            // console.log('生成二维码');
            // console.log( location.href+"&isshop=1")
            if (this.qrcode) {
                this.显示 = true;
            } else {
                openloading(true);
                setTimeout(()=>{
                    Promise.all([this.获取店铺log_base64(),this.imgtobase64(), this.生成二维码()]).then(results => {
                        // console.log('1111111',results);
                        setTimeout(() => {
                            this.print();
                        }, 500);
                    }).catch(reason => {
                        console.log(reason)
                        openloading(false);
                        mui.toast("生成二维码失败，稍后再试。", {duration: "long",type: "div"});
                    });
                },500)
            }
        },
        //获取图片base64
        获取店铺log_base64() {
            console.log('111111111111111',this.shop)
            return new Promise((resolve, reject) => {
                this.$request("/api-u/users/imgtobase64",{ url: this.shop.signboard },"post",true).then(x => {
                    if (x.data.code == 200) {
                        this.店铺logo_base64 = "data:image/jpeg;base64," + x.data.data;
                        resolve(x);
                    } else {
                        reject("获取图片base64错误2");
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        },
        //生成带图片的二维码
        print() {
            const el = this.$refs.printMe;
            const options = {
                useCORS: true,
                logging: false,
                scale:2
            };
            html2canvas(el, options).then(canvas => {
                    this.qrcode = canvas.toDataURL();
                    // this.qrcode_show=true;
                    openloading(false);
                    this.显示 = true;
                },
                { useCORS: true }
            );
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';

.QRCode.content {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
    padding: 44px 0px 0px;
    .content_1 {
        padding: 0px;
        width: 75%;
    }
}
.QRCode.rongqi {
    background: #ffffff;
    position: fixed;
    left: -200%;
}
.QRCode {
    .mask {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
    }
    .content_1 {
        position: relative;
        z-index: 1;
        width: 266px;
        padding: 7px 9px 17px;
        .title_3{
            display: flex;
            align-items: center;
            margin: 0px 0px 10px 0px;
            .店铺logo{
                height: 40px;
                width: 40px;
                margin: 0px 10px 0px 0px;
                border-radius: 100%;
                flex-shrink: 0;
            }
            .店铺信息{
                width: 0;
                flex-grow: 1;
                >div:nth-child(1){
                    font-size: 14px;
                    font-weight: bold;
                }
                >div:nth-child(2){
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 12px;
                    color: #888888;
                }
            }
        }
        .二维码提示{
            position: absolute;
            width: 100%;
            left: 0px;
            bottom: -50px;
            height: 35px;
            color: rgba(56, 56, 56, 1);
            background-color: rgba(255, 255, 255, 1);
            border-radius: 35px;
            font-size: 14px;
            text-align: center;
            margin: 14px 0px 0px;
            line-height: 35px;
        }
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
        .img_box1 {
            img {
                width: 100%;
            }
        }
        .title_2 {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin: 6px 0px 0px 0px;
            img {
                width: 27px;
                height: 27px;
                border-radius: 6px;
                margin: 0px 6px 0px 0px;
            }
            .text_1 {
                color: $header_background;
            }
            .text_2 {
                color: #a6a6a6;
            }
        }
        .img_box {
            height: 174px;
            margin: 0px 0px 10px 0px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .title_1 {
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            font-weight: bold;
            margin: 7px 0px 10px;
        }
        .cont_1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .erweima_box {
                flex-shrink: 0;
                width: 80px;
                margin: 0px 8px 0px 0px;
                img {
                    width: 100%;
                }
            }
            .sellingPrice {
                color: $header_background;
                font-size: 19px;
                margin: 0px 5px 0px 0px;
            }
            .marketPrice {
                color: rgba(166, 166, 166, 1);
                font-size: 12px;
                margin: 0px 5px 0px 0px;
            }
            .danwei {
                color: #333333;
                font-size: 12px;
            }
            .hongbao {
                display: flex;
                align-items: center;
                .icon_1 {
                    font-size: 22px;
                    color: $header_background;
                    margin: 0px 5px 0px 0px;
                    width: 22px;
                    height: 22px;
                }
                .qian {
                    color: $header_background;
                    font-size: 12px;
                }
            }
        }
        .tishi {
            color: rgba(166, 166, 166, 1);
            font-size: 12px;
            text-align: center;
            margin: 14px 0px 0px;
        }
    }
}
</style>
