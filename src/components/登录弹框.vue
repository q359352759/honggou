<template>
    <div class="登录弹框">
        <form @submit.prevent="提交()">
            <ul class="登录容器">
                <li class="关闭" @click="设置是否显示登录框(false)">
                    <i class="icon iconfont icon-quxiao"></i>
                </li>
                <li class="标题">登录</li>
                <li class="输入框">
                    <i class="icon iconfont icon-shouji"></i>
                    <input type="text" required v-model="登录信息.username" placeholder="手机号码">
                </li>
                <li class="输入框">
                    <i class="icon iconfont icon-mima"></i>
                    <input type="password" v-model="登录信息.password" required placeholder="登录密码">
                </li>
                <li class="登录按钮">
                    <button type="submit">登录</button>
                    <span @click="切换注册(true)">注册</span>
                </li>
            </ul>
        </form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            登录信息:{
                username:"",
                password:""
            }
        }
    },
    inject:['刷新页面'],
    computed: {
    },
    methods: {
        ...mapActions({
            设置是否显示登录框:'设置是否显示登录框',
            设置是否显示注册框:'设置是否显示注册框',
            登录:"登录/登录"
        }),
        async 提交(){
            this.登录(this.登录信息).then((result) => {
                this.设置是否显示登录框(false);
                mui.toast("登录成功", { duration: 1000, type: "div" });
                this.刷新页面()
            }).catch((err) => {
            });
        },
        切换注册(){
            this.设置是否显示登录框(false);
            this.设置是否显示注册框(true);
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.登录弹框{
    background: rgba(0,0,0,0.4);
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .登录容器{
        padding: 17px 26px 28px;
        width: 295px;
        background: $header_background;
        position: relative;
        border-radius: 16px;
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
        .标题{
            color: rgba(255, 255, 255, 1);
        	font-size: 16px;
            padding: 0px 0px 10px;
            text-align: center;
        }
        .输入框{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ffffff;
            color: #ffffff;
            height: 33px;
            margin: 23px 0px 0px;
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
