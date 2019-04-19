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
                <li @click="change_type_1(1)" :class="{'active':type_1==1}">红包</li>
                <li @click="change_type_1(4)" :class="{'active':type_1==4}">专享</li>
                <li @click="change_type_1(2)" :class="{'active':type_1==2}">优购</li>
                <li @click="change_type_1(3)" :class="{'active':type_1==3}">商家</li>
            </ul>
            
        <!-- <div class="下拉显示内容" :class="{'回弹':回弹}" :style="{'height':下拉高度+'px'}">
            <i v-show="下拉高度<150" class="mui-icon mui-icon-arrowthindown"></i>
            <i v-show="下拉高度>=150" class="mui-icon mui-icon-arrowthinup"></i>
            <span>{{下拉高度<150 ? '继续下拉':"松开刷新"}}</span>
        </div> -->

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
                
                <li @click="change_type_1(3)" :class="{'active':type_1==3}">店铺街</li>
                
                <li @click="change_type_1(2)" :class="{'active':type_1==2}">同城购</li>

                <li @click="change_type_1(4)" :class="{'active':type_1==4}">专享</li>
                
                <li @click="change_type_1(1)" :class="{'active':type_1==1}">必抢</li>

            </ul>
            
            <div v-if="type_1==3">
                <hbSj :红包="item" v-for="(item, index) in redenvelope.list" :key="index"/>
                <loading :loadingtype="redenvelope.loading" :nodata="!redenvelope.loading && redenvelope.total==0" :end="!redenvelope.loading && redenvelope.total!=0 && redenvelope.list.length>=redenvelope.total" />
            </div>

            <!-- 红包 -->
            <div class="box_4" v-if="type_1==1">
                <ul v-for="(x, index) in redenvelope.list" :key="index">
                    <li>
                        <div class="title_1" @tap="sjzst21(x)">{{x.shopName}}</div>
                        <div class="dizhi" @tap="sjzst21(x)">
                            {{x.address}}
                        </div>
                        <div class="text_1" v-if="x.deductionType==0">
                            <div class="dikou" @tap="sjzst21(x)">
                                省&nbsp;{{x.percentage}}%
                            </div>
                            <div class="juli" @tap="weixinmaptest(x)">
                                <i class="icon iconfont icon-location"></i>{{x.distance>0.5 ? x.distance.toFixed(1)+'km' : x.distance.toFixed(1)*1000+'m' }}
                            </div>
                        </div>
                        <div class="text_1" v-if="x.deductionType==1">
                            <div class="dikou" @tap="sjzst21(x)">
                                满{{x.expire}}，省{{x.deduction}}元
                            </div>
                            <div class="juli" @tap="weixinmaptest(x)">
                                <i class="icon iconfont icon-location"></i>{{x.distance>0.5 ? x.distance.toFixed(1)+'km' : x.distance.toFixed(1)*1000+'m'}}
                            </div>
                        </div>
                    </li>
                    <li>
                        <div></div>
                        <div></div>
                    </li>
                    <li @tap="RedEnvelopesList(x)">
                        <div>
                            <img src="image/redpackage.png" alt="">
                            <div>
                                <span :style="{'font-size':x.font_size}" ref="font-size">{{x.amount}}</span>
                            </div>
                        </div>
                    </li>
                    <li @tap="RedEnvelopesList(x)">
                        <hongbaobili :max="x.quantityMax" :lingqu="x.quantity" />
                        <div class="btn">领取</div>
                    </li>
                </ul>
            </div>
            <loading v-if="type_1==1" :loadingtype="redenvelope.loading" :nodata="!redenvelope.loading && redenvelope.total==0" :end="!redenvelope.loading && redenvelope.total!=0 && redenvelope.list.length>=redenvelope.total" />

            <div class="专享栏" v-if="type_1==4">
                <zhuanxiangshangp />
            </div>

            <div class="优购栏" v-if="type_1==2">
                <yougou :list="优购.list"/>
                <loading :loadingtype="优购.loading" :nodata="!优购.loading && 优购.total==0" :end="!优购.loading && 优购.total!=0 && 优购.list.length==优购.total" />
            </div>

            <!-- 商家 -->
            <ul class="box_6" v-if="type_1==5">
                <li v-for="(item, index) in shop.list" :key="index">
                    <div @click="sjzst2(item)">
                        <img :src="item.signboard" alt="" srcset="">
                    </div>
                    <div>
                        <h1 @click="sjzst2(item)">{{item.name}}</h1>
                        <h2>
                            <span @click="weixinmaptest(item)" class="mui-pull-right"><i class="icon iconfont icon-location"></i>{{item.distance>0.5 ? item.distance.toFixed(1)+'km' : item.distance.toFixed(1)*1000+'m'}}</span>
                            <div @click="sjzst2(item)">{{item.address}}</div>
                        </h2>
                        <h3 @click="sjzst2(item)">
                            <div class="左边">
                                <i v-if="item.新人红包" class="红包_icon icon iconfont icon-hongbao1"></i>
                                <div v-if="item.新人红包" class="红包规则">
                                    <div v-if="item.新人红包.deductionType==0">省&nbsp;{{item.新人红包.percentage}}%</div>
                                    <div v-if="item.新人红包.deductionType==1"> 满{{item.新人红包.expire}}，省{{item.新人红包.deduction}}元</div>
                                </div>
                                <i :class="{'无红包':!item.新人红包}" class="人气 icon iconfont icon-renqi"></i>
                                <div class="人气数量">{{item.popularity ? item.popularity : 0}}</div>
                            </div>
                            <div class="好评">
                                <div v-if="item.scoreAvg">好评：{{Math.floor(item.scoreAvg*10)/10}}</div>
                                <div v-else>暂无评价</div>
                            </div>
                        </h3>
                    </div>
                </li>
            </ul>
            <loading v-if="type_1==3" :loadingtype="shop.loading" :nodata="!shop.loading && shop.total==0" :end="!shop.loading && shop.total!=0 && shop.list.length==shop.total" />

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

import zhuanxiangshangp from "./home/专享商品.vue";
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
        zhuanxiangshangp,
        hongbaobili,
        banyuan,
        yougou,
        tuiguang,
        yszc,
        hbSj
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
            shop: {
                //商家
                start: 0,
                length: 10,
                state: 1, //通过了的
                list: [],
                total: 0,
                loading: true,
                page_index: 0
            },
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
            设置是否显示登录框:'设置是否显示登录框'
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
        //红包处跳转商家
        sjzst21(x) {
            this.$store.state.redid = x.id;
            this.$router.push("/sjzst2?shopid=" + x.shopid);
        },
        //商家处跳转商家详情
        sjzst2(x) {
            this.$router.push("/sjzst2?shopid=" + x.shopid);
        },
        //跳转到商家红包界面
        RedEnvelopesList(x) {
            console.log(x);
            this.$store.state.redid = x.id;

            if (!this.userInfo) {
                this.设置是否显示登录框(true);
                // mui.toast('请先登录。',{ duration: "long",type: "div" });
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // });
                return;
            }

            // this.$router.push("/RedEnvelopesList?shopid=" + x.shopid + "&isshop=1");
            this.$router.push('/sjzst2?shopid='+x.shopid)

            if (!x || x == "") {
                mui.toast("尚未发布此红包。", { duration: "long", type: "div" });
                return;
            } else if (x.type == 5) {
                console.log("点击了生日红包");
                if (this.userInfo.iaiState == 1) {
                    mui.confirm("确认将自己的生日信息（不包含年龄）授权给此商铺吗？", "提示", ["取消", "好的"], value => {
                        if (value.index == 1) {
                            if (!this.findByUserid) {
                                mui.toast("获取实名信息失败，稍后再试。", { duration: 2000, type: "div" });
                                return;
                            }
                            var birthday = this.findByUserid.birthday;
                            var myDate = new Date();
                            var newdate = myDate.getFullYear() + "-" + birthday.substring(4, 6) + "-" + birthday.substring(6);
                            if (newdate >= getDateStr(0)) {
                                //领取今年的
                                var startTime = getDateStr(-7, newdate);
                                var endTime = getDateStr(7, newdate);

                                var obj = {
                                    id: "",
                                    userid: this.userInfo.username, //红包id
                                    envelopeId: x.id,
                                    state: "0", //状态(使用等等)  0 刚领取
                                    type: x.type,
                                    startTime: startTime, //生日使用有效期
                                    endTime: endTime
                                };
                                this.add_red(obj);
                            } else {
                                //领取明年的
                                var newdate = myDate.getFullYear() + 1 + "-" + birthday.substring(4, 6) + "-" + birthday.substring(6);
                                var startTime = getDateStr(-7, newdate);
                                var endTime = getDateStr(7, newdate);

                                var obj = {
                                    id: "",
                                    userid: this.userInfo.username, //红包id
                                    envelopeId: x.id,
                                    state: "0", //状态(使用等等)  0 刚领取
                                    type: x.type,
                                    startTime: startTime, //生日使用有效期
                                    endTime: endTime
                                };
                                this.add_red(obj);
                            }
                        }
                    }, "div");
                } else {
                    mui.confirm("领取生日红包需要实名认证，您还未认证，请先认证。", "提示", ["取消", "去认证"], value => {
                        if (value.index == 1) {
                            this.$router.push("/RealName");
                        }
                    });
                }
                return;
            }
            var obj = {
                id: "",
                userid: this.userInfo.username, //红包id
                envelopeId: x.id,
                state: "0", //状态(使用等等)  0 刚领取
                type: x.type,
                startTime: "", //生日使用有效期
                endTime: "",
                amount: x.amount ? x.amount : 0
            };
            this.add_red(obj);
        },
        //调用添加红包接口
        add_red(obj) {
            console.log(obj);
            this.$axios.post("/api-s/shops/addUserCardPackge", obj).then(x => {
                console.log(x);
                if (x.data.code == 200) {
                    mui.toast("恭喜您，领取成功。", { duration: 2000, type: "div" });
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.messag, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err => {
                console.log(err);
                mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
            });
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
                    if (!this.redenvelope.loading && this.redenvelope.list.length < this.redenvelope.total) {
                        this.redenvelope.page_index++;
                        this.get_redenvelope();
                    }
                } else if (this.type_1 == 2) {
                    this.优购下一页();
                } else if (this.type_1 == 3) {
                    if (!this.shop.loading && this.shop.list.length < this.shop.total) {
                        this.shop.page_index++;
                        this.get_shop();
                    }
                } else if (this.type_1 == 4) {
                    this.专享下一页();
                }
                console.log("到底底部");
            }
        },
        //跳转微信内置地图
        weixinmaptest(item) {
            if(ApplicationType=='app'){
                var this_1=this;
                function 跳转地图(){
                    var name=item.shopName ? item.shopName : item.name
                    // 设置目标位置坐标点和其实位置坐标点
                    if(AppType=='ios'){
                        var 起点=bd09togcj02(this_1.当前位置.x, this_1.当前位置.y);
                        var 终点=bd09togcj02(item.x,item.y);
                        var dst = new plus.maps.Point(起点[0] , 起点[1]);
                        var src = new plus.maps.Point(终点[0] , 终点[1]);
                        // 调用系统地图显示 
                        plus.maps.openSysMap(src, name , dst);
                    }else{
                        var 起点=百度转标转WGS84(this_1.当前位置.x, this_1.当前位置.y);
                        var 终点=百度转标转WGS84(item.x,item.y);
                        var dst = new plus.maps.Point(起点[0] , 起点[1]);
                        var src = new plus.maps.Point(终点[0] , 终点[1]);
                        // 调用系统地图显示 
                        plus.maps.openSysMap(src, name , dst);
                    }
                }
                if (window.plus) {
                    跳转地图();
                } else {
                    document.addEventListener('plusready', 跳转地图, false);
                }
            }else{
                var ditu = bd_decrypt(item.x, item.y);
                wx.openLocation({
                    latitude: ditu.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: ditu.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: item.name, // 位置名
                    address: item.address, // 地址详情说明
                    scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
                });
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
        //选择类型
        change_type_1(x) {
            this.type_1 = x;
        },
        test() {
            console.log(1231);
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
                    autoplay: true,
                    pagination: {
                        el: ".swiper-pagination"
                    }
                });
            }
        },
        //查询店铺
        get_shop() {
            var this_1 = this;
            var obj = {
                start: this.shop.page_index * this.shop.length,
                length: this.shop.length,
                state: this.shop.state,
                upx: this.$store.state.my_position.x,
                upy: this.$store.state.my_position.y,
                orderType: "ASC",
                // oreder:'distance',   //sales 销量 popularity 人气 distance 距离 scoreAvg 评价
                distance:"distance"  //距离
                // popularity:"popularity"
                // scoreAvg:'scoreAvg'  //评价 
            };
            
            this.shop.loading = true;
            this.$axios.get("/api-s/shops/findAll", { params: obj }).then(x => {
                console.log("查询店铺", x);
                var list = x.data.data.data;
                list.forEach(item => {
                    item.新人红包="";
                    var 查询红包参数={
                            start:0,
                            length:10,
                            ccc:1,
                            shopid:item.shopid,
                            type:0
                        }
                    api_查询红包列表(查询红包参数).then(r=>{
                        if(r.data.code==200){
                            item.新人红包=r.data.data.data.length>0 ? r.data.data.data[0] : '';
                        }
                    })
                });
                this.shop.list = this.shop.list.concat(list);
                this.shop.total = x.data.data.total;
                this.shop.loading = false;
            }).catch(err => {
                console.log(err);
                this.shop.loading = false;
            });
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
            this.get_shop();
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
            if(this.shop.list.length==0 && !this.shop.logging){
                this.get_shop()
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
    justify-content: center;
    color: rgba(128, 128, 128, 1);
    font-size: 14px;
    > li {
        width: 53px;
        margin: 0px 10px;
        height: 35px;
        line-height: 35px;
    }
    .active {
        color: rgba(231, 106, 73, 1);
        border-bottom: 3px solid rgba(231, 106, 73, 1);
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
