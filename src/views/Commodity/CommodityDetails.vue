<template>
    <div id="CommodityDetails">
        <header class="mui-bar mui-bar-nav" :style="{'background-color': 'rgba(217, 57, 59,'+导航背景色+')'}">
            <a :style="{'background-color': 'rgba(153, 153, 153 , '+0.4*(1-导航背景色)+')'}" class="返回上一页 mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">
                <ul class="导航栏" :style="{'opacity':导航背景色}">
                    <li @click="导航(1)" :class="{'active':查看类型==1}">商品</li>
                    <li @click="导航(2)" :class="{'active':查看类型==2}">评价</li>
                    <li @click="导航(3)" :class="{'active':查看类型==3}">详情</li>
                </ul>
            </h1>
            <span :style="{'background-color': 'rgba(153, 153, 153 , '+0.4*(1-导航背景色)+')'}" @click="erweima_show()" class="erweima mui-pull-right">
                <i class="icon iconfont icon-fenxiang3"></i>
            </span>
        </header>
        <div ref="muiContent" class="mui-content mui-fullscreen" @scroll="scroll($event)">

            <div class="swiper-container box_1" ref="swiperContainer">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(x, index) in img_list" :key="index">
                        <img :src="x" alt="">
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>

            <ul class="box_2">
                <li class="title">
                    <div class="商品名">{{commodity.name}}</div>
                    <div class="人气">人气：{{commodity.popularity ? commodity.popularity : '0'}}</div>
                </li>
                <li class="Price">
                    <div>
                        <span class="sellingPrice">￥{{commodity.sellingPrice}}</span>
                    </div>
                    <div>
                        <span class="marketPrice"><s>{{commodity.marketPrice}}</s></span>
                        <span class="danwei">{{commodity.unit}}</span>
                        <span class="sales mui-pull-right">已售：{{commodity.sales}}</span>
                    </div>
                </li>
                <li class="Red_envelopes">
                    <div>
                        <i class="icon_1 icon iconfont icon-hongbao1"></i>
                        <span class="qian">省：{{commodity.deduction}}元</span>
                        <img v-if="专享 && 专享.type==0" src="image/xingren1.png"  class="专享图片" >
                        <span v-if="专享 && 专享.type==0" class="专享" >省：{{专享.deduction}}元</span>
                        <img v-if="专享 && 专享.type==1" src="image/shengri1.png" class="专享图片">
                        <span v-if="专享 && 专享.type==1" class="专享">省：{{专享.deduction}}元</span>
                    </div>
                    <span class="btn_1" @tap="linghongbao()">领红包</span>
                    <!--  -->
                </li>
                <li class="分享赚外快" @click="分享赚外快()">
                    <img src="image/fxzwk.png" alt="" srcset="">
                </li>
            </ul>

            <ul class="box_7" v-if="!isshop">
                <li>
                    <img :src="shop.signboard">
                    <div class="店铺信息">
                        <div>
                            <span class="shopname">{{shop.name}}</span>
                            <span class="pingfen">5.0分</span>
                        </div>
                        <div class="店铺地址">
                            <span>{{shop.address}}{{shop.remark ? shop.remark : ''}}</span>
                            <span>（{{店铺距离}}）</span>
                        </div>
                    </div>
                </li>
                <li @tap="toshop()">
                    进店
                </li>
            </ul>

            <ul class="mui-table-view box_3" ref="定位2">
                <li class="mui-table-view-cell">
                    <a class="mui-navigate-right item" @click="$router.push('/commodity/pinglunliebiao?id='+id)">
                        <span>商品评价</span>
                        <span>{{评论.total}}条</span>
                    </a>
                </li>
            </ul>
            <pinglun :item="评论.list[0]" v-if="评论.list && 评论.list.length>0"/>
            
            <ul class="介绍标题" ref="定位3" >
                <li></li>
                <li>商品详情</li>
                <li></li>
            </ul>
            <div class="box_5" v-if="commodity.remark" v-html="commodity.remark">
            </div>
            <loading :styles="{'padding-top':'50px','padding-bottom':'50px'}" v-if="!commodity.remark" :nodata="true" text="暂无商品描述"/>

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
                        <!-- <img :src="WechatIMG311" alt="" srcset=""> -->
                        <div class="text_1">红购：领红包，去付款，立即省钱</div>
                        <!-- <div class="text_2">领红包，去付款，立即省钱</div> -->
                    </div>
                </div>
            </div>

            <div class="QRCode content" v-show="QRCode_box">
                <div class="mask"></div>
                <div class="content_1">
                    <div class="close_1">
                        <div @click="close_1()"><i class="icon iconfont icon-quxiao"></i></div>
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
        <!-- <ul class="box_6">
            <li @tap="shoucang()">
                <i :class="{'icon-shoucang shoucang':UserFavorite,'icon-collect':!UserFavorite}" class="icon iconfont"></i>
                <div>{{UserFavorite ? '取消收藏' : '收藏'}}</div>
            </li>
            <li>
                <i class="icon iconfont icon-kefu1"></i>
                <div>客服</div>
            </li>
            <li @click="goumai()">
                立即购买
            </li>
        </ul> -->

        <ul class="底部栏">
            <li @click="shoucang()" class="圆形" :class="{'active':UserFavorite}"><i class="icon iconfont icon-shoucangdianjihou"></i></li>
            <li class="圆形" ref="复制" @click="复制微信号码()">
                <i class="icon iconfont icon-08ba06"></i>
            </li>
            <li class="圆形" v-if="shop">
                <a :href="'tel:'+shop.phone">
                    <i class="icon iconfont icon-dianhua2"></i>
                </a>
            </li>
            <li class="按钮" @click="goumai()">立即购买</li>
        </ul>

        <div class="添加微信提示" v-show="显示复制微信提示">
            <ul>
                <li>提示</li>
                <li>
                    <div v-show="!shop || !shop.wechat">该商户暂未添加微信客服</div>
                    <div v-show="shop && shop.wechat">
                        客服微信号已复制
                        <br>
                        请打开微信加好友
                        <br>
                        请备注“红购”
                    </div>
                </li>
                <li @click="显示复制微信提示=false">我知道了</li>
            </ul>
        </div>
        

    </div>
</template>

<script>
import { api_根据id查询商品 } from "@/api/商品接口.js";
import { api_查询两点距离 } from "@/api/查询距离.js";
import { api_添加扫码奖赏记录 } from "@/api/扫码接口.js";

import ClipboardJS from "clipboard";    //复制
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { openloading , limit} from "@/assets/js/currency.js";
import { mapActions, mapGetters } from "vuex";
import pinglun from './components/评论.vue'

import {WechatIMG311} from '@/assets/image_base64/WechatIMG311.js'
import {分享商品小红包} from '@/assets/image_base64/分享商品小红包.js'
import loading from '@/components/loading.vue';
import $ from "jquery";
export default {
    name: "",
    data() {
        return {
            分享商品小红包:分享商品小红包,
            WechatIMG311:WechatIMG311,
            ApplicationType:ApplicationType,
            isshop: true,
            QRCode_box: false,
            id: "",
            commodity: {},
            img_list: [],
            shop: {}, //店铺信息
            UserFavorite: "", //收藏信息
            userInfo: "", //用户信息
            qrcode: null,
            img_base64: "",
            专享: "",
            定时器:'',
            是否是分享:false,
            店铺logo_base64:"",
            店铺距离:"",
            滚动条高度:"",
            查看类型:1,
            点击导航栏:false,
            clipboard:"",
            显示复制微信提示:false
        };
    },
    components: {
        pinglun,
        loading
    },
    computed: {
        ...mapGetters({
            评论:'shangPing/评论/评论',
            当前位置:"当前位置",
            代理人信息:"g_agentUser",
        }),
        导航背景色(){
            var 透明度=0;
            if(this.滚动条高度>240){
                透明度=1
            }else{
                透明度=this.滚动条高度/240
            }
            // 'rgba(217, 57, 59, 1)'
            return 透明度;
        }
    },
    methods: {
        ...mapActions({
            商品查询专享: "shangPing/商品查询专享",
            修改商品: "shangPing/修改商品",
            评论初始化:'shangPing/评论/初始化',
            查询评价:'shangPing/评论/查询评价',
            分享图片: 'app/分享/分享图片',
            获取位置:'获取位置/获取位置',
            获取代理人信息: "actions_agentUser",
            设置是否显示登录框:'设置是否显示登录框'

        }),
        复制微信号码(){
            if(!this.shop || !this.shop.wechat){
                this.显示复制微信提示=true;
            }else{
                this.clipboard.on("success", (e)=>{
                    this.显示复制微信提示=true
                });
                this.clipboard.on("error", function (e) {
                    mui.toast("复制失败，请手动复制。", { duration: "long", type: "div" });
                });
            }
        },
        开始按下() {
            if(ApplicationType=='app'){
                this.分享图片(this.qrcode)
            }
        },
        分享赚外快(){
            if(this.userInfo){
                if(this.代理人信息){
                    this.erweima_show();
                }else{
                    this.$router.push('/shizhe/tuiguang')   
                }
            }else{
                // this.$route.push('/login');
                this.设置是否显示登录框(true);
            }
        },
        导航(index){
            if(this.滚动条高度==0){
                return
            }
            this.查看类型=index;
            var this_1=this;
            this.点击导航栏=true; 
            var options = {
                container: this.$refs.muiContent,
                easing: 'ease-in',
                offset: -44,
                force: true,
                cancelable: true,
                onStart: function(element) {
                // scrolling started
                    console.log('onStart开始滚动')
                    this_1.点击导航栏=true
                },
                onDone: function(element) {
                    console.log('onDone')
                    setTimeout(()=>{
                        this_1.点击导航栏=false
                    },1000)
                },
                onCancel: function() {
                    console.log("onCancel");
                },
                x: false,
                y: true
            }
            if(index==1){
                this.$scrollTo(this.$refs.swiperContainer, 300, options)
            }else if(index==2){
                this.$scrollTo(this.$refs.定位2, 300, options)
            }else{
                this.$scrollTo(this.$refs.定位3, 300, options)
            }
        },
        scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            this.滚动条高度=t;
            if(!this.点击导航栏){
                var list=[
                        this.$refs.swiperContainer.offsetTop,
                        this.$refs.定位2.offsetTop,
                        this.$refs.定位3.offsetTop
                    ];
                var index=limit(list,t);
                this.查看类型=index+1;
            }
        },
        //立即购买
        goumai() {
            this.$router.push("/commodity/PurchaseSingle?id=" + this.id);
        },
        linghongbao() {
            // http://192.168.1.13:8080/#/RedEnvelopesList?shopid=D7004090906D139CD1492008D376E457
            this.$router.push("/RedEnvelopesList?shopid=" + this.shop.shopid);
        },
        //点击收藏
        shoucang() {
            if (!this.userInfo) {
                mui.toast("请先登录才能收藏。", { duration: "long", type: "div" });
                return;
            }
            if (!this.UserFavorite) {
                this.addUserFavorite();
            } else {
                this.deleteUserFavorite();
            }
        },
        //添加收藏
        addUserFavorite() {
            var obj = {
                userid: this.userInfo.username,
                type: "1", //收藏类型(0:店铺,1:商品)
                name: "商品", //收藏类型(店铺,商品)
                shopid: "", //商店id
                commodityid: this.id //商品id
            };
            this.$axios({
                method: "post",
                url: "/api-s/shops/addUserFavorite",
                data: obj
            }).then(x => {
                console.log(x);
                if (x.data.code == 200) {
                    mui.toast("收藏成功。", { duration: 1000, type: "div" });
                    this.get_findDataUserFavorite();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message,"提示","我知道了",function () { },"div");
                }
            }).catch(err => {
                mui.toast("系统错误,稍后再试。", { duration: 1000, type: "div" });
            });
        },
        //删除收藏
        deleteUserFavorite() {
            this.$axios({
                method: "post",
                url: "/api-s/shops/deleteUserFavorite",
                data: [this.UserFavorite.id]
            }).then(x => {
                if (x.data.code == 200) {
                    console.log("取消收藏成功。", x);
                    mui.toast("取消收藏成功。", { duration: 1000, type: "div" });
                    this.get_findDataUserFavorite();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message,"提示","我知道了",function () { },"div");
                }
            }).catch(err => {
                console.log(err);
            });
        },
        //查询收藏
        get_findDataUserFavorite() {
            var obj = {
                start: 0,
                length: 10,
                userid: this.userInfo.username,
                // shopid:this.shopid
                commodityid: this.id //商品id
            };
            this.$axios({
                method: "get",
                url: "/api-s/shops/findDataUserFavorite",
                params: obj
            }).then(x => {
                console.log("查询收藏信息", x);
                if (x.data.code == 200) {
                    this.UserFavorite =
                        x.data.data.data.length > 0 ? x.data.data.data[0] : "";
                }
            }).catch(err => {
                console.log("查询收藏信息错误", err);
            });
        },
        //轮播图片
        getswiper() {
            var swiper = new Swiper(this.$refs.swiperContainer, {
                loop: true,
                autoplay: true,
                observer: true,
                autoplay: {
                    delay: 3000
                },
                pagination: {
                    el: ".swiper-pagination"
                }
            });
        },
        //获取图片base64
        imgtobase64() {
            return new Promise((resolve, reject) => {
                this.$request("/api-u/users/imgtobase64",{ url: this.img_list[0] },"post",true).then(x => {
                    if (x.data.code == 200) {
                        this.img_base64 = "data:image/jpeg;base64," + x.data.data;
                        resolve(x);
                    } else {
                        reject("获取图片base64错误");
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        },
        //生成二维码
        shengcheng_erweima() {
            if(this.userInfo){
                var url='http://m.lxad.vip/test/dist/index.html'+'#/commodity/CommodityDetails?id='+this.id+"&fenxiang=1&userid="+this.userInfo.username;
            }else{
                var url='http://m.lxad.vip/test/dist/index.html'+'#/commodity/CommodityDetails?id='+this.id+"&fenxiang=1";
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
                setTimeout(()=>{
                    el.querySelector("img").style.width = "100%";
                    setTimeout(()=>{
                        resolve()
                    },200)
                },300)
                resolve("生成二维码");
            });
        },
        //显示二维码
        erweima_show() {
            // console.log('生成二维码');
            // console.log( location.href+"&isshop=1")
            if (this.qrcode) {
                this.QRCode_box = true;
            } else {
                openloading(true);
                Promise.all([this.获取店铺log_base64(),this.imgtobase64(), this.shengcheng_erweima()]).then(results => {
                    // console.log('1111111',results);
                    setTimeout(() => {
                        this.print();
                    }, 500);
                }).catch(reason => {
                    // console.log(22222222,reason);
                    openloading(false);
                    mui.toast("生成二维码失败，稍后再试。", {duration: "long",
                        type: "div"
                    });
                });
                // console.log(qrcode)
            }
        },
        //获取图片base64
        获取店铺log_base64() {
            return new Promise((resolve, reject) => {
                this.$request("/api-u/users/imgtobase64",{ url: this.shop.signboard },"post",true).then(x => {
                    if (x.data.code == 200) {
                        this.店铺logo_base64 = "data:image/jpeg;base64," + x.data.data;
                        resolve(x);
                    } else {
                        reject("获取图片base64错误");
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
            html2canvas(el, options).then(
                canvas => {
                    this.qrcode = canvas.toDataURL();
                    // this.qrcode_show=true;
                    openloading(false);
                    this.QRCode_box = true;
                },
                { useCORS: true }
            );
        },
        //关闭二维码
        close_1() {
            this.QRCode_box = false;
        },
        //进入店铺
        toshop() {
            this.$router.push("/sjzst2?shopid=" + this.commodity.shopid);
        },
        //查询单个商品
        get_commodity() {
            api_根据id查询商品(this.id).then(x=>{
                var data=x.data.data;
                this.img_list = x.data.data.img ? x.data.data.img.split(",") : []
                if(data.remark=='<p><br></p>'){
                    data.remark='';
                }
                data.remark=data.remark ? data.remark.replace(/contenteditable="true"/g,'').replace(/contenteditable='true'/g,'') : '';
                // var str = "<div>"+ data.remark+'</div>';
                // try {
                // var div = $(str);
                //     div.children().attr('contenteditable',false);
                //     data.remark=div.html();
                // } catch (error) {}
                this.commodity = data;
                this.get_shop();
                openloading(false);
            }).catch(err=>{})
        },
        //根据Id查询店铺
        get_shop() {
            this.$axios({
                method: "get",
                url: "/api-s/shops/findByShopid/" + this.commodity.shopid
            }).then(x => {
                console.log("根据Id查询店铺信息", x);
                this.shop = x.data.data;
                if(this.$route.query.fenxiang){
                    if(this.$route.query.userid){
                        this.添加扫码记录(this.$route.query.userid)
                        localStorage.yaoqing=this.$route.query.userid;
                    }else{
                        this.添加扫码记录(this.shop.userid);
                    }
                }
                var query={
                        destinations:this.当前位置.y +"," + this.当前位置.x, //起点
                        origins: this.shop.y + "," + this.shop.x    //终点
                    }
                api_查询两点距离(query).then(r=>{
                    console.log('查询距离返回值',r)
                    if (r.data.status == 0 && r.data.result.length > 0) {
                        var 距离=r.data.result[0].distance.value;
                        if(距离<500){
                            this.店铺距离=距离+'m'
                        }else{
                            this.店铺距离= (距离/1000).toFixed(1)+'km'
                        }
                    }
                }).catch(err=>{})
            }).catch(err => {
                console.log(err);
            });
        },
        添加访问记录() {
            var obj = {
                commodityid: this.id,
                userid: this.userInfo.username
            };
            this.$axios.post("/api-s/shops/addCommodityPopularity", obj).then(x => {
                console.log("添加人气", x);
            }).catch(err => { });
        },
        添加扫码记录(分享者id){
            if(!this.userInfo || !this.userInfo.username){
                return
            }
            var obj={
                    id:"",
                    shopid:this.commodity.shopid,
                    commodityid:this.commodity.id,
                    agentid:分享者id,
                    createtime:"",
                    userid:this.userInfo.username
                }
            console.log('添加扫码1',obj);
            api_添加扫码奖赏记录(obj).then(x=>{
                console.log('添加扫码1',x)
            }).catch(err=>{
                console.log(err);
            })
        }
    },
    beforeCreate() {
        // console.group('------beforeCreate创建前状态------');
    },
    created() {
        // console.group('------created创建完毕状态------');
    },
    beforeCreate() {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted() {
        openloading(true);
        var this_1=this
        this.clipboard = new ClipboardJS(this.$refs.复制, {
            text: function () {
                return this_1.shop.wechat;
            }
        });
        

        this.id = this.$route.query.id;
        this.评论初始化(this.id);
        this.查询评价();
        this.获取代理人信息();
        //查询单个商品
        // this.get_commodity();
        if(!this.当前位置 || this.当前位置.x=='' || this.当前位置.y==''){
            this.获取位置().then(x=>{
                this.get_commodity();
            }).catch(err=>{
                this.get_commodity();
            })
        }else{
            this.get_commodity();
        }

        this.商品查询专享(this.id).then(x => {
            if (x.data.code == 200) {
                if (x.data.data.length > 0) {
                    this.专享 = x.data.data[0];
                }
            }
        }).catch(err => {});
        this.isshop = this.$route.query.isshop ? false : true;
        if(this.$route.query.fenxiang){
            this.是否是分享=true;
            this.isshop=false;
            localStorage.backUrl="/commodity/CommodityDetails?id="+this.id+"&isshop=1";
            if(this.$route.query.userid){
                localStorage.yaoqing=this.$route.query.userid;
            }
        }

        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }
        

        //查询收藏
        if (this.userInfo) {
            this.get_findDataUserFavorite();
            this.添加访问记录();
        }

        // console.group('------mounted 挂载结束状态------');
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
        img_list() {
            this.$nextTick(function () {
                console.log("数据渲染完成");
                if (this.img_list.length > 1) {
                    this.getswiper();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.mui-bar-nav {
    box-shadow: none;
}
.mui-bar {
    background-color:rgba(0, 0, 0, 0);
    // background-color: rgba(0,0,0,0);
    .erweima,
    .返回上一页{
        margin: 5px 0px 0px;
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
    .导航栏{
        display: flex;
        line-height: 30px;
        width: 150px;
        margin: 6px auto 0px;
        justify-content: space-between;
        li{
            padding: 0px 2px;
            color: rgba(246, 246, 246, 1);
            font-size: 14px;
        }
        .active{
            border-bottom: 2px solid #ffffff;
        }
    }
}
.mui-content {
    padding-bottom: 50px;
    padding-top: 0px;
    background: #ffffff;
}


.底部栏{
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 50px;
    background: #ffffff;
    display: flex;
    padding: 0px 24px;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f6f6f6;
    a{
        color: inherit;
    }
    .圆形{
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        margin: 0px 20px 0px 0px;
        background: rgba(245, 104, 39, 1);
        color: #ffffff;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        i{
            font-size: 20px;
            height: 20px;
            line-height: 20px;
        }
    }
    .圆形.active{
        color: rgba(248, 236, 44, 1);
    }
    .按钮{
        flex-grow: 1;
        text-align: center;
        height: 32px;
        text-align: center;
        line-height: 32px;
        background: rgba(245, 104, 39, 1);
        border-radius: 32px;
        font-size: 14px;
        color: #ffffff;
        font-weight: bold;
    }
}

.添加微信提示{
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    >ul{
        width: 210px;
        border-radius: 16px;
        background: #ffffff;
        text-align: center;
        padding: 15px 0px 20px;
        >li:nth-child(1){
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
            font-weight: bold;
        }
        >li:nth-child(2){
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
            line-height: 150%;
            padding: 20px 0px;
        }
        >li:nth-child(3){
            color: rgba(0, 122, 255, 1);
        	font-size: 14px;
        }
    }
}


.box_1 .swiper-slide {
    height: 2.82rem;
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}

.box_2 {
    padding: 9px 12px 15px;
    background: #ffffff;
    position: relative;
    
    .title {
        display: flex;
        white-space: nowrap;
        justify-items: center;
        .商品名 {
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-grow: 1;
        }
        .人气 {
            color: #a6a6a6;
            font-size: 12px;
        }
    }
    .Price {
        display: flex;
        align-items: flex-end;
        margin: 5px 0px 4px;
        > div:nth-child(1) {
            margin: 0px 5px 0px 0px;
        }
        > div:nth-child(2) {
            flex-grow: 1;
        }
    }
    .sellingPrice {
        color: $header_background;
        font-size: 19px;
        font-weight: bold;
    }
    .marketPrice {
        color: rgba(166, 166, 166, 1);
        font-size: 12px;
    }
    .danwei {
        font-size: 12px;
        color: #424242;
        margin: 0px 0px 0px 5px;
    }
    .sales {
        color: rgba(166, 166, 166, 1);
        font-size: 12px;
    }
    .Red_envelopes {
        display: flex;
        align-items: center;
        > div:nth-child(1) {
            flex-grow: 1;
            display: flex;
            align-items: center;
        }
        .icon_1 {
            color: rgba(256, 76, 76, 1);
            font-size: 22px;
            margin: 0px 5px 0px 0px;
        }
        .qian {
            font-size: 12px;
        }
        .专享图片{
            width: 22px;
            height: 22px;
            margin: 0px 5px 0px 15px;
        }
        .专享 {
            font-size: 12px;
            color: $header_background;
        }
        .btn_1 {
            width: 60px;
            height: 20px;
            font-size: 10px;
            border-radius: 20px;
            line-height: 18px;
            border: 1px solid $header_background;
            text-align: center;
            color: $header_background;
        }
    }
    .分享赚外快{
        width: 40px;
        height: 47px;
        position: absolute;
        right: 85px;
        bottom: 9px;
        img{
            width: 100%;
            height: 100%;
            animation: 抖动 2s linear infinite;
            // transform-origin:50% 100%;
            // animation-delay:2s;
        }
    }
}
@keyframes 抖动 {
    0%{
        transform: rotate(0deg);
    }5% {
        transform: rotate(-15deg);
    }10%{
        transform: rotate(15deg);
    }15%{
        transform: rotate(0deg);
    }20%{
        transform: rotate(-15deg);
    }25%{
        transform: rotate(15deg);
    }30%{
        transform: rotate(0deg);
    }100%{

    }
}


.box_3 {
    border-bottom: 1px solid #f6f6f6;
    border-top: 3px solid #f6f6f6;
    .item {
        padding-right: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span:nth-child(1) {
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
        }
        > span:nth-child(2) {
            color: rgba(166, 166, 166, 1);
            font-size: 12px;
        }
    }
}

.box_7 {
    background-color: rgba(255, 255, 255, 1);
    height: 44px;
    display: flex;
    padding: 0px 12px;
    align-items: center;
    margin: 3px 0px 0px;
    border-top: 3px solid #f6f6f6;
    img {
        width: 50px;
        height: 38px;
        margin: 0px 10px 0px 0px;
        border-radius: 5px;
    }
    > li:nth-child(1) {
        flex-grow: 1;
        display: flex;
        align-items: center;
    }
    > li:nth-child(2) {
        width: 60px;
        height: 24px;
        text-align: center;
        border-radius: 24px;
        border: 1px solid #589ce9;
        font-size: 10px;
        line-height: 22px;
        color: #589ce9;
    }
    .店铺信息{
        flex-grow: 1;
        padding: 0px 10px 0px 0px;
        width: 0;
    }
    .店铺地址{
        color: rgba(166, 166, 166, 1);
        font-size: 10px;            
        display: flex;
        >span:nth-child(1){
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        >span:nth-child(2){
            flex-shrink: 0;

        }
    }
    .shopname {
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
    }
    .pingfen {
        color: $header_background;
        font-size: 10px;
        margin: 0px 0px 0px 3px;
    }
}

.介绍标题{
    background: #f6f6f6;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    >li:nth-child(1),
    >li:nth-child(3){
        width: 60px;
    	height: 1px;
        background: rgba(229, 229, 229, 1);
    }
    >li:nth-child(2){
        color: rgba(56, 56, 56, 1);
    	font-size: 14px;
        padding: 0px 10px;
    }
}
.box_5 {
    background: #ffffff;
    padding: 8px 12px;
    margin: 3px 0px 0px 0px;
}

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
    .content_1 {
        padding: 0px;
        width: 70%;
    }
}
.QRCode.rongqi {
    background: #ffffff;
    // border: 1px solid #000000;
    // top: 40px;
    position: fixed;
    left: -100%;
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
