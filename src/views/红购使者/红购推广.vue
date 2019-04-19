<template>
    <div class="推广">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">全民赚外快</h1>
        </header>
        <div class="mui-content mui-fullscreen" >
            <div class="内容" style="background-image: url('image/hgtg.jpg')">
                <ul class="文字区">
                    <li>红购：一个专注省钱的同城电商平台，把全城促销信息整合在一起。线下店铺线上浏览，选好商品再去消费，省时、省力、省心。</li>
                    <li>消费者享有上千次“首单特惠”，属于每一个人的同城电商平台。让每一个消费者得到真正的实惠，越来越多的人都在使用红购。</li>
                    <li>免费申请成为“红购使者”，把“首单特惠”商品分享身边的朋友，别人省钱消费，自己还能赚取分红。</li>
                    <li>“如果自己不推荐身边的朋友，也会被他人推荐，最终他人赚取分红。”</li>                    
                </ul>
                <div class="推广图片">
                    <img src="image/hgtg2.png" alt="" srcset="">
                </div>

                <div @click="跳转()" class="按钮">{{text}}</div>
            </div>
        
        </div>
    </div>
</template>

<script>
import btn from "@/components/button.vue";
import { openloading } from "@/assets/js/currency.js";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "",
    components: {
        btn
    },
    data() {
        return {
            text: "去赚外快",
            获取成功: false,
            userInfo:''
        };
    },
    computed: {
        ...mapGetters({
            代理人信息: "g_agentUser"
        })
    },
    methods: {
        ...mapActions({
            获取代理人信息: "actions_agentUser",
            设置是否显示登录框:'设置是否显示登录框'
        }),
        跳转() {
            if(!this.userInfo){
                this.设置是否显示登录框(true);
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // });
            }else if (!this.获取成功) {
                mui.toast("网络错误稍后再试。", { duration: 2000, type: "div" });
            } else {
                if (!this.代理人信息) {
                    this.$router.push('/shizhe/shenqing')
                } else {
                    if (this.代理人信息.type == 1) {
                        this.$router.push("/Agent");
                    } else {
                        this.$router.push("/shizhe/honggoushizhe");
                    }
                }
            }
        }
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo)
        } catch (error) {}
        if(this.userInfo){
            openloading(true);
            this.获取代理人信息().then(x => {
                console.log(x);
                if (x.data.code == 200) {
                    this.获取成功 = true;
                } else if (x.data.code == 201) {
                    this.获取成功 = true;
                } else {
                    this.获取成功 = false;
                }
                openloading(false);
            }).catch(err => {
                openloading(false);
                this.获取成功 = false;
            });
        }
        
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.内容{
    min-height: 100%;
    background-size: cover;
    padding: 1px 0px;
    .文字区{
        margin: 20px 30px 0px;
        color: $header_background;
        font-size: 12px;
        line-height: 150%;
        li{
            text-indent: 24px;
        }
    }
    .推广图片{
        max-width: 100%;
        width: 2.8rem;
    	height: 2.78rem;
        margin: 10px auto 0px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .按钮{
        margin: 36px auto 56px;
        width: 175px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        border-radius: 34px;
        font-size: 14px;
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.2);
        background-color: rgba(255, 255, 255, 1);
        color: $header_background;
    }
}
</style>
