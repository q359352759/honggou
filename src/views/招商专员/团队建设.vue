<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">团队建设</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="box_1">
                <li :class="{'active':专员基本信息 && 专员基本信息.lelevel>=4}">
                    <div>
                        <span class="标题">招商经理</span>
                        <span class="红色字体">分红70000元</span>
                    </div>
                    <div class="文字">要求：团队下拥有三个招商主管</div>
                </li>
                <li :class="{'active':专员基本信息 && 专员基本信息.lelevel>=3}">
                    <div>
                        <span class="标题">招商主管</span>
                        <span class="红色字体">分红50000元</span>
                    </div>
                    <div class="文字">要求：团队下3个专员累计招募9个合格代理商，每个专员至少招募1个合格代理商</div>
                </li>
                <li :class="{'active':专员基本信息 && 专员基本信息.lelevel>=2}">
                    <div>
                        <span class="标题">正式专员</span>
                        <span class="红色字体">分红30000元</span>
                    </div>
                    <div class="文字">要求：招募三个以上合格代理商（收入超过1万元的代理商）</div>
                </li>
                <li :class="{'active':专员基本信息 && 专员基本信息.lelevel>=1}">
                    <div>
                        <span class="标题">实习专员</span>
                        <span class="红色字体">分红20000元</span>
                    </div>
                </li>
            </ul>

            <ul class="升级说明" v-if="专员基本信息 && 专员基本信息.lelevel==3">
                <li class="标题">你离招商经理还差：</li>
                <li>招商主管：1个（还差2个）</li>
            </ul>
            <ul class="升级说明" v-if="专员基本信息 && 专员基本信息.lelevel==2">
                <li class="标题">你离招商主管还差：</li>
                <li>招募了1个合格代理商的专员：2个（还差1个）</li>
                <li>团队累计招募代理商：10个（已完成）</li>
            </ul>
            <ul class="升级说明" v-if="专员基本信息 && 专员基本信息.lelevel==1">
                <li class="标题">你离正式专员还差：</li>
                <li>合格代理商：-0个（还差-0个）</li>
            </ul>

            <ul class="相关金额">
                <li>
                    <div>招商奖励</div>
                    <div class="钱">￥-0</div>
                </li>
                <li>
                    <div>招商分红</div>
                    <div class="钱">￥-0</div>
                </li>
                <li>
                    <div>等级差额</div>
                    <div class="钱">￥-0</div>
                </li>
            </ul>

            <ul class="说明_2">
                <li>招商奖励：为现金奖励，直推1000，间推500。</li>
                <li>招商分红：获得直推代理商收益15%的分红。</li>
                <li>等级差额：你与团队成员存在等级差，获得团队成员招募的代理商收益10%的分红。</li>
            </ul>

        </div>
        <div class="按钮" @click="生成二维码()">招募团队</div>
        <!-- <shengchengErweima ref="shengchengErweima"/> -->
        <shengchengErweima ref="shengchengErweima" :url="邀请地址" :title="邀请标题"/>
    </div>
</template>

<script>
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import shengchengErweima from './components/邀请二维码.vue'
import { mapGetters } from 'vuex';
export default {
    name:"",
    components:{
        shengchengErweima
    },
    data() {
        return {
            userInfo:'',
            邀请地址:"",
            邀请标题:"",
        }
    },
    computed: {
        ...mapGetters({
            实名信息:"实名认证/实名信息",
            专员基本信息:'专员基本信息',
        })
    },
    methods: {
        生成二维码(){
            this.邀请地址='http://m.lxad.vip/test/dist/index.html' + "#/zhuanyuan/shenqing?pid=" + this.userInfo.username;
            this.邀请标题='邀请你成为红购招商专员';
            this.$refs.shengchengErweima.显示分享()
        }
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}


    },
}
</script>

<style lang="scss" scoped>
.mui-content{
    padding-bottom: 60px;
}
.box_1{
    padding: 20px 10px 20px 55px;
    position: relative;
    background: #ffffff;
    >li:not(:last-child){
        min-height: 80px;
    }
    li{
        position: relative;
    }
    li::after{
        position: absolute;
        width: 16px;
    	height: 16px;
        top: 0px;
        // left: -30px;
        border-radius: 100%;
        left: calc(-13px - 16px);
        content: "";
        background-color: rgba(166, 166, 166, 1);
    }
    li.active::after{
        background: rgba(0, 122, 255, 1);
    }
    li:not(:last-child)::before{
        position: absolute;
        width: 3px;
        height: 100%;
        top: 0px;
        left: calc(-13px - 8px - 1.5px);
        content: "";
        background-color: rgba(166, 166, 166, 1);
    }
    li.active::before{
        background: rgba(0, 122, 255, 1);
    }
    .标题{
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        margin: 0px 7px 0px 0px;
        font-weight: bold;
    }
    .红色字体{
        color: rgba(217, 57, 59, 1);
    	font-size: 14px;
    }
    .文字{
        color: rgba(166, 166, 166, 1);
    	font-size: 12px;
    }
}
.升级说明{
    background: #ffffff;
    margin: 3px 0px 0px;
    padding: 13px 25px;
    color: rgba(128, 128, 128, 1);
	font-size: 12px;
    .标题{
        color: #505050;
    }
}
.相关金额{
    margin: 3px 0px 0px;
    background: #ffffff;
    padding: 10px 50px 15px;
    display: flex;
    justify-content: space-between;
	font-size: 12px;
    text-align: center;
    color: #505050;
    .钱{
        color: rgba(217, 57, 59, 1);
        margin: 5px 0px 0px; 
    }
}

.说明_2{
    padding: 8px 25px;
    color: rgba(128, 128, 128, 1);
	font-size: 10px;
}
.按钮{
    position: fixed;
    left: 0px;
    bottom: 0px;
    height: 44px;
    width: 100%;
    line-height: 44px;
    color: rgba(255, 255, 255, 1);
	background-color: rgba(217, 57, 59, 1);
	font-size: 14px;
    text-align: center;
    padding: 0px 0px 0px 2px;
    letter-spacing: 2px;    
}
</style>
