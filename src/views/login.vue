<template>
    <div id="login">
        <!-- <header class="mui-bar mui-bar-nav">
            <h1 class="mui-title">登录</h1>
        </header> -->
        <div class="mui-content">
            <div class="login_header">
                <div>
                    <img src="image/bg_1.png" alt="" srcset="">
                    <img src="image/WechatIMG311.png" alt="">
                </div>
            </div>

            <div class="form_box">
                <form @submit.prevent="login()">
                    <ul class="box_1">
                        <li>
                            <i class="icon iconfont icon-shouji"></i>
                            <input type="text" @blur="失去焦点()" required v-model="username">
                            <span v-if="!username">请输入手机号码</span>
                        </li>
                        <li>
                            <i class="icon iconfont icon-san"></i>
                            <input type="password" @blur="失去焦点()" required v-model="password">
                            <span v-if="!password">请输入密码</span>
                        </li>
                    </ul>
                    <!-- <button class="Sign_in" type="submit">登录</button> -->
                    <btn type="submit" value="登录" />
                    <!-- <btn @click.native="模拟登陆成功()" value="模拟登陆成功" /> -->
                    <div class="weixing">
                        <!-- <div><i class="mui-icon mui-icon-weixin"></i></div> -->
                    </div>
                    <ul class="box_2">
                        <li @click="ForgetPassword()">忘记密码？</li>
                        <li @click="register()">立即注册></li>
                    </ul>
                </form>
            </div>

            <div class="box_3">
                <img src="image/bg_3.png" alt="" srcset="">
            </div>

        </div>
        <guanzhugongzhonghao v-show="!是否关注 && !是否手动关闭"/>
    </div>
</template>

<script>

import { dateFtt, openloading } from "@/assets/js/currency";
import { mapActions , mapGetters} from "vuex";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import btn from "@/components/button.vue";
import guanzhugongzhonghao from '@/components/关注二维码弹出框.vue'

export default {
    name: "login",
    components: {
        btn,
        guanzhugongzhonghao
    },
    filters: {},
    data() {
        return {
            // phone: "15123456789",
            username: "",
            password: ""
        };
    },
    computed: {
        ...mapGetters({
            是否关注: 'user/是否关注',
            是否手动关闭: 'user/是否手动关闭'
        })
    },
    methods: {
        ...mapActions({
            set_isfenxiang: "shop/set_isfenxiang",
            设置openid: "user/设置openid",
            判断用户是否关注: 'user/判断用户是否关注',
            设置手动关闭:'user/设置手动关闭',
            登录推送:'app/推送/登录推送',
            查询专员信息:'查询专员信息',
            点单排号初始化:'用户点单排号/排号初始化',

            登录:"登录/登录"
        }),
        模拟登陆成功(){
            console.log(1);
            if(window.history.length==1){
                this.$router.push("/my");
            }else{
                history.back()
            }
        },
        失去焦点(){
            console.log('vue失去焦点')
            setTimeout(()=>{
                window.scroll(0, 0);
            },300)
        },
        //跳转忘记密码
        ForgetPassword() {
            this.$router.replace('/ForgetPassword')
        },
        //跳转注册
        register() {
            this.$router.replace("/register");
        },
        async login() {
            var obj={
                    username: this.username,
                    password: this.password
                }
            this.登录(obj).then(x=>{
                setTimeout(() => {
                    if(window.history.length==1){
                        this.$router.push("/my");
                    }else{
                        history.back()
                    }
                }, 1000);
            })
            return
            // window.scroll(0, 0);
            // openloading(true);
            // this.$axios.post('/sys/login',this.$qs.stringify(obj)).then(x => {
            //     if (x.data.code && x.data.code != 200) {
            //         openloading(false);
            //         if (x.data.error_description == "Bad credentials") {
            //             mui.toast("密码错误", { duration: "long", type: "div" });
            //         } else {
            //             mui.alert(x.data.error_description ? x.data.error_description : x.data.message, "提示", "我知道了", function () { }, "div");
            //         }
            //     } else if (x.data.error) {
            //         mui.alert(x.data.error_description ? x.data.error_description : x.data.message, "提示", "我知道了", function () { }, "div");
            //     } else {
            //         localStorage.loginDate = JSON.stringify(x.data);
            //         //更新store 用户登录信息
            //         this.$store.commit("setloginDate", JSON.stringify(x.data));
            //         this.$axios({
            //             method: "get",
            //             url: "/api-u/users/current?access_token=" + x.data.access_token
            //         }).then(x => {
            //             console.log("获取个人信息主要用户Id", x);
            //             localStorage.id = x.data.id;
            //             let userInfo = x.data;
            //             try {
            //                 userInfo.nickname = b64DecodeUnicode(userInfo.nickname);
            //             } catch (error) { }
            //             localStorage.userInfo = JSON.stringify(userInfo);
            //             this.登录推送(userInfo.username)
            //             this.设置openid();
            //             this.点单排号初始化();

            //             this.查询专员信息(userInfo.username).then(r=>{
            //                 setTimeout(() => {
            //                     if(window.history.length==1){
            //                         this.$router.push("/my");
            //                     }else{
            //                         history.back()
            //                     }
            //                 }, 1000);
            //             }).catch(err=>{
            //                 setTimeout(() => {
            //                     if(window.history.length==1){
            //                         this.$router.push("/my");
            //                     }else{
            //                         history.back()
            //                     }
            //                 }, 1000);
            //             })
            //         }).catch(error => {
            //             openloading(false);
            //         });
            //     }
            // }).catch(err => {
            //     openloading(false);
            //     mui.toast("登录失败。", { duration: 2000, type: "div" });
            // });
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
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        this.set_isfenxiang(true);
        try {
             this.$store.state.area = JSON.parse(localStorage.area);
        } catch (error) {}
        this.设置手动关闭(false);
        this.判断关注()
        //获取地区
        this.$store.dispatch("get_area");

        
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
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
#login {
    height: 100%;
}

#login .mui-content {
    height: 100%;
    background: #92c6dd;
    overflow: auto;
    // min-height: 667px;
}

#login .mui-bar {
    background: $header_background;
    box-shadow: none;

    a {
        color: #ffffff;
    }
}

#login .mui-title {
    color: #ffffff;
}

#login .login_header {
    width: 100%;
    // height: 390px;
    height: 320px;
    position: relative;
    text-align: center;
    overflow: hidden;
    > div {
        position: relative;
    }
    img:nth-child(1) {
        width: 2.67rem;
    }
    img:nth-child(2) {
        width: 0.6rem;
        height: 0.6rem;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        margin: auto;
        border-radius: 10px;
    }
}

#login .box_3 {
    font-size: 0px;
    margin: -0.84rem 0px 0px;
    img {
        width: 100%;
    }
}

#login .swiper-pagination-bullet-active {
    background: $header_background;
}

#login .logo_img {
    width: 0.8rem;
    height: 0.8rem;
    margin: 0.3rem auto;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 100%;
    }
}
#login form {
    position: relative;
    z-index: 2;
    // position: absolute;
    // width: 100%;
    // // top: 300px;
    // bottom: 100px;
    // left: 0px;
}

#login .form_box {
    // height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
#login .box_1 {
    width: 2.5rem;
    margin: 0px auto;
    position: relative;
    z-index: 2;
    color: #ffffff;
    li {
        margin: 0px 0px 0.3rem 0px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ffffff;
        padding: 0px 3px;
        position: relative;
        input {
            margin: 0px;
            border: none;
            padding: 0px 0.1rem 0px;
            height: 0.3rem;
            background: none;
            font-size: 0.14rem;
            color: #ffffff;
            position: relative;
            z-index: 2;
        }
        span {
            font-size: 0.14rem;
            position: absolute;
            left: 0.3rem;
        }
    }
}

#login .Sign_in {
    width: 1.77rem;
    // width: 2.5rem;
    margin: 0px auto;
    display: block;
    height: 0.34rem;
    border-radius: 0.34rem;
    background: $header_background;
    color: #ffffff;
    border: none;
}

#login .weixing {
    width: 30px;
    // margin: 30px auto;
    margin: 18px auto;
    text-align: center;
    line-height: 28px;
    color: #cccccc;
    min-height: 1px;
    div {
        border: 1px solid #cccccc;
        border-radius: 30px;
        height: 30px;
        width: 30px;
        margin: 0px auto;
    }
    i {
        font-size: 20px;
    }
}

#login .box_2 {
    width: 2.5rem;
    margin: 0px auto;
    display: flex;
    color: #ffffff;
    font-size: 0.14rem;
    li {
        width: 50%;
        text-align: center;
    }

    li:nth-child(1) {
        border-right: 2px solid #ffffff;
    }
}
</style>
