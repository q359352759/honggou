<template>
    <div class="dialog">
        <div class="content_1">
            <div class="关闭" @click="zhidaole()"><i class="icon iconfont icon-quxiao"></i></div>
            <div class="竖线"></div>
            <img src="image/home.png" alt="" srcset="">
            <div class="弹出框内容">
                <ul>
                    <li>红购：用红包去购物</li>
                    <li>一个专注省钱的同城电商平台</li>
                    <li>注册领取50元红包，邀请他人注册得20元红包</li>
                    <li>自用省钱：“首单特惠”，享受上千次机会</li>
                    <li>分享赚钱：分享商品就能赚取分红或赏金</li>
                    <li>推广用户赚10元分红，推广商家最高赚5000元分红</li>
                    <li>线上选购下单，线下省钱消费，开启同城网购模式</li>
                    <li>帮助实体店铺实现，推广裂变、会员裂变、成交裂变</li>
                    <li>降低实体店推广和运营成本，普惠于消费大众</li>
                    <li>全城促销信息一手掌握，线下店铺线上浏览</li>
                </ul>
                <div @click="跳转()">去分享赚外快</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "",
    data() {
        return {
            userInfo: ""
        };
    },
    computed: {
        ...mapGetters({
            代理人信息: "g_agentUser"
        })
    },
    methods: {
        zhidaole() {
            // console.log(new Date("2018-12-12 11:40").getTime());
            // console.log(new Date('2018-12-12 13:40').getTime());
            // console.log(new Date('2018-12-12 13:40').getTime()-new Date('2018-12-12 11:40').getTime());
            // 2 小时
            // console.log((new Date('2018-12-12 13:40').getTime()-new Date('2018-12-12 11:40').getTime())/1000/60/60)
            var obj = {
                userid: this.userInfo ? this.userInfo.username : "", //用户Id 没有id 表示游客
                time: new Date().getTime(),
                Tips: this.radio_type_2 //false 表示需要再提示 true 表示不再提示;
            };
            localStorage.homeDialog = JSON.stringify(obj);
            this.$emit("setHomeDialog", 1);
        },
        跳转(){
            var obj = {
                userid: this.userInfo ? this.userInfo.username : "", //用户Id 没有id 表示游客
                time: new Date().getTime(),
                Tips: this.radio_type_2 //false 表示需要再提示 true 表示不再提示;
            };
            localStorage.homeDialog = JSON.stringify(obj);
            this.$emit("setHomeDialog", 1);
            this.$router.push("/shizhe/tuiguang");
        }
        // help() {
        //     this.$router.push("/help");
        // }
        
    },
    mounted() {
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }
    }
};
</script>

<style lang="scss" scoped>
.dialog {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.36);
    z-index: 12;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .content_1{
        width: 320px;
        height: 400px;
        position: relative;
        .关闭{
            width: 36px;
        	height: 36px;
            position: absolute;
            top: 6px;
            right: 46px;
            background: #ffffff;
            font-size: 14px;
            color: rgba(153, 153, 153, 1);
            line-height: 36px;
            border-radius: 100%;
            text-align: center;
            z-index: 3;
        }
        .竖线{
            width: 1px;
            height: 70px;
            position: absolute;
            top: 42px;
            right: 64px;
            background: #ffffff;
        }
        >img{
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
        }
        .弹出框内容{
            position: absolute;
            z-index: 2;
            width: 100%;
            top: 90px;
            left: 0px;
            ul{
                color: rgba(255, 255, 255, 1);
                font-size: 12px;
                text-align: center;
                line-height: 150%;
            }
            div{
                width: 120px;
            	height: 26px;
                text-align: center;
                line-height: 26px;
                font-size: 12px;
                color: rgba(0, 122, 255, 1);
                margin: 25px auto 0px;
                border-radius: 26px;
                background: #ffffff;
            }
        }
    }
}
</style>
