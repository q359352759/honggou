<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">专享营销</h1>
            <span @tap="addMarketingVip()" class="tite_1">添加商品</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="box_1">
                <li v-for="(item, index) in Exclusive" :key="index" :class="{'pos_left':item.pos_left,'active':item.active}">
                    <div class="content_1" v-on:touchend="touchend($event,item)" v-on:touchstart="huoqu($event,item)" v-on:touchmove="touchmove($event)">
                        <div class="img_box">
                            <img v-if="item.comImg && item.comImg.split(',').length>0" :src="item.comImg.split(',')[0]" alt="" srcset="">
                        </div>
                        <div class="text_box">
                            <div class="name">{{item.comName}}</div>
                            <div class="money">售价：{{item.comSellingPrice }}元</div>
                            <div class="footer">
                                <div class="mui-pull-right text_2" v-if="item.type==0">
                                    新人可省：{{item.deduction}}元
                                </div>
                                <div class="mui-pull-right text_2" v-if="item.type==1">
                                    生日可省：{{item.deduction}}元
                                </div>
                                <div class="text_1">
                                    <span>可省：{{item.comDeduction}}元</span>
                                    <span v-if="item.comCommission">,佣金{{item.comCommission}}元</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right_1" @tap="delete_1(item,index)">
                        <div>删除</div>
                    </div>
                </li>
            </ul>

            <loading :loadingtype="loading" :end="!loading && Exclusive.length!=0" :nodata="!loading && Exclusive.length==0" />

        </div>
    </div>
</template>

<script>

import { api_查询专享列表 , api_删除专享} from "@/api/专享接口.js";
import { api_查询奖赏列表 } from "@/api/奖赏接口.js";

import loading from "@/components/loading.vue";
import { openloading , 当前时间格式化 } from "@/assets/js/currency.js";
import { mapGetters ,mapActions } from "vuex";
export default {
    name: "",
    components: {
        loading
    },
    computed: {
        ...mapGetters({
            myshop:'get_myshop'
        })
    },
    data() {
        return {
            loading: true,
            get_index: 0,
            Exclusive: []
        };
    },
    methods: {
        ...mapActions({
            获取店铺:'getMyshop'
        }),
        //删除专享
        async delete_1(x, index) {
            var query={
                    start:0,
                    length:10,
                    commodityid:x.commodityId
                }
            openloading(true);
            try {
                var 奖赏_r = await api_查询奖赏列表(query);
                openloading(false)
                if(奖赏_r.data.code==200){
                    if(奖赏_r.data.data.data.length>0){
                        var 奖赏=奖赏_r.data.data.data[0];
                        var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm');
                        if(奖赏.expirationtime > 当前时间 && 奖赏.surplusrewardnum > 0){
                            mui.alert('该商品处于奖赏状态，未结束前不能进行修改', "提示", "我知道了", function () { }, "div");
                            return
                        }
                    }
                }else{
                    mui.alert(奖赏_r.data.msg ? 奖赏_r.data.msg : 奖赏_r.data.message, "提示", "我知道了", function () { }, "div");
                    return
                }
            } catch (error) {
                openloading(false)
                mui.toast("系统错误，稍后再试。", {duration: 2000,type: "div"});   
                return             
            }
            // "/shops/deleteShopExclusive/{id}
            mui.confirm("确定删除吗？", "提示", ["我在想想", "确定"], value => {
                if (value.index == 1) {
                    openloading(true);
                    api_删除专享(x.id).then(x=>{
                        if (x.data.code == 200) {
                                this.Exclusive.splice(index, 1);
                                mui.toast("删除成功。", { duration: "long", type: "div" });
                            } else {
                                mui.alert( x.data.msg ? x.data.msg : x.data.messag,"提示","我知道了",function () { },"div");
                            }
                            openloading(false);
                    }).catch(err=>{
                        mui.toast("系统错误，稍后再试。", {duration: "long",type: "div"});
                            openloading(false);
                    })
                }
            });
        },
        //根据店铺查询专享
        get_Exclusive() {
            this.loading = true;
            var query={
                    start:0,
                    length:1000,
                    shopid:this.myshop.shopid
                }
            api_查询专享列表(query).then(x=>{
                if (x.data.code == 200) {
                        this.Exclusive = x.data.data.data;
                    } else {
                        mui.alert(x.data.msg ? x.data.msg : x.data.messag,"提示","我知道了",function () { },"div");
                    }
                    this.loading = false;
            }).catch(err=>{
                mui.toast("获取失败，请稍后再试。", {duration: "long",type: "div"});
                this.loading = false;
            })
        },
        //跳转添加
        addMarketingVip() {
            this.$router.push("/addMarketingVip");
        },
        //手指头刚按下
        huoqu(e, x) {
            // console.log(x)
            //手指头刚刚按下
            this.$set(x, "active", false);
            var targetTouches = e.targetTouches[0];
            this.touchstart_x =
                targetTouches.clientX - e.currentTarget.parentElement.offsetLeft;
        },
        //开始拖动
        touchmove(e) {
            var targetTouches = e.targetTouches[0];
            e.currentTarget.parentElement.style.left =
                targetTouches.clientX - this.touchstart_x + "px";
        },
        //拖动结束
        touchend(e, x) {
            x.active = true;
            var event = e;
            var parentElement = e.currentTarget.parentElement;
            setTimeout(() => {
                if (parentElement.offsetLeft < -60) {
                    this.$set(x, "pos_left", true);
                } else {
                    this.$set(x, "pos_left", false);
                }
                parentElement.removeAttribute("style");
            }, 100);
        },
        async 初始化(){
            if(!this.myshop || !this.myshop.shopid){
                await this.获取店铺()
            }
            this.get_Exclusive();
        }
    },
    mounted() {
        this.初始化()
    },
    watch: {
        myshop() {
            if (this.myshop && this.myshop.shopid && this.get_index == 0) {
                this.get_index = 1;
                this.get_Exclusive();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.mui-bar .tite_1 {
    position: absolute;
    line-height: 44px;
    color: #ffffff;
    top: 0px;
    right: 10px;
    font-size: 14px;
}
.box_1 {
    overflow-x: hidden;
    > li {
        background: #ffffff;
        padding: 7px 10px;
        border-top: 1px solid #f6f6f6;
        // display: flex;
        position: relative;
        left: 0px;
    }
    > li.active {
        transition: all 0.3s;
    }
    > li.pos_left {
        left: -60px;
    }
    .right_1 {
        position: absolute;
        width: 100%;
        left: 100%;
        top: 0px;
        height: 100%;
        background: #d43030;
        font-size: 0.14rem;
        color: #ffffff;
        display: flex;
        align-items: center;
        padding: 0px 0.16rem 0px;
    }
    .content_1 {
        display: flex;
    }
    .img_box {
        flex-shrink: 0;
        width: 83px;
        height: 62px;
        margin: 0px 8px 0px 0px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .text_box {
        width: 0;
        flex-grow: 1;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        .name {
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
        }
        .money {
            color: rgba(128, 128, 128, 1);
            font-size: 12px;
        }
        .text_1 {
            color: rgba(166, 166, 166, 1);
            font-size: 12px;
        }
        .text_2 {
            color: rgba(212, 48, 48, 1);
            font-size: 12px;
        }
    }
}
</style>
