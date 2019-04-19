<template>
    <div>
        <div class="显示容器" v-show="显示分享">
            <div class="内容">
                <div class="关闭" @click="显示分享=false">
                    <i class="icon iconfont icon-quxiao"></i>
                </div>
                <div class="图片容器" @click="开始按下()">
                    <img :src="截图base64" alt="">
                </div>
                <ul class="按钮组" v-show="店铺内">
                    <li class="文本" @click="点击保存()">
                        保存二维码
                    </li>
                    <li class="文本" @click="开始按下()">
                        {{ApplicationType =='app' ? '点击分享' :"长按图片分享"}}
                    </li>
                </ul>
                <li class="文本1" @click="开始按下()" v-show="!店铺内">
                    {{ApplicationType =='app' ? '点击分享' :"长按二维码，点击“发送给朋友”"}}
                </li>
            </div>
        </div>
        <div class="生成容器" ref="生成容器">
            <div class="店铺信息">
                <div>
                    <img :src="店铺logobase64" alt="">
                </div>
                <div>
                    <div>
                        <div ref="设置字体1">
                            <div>{{shop.name ? shop.name.substring(0,14) : ''}}</div>
                        </div>
                        <div v-show="shop.name && shop.name.length>14">...</div>
                    </div>
                    <div>
                        <div ref="设置字体2">
                            <div>{{shop.address ? shop.address.substring(0,14) : ''}}</div>
                        </div>
                        <div v-show="shop.address && shop.address.length>14">...</div>
                    </div>
                </div>
            </div>
            <div class="红包信息">
                <img class="背景图" :src="分享店铺背景大图" alt="">
                <div class="新人红包金额">{{xinrenhongbao ? xinrenhongbao.amount : 50}}<span>元</span></div>
                <div class="红包抵扣规则" v-if="xinrenhongbao">
                    <span v-if="xinrenhongbao.deductionType==1">
                        每满{{xinrenhongbao.expire}}减{{xinrenhongbao.deduction}}元
                    </span>
                    <span v-if="xinrenhongbao.deductionType==0">
                        用红包买单省：{{xinrenhongbao.percentage}}%
                    </span>
                </div>
                <div class="二维码" ref="二维码容器">
                    <!-- <img alt="" srcset=""> -->
                </div>
                <div class="扫码提示">{{店铺内 ? '扫码领红包' : '长安识别二维码'}}</div>
                <div class="提示语">红购：领红包，去付款，立即省钱!</div>
            </div>
        </div>
    </div>
</template>

<script>
import { 分享店铺背景大图 } from "@/assets/image_base64/分享店铺背景大图.js";

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { dateFtt, openloading } from "@/assets/js/currency";
import { mapActions } from 'vuex';

export default {
    name:"",
    props:{
        shop:{
            default:()=>{}
        },
        fenxiangid:"",
        xinrenhongbao:"",
        店铺内:false,
    },
    data() {
        return {
            
            ApplicationType:ApplicationType,
            分享店铺背景大图:分享店铺背景大图,
            店铺logobase64:"",
            截图base64:"",
            显示分享:false
        }
    },
    methods: {
        ...mapActions({
            分享图片: 'app/分享/分享图片',
            保存图片到相册:"app/保存图片/保存图片到相册"
        }),
        开始按下() {
            if (ApplicationType == 'app') {
                this.分享图片(this.截图base64)
            }
        },
        点击保存(){
            if (ApplicationType != 'app') {
                mui.toast("请使用app保存", {duration: 1000,type: "div"});
            }else{
                openloading(true);
                this.保存图片到相册(this.截图base64).then(x=>{
                    openloading(false);
                    this.显示分享=false;
                    mui.toast("保存成功", {duration: 1000,type: "div"});
                }).catch(err=>{
                    openloading(false);
                    mui.toast("保存失败", {duration: 1000,type: "div"});
                })
            }
        },
        设置字体大小() {
            var div1 = this.$refs.设置字体1;
            var div2 = this.$refs.设置字体2;
            if(div1.clientWidth > div1.parentElement.clientWidth){
                // div1.style.zoom = div1.parentElement.clientWidth / div1.clientWidth
                div1.style.fontSize = div1.parentElement.clientWidth / div1.clientWidth*14+'px'
            }
            if(div2.clientWidth > div2.parentElement.clientWidth){
                // div2.style.zoom = div2.parentElement.clientWidth / div2.clientWidth
                div2.style.fontSize = div2.parentElement.clientWidth / div2.clientWidth*10+'px';
            }
        },
        显示分享图片(){
            console.log('显示分享二维码')
            if(this.截图base64){
                this.显示分享=true;
            }else{
                openloading(true);
                // this.设置字体大小();
                Promise.all([this.生成二维码(), this.生成店铺log()]).then(x => {
                    this.截图();
                }).catch(err => {
                    console.log(err);
                    openloading(false);
                    mui.toast("生成二维码失败，稍后再试。", {duration: "long",type: "div"});
                });
            }
        },
        生成二维码(){
            return new Promise((resolve, reject) => {
                if(this.fenxiangid){
                    var url = 'http://m.lxad.vip/test/dist/index.html' + "#/sjzst2?shopid=" + this.shop.shopid + "&fenxiang=1&userid="+this.fenxiangid;
                }else{
                    var url = 'http://m.lxad.vip/test/dist/index.html' + "#/sjzst2?shopid=" + this.shop.shopid + "&fenxiang=1";
                }
                console.log(url);
                var el = this.$refs.二维码容器;
                el.innerHTML = "";
                let qrcode = new QRCode(el, {
                    width: 400,
                    height: 400, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
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
        生成店铺log(){
            return new Promise((resolve, reject) => {
                this.$axios.post("/api-u/users/imgtobase64", this.$qs.stringify({ url: this.shop.signboard })).then(x => {
                    if (x.data.code == 200) {
                        this.店铺logobase64 = "data:image/jpeg;base64," + x.data.data;
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
                logging: false,
                scale:2
            };
            html2canvas(el, options).then(canvas => {
                this.截图base64 = canvas.toDataURL();
                this.显示分享 = true;
                openloading(false);
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.显示容器{
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
    padding: 44px 0px 0px;
    .内容 {
        width: 260px;
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
        .按钮组{
            position: absolute;
            width: 100%;
            left: 0px;
            bottom: -45px;
            display: flex;
            justify-content: space-between;
        }
        .文本 {
            width: 112px;
            height: 35px;
            line-height: 35px;
            color: rgba(56, 56, 56, 1);
            background-color: rgba(255, 255, 255, 1);
            font-size: 14px;
            border-radius: 35px;
            // margin: 11px 0px;
            text-align: center;
        }
        .文本1{
            position: absolute;
            width: 100%;
            left: 0px;
            bottom: -45px;
            height: 35px;
            line-height: 35px;
            color: rgba(56, 56, 56, 1);
            background-color: rgba(255, 255, 255, 1);
            font-size: 14px;
            border-radius: 35px;
            // margin: 11px 0px;
            text-align: center;
        }
    }
}
.生成容器{
    position: fixed;
    width: 260px;
    height: 382px;
    background: #ffffff;
    z-index: 3;
    top: 50px;
    left: -100%;
    border: 1px solid #cccccc;
    padding: 15px;
    .店铺信息{
        display: flex;
        >div:nth-child(1){
            width: 60px;
            height: 45px;
            margin: 0px 9px 0px 0px;
            flex-shrink: 0;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4px;
            }
        }
        >div:nth-child(2){
            width: 0;
            flex-grow: 1;
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            >div{
                overflow: auto;
                display: flex;
                >div:nth-child(1){
                    // width: fit-content;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                >div:nth-child(2){
                    flex-shrink: 0;
                }
            }
            >div:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
            }
            >div:nth-child(2){
                color: rgba(80, 80, 80, 1);
            	font-size: 10px;
            }
        }
    }
    .红包信息{
        margin: 15px 0px 0px;
        height: 293px;
        position: relative;
        .背景图{
            width: 100%;
            height: 100%;
        }
        .新人红包金额{
            position: absolute;
            width: 100%;
            text-align: center;
            color: rgba(217, 57, 59, 1);
            font-size: 38px;
            top: 20px;
            left: 0px;
            span{
                font-size: 20px;
                margin: 0px 0px 0px 3px;
            }
        }
        .红包抵扣规则{
            position: absolute;
            width: 100%;
            text-align: center;
            color: rgba(217, 57, 59, 1);
        	font-size: 10px;
            top: 60px;
            left: 0px;
        }
        .二维码{
            width: 86px;
            height: 86px;
            border:5px solid #ffffff;
            border-radius: 8px;
            position: absolute;
            top: 127px;
            left: 0px;
            right: 0px;
            margin: auto;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .扫码提示{
            width: 137px;
        	height: 32px;
            line-height: 32px;
            background: rgba(255, 195, 0, 1);
            border-radius: 5px;
        	font-size: 14px;
            font-weight: bold;
            text-align: center;
            position: absolute;
            left: 0px;
            right: 0px;
            top: 220px;
            margin: auto;
            color: #ffffff;
        }
        .提示语{
            color: rgba(255, 255, 255, 1);
        	font-size: 10px;
            position: absolute;
            width: 100%;
            left: 0px;
            top: 264px;
            text-align: center;
        }
    }
}
</style>
