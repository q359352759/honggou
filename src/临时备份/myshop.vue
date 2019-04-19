<template>
    <div id="myshop">
        <header class="mui-bar mui-bar-nav">
            <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
            <a @tap="返回上一页()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">
                <span v-if="myshop.state!=3">
                    {{myshop.name}}
                </span>
                <span v-if="myshop.state==3">
                    已下架
                </span>
            </h1>
            <span v-if="myshop.state!=3" class="erweima mui-pull-right " @click="分享二维码()"><i class="icon iconfont icon-31erweima"></i></span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="box_1">
                <li @tap="ShopDetails()">
                    <img :src="myshop.signboard" alt="" srcset="">
                    <div>编辑店铺</div>
                </li>
                <li>
                    <h1>{{myshop.address}}</h1>
                    <h2>营业时间：{{myshop.openTime}}--{{myshop.closeTime}}</h2>
                    <h3>联系电话：{{myshop.phone}}</h3>
                </li>
                <li>
                    <div>
                        <i v-if="myshop.referrerPhone" @click="set_referrer_show(true)" class="icon iconfont icon-kefunv"></i>
                    </div>
                    <div @click="$router.push('/xieyi/shangjiashouce')" class="手册">《商家使用手册》</div>
                </li>
            </ul>

            <ul class="box_2">
                <li>
                    <div @click="$router.push('/myshop/Member/MemberList')"><i class="icon iconfont icon-huiyuan1"></i></div>
                    <div>会员</div>
                </li>
                <li>
                    <div @click="$router.push('/myshop/shangping/guanli')"><i class="icon iconfont icon-shangping"></i></div>
                    <div>商品</div>
                </li>
                <li>
                    <div @click="跳转分销()"><i class="icon iconfont icon-distribute"></i></div>
                    <div>
                        {{是否通过审核 ? '分销' : '资讯'}} 
                    </div>
                </li>
                <li>
                    <div @click="$router.push('/myshop/xiaoshou/xiaoshou')"><i class="icon iconfont icon-leijixiaoshoue"></i></div>
                    <div>销售</div>
                </li>
                <li>
                    <div @click="$router.push('/Marketing')"><i class="icon iconfont icon-laba2"></i></div>
                    <div>营销</div>
                </li>
            </ul>
            <ul class="box_2">
                <!-- <li v-show="!是否通过审核">
                    <div @click="$router.push('/Notice')"><i class="icon iconfont icon-laba"></i></div>
                    <div>公告</div>
                </li> -->
                <li>
                    <div @click="跳转点单()"><i class="icon iconfont icon-diandan"></i></div>
                    <div>点单</div>
                </li>
                <li>
                    <div @click="$router.push('/myshop/jieshao')"><i class="icon iconfont icon-jianjie"></i></div>
                    <div>介绍</div>
                </li>
                <li>
                    <div @tap="$router.push('/albumManagement')"><i class="icon iconfont icon-xiangce"></i></div>
                    <div>相册</div>
                </li>
                <li>
                    <div @click="$router.push('/myshop/comment/commentList')">
                        <i class="icon iconfont icon-pinglun"></i>
                        <span class="角标" v-if="评论待回复数量!=0">{{评论待回复数量}}</span>    
                    </div>
                    <div>评论</div>
                </li>
                <li v-if="店铺身份==1">
                    <div @click="$router.push('/myshop/dianyuan/guanli')"><i class="icon iconfont icon-icon_dianyuanguanli"></i></div>
                    <div>店员</div>
                </li>
                <li v-if="店铺身份==2">
                    <div @click="设置打卡框(true)"><i class="icon iconfont icon-qiandao-xianxing"></i></div>
                    <div>打卡</div>
                </li>
            </ul>

            <div class="box_3" v-show="!是否通过审核">
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right" @click="$router.push('/myshop/Member/MemberList')">
                            <div class="cont_1">
                                <div class="mui-pull-right">
                                    共计：{{顾客.total}}人
                                </div>
                                <div>今日新增会员：{{今日新增}}人</div>
                            </div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell" v-if="是否通过审核">
                        <a class="mui-navigate-right">
                            <div class="cont_1">
                                <div class="mui-pull-right">
                                    共计：0人
                                </div>
                                <div>
                                    待审核分销员：0人
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right" @click="$router.push('/myshop/xiaoshou/xiaoshou')">
                            <div class="cont_1">
                                <div class="mui-pull-right">
                                    本月：{{本月销售.data ? 本月销售.data : 0}}元
                                </div>
                                <div>
                                    今日营业额：{{今日销售.data ? 今日销售.data : 0}}元
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell" @click="跳转提现()">
                        <a class="mui-navigate-right">
                            <div class="cont_1">
                                <div class="mui-pull-right tixian">
                                    提现
                                </div>
                                <div>
                                    可提现金额：{{ketixian}}元
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            <div class="cont_1">
                                <div>
                                    本月群发：0条
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell" v-if="是否通过审核">
                        <a class="mui-navigate-right" @click="跳转红购返利()">
                            <div class="cont_1">
                                <div>
                                    红利返现
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right" @click="进入店铺()">
                            <div class="cont_1">
                                <div>
                                    店铺预览
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            <ul class="box_4" v-show="是否通过审核">
                <li @click="$router.push('/myshop/Member/MemberList')">
                    <div class="标题 标题1">会员</div>
                    <div>今日：{{今日新增}}人</div>
                    <div>累计：{{顾客.total}}人</div>
                </li>
                <li>
                    <div class="标题 标题1">分销员</div>
                    <div class="红色字体">待审核：-0人</div>
                    <div>累计：-0人</div>
                </li>
                <li @click="$router.push('/myshop/xiaoshou/xiaoshou')">
                    <div class="标题 标题1">营业额</div>
                    <div>今日：{{今日销售.data ? 今日销售.data : 0}}元</div>
                    <div>本月：{{本月销售.data ? 本月销售.data : 0}}元</div>
                </li>
                <li>
                    <div class="标题 标题1">群发</div>
                    <div>本月：-0条</div>
                </li>
                <li @click="$router.push('/myshop/dth')">
                    <div class="标题 标题1">待提货</div>
                    <div class="红色字体">{{待取货数量}}单</div>
                </li>
                <li @click="跳转提现()">
                    <div class="标题 标题1">可提现</div>
                    <div>{{ketixian}}元</div>
                </li>
                <li @click="$router.push('/Notice')">
                    <div class="标题">店铺公告</div>
                </li>
                <li @click="进入店铺()">
                    <div class="标题">店铺预览</div>
                </li>
                <li @click="跳转红购返利()">
                    <div class="标题">红利返现</div>
                </li>
            </ul>

            <button @click="$router.push('/myshop/js/tgjs')">推广奖赏</button>

            <div class="店铺下架通知" v-if="myshop.state==3">
                <div class="下架图片">
                    <img src="image/yixiajia.png" alt="" srcset="">
                </div>
                <div class="提示语">您的店铺已被下架</div>
                <div class="text_box" v-html="myshop.cause"></div>
                <a :href="'tel:'+区域代理商.phone" v-if="区域代理商">
                    <btn value="联系客服" />
                </a>
            </div>
        </div>

        <tuijianren v-if="myshop.referrerPhone" v-show="referrer_show" />

        <daka v-show="显示打卡框" />
        <!-- 分享二维码 -->
        <dpewm ref="dpewm" :店铺内="true" :shop="myshop" :xinrenhongbao="xingren_hongbao"/>
    
    </div>
</template>

<script>

import { api_查询订单列表 } from "@/api/订单接口.js";
import { api_申请红购使者 } from "@/api/红购使者接口.js";
import { api_根据userid查询代理人信息 } from "@/api/代理人接口.js";
import { api_获取代理商列表 } from "@/api/代理商接口.js";
import { api_查询评论列表 } from "@/api/评论接口.js";

// html2canvas
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { openloading, getDateStr } from "@/assets/js/currency.js";
import { getCurrentMonthFirst, getCurrentMonthLast } from "@/assets/js/time.js";
import $ from "jquery";
import { mapActions, mapGetters } from "vuex";

import tuijianren from "@/components/myshop/tuijianren.vue";
import btn from "@/components/button.vue";
import daka from "./打卡/打卡弹出框.vue";
import dpewm from '@/components/分享二维码/店铺二维码.vue';

export default {
    name: "",
    components: {
        tuijianren,
        btn,
        daka,
        dpewm
    },
    data() {
        return {
            区域代理商: "",
            店主代理人信息: {
                查询成功: false,
                详情: "",
            },
            ApplicationType: ApplicationType,
            qrcode: null,
            qrcode_show: false,
            erweima_base64: "",
            xingren_hongbao: {},
            今日新增: 0,
            顾客: {
                //主要用于统计人数
                query: {
                    start: 0,
                    length: 1,
                    shopid: "",
                    order: "createTime", //PAYMENTAMOUNT 消费 createTime 时间
                    orderType: "DESC" //ASC DESC
                },
                list: [],
                total: 0,
                loading: false,
                paget_index: 0
            },
            定时器: "",
            评论待回复数量:0,
            待取货数量:0
        };
    },
    computed: {
        ...mapGetters({
            weixinobj: 'weixinobj',
            myshop: "get_myshop",
            zichan: "myshops/zichan/g_zichan",
            referrer_show: "myshops/referrer_show",
            referrer: "myshops/referrer",
            今日销售: "myshops/销售/今日销售",
            本月销售: "myshops/销售/本月销售",
            店铺身份: "myshops/身份",
            显示打卡框: "myshops/显示打卡框",
            获取招募信息: "myshops/分销/获取招募信息",
            招募信息: 'myshops/分销/招募信息',
            是否通过审核:'版本信息/是否通过审核'
        }),
        ketixian() {
            if (this.zichan && this.zichan.balance) {
                return Math.floor(this.zichan.balance * 100) / 100;
            } else {
                return 0;
            }
        }
    },
    methods: {
        ...mapActions({
            getMyshop: "getMyshop",
            设置推荐人: "myshops/设置推荐人",
            set_zichan_shopid: "myshops/zichan/set_shopid",
            findshopTurnoverByShopid: "myshops/zichan/findshopTurnoverByShopid",
            set_referrer_show: "myshops/set_referrer_show", //推荐人显示框
            查询销售统计: "myshops/销售/查询销售统计",
            get_agentUser_phone: "agent/get_agentUser_phone",
            查询所有店员: "myshops/店员/查询所有店员",
            设置打卡框: "myshops/设置打卡框",

            查询班次: "myshops/班次/查询班次",
            考勤时间初始化: "myshops/班次/考勤时间初始化",
            查询考勤时间: "myshops/班次/查询考勤时间",
            查询自己的打卡记录: "myshops/打卡/查询自己的打卡记录",
            分享图片: 'app/分享/分享图片',
            查询店铺招募信息: 'myshops/分销/查询店铺招募信息',
            设置重新提交: "myshops/分销/设置重新提交"
        }),
        返回上一页() {
            var back = this.$route.query.back;
            if (back) {
                history.back();
            } else {
                this.$router.push('/my')
            }
        },
        分享二维码(){
            this.$refs.dpewm.显示分享图片()
        },
        跳转红购返利() {
            if (this.店主代理人信息.查询成功) {
                if (this.店主代理人信息.详情.type == 1) {   //代理人
                    this.$router.push('/Agent?userid=' + this.myshop.userid + '&back=1')
                } else {
                    this.$router.push('/shizhe/honggoushizhe?userid=' + this.myshop.userid + '&type=fanxian')
                }
            } else {
                mui.toast("获取相关信息失败，稍后再试.", { duration: "long", type: "div" });
            }
        },
        跳转提现() {
            this.$router.push("/myshop/WithdrawMoney");
        },
        获取今日新增会员() {
            this.$axios.get("/api-s/shops/countTodayshopCustomer/" + this.myshop.shopid).then(x => {
                console.log("获取今日新增", x);
                if (x.data.code == 200) {
                    this.今日新增 = x.data.data;
                }
            }).catch(err => { });
        },
        获取顾客() {
            this.顾客.query.start = this.顾客.query.length * this.顾客.paget_index;
            this.顾客.query.shopid = this.myshop.shopid;
            this.$axios.get("/api-s/shops/findShopCustomerAll", { params: this.顾客.query }).then(x => {
                console.log("获取店铺顾客", x);
                if (x.data.code == 200) {
                    this.顾客.list = this.顾客.list.concat(x.data.data.data);
                    this.顾客.total = x.data.data.total;
                }
            }).catch(err => { });
        },
        进入店铺() {
            sessionStorage.removeItem("backUrl");
            this.$router.push("/sjzst2?shopid=" + this.myshop.shopid);
        },
        close_1() {
            this.qrcode_show = false;
        },
        跳转点单(){
            //  mui.toast("功能开发中", { duration: "long", type: "div" });
            //  return
            this.$router.push('/myshop/ddgl/ddgl')
        },        
        //跳转店铺详情
        ShopDetails() {
            this.$store.state.in_index = 0;
            this.$router.push("/ShopDetails");
        },
        //查询店铺新人
        get_hongbao() {
            var query = {
                start: 0,
                length: 10,
                ccc: 1,
                type: 0,
                shopid: this.myshop.shopid
            };
            this.$request("/api-s/shops/redenvelope/findAll", query, "get").then(x => {
                console.log("查询店铺新人红包", x);
                if (x.data.code == 200) {
                    if (x.data.data.data.length > 0) {
                        this.xingren_hongbao = x.data.data.data[0];
                    }else{
                        mui.alert('店铺新人红包未发布', "提示", "我知道了", function () { }, "div");
                    }
                }
            }).catch(err => {});
        },
        跳转分销() {
            if(this.是否通过审核){
                if (this.获取招募信息 == 0) {
                    this.$router.push('/myshop/fenxiao/shenqingJieshao')
                } else if (this.获取招募信息 == 1) {
                    this.$router.push('/myshop/fenxiao/fabuzhaomu')
                } else {
                    mui.toast("正在获取招募信息，稍后再试", { duration: "long", type: "div" });
                }
            }else{
                mui.toast("暂未开放", { duration: "long", type: "div" });
            }
        },
        async shopinit() {
            openloading(true);
            if (!this.myshop || !this.myshop.shopid) {
                await this.getMyshop();
            }
            var 查询代理商_query = {
                start: 0,
                length: 10,
                areaCode: this.myshop.areaCode
            }
            api_获取代理商列表(查询代理商_query).then(x => {
                if (x.data.code == 200) {
                    if (x.data.data.data.length > 0) {
                        this.区域代理商 = x.data.data.data[0]
                    }
                }
            })
            api_根据userid查询代理人信息(this.myshop.userid).then(x => {
                console.log('查询代理人信息', x)
                if (x.data.code == 200 || x.data.code == 201) {
                    if (!x.data.data) {
                        var 申请使者对象 = {
                            areaCode: this.myshop.areaCode, //区域code
                            realName: this.myshop.iaiName, //真实姓名
                            userid: this.myshop.userid,
                            phone: this.myshop.phone,
                            openid: this.weixinobj.openid
                        }
                        api_申请红购使者(申请使者对象).then(x => {
                            console.log('添加红购使者', x);
                            //再次查询代理人信息
                            this.api_根据userid查询代理人信息(this.myshop.userid).then(r => {
                                if (r.data.code == 200 || r.data.code == 201) {
                                    this.店主代理人信息.查询成功 = true;
                                    this.店主代理人信息.详情 = r.data.data;
                                }
                            })
                        })
                    } else {
                        this.店主代理人信息.查询成功 = true
                        this.店主代理人信息.详情 = x.data.data;
                    }
                }
            })

            this.get_hongbao();
            this.set_zichan_shopid(this.myshop.shopid);
            this.findshopTurnoverByShopid().then(x => {
                openloading(false);
            });
            // this.获取营业统计()
            this.查询销售统计(this.myshop.shopid);
            this.获取今日新增会员();
            this.获取顾客();
            this.查询所有店员();
            this.考勤时间初始化();
            this.查询班次();
            this.查询考勤时间();
            this.查询自己的打卡记录();
            this.查询店铺招募信息().then(x => {
                if (this.招募信息.state == 1) {
                    this.设置重新提交(false);
                }
            })

            var 待取货_query={
                start: 0,
                length: 10,
                // state: 1,
                // userid: this.userInfo.username,
                logstatus:3,
                shopid:this.myshop.shopid 
            }
            api_查询订单列表(待取货_query).then(x=>{
                this.待取货数量=x.data.code==200 ? x.data.data.total : 0
            })

            if (this.myshop.referrerPhone) {
                this.get_agentUser_phone(this.myshop.referrerPhone).then(x => {
                    if (x.data.code == 200) {
                        this.设置推荐人(x.data.data);
                    }
                }).catch(err => { });
            }
            var 查询待回复评论={
                    start:0,
                    length:10,
                    shopid:this.myshop.shopid,
                    shopreplytype:0,
                }
            api_查询评论列表(查询待回复评论).then(x=>{
                this.评论待回复数量=x.data.code==200 ? x.data.data.total : 0;
            })

        }
    },
    beforeCreate: function () {
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        // var a=[];
        //     a[0]='ssssssss';
        //     console.log(typeof a[0])
        this.shopinit();
    },
    activated() {
        this.getType = 0;
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
        // document.querySelector(".mui-slider_1").removeEventListener("slide", function() {});
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {}
};
</script>



<style lang="scss" scoped>
@import "@/assets/css/config.scss";
// header_background
.店铺下架通知 {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    padding: 123px 0px 0px;
    text-align: center;
    .图标 {
        font-size: 90px;
        color: rgba(212, 34, 27, 1);
    }
    .提示语 {
        margin: 20px 0px;
        color: rgba(212, 48, 48, 1);
        font-size: 14px;
    }
    .text_box {
        padding: 0px 30px 60px;
        text-align: left;
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
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

.erweima {
    color: #ffffff;
    line-height: 44px;
    font-size: 20px;
}
.box_1 {
    display: flex;
    padding: 0.1rem;
    background: #ffffff;
    margin: 0px 0px 3px;
    li:nth-child(1) {
        width: 0.6rem;
        height: 0.6rem;
        position: relative;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
        }
        div {
            position: absolute;
            width: 100%;
            background: rgba(153, 153, 153, 0.6);
            color: #ffffff;
            left: 0px;
            bottom: 0px;
            font-size: 0.1rem;
            text-align: center;
        }
    }
    li:nth-child(2) {
        width: 0;
        flex-grow: 1;
        margin: 0px 0.1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 3px 0px;
        h1 {
            font-weight: 400;
            color: rgba(56, 56, 56, 1);
            font-size: 0.12rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0px;
        }
        h2 {
            margin: 0px;
            font-weight: 400;
            color: rgba(56, 56, 56, 1);
            font-size: 0.12rem;
        }
        h3 {
            margin: 0px;
            font-weight: 400;
            color: rgba(56, 56, 56, 1);
            font-size: 0.12rem;
        }
    }
    li:nth-child(3) {
        flex-shrink: 0;
        color: #1c94d8;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        justify-content: space-between;
        padding: 3px 0px;
        i {
            font-size: 0.3rem;
        }
        .手册 {
            font-size: 12px;
        }
    }
}
.box_2 {
    display: flex;
    text-align: center;
    background: #ffffff;
    padding: 8px 0px 5px;
    > li {
        width: 20%;
        > div:nth-child(1) {
            width: 0.35rem;
            height: 0.35rem;
            border-radius: 100%;
            color: #ffffff;
            background: $header_background;
            line-height: 0.35rem;
            font-size: 20px;
            margin: 0px auto 5px;
            position: relative;
            .角标{
                font-size: 10px;
                color: #ffffff;
                min-width: 22px;
            	height: 16px;
                position: absolute;
                top: -5px;
                left: 60%;
                background: rgba(246, 78, 80, 1);
                line-height: 16px;
                border-radius: 16px;
                padding: 0px 2px;
            }
        }
        > div:nth-child(2) {
            color: #505050;
            font-size: 0.12rem;
        }
    }
}
.box_3 {
    margin: 5px 0px 0px;
    color: #505050;
    font-size: 0.12rem;
    .cont_1 {
        padding-right: 0.25rem;
    }
    .tixian {
        color: #1c94d8;
    }
}
.box_4{
    margin: 3px 0px 0px;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    position: relative;
    color: rgba(128, 128, 128, 1);
	font-size: 10px;
    >li{
        width: calc(100% / 3);
        border-bottom: 1px solid #f6f6f6;
        background: #ffffff;
        padding: 10px 0px ;
    }
    div{
        white-space: nowrap;
        overflow: auto;
    }
    .标题{
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        font-weight: bold;
    }
    .标题1{
        margin: 0px 0px 5px 0px;
    }
    .红色字体{
        color: $header_background;
    }
}
.box_4::after,
.box_4::before{
    position: absolute;
    top: 0px;
    content: "";
    width: 1px;
    height: 100%;
    background: #f6f6f6;
}
.box_4::after{
    left: calc(100% / 3);
}
.box_4::before{
    right: calc(100% / 3);
}


.进入店铺 {
    margin: 27px 0px;
}
</style>


<style lang="scss">
#myshop .qrcode_box {
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
</style>