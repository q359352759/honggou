<template>
    <div>
        <div class="mui-content mui-fullscreen">
            <header class="mui-bar mui-bar-nav">
                <a class="按钮 mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
                <h1 class="mui-title">
                    <span class="第几张" @click="上下()">
                        {{第几页!=1 ? '下一张' : '上一张'}}
                    </span>
                </h1>
                <span @click="分享()" class="按钮 mui-pull-right">
                    <i class="icon iconfont icon-fenxiang3"></i>
                </span>
            </header> 

            <div class="swiper-container 轮播" ref="推广轮播">
                <div class="swiper-wrapper">
                    <div class="swiper-slide 样式1" ref="样式1">
                        <div class="图片1">
                            <img :src="tghb1" alt="" srcset="">
                        </div>
                        <div class="图片2">
                            <img :src="tghb2" alt="" srcset="">
                        </div>
                        <div class="图片3">
                            <img :src="tghb3" alt="" srcset="">
                        </div>
                        <div class="图片4">
                            <ul>
                                <li>
                                    <img v-if="!头像base64" :src="WechatIMG311" alt="">
                                    <img v-if="头像base64" :src="头像base64" alt="">
                                </li>
                                <li>
                                    <div>
                                        <span v-if="实名信息">{{实名信息.name}}</span>
                                        <span v-if="userInfo && !实名信息">{{userInfo.phone}}</span>
                                    </div>
                                    <div>营销顾问</div>
                                </li>
                                <li ref="二维码1">
                                    <!-- <img src="image/10.png" alt=""> -->
                                </li>
                            </ul>
                            <div class="背景">
                                <img  :src="tghb4" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide 样式2" ref="样式2">
                        <div class="图片1">
                            <img :src="tghb21" alt="" srcset="">
                        </div>
                        <div class="图片2">
                            <img :src="tghb22" alt="" srcset="">
                        </div>
                        <div class="图片3">
                            <img :src="tghb23" alt="" srcset="">
                        </div>
                        <div class="图片4">
                            <img  :src="tghb24" alt="" srcset="">
                        </div>
                        <div class="图片5">
                            <ul>
                                <li>
                                    <img v-if="!头像base64" :src="WechatIMG311" alt="">
                                    <img v-if="头像base64" :src="头像base64" alt="">
                                </li>
                                <li>
                                    <div>
                                        <span v-if="实名信息">{{实名信息.name}}</span>
                                        <span v-if="userInfo && !实名信息">{{userInfo.phone}}</span>
                                    </div>
                                    <div>营销顾问</div>
                                </li>
                                <li ref="二维码2">
                                    <!-- <img src="image/10.png" alt=""> -->
                                </li>
                            </ul>
                            <div class="扫码提示">
                                <div>识别二维码</div>
                                <div>免费开通点单系统</div>
                            </div>
                            <div class="背景">
                                <img :src="tghb25" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="swiper-pagination"></div> -->
            </div>
        </div>

        <div class="二维码弹出框" v-show="显示分享">
            <div class="内容区">
                <div class="close_1">
                    <div @click="显示分享=false"><i class="icon iconfont icon-quxiao"></i></div>
                    <div></div>
                </div>
                <div class="图片容器" @click="开始按下()">
                    <img :src="分享base64" alt="" srcset="">
                </div>
                <div class="二维码提示" @click="开始按下()">
                    {{ApplicationType =='app' ? '点击分享' :"长按二维码，点击“发送给朋友”"}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import { openloading } from "@/assets/js/currency.js";
import { mapActions } from 'vuex';
export default {
    name:"",
    data() {
        return {
            // 样式1
            tghb1:"",
            tghb2:"",
            tghb3:"",
            tghb4:"",
            // 样式2
            tghb21:"",
            tghb22:"",
            tghb23:"",
            tghb24:"",
            tghb25:"",

            第几页:0,
            swiper:"",
            userid:'',
            实名信息:'',
            userInfo:"",
            WechatIMG311:WechatIMG311,
            ApplicationType: ApplicationType,
            头像base64:"",
            分享base64:"",
            显示分享:false
        }
    },
    methods: {
        ...mapActions({
            分享图片: 'app/分享/分享图片',
        }),
        开始按下() {
            if (ApplicationType == 'app') {
                this.分享图片(this.分享base64)
            }
        },
        分享(){
            openloading(true);
            if(this.第几页==0){
                const el = this.$refs.样式1;
                const options = {
                    useCORS: true,
                    logging: false,
                    scale:2
                };
                html2canvas(el, options).then(canvas => {
                    this.分享base64 = canvas.toDataURL();
                    this.显示分享 = true;
                    openloading(false);
                });
            }else{
                const el = this.$refs.样式2;
                const options = {
                    useCORS: true,
                    logging: false,
                    scale:2
                };
                html2canvas(el, options).then(canvas => {
                    this.分享base64 = canvas.toDataURL();
                    this.显示分享 = true;
                    openloading(false);
                });
            }
        },
        上下(){
            if(this.第几页==1){
                this.swiper.slidePrev();
            }else{
                this.swiper.slideNext();
            }
        },
        获取图片1(key){
            return new Promise((resolve, reject) => {
                this.$axios.get('http://m.lxad.vip/test/imageBase64/'+key+'.txt').then(x => {
                    resolve(x)
                }).catch((err) => {
                    reject()
                });
            });
        },
        获取图片(){
            return new Promise((resolve, reject) => {
                Promise.all([
                    // 样式1
                    this.获取图片1('tghb1'),
                    this.获取图片1('tghb2'),
                    this.获取图片1('tghb3'),
                    this.获取图片1('tghb4'),
                    // 样式2
                    this.获取图片1('tghb21'),
                    this.获取图片1('tghb22'),
                    this.获取图片1('tghb23'),
                    this.获取图片1('tghb24'),
                    this.获取图片1('tghb25'),
                ]).then(x=>{
                    this.tghb1=x[0].data;
                    this.tghb2=x[1].data;
                    this.tghb3=x[2].data;
                    this.tghb4=x[3].data;
                    this.tghb21=x[4].data;
                    this.tghb22=x[5].data;
                    this.tghb23=x[6].data;
                    this.tghb24=x[7].data;
                    this.tghb25=x[8].data;
                    resolve()
                }).catch(err=>{
                    resolve()
                })
            });
        },
        获取用户头像base64(){
            this.$axios.post("/api-u/users/imgtobase64", this.$qs.stringify({ url: this.userInfo.headImgUrl })).then(x => {
                if (x.data.code == 200) {
                    this.头像base64 = "data:image/jpeg;base64," + x.data.data;
                }
                openloading(false);
            }).catch(err => {
                openloading(false);
            });
        },
        生成二维码1(){
            var url = 'http://m.lxad.vip/test/dist/index.html' + "#/ShopInstructions?pid=" + this.userInfo.username;
            console.log(url)
            var el = this.$refs.二维码1;
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
            }, 500);
        },
        生成二维码2(){
            var url = 'http://m.lxad.vip/test/dist/index.html' + "#/ShopInstructions?pid=" + this.userInfo.username;
            console.log(url)
            var el = this.$refs.二维码2;
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
            }, 500);
        },
        async 信息初始化(){
            openloading(true);

            Promise.all([
                api_通过username查询用户(this.userid),
                api_获取实名信息(this.userid)
            ]).then(x=>{
                this.userInfo=x[0].data.code==200 ? x[0].data.data  :"";
                this.实名信息=x[1].data.code==200 ? x[1].data.data : '';
                this.生成二维码1()
                this.生成二维码2()
                if(this.userInfo.headImgUrl){
                    this.获取用户头像base64();
                }else{
                    openloading(false)
                }
            }).catch(err=>{
                openloading(false)
            })
        }
    },
    mounted() {
        // http://192.168.1.8:8080/#/ShopInstructions
        // #/ShopInstructions?pid=9379FECD5A5C1CAB47983D6870DF6D27
        this.获取图片();
        if(this.$route.query.userid){
            this.userid=this.$route.query.userid;
        }else{
            try {
                this.userInfo=JSON.parse(localStorage.userInfo);
                this.userid=this.userInfo.username
            } catch (error) {}
        }


        this.信息初始化()


        var this_1=this;
        this.swiper = new Swiper(this.$refs.推广轮播, {
            on: {
                slideChangeTransitionEnd: function(){
                    this_1.第几页=this.activeIndex;
                },
            },
        });



    },
}
</script>

<style lang="scss" scoped>
.mui-bar{
    background: none;
    box-shadow: none;
    .mui-title{
        overflow: initial;
    }
    .按钮{
        margin: 10px 0px 0px;
        width: 36px;
    	height: 36px;
        background-color: rgba(153, 153, 153 , 0.4);
        border-radius: 100%;
        padding: 0px;
        text-align: center;
        font-size: 24px;
        color: #ffffff;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        i{
            height: 24px;
        }
    }
    .第几张{
        width: 71px;
        height: 24px;
        background-color: rgba(153, 153, 153, 0.5);
        line-height: 24px;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        border-radius: 24px;
        position: absolute;
        top: 13px;
        left: 0px;
        right: 0px;
        margin: auto;
    }
}
.轮播{
    height: 100%;
    .样式1{
        .图片1{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            z-index: 1;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .图片2{
            width: 100%;
            position: relative;
            z-index: 2;
            img{
                width: 100%;
            }
        }
        .图片3{
            width: calc(100vw * (360 / 375));
            position: absolute;
            top: calc(100vh * (252  / 667 )); 
            left: 0px;
            right: 0px;
            z-index: 3;
            margin: auto;
            img{
                width: 100%;
            }
        }
        .图片4{
            width: 100%;
            position: absolute;
            bottom: 0px;
            left: 0px;
            z-index: 4;
            .背景{
                width: 100%;
                font-size: 0px;
                img{
                    width: 100%;
                }
            }
            ul{
                position: absolute;
                width: 100%;
                left: 0px;
                bottom: 0.09rem;
                display: flex;
                padding: 0px 0.5rem 0px 0.6rem;
                >li:nth-child(1){
                    width: 0.54rem;
                    height: 0.54rem;
                    flex-shrink: 0;
                    margin: 0px 8px 0px 0px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                    }
                }
                >li:nth-child(2){
                    color: rgba(255, 255, 255, 1);
                    font-size: 14px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    justify-content: space-around;
                }
                >li:nth-child(3){
                    width: 0.54rem;
                    height: 0.54rem;
                    flex-shrink: 0;
                    border: 4px solid #ffffff;
                    border-radius: 5px;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
    .样式2{
        .图片1{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            z-index: 1;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .图片2{
            position: absolute;
            // top: 104px;
            top: calc(100vh * (104 / 667));
            left: 0px;
            width: 100%;
            z-index: 2;
            img{
                width: 100%;
            }
        }
        .图片3{
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
            z-index: 3;
            font-size: 0px;
            img{
                width: 100%;
            }
        }
        .图片4{
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
            z-index: 4;
            font-size: 0px;
            img{
                width: 100%;
            }
        }
        .图片5{
            height: 54px;
            position: relative;
            z-index: 5;
            margin: 29px 0px 0px;
            .扫码提示{
                position: absolute;
                top: 58px;
                right: 0px;
                width: 154px;
                color: rgba(255, 255, 255, 1);
            	font-size: 10px;
                white-space: nowrap;
                text-align: center;
            }
            ul{
                height: 100%;
                display: flex;
                padding: 0px 50px 0px 60px;
                position: relative;
                z-index: 1;
                >li:nth-child(1){
                    width: 54px;
                    height: 54px;
                    flex-shrink: 0;
                    margin: 0px 8px 0px 0px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                    }
                }
                >li:nth-child(2){
                    color: rgba(255, 255, 255, 1);
                    font-size: 14px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    justify-content: space-around;
                }
                >li:nth-child(3){
                    width: 54px;
                    height: 54px;
                    flex-shrink: 0;
                    border: 4px solid #ffffff;
                    border-radius: 5px;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .背景{
                height: 100%;
                width: 100%;
                top: 0px;
                left:0px;
                position: absolute;
                img{
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
            }
        }
    }
}

.二维码弹出框{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    .内容区{
        width: 60%;
        height: 60%;
        background: #ffffff;
        position: relative;
        border: 7px solid #ffffff;
    }
    .图片容器{
        width: 100%;
        height: 100%;
        img{
            width: 100%;
            height: 100%;
        }
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
    .二维码提示 {
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
}
</style>
