<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
            <a @click="$router.push('/my')" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">申请招商专员</h1>
        </header>

        <div class="mui-content mui-fullscreen">
            <div class="box_1">
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell item">
                        <!-- <a class="mui-navigate-right "> -->
                            <div class="标题">指导老师：</div>
                            <div class="文本1" v-if="邀请人实名信息">{{邀请人实名信息.name}}</div>
                            <div class="文本1" v-if="!邀请人实名信息">{{邀请人信息.nickname}}</div>
                        <!-- </a> -->
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right item" @click="跳转实名认证()">
                            <div class="标题">实名认证：</div>
                            <div v-show="!实名信息" class="文本1">未认证</div>
                            <div v-show="实名信息" class="文本2">已认证</div>
                        </a>
                    </li>
                </ul>
            </div>
            
            <ul class="box_2">
                <li @click="同意协议=!同意协议" class="图标"><i class="icon iconfont" :class="{'icon-xuanze2 蓝色字体':同意协议,'icon-choose':!同意协议}"></i></li>
                <li @click="同意协议=!同意协议">我已阅读并同意</li>
                <li class="蓝色字体" @click="$router.push('/xieyi/zhaoshangZhuanyuan')">《招商专员协议》</li>
            </ul>
            <div>
                <btn @click.native="提交()"/>
            </div>
        </div>
    </div>    
</template>

<script>
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import { api_添加招商专员 } from "@/api/招商专员接口.js";

import { openloading } from "@/assets/js/currency.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import btn from '@/components/button.vue';
import { mapGetters , mapActions } from "vuex";
export default {
    name:"",
    components:{
        btn
    },
    data() {
        return {
            同意协议:true,
            userInfo:"",
            pid:"",
            邀请人实名信息:'',
            邀请人信息:''
        }
    },
    computed: {
        ...mapGetters({
            实名信息:"实名认证/实名信息",
            专员基本信息:'专员基本信息',
        })
    },
    methods: {
        ...mapActions({
            获取认证:'实名认证/获取认证',
            查询专员信息:'查询专员信息'
        }),
        跳转实名认证(){
            if (!this.实名信息) {
                this.$router.push("/RealName");
            } else {
                this.$router.push("/AlreadyRealName");
            }
        },
        提交(){
            if(!this.同意协议){
                mui.toast("请先同意协议", { duration: "long", type: "div" });
                return
            }else if(!this.实名信息){
                mui.toast("请先实名认证", { duration: "long", type: "div" });
                return
            }else if(!this.邀请人信息){
                mui.toast("获取邀请人信息失败。请重新识别二维码。", { duration: "long", type: "div" });
                return
            }
            var obj={
                leid:this.userInfo.username,
                lepid:this.邀请人信息.username
            }
            openloading(true)
            api_添加招商专员(obj).then(x=>{
                if(x.data.code==200){
                    this.查询专员信息(this.userInfo.username).then(x=>{
                        mui.toast("申请成功", { duration: "long", type: "div" });
                        this.$router.push('/zhuanyuan/guanli')
                    }).catch(err=>{
                        openloading(false)
                        mui.toast("查询专员信息失败.", { duration: "long", type: "div" });
                    })
                }else{
                    openloading(false)
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err=>{
                openloading(false);
                mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
            })
            // this.$router.push('/zhuanyuan/guanli')
        },
        async 初始化(){
            openloading(true);
            Promise.all([
                this.获取认证(this.userInfo.username),
                api_通过username查询用户(this.pid),
                api_获取实名信息(this.pid)
            ]).then(x=>{
                console.log(x);
                var 邀请人信息=x[1].data.code==200 ? x[1].data.data : '';
                try {
                    邀请人信息.nickname=b64DecodeUnicode(邀请人信息.nickname);
                } catch (error) {}
                this.邀请人信息=邀请人信息;
                this.邀请人实名信息=x[2].data.code==200 ? x[2].data.data : '';
                openloading(false);
            }).catch(err=>{
                mui.alert(err.data.msg ? err.data.msg : err.data.message, "提示", "我知道了", function () { }, "div");
                openloading(false);
            })
        }
    },
    mounted() {
        this.pid=this.$route.query.pid;
        localStorage.yaoqing=this.pid
        localStorage.backUrl="/zhuanyuan/shenqing?pid="+this.pid;

        try {
            this.userInfo=JSON.parse(localStorage.userInfo);        
        } catch (error) {
            this.$router.push('/login');
            return
        }

        console.log('未登陆')
        // http://192.168.1.15:8080/#/zhuanyuan/shenqing?pid=4E43231D6CC4A0EB453A6B79DCD97D31
        this.初始化();
    },
}
</script>

<style lang="scss" scoped>
.box_1{
    margin-top: 3px;
    .item{
        display: flex;
    }
    .标题{
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        width: 90px;
    }
    .文本1{
        color: rgba(217, 217, 217, 1);
        font-size: 14px;
    }
    .文本2{
        color: rgba(0, 122, 255, 1);
    	font-size: 14px;
    }
}
.box_2{
    padding: 0px 15px;
    margin: 20px 0px 29px;
    display: flex;
    align-items: center;
    color: rgba(80, 80, 80, 1);
	font-size: 14px;
    .蓝色字体{
        color: rgba(42, 130, 228, 1);
    }
    .图标{
        margin: 0px 5px 0px 0px;
    }
}
</style>

