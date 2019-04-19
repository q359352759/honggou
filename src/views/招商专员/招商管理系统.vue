<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">招商管理系统</h1>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <ul class="头部">
                <li class="头像">
                    <img v-if="!userInfo.headImgUrl" src="image/12121.png" alt="" srcset="">
                    <img v-if="userInfo.headImgUrl" :src="userInfo.headImgUrl" alt="" srcset="">
                </li>
                <li class="用户信息">
                    <div>
                        <span class="用户名" v-if="实名信息">{{实名信息.name}}</span>
                        <span class="用户名" v-if="!实名信息">{{userInfo.nickname}}</span>
                        <span class="二维码" @click="生成二维码(1)"><i class="icon iconfont icon-31erweima"></i></span>
                        <span class="推荐头像" v-show="专员基本信息.lepid" @click="显示推荐人=true"><i class="icon iconfont icon-kefunv"></i></span>
                    </div>
                    <div class="专员级别">{{专员等级[专员基本信息.lelevel]}}</div>
                </li>
                <li class="右边" @click="$router.push('/zhuanyuan/tuanduiJianshe')">
                    <i class="icon iconfont icon-tuandui2"></i>
                    <div>团队建设</div>
                </li>
                <li class="右边" @click="生成二维码(2)">
                    <i class="icon iconfont icon-woshou1"></i>
                    <div>招募代理</div>
                </li>
            </ul>

            <ul class="中间内容">
                <li @click="设置显示类型(0)" :class="{'active':显示类型==0}">
                    <div class="图标"><i class="icon iconfont icon-fenrun"></i></div>
                    <div class="文本1">招商收益</div>
                    <div class="钱">￥-0</div>
                </li>
                <li @click="设置显示类型(1)" :class="{'active':显示类型==1}">
                    <div class="图标"><i class="icon iconfont icon-tuandui"></i></div>
                    <div class="文本1">团队奖励</div>
                    <div class="钱">￥-0</div>
                </li>
                <li @click="设置显示类型(2)" :class="{'active':显示类型==2}">
                    <div class="图标"><i class="icon iconfont icon-ketixianjine"></i></div>
                    <div class="文本1">可提现</div>
                    <div class="钱">￥-0</div>
                </li>
            </ul>
            <div ref="定位点"></div>

            <!-- 招商收益 -->
            <zshy v-show="显示类型==0"/>
            <!-- 团队奖励 -->
            <tdjl v-show="显示类型==1"/>
            <!-- 体现 -->
            <tx v-show="显示类型==2"/>

            <div class="底部">
                <ul v-show="显示类型==0">
                    <li>代理商：-0人</li>
                    <li>直推奖：-0元</li>
                    <li>总收益：-0元</li>
                </ul>
                <ul v-show="显示类型==1">
                    <li>招商团队：{{招商团队统计.areatotal ? 招商团队统计.areatotal : 0 }}人</li>
                    <li>总间推：{{招商团队统计.phavedividendTotal ? 招商团队统计.phavedividendTotal : 0}}元</li>
                    <li>总差额：{{招商团队统计.pindirectjackpotTotal ? 招商团队统计.pindirectjackpotTotal : 0}}元</li>
                </ul>
            </div>
        </div>

        <mimashuru ref="mimashuru" v-if="显示密码输入框" @close="close_1" @shuruQueding="shuruQueding"/>
        <xingmingShuru ref="xingmingShuru" v-if="显示姓名输入" @close="close_xingming" @xingmingQueding="xingmingQueding"/>

        <shengchengErweima ref="shengchengErweima" :url="邀请地址" :title="邀请标题"/>
        
        <tuijianren v-show="显示推荐人" @close="显示推荐人=false"/>
    </div>
</template>

<script>
import mimashuru from '@/components/密码输入框.vue';
import xingmingShuru from '@/components/支付姓名输入框.vue';
import tuijianren from "@/components/推荐人弹出框.vue";

import shengchengErweima from './components/邀请二维码.vue'

import zshy from './components/招商收益.vue';
import tdjl from './components/团队奖励.vue';
import tx from './components/提现.vue';
import { mapActions, mapGetters } from "vuex";
export default {
    name:"",
    components:{
        zshy,
        tdjl,
        tx,
        mimashuru,
        xingmingShuru,
        shengchengErweima,
        tuijianren
    },
    data() {
        return {
            显示姓名输入:false,
            显示推荐人:false,
            userInfo:'',
            专员等级:['','实习专员','正式专员','招商主管','招商经理'],
            邀请地址:'',
            邀请标题:""
        }
    },
    computed: {
        ...mapGetters({
            显示类型:'招商专员/招商管理/显示类型',
            显示密码输入框:"招商专员/招商管理/显示密码输入框",
            实名信息:"实名认证/实名信息",
            专员基本信息:'专员基本信息',
            招商团队:"招商专员/招商管理/招商团队",
            招商团队统计:'招商专员/招商管理/招商团队统计'
        })
    },
    methods: {
        ...mapActions({
            设置显示类型:"招商专员/招商管理/设置显示类型",
            设置定位:"招商专员/招商管理/设置定位",
            设置显示密码输入框:"招商专员/招商管理/设置显示密码输入框",
            数据初始化:'招商专员/招商管理/数据初始化',
            获取认证:'实名认证/获取认证',
            查询专员信息:'查询专员信息',
        }),
        生成二维码(type){
            if(type==1){
                //邀请专员
                this.邀请地址='http://m.lxad.vip/test/dist/index.html' + "#/zhuanyuan/shenqing?pid=" + this.userInfo.username;
                this.邀请标题='邀请你成为红购招商专员';
                this.$refs.shengchengErweima.显示分享()
            }else{
                //邀请代理商
                this.邀请地址='http://m.lxad.vip/test/dist/index.html' + "#/RegionalAgencyAgreement?pid=" + this.userInfo.username;
                this.邀请标题="邀请你成为红购代理商";
                this.$refs.shengchengErweima.显示分享();
            }
        },
        //关闭输入框
        close_1(x){
            this.设置显示密码输入框(false);
        },
        //关闭姓名输入框
        close_xingming(){
            this.显示姓名输入=false;
        },
        //密码输入确定
        shuruQueding(){
            this.设置显示密码输入框(false);
            console.log(this.$refs.mimashuru.支付密码);
            this.显示姓名输入=true;
        },
        //输入姓名确定
        xingmingQueding(){
            this.显示姓名输入=false;
            console.log(this.$refs.xingmingShuru.姓名)
        },
        scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            // this.fixed = e.target.scrollTop + 44 >= this.$refs.定位点.offsetTop;
                this.设置定位(e.target.scrollTop + 44 >= this.$refs.定位点.offsetTop)
            if (h + t >= sh - 10 ) {
            }
        }
    },
    mounted() {
        this.userInfo = JSON.parse(localStorage.userInfo);
        // "9379FECD5A5C1CAB47983D6870DF6D27"
        // this.获取认证("9379FECD5A5C1CAB47983D6870DF6D27");
        
        this.查询专员信息(this.userInfo.username);
        this.获取认证(this.userInfo.username);
        this.数据初始化(this.userInfo.username);
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.mui-content{
    padding-bottom: 50px;
}
.头部{
    flex-shrink: 0;
    padding: 12px 15px;
    background: #ffffff;
    display: flex;
    .头像{
        width: 44px;
    	height: 44px;
        flex-shrink: 0;
        margin: 0px 7px 0px 0px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }
    .用户信息{
        flex-grow: 1;
        font-size: 14px;
        >div:nth-child(1){
            display: flex;
            align-items: center;
        }
        .用户名{
            color: rgba(80, 80, 80, 1);
            margin: 0px 13px 0px 0px;
            font-weight: bold;
        }
        .二维码{
            color: rgba(116, 120, 112, 1);
            margin: 0px 13px 0px 0px;
            font-size: 18px;
            height: 18px;
        }
        .推荐头像{
            color: rgba(36, 148, 212, 1);
            font-size: 18px;
            height: 18px;
        }
        .专员级别{
            color: rgba(128, 128, 128, 1);
        	font-size: 10px;
        }
    }
    .右边{
        height: 44px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin: 0px 0px 0px 14px;
        text-align: center;
        i{
            color: rgba(24, 148, 220, 1);
            font-size: 24px;
        }
        div{
            color: rgba(128, 128, 128, 1);
        	font-size: 10px;
        }
    }
}

.中间内容{
    display: flex;
    justify-content: space-between;
    text-align: center;
    background: #ffffff;
    margin: 4px 0px 4px;
    padding: 0px 0.5rem 0px;
    li{
        padding: 5px 11px;
    }
    li.active{
        border-bottom: 2px solid $header_background;
    }
    .图标{
        width: 38px;
    	height: 38px;
        margin: 0px auto 3px;
        text-align: center;
        line-height: 38px;
        border-radius: 100%;
        background: $header_background;
        color: #ffffff;
        font-size: 24px;
    }
    .文本1{
        color: rgba(128, 128, 128, 1);
    	font-size: 10px;
    }
    .钱{
        color: rgba(212, 48, 48, 1);
    	font-size: 10px;
    }
}

.底部{
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    ul{
        display: flex;
        height: 32px;
        background: $header_background;
        line-height: 32px;
        color: rgba(255, 255, 255, 1);
        font-size: 11px;
        text-align: center;
        li{
            width: calc(100% / 3);
        }
    }
}


</style>
