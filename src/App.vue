<template>
    <div id="app" ref="app" @touchstart="触碰屏幕($event)"  @touchend="手指头离开屏幕($event)">
    <!-- <div id="app" ref="app" @touchstart="触碰屏幕($event)" @touchend="手指头离开屏幕($event)"> -->
        <!-- @touchstart="开始滑动($event)" v-on:touchmove ="滑动中($event)" @touchend="手指离开()" :class="{'回弹':回弹}" ref="muiContent" @scroll="content_scroll($event)" -->
        <div id="app下拉刷新区" @touchstart="触碰屏幕1($event)" v-on:touchmove ="滑动中($event)"  @touchend="手指头离开屏幕1($event)">
            <div class="app下拉显示内容" :class="{'回弹':回弹}" :style="{'height':下拉高度+'px'}">
                <div>
                    <i v-show="下拉高度<150" class="mui-icon mui-icon-arrowthindown"></i>
                    <i v-show="下拉高度>=150" class="mui-icon mui-icon-arrowthinup"></i>
                    <span>{{下拉高度<150 ? '继续下拉':"松开刷新"}}</span>
                </div>
            </div>
            <div class="app内容区">
                <transition :name="transitionName">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive && 显示页面"></router-view>
                    </keep-alive>
                </transition>
                <transition :name="transitionName">
                    <router-view v-if="!$route.meta.keepAlive && 显示页面"></router-view>
                </transition>
            </div>
        </div>
        


        <router-view name="circularNav" v-if="显示页面"></router-view>
        <router-view name="tuiguang" v-if="是否通过审核 && 显示页面 "></router-view>

        <!-- <router-view name="新主键"></router-view> -->

        <div ref="播放器容器" class="播放器容器">
            <!-- <audio id="tts_autio_id" autoplay="autoplay">
                <source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&per=1&text=请输入文字" type="audio/mpeg">
                <embed id="tts_embed_id" height="0" width="0" src="">
            </audio> -->
        </div>

        <!-- <div class="hongbaotishi">
            <div>
                <div>
                    <div>恭喜你</div>
                    <div>领取成功</div> 
                </div>            
            </div>
        </div> -->
        <!-- <div @click="change_radio_2()" class="radio_1" :class="{'active':radio_type_2}">
            <i class="icon iconfont icon-xuanze"></i>
        </div> -->
        <!-- window.scroll(0,0); -->
        <appgx v-show="安卓app更新.显示更新弹出框" v-if="显示页面"/>

        <mdnl v-show="显示买单按钮 && 用户排号.查询成功 && 用户排号.详情" v-if="显示页面"/>

        <dltk v-show="显示登录框"/>

        <zctk v-show="显示注册框"/>
        <!-- <tuiguang v-if="是否通过审核" /> -->

        <gzewm v-show="!是否关注 && !是否手动关闭"/>
    </div>
</template>

<script>
import appgx from '@/views/安卓更新.vue'
import mdnl from '@/components/买单按钮.vue'
const dltk = () => import("@/components/登录弹框.vue");
const zctk = () => import("@/components/注册弹框.vue");
const gzewm=()=>import('@/components/关注二维码弹出框.vue')
// import tuiguang from "@/views/home/home/推广红购使者.vue";

import { api_绑定推送 } from "@/api/绑定推送接口.js";

import { Get_URL_parameters , openloading} from "@/assets/js/currency";
import { mapGetters, mapState, mapActions } from "vuex";

import $ from 'jquery'
export default {
    name: "app",
    provide(){
        return {
            刷新页面:this.刷新页面,
        }
    },
    data() {
        return {
            显示页面:true,
            transitionName: "",
            userInfo: "",
            //有滑返回
            y1:0,
            y2:0,
            x1:0,
            x2:0,

            鼠标按下位置:0,
            鼠标拖动位置:0,
            是否可以下拉:false,
            回弹:false
        };
    },
    components:{
        appgx,
        mdnl,
        dltk,
        zctk,
        gzewm
        // tuiguang
    },
    computed: {
        ...mapGetters({
            最新版本:'版本信息/最新版本',
            更新描述:'版本信息/更新描述',

            安卓app更新:'app/安卓app更新/安卓app更新',
            显示买单按钮:"商家点单/显示买单按钮",
            用户排号:'用户点单排号/用户排号',
            是否可以下拉刷新:'是否可以下拉刷新',
            是否通过审核:'版本信息/是否通过审核',
            显示登录框:'显示登录框',
            显示注册框:'显示注册框',

            是否关注: 'user/是否关注',
            是否手动关闭: 'user/是否手动关闭'
        }),
        下拉高度(){
            var height=0;
            if(this.鼠标拖动位置>this.鼠标按下位置){
                height=this.鼠标拖动位置-this.鼠标按下位置
            }
            return height;
        }
    },
    methods: {
        刷新页面(){
            console.log(123)
            this.显示页面=false
            this.$nextTick(()=>{
                this.显示页面=true;
            })
        },
        ...mapActions({
            updated_user: "user/updated_user",
            get_user: "user/get_user",
            获取版本信息:'版本信息/获取版本信息',
            获取最新版本号:"版本信息/获取最新版本号",
            初始化app更新状态:'app/安卓app更新/初始化app更新状态',
            点单排号初始化:'用户点单排号/排号初始化',
            设置手动关闭:'user/设置手动关闭',
            判断用户是否关注: 'user/判断用户是否关注',
        }),
        触碰屏幕(e){
            //左滑返回
            this.y1= e.touches[0].clientY;
            this.x1=e.touches[0].clientX;
        },
        滑动中(e){
            //下拉刷新
            if(this.是否可以下拉刷新){
                var targetTouches = e.targetTouches[0];
                var y=targetTouches.clientY;
                this.鼠标拖动位置=y;
                if(this.鼠标按下位置<this.鼠标拖动位置){
                    e.preventDefault();
                }
            }
        },
        手指头离开屏幕(e){
            this.y2=e.changedTouches[0].clientY;
            this.x2=e.changedTouches[0].clientX;
        },
        触碰屏幕1(e){
            //下拉刷新
            if(this.是否可以下拉刷新){
                this.回弹=false
                var targetTouches = e.targetTouches[0];
                var y=targetTouches.clientY;
                this.鼠标按下位置=y;
            }
        },
        手指头离开屏幕1(e){
            if(this.是否可以下拉刷新){
                this.回弹=true;
                if(this.下拉高度>=150){
                    openloading(true);
                    setTimeout(x=>{
                        console.log('准备刷新');
                         window.location.reload()
                    },1000)
                }
                this.鼠标拖动位置=0;
            }
        },
        监听点击消息事件(msg){
            console.log('监听点击消息事件：'+JSON.stringify(msg))
            // try {
            //     var content= JSON.parse(msg.content);
            // } catch (error) {
            //     console.log('json解析错误');
            // }
            if(ApplicationType=='ios'){
                var content= JSON.parse(msg.content);
            }else{
                var content= JSON.parse(msg.payload);
            }
            plus.push.clear();
            /*activity
             *   money_voice 店铺到账
             *   order_meal  点单预定
            */
            if(content.activity=="money_voice"){
                console.log('跳转页面：'+'/myshop/xiaoshou/orderDetails?id='+content.orderId)
                this.$router.push('/myshop/xiaoshou/orderDetails?id='+content.orderId)
            }else{
                alert(content.activity+'未知数据类型')
            }
        },
        创建消息(msg){
            var content=JSON.parse(msg.content);
            plus.push.createMessage(content.body,msg.content);
            console.log('创建本地消息:'+msg.content);
            // {"activity":"money_voice","title":"红购收款通知","body":"红购到账:2.22元","orderId":"1000000108695338"}
            this.播放语音消息(content.body);
        },
        播放语音消息(ttsText){
            var ttsDiv = this.$refs.播放器容器;
            try {
                var ttsAudio = document.getElementById('tts_autio_id');
            // var ttsText = document.getElementById('ttsText').value;
                // 文字转语音
                ttsDiv.removeChild(ttsAudio);
            } catch (error) {}
            
            var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
            var sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=3&spd=5&text=' + ttsText + '" type="audio/mpeg">';
            var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
            var au2 = '</audio>';
            ttsDiv.innerHTML = au1 + sss + eee + au2;
            ttsAudio = document.getElementById('tts_autio_id');
            ttsAudio.volume = 1.0;
            ttsAudio.play();
        },
        检查版本是否通过审核(){
            var this_1=this;
            if(ApplicationType=='app' && AppType!='ios'){
                this_1.获取最新版本号().then(x=>{
                    if(this_1.最新版本 && this_1.最新版本!=当前版本号){
                        mui.confirm('有版本更新是否去更新？','更新提示',['下次再说','现在去'],value=>{
                            if(value.index==1){
                                this_1.$router.push('/appxiazai')
                            }
                        },'div')
                    }
                }).catch(err=>{})
            }
        },
        安卓版本更新提示(){
            this.获取最新版本号().then(x=>{
                if(this.最新版本 && this.最新版本!=当前版本号 && !this.安卓app更新.显示更新弹出框){
                    var html='<div style="color: rgba(80, 80, 80, 1);font-size: 12px;margin: 10px 0px 15px;">检测到新的版本'+this.最新版本+'</div>';
                        this.更新描述.forEach(item => {
                            html+='<div style="color: rgba(80, 80, 80, 1);font-size: 12px;text-align: left;">'+item+'</div>'
                        });

                    mui.confirm(html,'提示',['<span style="color: rgba(80, 80, 80, 1);font-size: 14px;">取消</span>','<span style="color: rgba(0, 122, 255, 1);font-size: 14px;">更新</span>'],value=>{
                        if(value.index==1){
                            // this_1.$router.push('/appxiazai');
                            this.初始化app更新状态()
                        }
                    },'div')
                }
            })
        },
        判断关注(){
            this.判断用户是否关注().then(x=>{
                if(!this.是否手动关闭 && !this.是否关注){
                    setTimeout(x=>{
                        this.判断关注()
                    },2000)
                }
            })
        }
    },
    beforeCreate: function () {
        //邀请注册页面 http://192.168.1.13:8080/#/Recommend?pid=9379FECD5A5C1CAB47983D6870DF6D27&invitationtype=1

        // console.log(this.$route);
        var agent = navigator.userAgent.toLowerCase();
        var hash = window.location.hash;
        if (hash.indexOf("invitationtype") != -1) {
            localStorage.yaoqing = window.location.hash;
        }
        localStorage.return_url = window.location.hash;
        if (agent.match(/MicroMessenger/i) == "micromessenger") {
            console.log("微信浏览器内访问");
            //判断是否是邀请页面
            var weixin = localStorage.weixin;
            var weixininfo = localStorage.weixininfo;
            if (!weixin || weixin == null || weixin == undefined || weixin == "undefined" || !weixininfo || weixininfo == null || weixininfo == undefined || weixininfo == "undefined") {
                console.log("没有微信信息");
                location.href = "getopenid.html";
            } else {
                console.log("已有微信信息");
            }
        } else {
            console.log("不是微信");
        }

        //显示启动页
        if (ApplicationType == 'app') {
            var diyici = localStorage.diyici;
            console.log(diyici);
            if (!diyici || diyici == '' || diyici == 'false' || diyici == null || diyici == undefined) {
                this.$router.push('/appYingdaoye');
            }
        }

        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        this.设置手动关闭(false);
        this.判断关注()
        console.log('%c一直被模仿，从未被超越!', 'color:#d9393b;font-size:20px', "— —");
        var this_1=this;
            this.获取版本信息();
            console.log(this.$route)
        if(this.$route.path!='/sjdd/qrzf'){
            this.点单排号初始化();
        }
        

        function getPushInfo(){  
            var info = plus.push.getClientInfo();  
            console.log( "获取客户端推送标识信息："+JSON.stringify(info));  
            console.log( "token: "+info.token );  
            console.log( "clientid: "+info.clientid );  
            console.log( "appid: "+info.appid );  
            console.log( "appkey: "+info.appkey );
        }
        // 接收消息推送
        function 接收消息推送(){
            document.addEventListener("resume", function () {  
                console.log("应用从后台切换到前台");
                //主要用于ios
                this_1.获取版本信息();
                //安卓版本更新提示
                if(ApplicationType=='app' && AppType!='ios'){
                    this_1.安卓版本更新提示();
                }
            }, false);

            if(ApplicationType=='app' && AppType!='ios'){
                this_1.安卓版本更新提示();
            }
            
            //清楚所有推送消息
            plus.push.clear();
            getPushInfo();
            // 监听点击消息事件
            plus.push.addEventListener( "click", function( msg ) {
                // 判断是从本地创建还是离线推送的消息
                // switch( msg.payload ) {
                //     case "LocalMSG":
                //         console.log('点击本地创建消息启动：')
                //     break;
                //     default:
                //         console.log('点击离线推送消息启动：')
                //     break;
                // }
                console.log('监听点击消息:'+JSON.stringify(msg))
                // {"content":"消息测试","payload":"消息测试123","appid":"vip.redmall.zyq","title":"红购","__UUID__":"androidPushMsg1125045016"}
                // 处理其它数据
                this_1.监听点击消息事件(msg);
            }, false );
            // 监听在线消息事件
            plus.push.addEventListener( "receive", function( msg ) {
                // if ( msg.aps ) {  // Apple APNS message
                //     console.log('接收到在线APNS消息：')
                // } else {
                //     console.log('接收到在线透传消息：')
                // }
                console.log('收到通知:'+JSON.stringify(msg))
                if(AppType!='ios'){
                    this_1.创建消息(msg)
                }else{
                    this_1.监听点击消息事件(msg);
                }
            }, false );

            if(AppType!='ios'){
                plus.push.setAutoNotification( false );
            }
        }

        
        if (window.plus) {
            接收消息推送();
        } else {
            document.addEventListener('plusready', 接收消息推送, false);
        }
        

        var agent = navigator.userAgent.toLowerCase();

        setTimeout(()=>{
            this.$refs.app.addEventListener("swiperight",function(){
                console.log(this_1.$route.meta)
                setTimeout(()=>{
                    if(this_1.y1<this_1.y2+30){
                        // alert("x1:"+this_1.x1+',x2:'+this_1.x2+',y1:'+this_1.y1+',y2:'+this_1.y2+'可以返回')
                        console.log(this_1.$route.meta)
                        if(!this_1.$route.meta.不能返回上一页){
                            console.log(window.history.length)
                            if(window.history.length==1){
                                this_1.$router.push('/my')
                            }else{
                                console.log('返回上一页')
                                history.back();
                            }
                        }
                    }
                },300)
                // if(ApplicationType!='app'){
                //     if (agent.match(/MicroMessenger/i) == "micromessenger") {
                //         WeixinJSBridge.call('closeWindow');
                //     }else{
                //     }
                // }else{
                //     try {
                //         var main = plus.android.runtimeMainActivity();  
                //         main.moveTaskToBack(false);
                //     } catch (error) {
                //     }
                // }
            });
        },3000)
        


        this.$store.state.weixin_ready = false;

        var this_1 = this;
        // var path = this.$route.path;
        var path = window.location.hash;

        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }

        if(this.userInfo){
            if (!this.userInfo.headImgUrl) {
                this.updated_user().then(x => {
                    this.get_user().then(res => {
                    }).catch(err => {});
                }).catch(err => {
                    console.log(err);
                });
            }
        }
        

        //支付宝授权后跳转地址
        // var url = Get_URL_parameters("url");
        // console.log('支付宝授权页面',url)
        // if (url) {
        //     var url_1 =location.protocol+"//"+location.host+location.pathname+"#/"+url+location.search;
        //     console.log(url_1);
        //     location.href = url_1;
        // }

        var jsApiList = [
            // 'onMenuShareTimeline',  //分享  即将废弃
            "onMenuShareAppMessage", //分享 即将废弃
            // 'onMenuShareQQ',            //分享 即将废弃
            // 'onMenuShareWeibo',         //分享到腾讯微博
            // 'onMenuShareQZone',
            "updateAppMessageShareData", //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
            // 'startRecord',      //开始录音接口
            // 'stopRecord',       //停止录音接口
            "onVoiceRecordEnd", //监听录音自动停止接口
            "playVoice", //播放语音接口
            "pauseVoice", //暂停播放接口
            "chooseWXPay", //微信支付
            "getLocation",   //获取地理位置接口
            "openLocation", //使用微信内置地图查看位置接口
            "scanQRCode" //扫一扫
        ];

        // 获取js签名
        this.$axios({
            method: "post",
            // url: '/api-v/pay/getSandboxSignKey',
            url: "http://m.lxad.vip/test/jssdk/jssdk.php"
            // url: "http://m.lxad.vip/test/jssdk/jssdktest.php"
        }).then(x => {
            console.log("jssdk签名", x);
            var data = x.data;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名
                jsApiList: jsApiList // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                console.log(123);
                this_1.$store.state.weixin_ready = true;
                // console.log('config信息验证后会执行ready方法');
            });
            wx.error(function (res) {
                console.log("config信息验证失败", res);
            });
        }).catch(err => {
            console.log(err);
        });

        //初始化一些vuex数据
        
        //登录信息
        var loginDate = localStorage.loginDate;
        this.$store.commit("setloginDate", loginDate);
        //微信登录的信息
        var weixinobj = localStorage.weixin;
        this.$store.commit("setweixinobj", weixinobj);
        //查询店铺类型
        this.$store.commit("setShopTree");
        //获取地区
        if (localStorage.area && localStorage.area != "" && localStorage.area != undefined && localStorage.area != "undefined") {
            this.$store.state.area = JSON.parse(localStorage.area);
        }
        //初始化分类
        try {
            var list = JSON.parse(localStorage.shops_tree_list);
            this.$store.state.shops_tree_list = list;
        } catch (error) { }
        //获取地区
        this.$store.dispatch("get_area");
        // console.group('------mounted 挂载结束状态------');
        //使用 jquery 统一添加失去焦点
        var 获得焦点=false
        $('body').on('blur','input,div[contenteditable="true"],li[contenteditable="true"]',function(){
            // console.log('jq失去焦点')
            获得焦点=false
            setTimeout(()=>{
                if(!获得焦点){
                    // console.log('收回键盘')
                    window.scroll(0, 0);
                }
            },300)
        })
        $('body').on('focus','input,div[contenteditable="true"],li[contenteditable="true"]',function(){
            // console.log('jq获得焦点')
            获得焦点=true;
        })
        // http://192.168.1.8:8080/#/commodity/CommodityDetails?id=117&isshop=1
        
        

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
        $route(to, from) {
            // console.log('路由发生变化');
            this.获取版本信息()
            var meta = to.meta;
            if (!meta.无需登录) {
                var userInfo = localStorage.userInfo;
                if (!userInfo || userInfo == null || userInfo == undefined) {
                    console.log('app未登陆跳转页面',to)
                    if(to.query.pid){
                        localStorage.backUrl=to.fullPath
                    }
                    this.$router.push('/login')
                }
            }
        }
    }
};
</script>


<style lang="scss">
@import "@/assets/css/config.scss";
html, body {
    // height: 100%;
    // width: 100%;
    // top: 0px;
    // left: 0px;
    // max-height: 100%;
    // margin: 0px;
    // padding: 0px;
    // overflow: hidden;
    // -webkit-touch-callout: none !important;
    // -webkit-user-select: none !important;
    // position: absolute;
    
}
.mui-table-view-cell:after{
    left: 0px;
    background-color: #f6f6f6;
    transform: scaleY(1);
}
* {
    user-select:auto;
    -webkit-user-select: auto;
}
.播放器容器{
    position: fixed;
    top: 0px;
    left: -100%;
}
.mui-bar{
    z-index: 1002;
}
.mui-poppicker {
    z-index: 1000;
}
.mui-table-view:after {
    display: none;
}
.mui-table-view:before {
    display: none;
}

.mui-bar {
    background-color: $header_background;
    a {
        color: #ffffff;
    }
}
.mui-title {
    color: #ffffff;
}

html,
body {
    height: 100%;
    line-height: inherit;
}

#app {
    height: 100%;
}

#app下拉刷新区{
    height: 100%;
    display: flex;
    flex-direction: column;
    .app下拉显示内容{
        >div{
            padding: 40px 0px 0px;
        }
        flex-shrink: 0;
        width: 100%;
        overflow: hidden;
        background: #f6f6f6;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        font-size: 14px;
        color: #4a4a4a;
        z-index: 0;
        i{
            font-size: 20px;
        }
    }
    .app下拉显示内容.回弹{
        transition: all 0.5s;
    }
    .app内容区{
        flex-grow: 1;
        position: relative;
    }
    .app内容区.回弹{
        transition: all 0.5s;
    }
}

ul {
    padding: 0px;
    margin: 0px;
}

li {
    list-style: none;
}

.mui-toast-container {
    bottom: 50%;
}
.mui-content {
    overflow: auto;
    background-color: #f6f6f6;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    /* will-change: transform; */
    transition: all 0.3s;
    // position: absolute;
    // width: 100%;
}
.slide-right-enter {
    opacity: 0;
    // transform: translate3d(100%, 0, 0);
}
.slide-right-leave-active {
    opacity: 0;
    // transform: translate3d(-100%, 0, 0);
}
.slide-left-enter {
    opacity: 0;
    // transform: translate3d(-100%, 0, 0);
}
.slide-left-leave-active {
    opacity: 0;
    // transform: translate3d(100%, 0, 0);
}

.radio_1 {
    display: inline-block;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 12px;
    border-radius: 100%;
    border: 2px solid #cccccc;
    overflow: hidden;
    i {
        font-size: 8px;
        display: none;
    }
}
.radio_1.active {
    background: rgba(58, 182, 237, 1);
    border: 2px solid rgba(58, 182, 237, 1);
    color: #ffffff;
    i {
        display: inline-block;
    }
}
</style>
