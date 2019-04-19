<template>
    <div id="home" >
        <ul class="box_header">
            <li @tap="saoyisao()">
                <div>
                    <i class="icon iconfont icon-iconfontscan"></i>
                </div>
            </li>
            <li>
                <div @tap="SearchShop()">
                    <div>
                        <i class="icon iconfont icon-chazhao"></i>
                    </div>
                    <input type="text" readonly>
                </div>
            </li>
            <li @tap="erweima()">
                <div>
                    <i class="icon iconfont icon-31erweima"></i>
                </div>
            </li>
            <li @click="$router.push('/news')">
            <!-- <li @click="测试()"> -->
                <div>
                    <i class="icon iconfont icon-31xiaoxi"></i>
                </div>
            </li>
        </ul>
        
        <ul class="box_3" v-show="box_3_actvie"  :class="{'active':box_3_actvie}">
            <li @click="type_1=3" :class="{'active':type_1==3}">店铺街</li>
            <li @click="type_1=4" :class="{'active':type_1==4}">特惠专享</li>
            <li @click="type_1=2" :class="{'active':type_1==2}">同城购</li>
            <!-- <li @click="type_1=1" :class="{'active':type_1==1}">商城</li> -->
        </ul>
            

        <!-- <div class="mui-content mui-fullscreen" :style="{'padding-top':下拉高度+44+'px'}" @touchstart="开始滑动($event)" v-on:touchmove ="滑动中($event)" @touchend="手指离开()" :class="{'回弹':回弹}" ref="muiContent" @scroll="content_scroll($event)"> -->
        <div class="mui-content mui-fullscreen" ref="muiContent" @scroll="content_scroll($event)">
        <!-- <div class="mui-content mui-fullscreen" :class="{'active':!muiContent_拖动}" ref="muiContent" @scroll="content_scroll($event)"> -->
            
            <div ref="横幅轮播">
                <!-- <div class="swiper-container" > -->
                    <!-- <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(x, index) in img_list" :key="index">
                            <img :src="x">
                        </div>
                    </div>
                    <div v-show="img_list.length>1" class="swiper-pagination"></div> -->
                <!-- </div> -->
            </div>
            
            <div class="半圆">
                <div>
                    <banyuan />
                </div>
            </div>

            <ul class="box_2">
                <li v-if="index<9" v-for="(x,index) in type_list" :key="index" @click="ShopClassification(x)">
                    <div class="img_box">
                        <img :src="x.logo" alt="">
                    </div>
                    <span>{{x.name}}</span>
                </li>
                <li @click="classification()" v-if="type_list.length>9">
                    <div class="img_box">
                        <img src="image/10.png" alt="">
                    </div>
                    <span>更多</span>
                </li>
            </ul>
            <!-- <button @click="获取位置()">点击获取位置</button> -->

            <div ref="box_4"></div>
            
            <ul class="box_3">
                <li @click="type_1=3" :class="{'active':type_1==3}">店铺街</li>
                <li @click="type_1=4" :class="{'active':type_1==4}">特惠专享</li>
                <li @click="type_1=2" :class="{'active':type_1==2}">同城购</li>
                <!-- <li @click="type_1=1" :class="{'active':type_1==1}">商城</li> -->
            </ul>
            <!-- 店铺街 -->
            <div v-if="type_1==3">
                <hbSj :红包="item" v-for="(item, index) in redenvelope.list" :key="index"/>
                <loading :loadingtype="redenvelope.loading" :nodata="!redenvelope.loading && redenvelope.total==0" :end="!redenvelope.loading && redenvelope.total!=0 && redenvelope.list.length>=redenvelope.total" />
            </div>
            <!-- 专享 -->
            <div v-if="type_1==4">
                <!-- <zhuanxiangshangp /> -->
                <zxsp :item="item" v-for="(item, index) in 专享.list" :key="index"/>
                <loading :loadingtype="专享.loading" :nodata="!专享.loading && 专享.total==0" :end="!专享.loading && 专享.total!=0 && 专享.list.length>=专享.total" />
            </div>
            <!-- 同城购 -->
            <div v-if="type_1==2">
                <yougou :list="优购.list"/>
                <loading :loadingtype="优购.loading" :nodata="!优购.loading && 优购.total==0" :end="!优购.loading && 优购.total!=0 && 优购.list.length==优购.total" />
            </div>
            <!-- 必抢 -->
            <div v-if="type_1==1">
                <loading :nodata="true" text="暂无商城数据"/>
            </div>

        
            <div class="QRCode" v-show="qrcode_show">
                <div class="mask"></div>
                <div class="content_1">

                    <div class="close_1">
                        <div @click="close_1()"><i class="icon iconfont icon-quxiao"></i></div>
                        <div></div>
                    </div>
                    <img @click="开始按下()" :src="qrcode" alt="" srcset="">
                    <div @click="开始按下()" class="二维码提示">
                        {{ApplicationType=='app' ? '点击分享' :"长按二维码，点击“发送给朋友”"}}
                    </div>
                </div>
            </div>

        </div>

        <!-- 生产二维码的容器 -->
        <div class="QRCode_box">
            <div class="content_1" ref="printMe">
                <div class="title_1">
                    <div class="img_box">
                        <img v-show="erweima_base64" class="head_img" :src="erweima_base64" alt="">
                        <img v-show="!erweima_base64" class="head_img" :src="WechatIMG311" alt="">
                    </div>
                    <div>
                        <div v-show="userInfo.nickname" class="userName">{{userInfo.nickname}}</div>
                        <div v-show="!userInfo.nickname" class="userName">{{userInfo.phone | fliter_phone}}</div>
                        <!-- <div class="text">对酒当歌，人生几何。</div> -->
                    </div>
                </div>
                <div class="erweima_box">
                    <img v-show="erweima_base64" class="head_img" :src="erweima_base64" alt="">
                    <img v-show="!erweima_base64" class="head_img" :src="WechatIMG311" alt="">
                    <div ref="qrcode">
                        
                    </div>
                </div>
                <div class="tishi">扫码领取50元红包</div>
            </div>
        </div>
        <homeDialog v-if="homeDialog_show && 是否通过审核" @setHomeDialog="getHomeDialog" />

        <!-- <tuiguang v-if="是否通过审核"/> -->

        <yszc v-if="显示隐私政策" @close="close_yszc"/>

    </div>
</template>

<script>
import { api_查询红包列表 } from "@/api/红包接口.js";

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'

import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
// import Swiper from 'swiper';
import { openloading, bd_decrypt, GetDistance } from "@/assets/js/currency";
import { 百度转标转WGS84 , bd09togcj02 } from "@/assets/js/地图坐标转换.js";
import loading from "@/components/loading.vue";
//弹出框
import homeDialog from "@/components/homeDialog.vue";
import yszc from "@/components/隐私政策.vue";

import zxsp from "./home/单个专享商品.vue";
import hongbaobili from "./home/红包比例.vue";
import yougou from "./home/优购.vue";
import banyuan from "./home/半圆.vue";
import tuiguang from "./home/推广红购使者.vue";
import hbSj from './home/红包加商家.vue'
import { mapActions, mapGetters } from "vuex";

export default {
    name: "home",
    components: {
        loading,
        homeDialog,
        hongbaobili,
        banyuan,
        yougou,
        tuiguang,
        yszc,
        hbSj,
        zxsp,
    },
    data() {
        return {
            鼠标按下位置:0,
            鼠标拖动位置:0,
            滚动条位置:0,
            回弹:false,
            是否可以下拉:false,
            // 下拉高度:0,

            显示隐私政策:false,
            WechatIMG311:WechatIMG311,
            ApplicationType:ApplicationType,
            首次进入:true,
            homeDialog_show: false,
            box_3_actvie: false,
            img_list: [], //轮播图
            type_1: 3,
            my_position: {
                //我的位置模拟数据
                x: "",
                y: ""
            },
            redenvelope: {
                //红包
                list: [],
                loading: true,
                total: 0,
                page_index: 0,
                query: {
                    start: 0,
                    length: 10,
                    type: "1", //随便传的不是类型
                    upx: "",
                    upy: "",
                    orderType: "ASC"
                }
            },
            userInfo: "",
            qrcode: "", //二维码
            qrcode_show: false,
            erweima_base64: "", //base64用于嵌入二维码中
            // type_list: [], //店铺类型
            定时器:'',
            长按:false,
        };
    },
    computed: {
        ...mapGetters({
            代理人信息: "g_agentUser",
            专享: "home/专享",
            优购: "home/优购/优购",
            当前位置:'当前位置',
            type_list:'shops_tree_list',
            是否通过审核:'版本信息/是否通过审核',
            shifoutongguo:'版本信息/是否通过审核',
        }),
        //实名认证信息
        findByUserid() {
            return this.$store.state.findByUserid;
        },
        下拉高度(){
            var height=0;
            if(this.鼠标拖动位置>this.鼠标按下位置){
                height=this.鼠标拖动位置-this.鼠标按下位置
            }
            return height;
        }
    },
    filters: {
        fliter_phone(phone) {
            if (!phone) return "";
            return phone.substring(0, 3) + "***" + phone.substring(phone.length - 3);
        },
        filter_juli(data) {
            if (!data) return "";
            return data.replace("米", "m").replace("公里", "km");
        }
    },
    methods: {
        ...mapActions({
            查询专享: "home/查询专享",
            专享下一页: "home/专享下一页",
            查询优购: "home/优购/查询优购",
            优购下一页: "home/优购/优购下一页",
            获取代理人信息: "actions_agentUser",
            获取位置:'获取位置/获取位置',
            分享图片:'app/分享/分享图片',
            设置下拉刷新:'设置下拉刷新',
        }),
        开始滑动(e){
            if(this.滚动条位置>10) return
            this.是否可以下拉=true;
            this.回弹=false
            var targetTouches = e.targetTouches[0];
            var y=targetTouches.clientY;
            this.鼠标按下位置=y;
        },
        滑动中(e){
            if(this.滚动条位置>0 || !this.是否可以下拉) return
            var targetTouches = e.targetTouches[0];
            var y=targetTouches.clientY;
            this.鼠标拖动位置=y;
            if(this.鼠标按下位置<this.鼠标拖动位置){
                e.preventDefault();
            }
        },
        手指离开(){
            this.回弹=true;
            this.是否可以下拉=false;
            if(this.下拉高度>=150){
                openloading(true);
                setTimeout(x=>{
                    window.location.reload()
                },1000)
            }
            this.鼠标拖动位置=0;
            // this.鼠标按下位置=0
        },
        //关闭隐私政策
        close_yszc(){
            console.log('关闭隐私政策');
            localStorage.yinsizhengce=true;
            this.显示隐私政策=false
        },
        开始按下(){
            if(ApplicationType=='app'){
                this.分享图片(this.qrcode)
            }
        },
        async 测试(){
            // await this.获取位置();
            console.log(this.$refs.muiContent)
            mui.alert(JSON.stringify(this.当前位置)+this.$refs.muiContent, "提示", "我知道了", function () { }, "div");
        },
        getHomeDialog(x) {
            this.homeDialog_show = false;
        },
        //扫一扫
        saoyisao() {
            if(this.ApplicationType=='app'){
                this.$router.push('/appSaoyisao');
            }else{
                if (this.$store.state.weixin_ready) {
                    try {
                        openloading(false);
                        wx.scanQRCode({
                            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                            success: function (res) {
                                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            }
                        });
                    } catch (error) {
                        setTimeout(() => {
                            this.saoyisao();
                        }, 1000);
                    }
                } else {
                    openloading(true);
                    setTimeout(() => {
                        this.saoyisao();
                    }, 1000);
                }
            }
        },
        //生产二维码
        erweima() {
            // console.log()
            if (!this.userInfo) {
                mui.toast("登录后才有二维码，请先登录。", { duration: "long", type: "div" });
                return;
            }
            var url = 'http://m.lxad.vip/test/dist/index.html' + "#/BeInvited?pid=" + this.userInfo.username ;
            if (this.qrcode) {
                this.qrcode_show = true;
            } else {
                openloading(true);
                if (this.userInfo.headImgUrl) {
                    this.$axios.post("/api-u/users/imgtobase64", this.$qs.stringify({ url: this.userInfo.headImgUrl })).then(x => {
                        if (x.data.code == 200) {
                            this.erweima_base64 = "data:image/jpeg;base64," + x.data.data;
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
                                this.print();
                            }, 500);
                        } else {
                            openloading(false);
                            mui.toast("生成二维码失败，稍后再试。", { duration: "long", type: "div" });
                        }
                    }).catch(err => {
                        openloading(false);
                        mui.toast("生成二维码失败，稍后再试。", { duration: "long", type: "div" });
                    });
                } else {
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
                    this.print();
                }
            }
        },
        print() {
            const el = this.$refs.printMe;
            const options = {
                useCORS: true,
                logging: false
            };
            html2canvas(el, options).then(canvas => {
                this.qrcode = canvas.toDataURL();
                this.qrcode_show = true;
                openloading(false);
            });
        },
        close_1() {
            this.qrcode_show = false;
        },
        //跳转搜索
        SearchShop() {
            this.$router.push("/SearchShop");
        },
        //滚动条
        content_scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            this.设置下拉刷新(t==0);
            this.滚动条位置 = t;
            if (this.$refs.box_4.offsetTop - 44 <= e.target.scrollTop) {
                this.box_3_actvie = true;
            } else {
                this.box_3_actvie = false;
            }
            if (h + t >= sh - 10) {
                if (this.type_1 == 1) {
                    
                } else if (this.type_1 == 2) {
                    this.优购下一页();
                } else if (this.type_1 == 3) {
                    if (!this.redenvelope.loading && this.redenvelope.list.length < this.redenvelope.total) {
                        this.redenvelope.page_index++;
                        this.get_redenvelope();
                    }
                } else if (this.type_1 == 4) {
                    this.专享下一页();
                }
            }
        },
        //跳转更多
        classification() {
            this.$router.push("/classification");
        },
        //点击了分类
        ShopClassification(x) {
            this.$router.push("/ShopClassification?id=" + x.id + "&name=" + x.name);
        },
        渲染横幅(){
            // var html=
            if(this.是否通过审核){
                this.img_list = ["image/home_21.jpg", "image/home_22.jpg", "image/home_23.jpg", "image/home_24.jpg"];
            }else{
                this.img_list=["image/home_22.jpg"];
            }
            var html='<div class="swiper-container" >'+
                    '<div class="swiper-wrapper">'
            this.img_list.forEach(item=>{
                html+='<div class="swiper-slide">'+
                            '<img src="'+item+'">'+
                        '</div>'
            })
                html+='</div>'
            if(this.img_list.length>1){
                html+='<div class="swiper-pagination"></div>';
            }else{
                html+='<div class="mui-hidden swiper-pagination"></div>';
            }
                html+='</div>'
            this.$refs.横幅轮播.innerHTML=html;
            if(this.img_list.length>1){
                var swiper = new Swiper(this.$refs.横幅轮播.querySelector('div'), {
                    loop: true,
                    autoplay:{
                        delay: 3000,
                        // stopOnLastSlide: true,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: ".swiper-pagination"
                    }
                });
            }
        },
        //查询 首页显示的 红包
        get_redenvelope() {
            var this_1 = this;
            this.redenvelope.loading = true;
            this.redenvelope.query.start = this.redenvelope.page_index * this.redenvelope.query.length;
            this.redenvelope.query.upx = this.$store.state.my_position.x;
            this.redenvelope.query.upy = this.$store.state.my_position.y;
            this.$axios.get("/api-s/shops/redenvelope/findData", { params: this.redenvelope.query }).then(x => {
                this.redenvelope.loading = false;
                var list = x.data.data.data;
                for (var i = 0; i < list.length; i++) {
                    list[i].juli = "";
                    var amount = list[i].amount;
                    if (amount > 999 && amount < 1000) {
                        list[i].font_size = "14px";
                    } else if (amount >= 1000 && amount < 9999) {
                        // 99999
                        list[i].font_size = "12px";
                    } else if (amount > 9999) {
                        list[i].font_size = "10px";
                    }
                }
                this.redenvelope.list = this.redenvelope.list.concat(list);
                this.redenvelope.total = x.data.data.total;
            }).catch(err => {
                this.redenvelope.loading = false;
            });
        },
        async 初始化(){
            if(!this.当前位置 || this.当前位置.x=='' || this.当前位置.y==''){
                // openloading(true)
                await this.获取位置();
                openloading(false);
            }
            this.get_redenvelope();
        },
    },
    beforeCreate: function () {
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }

        var homeDialog_obj = "";
        var username = this.userInfo ? this.userInfo.username : "";
        try {
            homeDialog_obj = JSON.parse(localStorage.homeDialog);
        } catch (error) { }
        console.log("homeDialog_obj", homeDialog_obj);
        //说明提示框
        if (!homeDialog_obj || homeDialog_obj == "" || username != homeDialog_obj.userid) {
            this.homeDialog_show = true;
        } else {
            var time1 = new Date().getTime();
            var time2 = homeDialog_obj.time;
            var time3 = (time1 - time2) / 1000 / 60 / 60;
            // if (!homeDialog_obj.Tips && time3 > 4) {
            if (time3 > 4) {
                this.homeDialog_show = true;
            }
        }
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        var this_1 = this;

        var query = this.$route.query;
        if (query.saoyisao && !sessionStorage.saoyisao) {
            this.saoyisao();
            sessionStorage.saoyisao = 1;
        }

        this.初始化()
        //查询专享
        this.查询专享();
        this.查询优购();

        // console.group('------mounted 挂载结束状态------');
    },
    activated() {
        this.渲染横幅()

        //显示启动页
        var yinsizhengce = localStorage.yinsizhengce;
        console.log('是否显示隐私政策',yinsizhengce)
        if(ApplicationType=='app'){
            this.显示隐私政策=yinsizhengce=='true' ? false : true;
        }
        

        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }
        if (this.userInfo) {
            this.$store.commit("setfindByUserid");
            this.获取代理人信息();
        }
        //再次进入页面
        if(!this.首次进入){
            console.log('再次进入页面',this.滚动条位置)
            console.log(this.$refs.muiContent)
            // this.$refs.smoothScrollTo(0,this.滚动条位置,true);  
            try {
                this.$refs.muiContent.scrollTo(0, this.滚动条位置, true);   
            } catch (error) {
                
            }
            if(this.redenvelope.list.length==0 && !this.redenvelope.loading){
                this.get_redenvelope()
            }
            if(this.专享.list.length==0 && !this.专享.loading){
                this.查询专享();
            }
            if(this.优购.list.length==0 && !this.优购.logging){
                this.查询优购();
            }
        }
        
        this.首次进入=false;
        var t=this.$refs.muiContent.scrollTop;
        console.log(t);
        this.设置下拉刷新(t==0);

    },
    beforeUpdate: function () {
        // console.group('beforeUpdate 更新前状态===============》');
    },
    updated: function () {
        // console.group('updated 更新完成状态===============》');
    },
    beforeDestroy: function () {
        // console.group('beforeDestroy 销毁前状态===============》');
    },
    destroyed: function () {
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {
        shifoutongguo(){
            this.渲染横幅();
        }
    },
};
</script>

<style lang="scss" scope>
@import "@/assets/css/config.scss";
#home .下拉显示内容{
    position: fixed;
    top: 44px;
    left: 0px;
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    font-size: 14px;
    color: #4a4a4a;
    i{
        font-size: 20px;
    }
}
#home .下拉显示内容.回弹{
    transition: all 0.5s;
}
#home .mui-content.回弹{
    transition: all 0.5s;
}



#home {
    // height: 100%;
    // overflow: auto;
    .mui-content {
        padding: 44px 0px 0px 0px;
        // height: 100%;
    }
    .mui-content.active{
        animation: all 3s;
    }
}
#home .半圆 {
    position: relative;
    > div {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 7px;
        left: 0px;
        bottom: 0px;
    }
}
#home .mui-bar {
    background: $header_background;
}

#home .mui-title {
    color: #ffffff;
}

#home .box_header {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 11;
    line-height: initial;
    height: 44px;
    background: $header_background;
    backface-visibility: hidden;
    display: flex;
    > li:nth-child(1) {
        margin: 0px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #ffffff;
        span {
            font-size: 12px;
            line-height: 12px;
            display: block;
        }
        i {
            font-size: 0.2rem;
        }
    }
    > li:nth-child(2) {
        display: flex;
        align-items: center;
        flex-grow: 1;
        > div {
            width: 100%;
            align-items: center;
            display: flex;
            background: #ffffff;
            height: 30px;
            border-radius: 30px;
            opacity: 0.6;
            > div:nth-child(1) {
                margin: 0px 10px;
            }
        }
        input {
            margin: 0px;
            padding: 0px;
            border: none;
            height: 100%;
            background: none;
        }
    }
    > li:nth-child(3) {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #ffffff;
        margin: 0px 12px;
        span {
            font-size: 0.12rem;
            line-height: 12px;
            display: block;
        }
        i {
            font-size: 0.2rem;
        }
    }
    > li:nth-child(4) {
        margin: 0px 12px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #ffffff;
        span {
            font-size: 0.12rem;
            line-height: 12px;
            display: block;
        }
        i {
            font-size: 0.2rem;
        }
    }
}


#home .swiper-slide {
    // height: 1.2rem;
    font-size: 0px;
}

#home .swiper-slide img {
    width: 100%;
    object-fit: cover;
}

#home .swiper-pagination-bullet-active {
    background: $header_background;
}

#home .box_2 {
    display: flex;
    flex-wrap: wrap;
    background: #ffffff;
    text-align: center;
    font-size: 12px;
    padding: 0px 0px 10px;
    > li {
        width: calc(100% / 5);
        margin: 0.08rem 0px 0px;
    }
    .img_box {
        width: 0.4rem;
        height: 0.4rem;
        margin: 0px auto 5px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }
}

#home .box_3 {
    position: relative;
    z-index: 1;
    display: flex;
    background: #ffffff;
    text-align: center;
    // justify-content: center;
    justify-content: space-between;
    padding: 0px 45px;
    color: rgba(128, 128, 128, 1);
    font-size: 14px;
    > li {
        height: 35px;
        line-height: 35px;
    }
    .active {
        font-weight: bold;
        color: $header_background;
        border-bottom: 2px solid $header_background;
    }
}
#home .box_3.active {
    position: fixed;
    top: 44px;
    left: 0px;
    width: 100%;
    z-index: 2;

}

#home .box_4 ul {
    margin: 0.07rem 0px;
    background: #ffffff;
    display: flex;
    > li:nth-child(1) {
        display: flex;
        padding: 8px 20px 8px 20px;
        width: 0;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        .title_1 {
            width: 100%;
            font-size: 0.14rem;
        }
        .dizhi {
            width: 100%;
            color: #a6a6a6;
            font-size: 0.12rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .Fraction {
                color: red;
                margin: 0px 0px 0px 5px;
            }
            i {
                font-size: 0.1rem;
            }
            .juli {
                margin: 3px 0px 0px;
                color: rgba(166, 166, 166, 1);
            }
        }
        .text_1 {
            width: 100%;
            color: $header_background;
            font-size: 0.12rem;
            display: flex;
            justify-content: center;
            .dikou {
                flex-grow: 1;
                font-weight: bold;
            }
            .juli {
                color: rgba(166, 166, 166, 1);
            }
        }
    }
    > li:nth-child(2) {
        width: 1px;
        flex-shrink: 0;
        position: relative;
        border-left: 1px dashed #ff5733;
        > div:nth-child(1) {
            position: absolute;
            width: 0.2rem;
            height: 0.2rem;
            background: #f6f6f6;
            top: -0.1rem;
            left: -0.1rem;
            border-radius: 50%;
        }
        > div:nth-child(2) {
            position: absolute;
            width: 0.2rem;
            height: 0.2rem;
            background: #f6f6f6;
            bottom: -0.1rem;
            left: -0.1rem;
            border-radius: 50%;
        }
    }
    > li:nth-child(3) {
        display: flex;
        align-items: center;
        padding: 0px 0rem 0px 0.13rem;
        > div {
            width: 0.4rem;
            position: relative;
            font-size: 0;
            img {
                width: 100%;
            }
            div {
                font-size: 16px;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 15px 0px 0px;
            }
            span {
                // position: absolute;
                // top: 0.2rem;
                // bottom: 0px;
                // left: 0px;
                // right: 0px;
                text-align: center;
                color: #ffffff;
                overflow: auto;
            }
            .dikou {
                font-size: 12px;
            }
        }
    }
    > li:nth-child(4) {
        padding: 5px 10px;
        .比例 {
            width: 0.45rem;
            height: 0.45rem;
            border: 2px #ff5733 solid;
            color: #ff5733;
            border-radius: 50%;
            font-size: 0.1rem;
            text-align: center;
            line-height: initial;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin: 0px auto;
            > div:nth-child(2) {
                position: absolute;
                width: 0.2rem;
                height: 5px;
                background: #ffffff;
                bottom: -2px;
                left: 0px;
                right: 0px;
                margin: auto;
            }
        }
        .btn {
            width: 0.4rem;
            height: 0.14rem;
            font-size: 0.1rem;
            line-height: 0.14rem;
            color: #ffffff;
            background: #ff5733;
            border-radius: 0.2rem;
            text-align: center;
            margin: 5px auto 0px;
        }
    }
}

#home .box_6 {
    margin: 5px 0px 0px;
    > li {
        display: flex;
        background: #ffffff;
        padding: 0.08rem 0.1rem;
        border-bottom: 1px solid #e5e5e5;
        > div:nth-child(1) {
            flex-shrink: 0;
            width: 0.77rem;
            height: 0.58rem;
            background: #eeeeee;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        > div:nth-child(2) {
            margin: 0px 0px 0px 8px;
            width: 0;
            flex-grow: 1;
            h1 {
                margin: 0px;
                font-weight: 400;
                color: rgba(80, 80, 80, 1);
                font-size: 0.14rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            h2 {
                margin: 8px 0px 8px;
                font-weight: 400;
                color: rgba(166, 166, 166, 1);
                font-size: 0.12rem;
                div {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            h3 {
                color: rgba(212, 48, 48, 1);
                margin: 0px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .左边{
                    display: flex;
                    align-items: center;
                    font-size: 0.12rem;
                }
                .红包规则{
                    font-weight: bold;
                }
                .红包_icon{
                    font-weight: 400;
                    font-size: 0.16rem;
                    margin: 0px 3px 0px 0px;
                }
                .人气{
                    font-size: 0.16rem;
                    margin: 0px 3px 0px 7px;
                }
                .人气.无红包{
                    margin: 0px 3px 0px 0px;
                }
                .人气数量{
                    font-weight: 400;
                }
                .好评{
                    font-weight: 400;
                    font-size: 12px;
                }
            }
        }
    }
}

#home .QRCode_box {
    position: absolute;
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
            margin: 20px auto 0px;
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
                width: 50px;
                height: 50px;
                border-radius: 10px;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                margin: auto;
                z-index: 1;
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

#home .QRCode {
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
        .二维码提示{
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
