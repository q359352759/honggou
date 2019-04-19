<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{全部信息.店铺信息.name}}</h1>
            <span class="title_header_1">
                <div>
                    <i :class="{'icon-shoucangdianjihou shouchang':全部信息.收藏信息,'icon-shoucang1':!全部信息.收藏信息}" @click="添加和删除收藏()" class="icon iconfont"></i>
                </div>
                <div @click="分享二维码()">
                    <i class="icon iconfont icon-fenxiang2"></i>
                </div>
            </span>
        </header>
        <div class="mui-content mui-fullscreen" :style="{'padding-bottom':全部信息.购买商品列表.length>0 ? '72px' : '0px'}" @scroll="content_scroll($event)" ref="muiContent">

            <sjxq />

            <ul class="店铺公告">
                <li>
                    <i class="icon iconfont icon-laba"></i>
                </li>
                <li>
                    <marquee class="noticeText ng-binding" direction="left" behavior="scroll" scrolldelay="20" truespeed scrollamount="1" width="100%" style="width: 100%;">{{(全部信息.店铺公告 && 全部信息.店铺公告.remark) ? 全部信息.店铺公告.remark : '恭喜'+(全部信息.店铺信息.name ? 全部信息.店铺信息.name : '')+'成功开通数字店铺'}}</marquee>
                </li>
            </ul>

            <ul class="查看类型" ref="定位高度">
                <li @click="选择查看类型(0)" :class="{'active':查看类型==0}">选购</li>
                <!-- <li @click="选择查看类型(1)" :class="{'active':查看类型==1}">买单</li> -->
                <!-- <li @click="$router.push('/Check?shopid='+全部信息.shopid)" :class="{'active':查看类型==1}">买单</li>   -->
                <li @click="跳转输入金额()" :class="{'active':查看类型==1}">买单</li>
                <li @click="选择查看类型(2)" :class="{'active':查看类型==2}">评价</li>
                <li @click="选择查看类型(3)" :class="{'active':查看类型==3}">介绍</li>
                <ul class="左边" v-show="查看类型==0" :style="{'height':左侧高度+'px'}">
                    <li @click="点击左边分组('滚动锚点'+index)" :class="{'active':全部信息.左侧栏定位=='滚动锚点'+index}" v-for="(item, index) in 全部信息.选购列表导航" :key="index">{{item}}</li>
                    <li @click="点击左边分组('滚动锚点'+(index+3))" :class="{'active':全部信息.左侧栏定位=='滚动锚点'+(index+3)}" v-if="item.商品.length>0" v-for="(item, index) in 全部信息.商品分组">{{item.groupname}}</li>
                    <li @click="点击左边分组('滚动锚点a')" :class="{'active':全部信息.左侧栏定位=='滚动锚点a'}" v-if="新未分组商品.length>0">未分组</li>
                </ul>
            </ul>
            <ul class="查看类型 定位" v-show="滚动条高度+44>=定位高度">
                <li @click="选择查看类型(0)" :class="{'active':查看类型==0}">选购</li>
                <!-- <li @click="选择查看类型(1)" :class="{'active':查看类型==1}">买单</li> -->
                <!-- <li @click="$router.push('/Check?shopid='+全部信息.shopid)" :class="{'active':查看类型==1}">买单</li> -->
                <li @click="跳转输入金额()" :class="{'active':查看类型==1}">买单</li>
                <li @click="选择查看类型(2)" :class="{'active':查看类型==2}">评价</li>
                <li @click="选择查看类型(3)" :class="{'active':查看类型==3}">介绍</li>
                <ul class="左边" v-show="查看类型==0" :style="{'height':左侧高度+'px'}">
                    <li @click="点击左边分组('滚动锚点'+index)" :class="{'active':全部信息.左侧栏定位=='滚动锚点'+index}" v-for="(item, index) in 全部信息.选购列表导航" :key="index">{{item}}</li>
                    <li @click="点击左边分组('滚动锚点'+(index+3))" :class="{'active':全部信息.左侧栏定位=='滚动锚点'+(index+3)}" v-if="item.商品.length>0" v-for="(item, index) in 全部信息.商品分组">{{item.groupname}}</li>
                    <li @click="点击左边分组('滚动锚点a')" :class="{'active':全部信息.左侧栏定位=='滚动锚点a'}" v-if="新未分组商品.length>0">未分组</li>
                </ul>
            </ul>

            <div class="底部" v-show="查看类型==0">
                <!-- <ul class="左边" :style="{'padding-top':左侧定位+'px'}">
                    <li @click="点击左边分组('滚动锚点'+index)" :class="{'active':全部信息.左侧栏定位=='滚动锚点'+index}" v-for="(item, index) in 全部信息.选购列表导航" :key="index">{{item}}</li>
                    <li @click="点击左边分组('滚动锚点'+(index+3))" :class="{'active':全部信息.左侧栏定位=='滚动锚点'+(index+3)}" v-if="item.商品.length>0" v-for="(item, index) in 全部信息.商品分组">{{item.groupname}}</li>
                    <li @click="点击左边分组('滚动锚点a')" :class="{'active':全部信息.左侧栏定位=='滚动锚点a'}" v-if="新未分组商品.length>0">未分组</li>
                </ul> -->
                <ul class="右边" ref="右边">
                    <!-- 红包列表 -->
                    <div ref="滚动锚点0" ref-name="滚动锚点0">
                        <hblb />
                    </div>
                    <div ref="滚动锚点1" ref-name="滚动锚点1" class="商品列表" v-if="新人专享商品.length!=0 || 生日专享商品.length!=0">
                        <div class="分组标题">特惠专享</div>
                        <dgsp :obj="obj" v-for="obj in 新人专享商品"/>
                        <dgsp :obj="obj" v-for="obj in 生日专享商品"/>
                    </div>
                    <div ref="滚动锚点2" ref-name="滚动锚点2" class="商品列表" v-if="老顾客专享.length>0">
                        <div class="分组标题">老顾客专享</div>
                        <dgsp :obj="obj" v-for="obj in 老顾客专享"/>
                    </div>
                    
                    <div :ref="'滚动锚点'+(index+3)" :ref-name="'滚动锚点'+(index+3)" class="商品列表" v-if="item.商品.length>0" v-for="(item, index) in 全部信息.商品分组" :key="index">
                        <div class="分组标题">{{item.groupname}}</div>
                        <dgsp :obj="obj" v-for="obj in item.商品"/>
                    </div>
                    <div ref="滚动锚点a" ref-name="滚动锚点a" class="商品列表" v-if="新未分组商品.length>0">
                        <div class="分组标题">未分组</div>
                        <dgsp :obj="obj" v-for="obj in 新未分组商品"/>
                    </div>
                </ul>
            </div>

            <pinglun v-show="查看类型==2"/>

            <jianjie v-if="查看类型==3"/>

            <div class="大图" v-if="全部信息.显示大图" @click="close_swper()">
                <div class="mask"></div>
                <div>
                    <swperdome :imglist="环境图片" :index="全部信息.大图_index" />
                </div>
            </div>
            
        </div>
        
        <!-- 购物车 -->
        <gwc/>
        <!-- 分享红包 -->
        <fenxianghongbao v-if="全部信息.是否显示分享红包" :hongbaoid="全部信息.分享红包id" :shop="全部信息.店铺信息" :hongbao="全部信息.分享红包" @setshow="setxinrenhongbao_show" />
        <!-- 分享二维码 -->
        <dpewm ref="dpewm" :shop="全部信息.店铺信息" :xinrenhongbao="新人红包" :fenxiangid="userInfo ? userInfo.username : ''"/>
    
    </div>
</template>

<script>
import { api_根据shopid查询店铺, api_店铺添加人气 } from "@/api/店铺接口.js";

import sjxq from "./商家点单/商家详情.vue";
import pinglun from './商家点单/评论.vue';
import jianjie from './商家点单/简介.vue';
import hblb from "./商家点单/红包列表.vue";
import dgsp from "./商家点单/单个商品.vue";
import gwc from "./商家点单/购物车.vue";

import dpewm from '@/components/分享二维码/店铺二维码.vue';
import swperdome from "@/components/swperdome.vue";
import fenxianghongbao from "@/components/home/myshop/fenxianghongbao.vue";

import { openloading , limit} from "@/assets/js/currency.js";
import { mapGetters, mapActions } from "vuex";


import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";

export default {
    name:"",
    components:{
        sjxq,
        pinglun,
        jianjie,
        swperdome,
        hblb,
        dgsp,
        gwc,
        fenxianghongbao,
        dpewm
    },
    data() {
        return {
            ApplicationType:ApplicationType,
            shopid:"",
            定位高度:0,
            滚动条高度:0,
            查看类型:0,
            右侧容器高度:[],
            是否点击左侧:false,

            userInfo:"",
            xinrenhongbao_box:false,
            isfenxiang:false,
            hongbaoid:"",
            fenxiang_hongbao: {},
            erweima_base64:"",
            qrcode: null,
            分享人id:"",
            浏览器高度:0
        }
    },
    computed: {
        ...mapGetters({
            全部信息:'商家点单/全部信息',
            环境图片:'商家点单/环境图片',
            新人专享商品:'商家点单/新人专享商品',
            生日专享商品:'商家点单/生日专享商品',
            老顾客专享:'商家点单/老顾客专享',
            新未分组商品:'商家点单/新未分组商品',
            新人红包:"商家点单/新人红包",
            用户排号:'用户点单排号/用户排号'
        }),
        左侧高度(){
            var height=this.浏览器高度-(this.全部信息.购买商品列表.length>0 ? 72 : 0);
            if(this.滚动条高度+44>=this.定位高度){
                height=height-44-36
            }else{
                height=height-this.定位高度+this.滚动条高度
            }
            return height;
        },
        左侧定位(){
            var top=0;
                top=this.定位高度+36;
                if(this.滚动条高度+44>=this.定位高度){
                    top=this.滚动条高度+44+36
                }
                // top=this.定位高度+36-this.滚动条高度
            // if(top<=44+36){
            //     return 44+36
            // }else{
            //     return top;
            // }

            return top;
        },
    },
    methods: {
        ...mapActions({
            初始化:'商家点单/初始化',
            设置牌号:"商家点单/设置牌号",
            评价下一页:'商家点单/评价下一页',
            设置显示大图:'商家点单/设置显示大图',
            添加和删除收藏:"商家点单/添加和删除收藏",
            设置显示分享的红包:"商家点单/设置显示分享的红包",
            获取用户红包:"商家点单/获取用户红包",
            分享图片: 'app/分享/分享图片',
            查询用户排号:"用户点单排号/查询用户排号",
            点单排号初始化:"用户点单排号/排号初始化",
            设置是否显示登录框:"设置是否显示登录框"
        }),
        分享二维码(){
            this.$refs.dpewm.显示分享图片()
        },
        跳转输入金额(){
            if(!this.userInfo){
                this.设置是否显示登录框(true);
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // },'div');
                return;
            }
            this.$router.push('/sjzst2/zzmd?shopid='+this.全部信息.shopid)
        },
        //显示新人红包弹出框
        setxinrenhongbao_show(x,y) {
            console.log("收到参数", x);
            this.全部信息.是否显示分享红包 = x;
            console.log(y)
            if(y){
                this.获取用户红包();
            }
        },
        点击左边分组(key){
            var this_1=this;
            this.全部信息.左侧栏定位=key
            var options = {
                container: this.$refs.muiContent,
                easing: 'ease-in',
                offset: -80,
                force: true,
                cancelable: true,
                onStart: function(element) {
                // scrolling started
                    console.log('onStart开始滚动')
                    this_1.是否点击左侧=true
                },
                onDone: function(element) {
                    console.log('onDone')
                    setTimeout(()=>{
                        this_1.是否点击左侧=false
                    },1000)
                },
                onCancel: function() {
                    console.log("onCancel");
                    // scrolling has been interrupted
                },
                x: false,
                y: true
            }
            console.log(this.$refs[key]);
            if(!this.$refs[key]){
                return
            }
            if(this.$refs[key].constructor ==Array ){
                this.$scrollTo(this.$refs[key][0], 300, options)
            }else{
                this.$scrollTo(this.$refs[key], 300, options)
            }
            // return
            // console.log(key)
            // console.log(this.$refs[key]);
            // if(this.$refs[key].constructor ==Array ){
            //     // this.$refs[key][0].scroll(0,100)
            // }else{
            //     // this.$refs[key].scroll(0,100)
            // }
            // this.$refs.muiContent.scroll(0,100)
            // this.$refs.muiContent.scrollTo(0,100,true)
            // this.$refs[key][0].scrollIntoView()
            // scrollTop
        },
        close_swper(){
            console.log('关闭');
            this.设置显示大图([false,0])
        },
        content_scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            this.滚动条高度=t;
            if(this.查看类型==0){
                if(!this.是否点击左侧){
                    // scrollIntoView
                    this.右侧容器高度=[];
                    var divlist=this.$refs.右边.children;
                    for(let i=0;i<divlist.length;i++){
                        this.右侧容器高度.push(divlist[i].offsetTop)
                    }
                    var index=limit(this.右侧容器高度,this.滚动条高度);
                    this.全部信息.左侧栏定位 = this.$refs.右边.children[index].getAttribute('ref-name');
                }
            }
            if (h + t >= sh - 10) {
                if(this.查看类型==2){
                    this.评价下一页();
                }
            }
        },
        选择查看类型(type){
            this.查看类型=type;
            try {
                setTimeout(x=>{
                    this.$refs.muiContent.scrollTo(0, this.定位高度-44, true);            
                },300)
            } catch (error) {}
        },
        async 数据初始化(){
            
            if(!this.用户排号.查询成功){
                this.点单排号初始化();
                await this.查询用户排号();
            }
            if(!this.用户排号.查询成功){
                mui.alert('查询历史点单失败，稍后再试', "提示", "我知道了", function () { }, "div");
                history.back();
                return;
            }else{
                if(this.用户排号.详情 && this.用户排号.详情.shopid!=this.shopid){
                    mui.confirm("有未支付点单，支付后才能进行下次点单，是否现在去支付？", "提示", ["取消", "是的"],value=>{
                        if (value.index == 1) {
                            this.$router.push('/sjdd/qrzf');
                        }else{
                            this.$router.push('/home');
                        }
                    })
                    return;
                }
            }
            
            console.log('用户排号：',this.用户排号);

            this.设置牌号(this.$route.query.ph);
            this.初始化(this.shopid).then(x=>{
                console.log('初始化完成');
                this.全部信息.分享红包id = this.$route.query.hongbaoid ? this.$route.query.hongbaoid : "";
                // this.全部信息.是否分享过来=this.$route.query.fenxiang ? true : false;
                this.全部信息.是否分享过来=true;
                this.全部信息.分享人id=this.$route.query.userid ? this.$route.query.userid : '';
                this.设置显示分享的红包()
            })
        }
    },
    mounted() {
        if(!this.$route.query.ph){
            mui.alert('无桌号信息，请重新扫描', "提示", "确定", function () {
                history.back();
            }, "div");
        }
        console.log('页面加载完成')
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}
        this.shopid=this.$route.query.shopid;
        this.浏览器高度=window.innerHeight
        

        this.数据初始化()
        
        this.定位高度=this.$refs.定位高度.offsetTop;
        localStorage.backUrl=this.$route.fullPath
        // console.log(this.$route);

        if(this.userInfo){
            var obj = {
                shopid: this.shopid,
                userid: this.userInfo.username
            };
            api_店铺添加人气(obj)
        }
        
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.title_header_1 {
    font-size: 17px;
    font-weight: 400;
    line-height: 44px;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 1;
    padding: 0px 10px 0px 0px;
    color: #ffffff;
    display: flex;
    > div {
        margin: 0px 0px 0px 5px;
    }
    i {
        margin: 0px 5px;
    }
    .shouchang {
        color: #e0fd00;
    }
}
.店铺公告 {
    background: #ffffff;
    display: flex;
    height: 37px;
    margin: 3px 0px;
    position: relative;
    z-index: 2;
    align-items: center;
    > li:nth-child(1) {
        width: 47px;
        flex-shrink: 0;
        text-align: center;
        color: $header_background;
    }
    > li:nth-child(2) {
        flex-grow: 1;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        background-color:rgba(241, 102, 103, 1);
        height: 32px;
        line-height: 32px;
    }
}


.查看类型{
    width: 100%;
    flex-shrink: 0;
    height: 36px;
    background: #ffffff;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    line-height: 36px;
    padding: 0px 35px;
    >li{
        width: 60px;
        text-align: center;
        color: rgba(128, 128, 128, 1);
    	font-size: 14px;
    }
    >li.active{
        color: $header_background;
        font-weight: bold;
        border-bottom: 2px solid $header_background;
    }
}   
.查看类型.定位{
    position: fixed;
    top: 44px;
}
.左边{
        width: 70px;
        background: #f6f6f6;
        overflow: auto;
        position: absolute;
        left: 0px;
        top: 36px;
        z-index: 0;
        li{
        	height: 55px;
            background: #ffffff;
            border-bottom: 1px solid #f6f6f6;
            text-align: center;
            line-height: 55px;
            font-size: 12px;
            color: rgba(128, 128, 128, 1);
        }
        .active{
            background: #f6f6f6;
            color:$header_background;
        }
    }
.底部{
    .左边{
        width: 70px;
        background: #f6f6f6;
        overflow: auto;
        position: absolute;
        left: 0px;
        // top: 0px;
        bottom: 0px;
        z-index: 0;
        height: 100%;
        li{
        	height: 55px;
            background: #ffffff;
            border-bottom: 1px solid #f6f6f6;
            text-align: center;
            line-height: 55px;
            font-size: 12px;
            color: rgba(128, 128, 128, 1);
        }
        .active{
            background: #f6f6f6;
            color:$header_background;
        }
    }
    padding: 0px 0px 0px 70px;
    z-index: 0;
    .右边{
        flex-grow: 1;
        .商品列表{
            padding: 0px 6px 0px;
        }
        .分组标题{
            height: 36px;
            line-height: 36px;
            color: rgba(128, 128, 128, 1);
        	font-size: 12px;
            padding: 0px 4px;
        }
    }
}

.大图 {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    // background: #000000;
    align-items: center;
    z-index: 11;
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        background: #000000;
    }
}


// 二维码
.qrcode_box {
    width: 273px;
    background: #ffffff;
    position: fixed;
    padding: 20px 25px;
    left: -100%;
    // top: 40px;
    .header_1 {
        display: flex;
        .img_box {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            margin: 0px 5px 0px 0px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
        .text_1 {
            height: 42px;
            width: 0;
            flex-grow: 1;
            color: rgba(80, 80, 80, 1);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            > div:nth-child(1) {
                font-size: 14px;
                overflow: auto;
                white-space: nowrap;
                width: 100%;
            }
            > div:nth-child(2) {
                font-size: 12px;
                white-space: nowrap;
                overflow: auto;
                color: #afafaf;
                width: 100%;
            }
        }
    }
    .erweima {
        margin: 20px auto 8px;
        width: 200px;
        height: 200px;
        position: relative;
        > img {
            position: absolute;
            width: 50px;
            height: 50px;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            margin: auto;
            border-radius: 10px;
        }
        > div {
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .footer_1 {
        color: rgba(80, 80, 80, 1);
        font-size: 12px;
        text-align: center;
        .hongbao {
            color: #d43030;
        }
    }
}

.QRCode {
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
