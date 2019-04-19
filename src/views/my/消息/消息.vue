<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">消息</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="box_1"></div>
            <div class="box_2">
                <ul>
                    <li>
                        <div>
                            <img src="image/news_1.png" alt="">
                            <!-- <span>2</span> -->
                        </div>
                        <div>系统通知</div>
                    </li>
                    <li>
                        <div>
                            <img src="image/news_2.png" alt="">
                            <!-- <span>2</span> -->
                        </div>
                        <div>促销快讯</div>
                    </li>
                    <li>
                        <div>
                            <img src="image/news_3.png" alt="">
                            <!-- <span>2</span> -->
                        </div>
                        <div>降价通知</div>
                    </li>
                    <li>
                        <div>
                            <img src="image/news_4.png" alt="">                            
                            <!-- <span>3</span> -->
                        </div>
                        <div>好友消息</div>
                    </li>
                </ul>
            </div>

            <div class="内容区">
                <div class="查看类型">
                    <div v-for="(item, index) in 系统消息.list">
                        <xtxx @click.native="跳转详情(item)" :item="item" :key="index"/>
                    </div>
                    <loading :loadingtype="系统消息.loading" :nodata="!系统消息.loading && 系统消息.total==0" :end="!系统消息.loading && 系统消息.total!=0 && 系统消息.list.length>=系统消息.total"/>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
import loading from "@/components/loading.vue";
import xtxx from "./components/系统消息.vue";
import { mapGetters , mapActions } from "vuex";
export default {
    name: "",
    components: {
        loading,
        xtxx
    },
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters({
            查看类型:"消息/查看类型",
            系统消息:'消息/系统消息' 
        }),
    },
    methods: {
        ...mapActions({
            数据初始化:"消息/数据初始化",
            获取系统消息:"消息/获取系统消息"
        }),
        跳转详情(item){
            console.log(item);
            var msgblob=JSON.parse(item.msgblob)
            if(msgblob.activity=="money_voice"){
                this.$router.push('/myshop/xiaoshou/orderDetails?id='+msgblob.orderId)
            }else{
                mui.toast("未知类型", { duration: "long", type: "div" });
            }
        }
    },
    mounted() {
        this.数据初始化();
        this.获取系统消息();
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.mui-bar-nav {
    box-shadow: none;
}
.mui-content{
    display: flex;
    flex-direction: column;
}
.box_1 {
    background: $header_background;
    height: 52px;
    flex-shrink: 0;
}

.box_2 {
    flex-shrink: 0;
    height: 30px;
    margin: 0px 8px;
    position: relative;
    ul {
        position: absolute;
        width: 100%;
        bottom: 5px;
        left: 0px;
        display: flex;
        background: #ffffff;
        border-radius: 10px;
        padding: 11px 0px 5px;
        > li {
            width: 25%;
            text-align: center;
            > div:nth-child(1) {
                width: 36px;
                height: 36px;
                position: relative;
                margin: 0px auto;
                img {
                    width: 100%;
                    height: 100%;
                }
                span {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    min-width: 12px;
                    height: 12px;
                    background-color: rgba(212, 48, 48, 1);
                    border-radius: 12px;
                    text-align: center;
                    color: #ffffff;
                    line-height: 12px;
                    font-size: 10px;
                }
            }
            > div:nth-child(2) {
                color: rgba(80, 80, 80, 1);
                font-size: 10px;
                margin: 3px 0px 0px;
            }
        }
    }
}
.内容区{
    flex-grow: 1;
    overflow: auto;
}
</style>
