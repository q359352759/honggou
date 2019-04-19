<template>
    <div class="注册弹框">
        <form @submit.prevent="提交()">
            <ul style="background-image: url('image/fxxrhb.png')">
                <li class="关闭" @click="设置是否显示注册框(false)">
                    <i class="icon iconfont icon-quxiao"></i>
                </li>
                <li class="金额 mui-text-center">
                    <b>50</b>
                    <span>元</span>
                </li>
                <li class="文字 mui-text-center">平台通用红包</li>
                <li class="输入框">
                    <i class="icon iconfont icon-shouji"></i>
                    <input type="text" v-model="phone" required placeholder="手机号码" pattern="^1\d{10}$">
                </li>
                <li class="输入框">
                    <i class="icon iconfont icon-yanzhengma"></i>
                    <input type="text" v-model="code" required placeholder="验证码">
                    <div class="获取验证码" @click="获取验证码()">{{time==0 ? '获取验证码' : time+'s'}}</div>
                </li>
                <li class="输入框">
                    <i class="icon iconfont icon-mima"></i>
                    <input type="password" v-model="password" required placeholder="登录密码">
                </li>
                <li class="登录按钮">
                    <button type="submit">注册</button>
                    <span @click="切换登录(true)">登录</span>
                </li>
            </ul>
        </form>
    </div>
</template>

<script>
import { api_根据phone查询用户 } from "@/api/用户接口.js";
import { api_获取验证码 , api_注册账号} from "@/api/注册.js";

import { openloading } from "@/assets/js/currency.js";

import { mapGetters, mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            time:0,
            phone:"",
            code:"",
            password:""
        }
    },
    inject:['刷新页面'],
    methods: {
        ...mapActions({
            设置是否显示登录框:'设置是否显示登录框',
            设置是否显示注册框:'设置是否显示注册框',
            登录:"登录/登录"
        }),
        切换登录(){
            this.设置是否显示注册框(false);
            this.设置是否显示登录框(true);
        },
        async 获取验证码(){
            var 验证手机号码=/^1\d{10}$/;
            if(this.time!=0){
                return
            }else if(!验证手机号码.test(this.phone)){
                mui.toast("手机号码有误", { duration: 2000, type: "div" });
                return
            }else{  
                var 查询用户= await api_根据phone查询用户(this.phone);                
                if(查询用户.data.code==200){
                    mui.toast("此手机已被注册", { duration: 2000, type: "div" });
                    return
                }
            }
            this.time = 60;
            var time = setInterval(()=>{
                    this.time--;
                    if (this.time == 0) {
                        clearInterval(time);
                    }
                }, 1000);
            api_获取验证码(this.phone).then(x=>{
                localStorage.keys = x.data.key;
            }).catch(err=>{
                mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
            })
        },
        async 提交(){
            openloading(true);
            var query = this.$route.query;
            if(query.pid){
                this.pid = query.pid;
            }else if(localStorage.yaoqing){
                var yaoqing = localStorage.yaoqing;
                this.pid = yaoqing.replace('#/Recommend?pid=', '');
            }

            var obj={
                    username: this.phone,
                    password: this.password,
                    phone: this.phone,
                    referrerid: this.pid,
                    code:this.code,
                    key:localStorage.keys
                }
            
            try {
                var 注册返回值= await api_注册账号(obj);            
            } catch (error) {
                 openloading(false);
                mui.toast("系统错误稍后再试", { duration: 2000, type: "div" });
            }
            if(注册返回值.data.code!=200){
                openloading(false);
                mui.alert(注册返回值.data.msg ? 注册返回值.data.msg : 注册返回值.data.message, "提示", "我知道了", function () { }, "div");
                return
            }
            var 登录信息={
                    username:this.phone,
                    password:this.password
                }
            this.登录(登录信息).then(x=>{
                this.刷新页面()
                this.设置是否显示注册框(false);
                mui.toast("注册成功，已自动登录", { duration: 1000, type: "div" });
            }).catch(err=>{

                mui.toast("注册成功", { duration: 1000, type: "div" });
            })

        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.注册弹框{
    background: rgba(0,0,0,0.4);
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 44px 0px 0px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    ul{
        width: 300px;
        height: 378px;
        background-size: cover;
        position: relative;
        padding: 28px 26px 0px;
        .关闭{
            position: absolute;
            width: 36px;
        	height: 36px;
            top: -68px;
            right: 18px;
            line-height: 36px;
            text-align: center;
            background: #ffffff;
            border-radius: 100%;
            color: rgba(153, 153, 153, 1);
            font-size: 20px;
        }
        .关闭::after{
            position: absolute;
            top: 36px;
            left: 0px;
            right: 0px;
            margin: auto;
            height: 32px;
            width: 1px;
            background: #ffffff;
            content: "";
        }
        .金额{
            color: $header_background;
            font-size: 20px;
            height: 48px;
            b{
                font-size: 46px;
            }
        }
        .文字{
            color: $header_background;
            font-size: 10px;
            margin: 0px 0px 53px;
        }

        .输入框{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ffffff;
            color: #ffffff;
            height: 33px;
            margin: 17px 0px 0px;
            i{
                color: inherit;
                font-size: 16px;
                line-height: 16px;
                height: 16px;
                margin: 0px 10px 0px 0px;
            }
            input{
                padding: 0px;
                margin: 0px;
                color: inherit;
                font-size: 14px;
                border: none;
                background: none;
                height: 100%;
            }
            .获取验证码{
            	font-size: 14px;
                white-space: nowrap;
                flex-shrink: 0;
            }
            input::-webkit-input-placeholder{
                color: #ffffff;
            }
            input:-moz-placeholder{
                color: #ffffff;
            }
            input::-moz-placeholder{
                color: #ffffff;
            }
            input:-ms-input-placeholder{
                color: #ffffff;
            }
        }
        .登录按钮{
            margin: 33px 0px 0px;
            position: relative;
            text-align: center;
            height: 32px;
            button{
                width: 120px;
                height: 100%;
                border-radius: 32px;
                padding: 0px;
                font-size: 14px;
                color: $header_background;
                border: none;
            }
            span{
                color: rgba(255, 255, 255, 1);
                font-size: 12px;
                position: absolute;
                line-height: 32px;
                top: 0px;
                right: 10px;
            }
        }

    }
}
</style>
