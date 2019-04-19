<template>
    <div class="支付成功">
        <ul>
            <!-- <li class="关闭" @click="设置支付成功弹出框(false)">
                <i class="icon iconfont icon-quxiao"></i>
            </li> -->
            <li class="标题">
                <i class="icon iconfont icon-zhifuchenggong"></i>
                <span>支付成功</span>
            </li>
            <li class="item">
                <span class="标题2">商家</span>
                <span>：</span>
                <b>{{dingdanxiangqing.shopName}}</b>
            </li>
            <li class="item">
                <span class="标题2">金额</span>
                <span>：{{dingdanxiangqing.paymentAmount+dingdanxiangqing.deduction}}元，省：{{dingdanxiangqing.deduction}}元</span>
            </li>
            <li class="item">
                <span class="标题2">实付</span>
                <span>：</span>
                <b class="money">{{dingdanxiangqing.paymentAmount}}</b>
                <span>元</span>
            </li>
            <li class="item">
                <span class="标题2">赚外快</span>
                <span>：</span>
                <span>把商品分享给身边的朋友就能赚取分红。</span>
            </li>
            <li class="按钮框">
                <!-- <btn :styles="{'width': '99px'}" @click.native="设置成功不评价弹出框(false)" value="去拿货"/> -->
                <div @click="设置成功不评价弹出框(false)">去拿货</div>
                <div @click="赚分红()">赚分红</div>
            </li>
        </ul>
    </div>
</template>

<script>

import { api_添加评论 } from "@/api/评论接口.js";

import { openloading } from "@/assets/js/currency.js";

import btn from "@/components/button.vue";
import xingxing from "@/components/可点击星星.vue";

import { mapGetters, mapActions } from "vuex";
export default {
    name: "",
    components: {
        btn,
        xingxing
    },
    data() {
        return {
            userInfo:""
        };
    },
    computed: {
        ...mapGetters({
            new_shangping_list:"orders/order/new_shangping_list",
            dingdanxiangqing: "orders/order/dingdanxiangqing",
            代理人信息:"g_agentUser",
        })
    },
    methods: {
        ...mapActions({
            // 设置支付成功弹出框: "orders/order/设置支付成功弹出框",
            设置成功不评价弹出框: "orders/order/设置成功不评价弹出框",
            findShopOrdersById:'orders/order/findShopOrdersById'    //查询订单信息
        }),
        赚分红(){
            this.设置成功不评价弹出框(false);
            if (!this.代理人信息) {
                this.$router.push('/shizhe/tuiguang')
            } else {
                if (this.代理人信息.type == 1) {
                    this.$router.push("/Agent");
                } else {
                    this.$router.push("/shizhe/honggoushizhe");
                }
            }
            
        },
        写评语(){
            this.设置支付成功弹出框(false);
            // 商品
            if(this.dingdanxiangqing.orderType==0){
                this.$router.push('/my/pingjia/pingjia?orderid='+this.dingdanxiangqing.id)
            }else{
                this.$router.push('/my/pingjia/xianjinPingjia?orderid='+this.dingdanxiangqing.id)
            }
        },
        提交评论(){
            
            var 评价列表=[];
            var score = this.$refs.星星.number;
            // 商品
            if(this.dingdanxiangqing.orderType==0){
                
                this.new_shangping_list.forEach(item => {
                    var 评价对象={
                        id:"",          //自增id
                        ordersid:this.dingdanxiangqing.ordersid,    //订单id
                        commodityid: item.commodityid, //商品id
                        shopid: this.dingdanxiangqing.shopid,      //商家id
                        userid: this.userInfo.username,      //用户id
                        remarkid: '',    //回复评价id
                        remark: '',      //评价内容
                        remarkimg:"",   //评价图片
                        remarkimgList:[],
                        somegreattimes:'',  //点赞次数
                        score:score,       //打分
                        commenttype:0, //类型  0 评价 1 追评 2 商家回复
                        anonymous:1,   //匿名()默认1不匿
                        hidden:1,      //隐藏 默认1不隐藏
                        shopreplytype:0,   //商家回复状态默认0未回复 1已回复 2不回复
                        checktype:0,   //查阅状态 默认为查阅0 已1 隐藏2
                        clerksid:"",    //店员id
                        lastcomment:"", //最后评论时间
                        isfollowcomment:"", //是否有新的追评
                        lastcommenta:"",    //最后追评/回复时间
                        isfollowcommenta:'',    //是否有新的追评/回复
                    };
                    评价列表.push(评价对象);
                });
            }else{
                var 评价对象={
                        id:"",          //自增id
                        ordersid:this.dingdanxiangqing.ordersid,    //订单id
                        commodityid: '', //商品id
                        shopid: this.dingdanxiangqing.shopid,      //商家id
                        userid: this.userInfo.username,      //用户id
                        remarkid: '',    //回复评价id
                        remark: '',      //评价内容
                        remarkimg:"",   //评价图片
                        remarkimgList:[],
                        somegreattimes:'',  //点赞次数
                        score:score,       //打分
                        commenttype:0, //类型  0 评价 1 追评 2 商家回复
                        anonymous:1,   //匿名()默认1不匿
                        hidden:1,      //隐藏 默认1不隐藏
                        shopreplytype:0,   //商家回复状态默认0未回复 1已回复 2不回复
                        checktype:0,   //查阅状态 默认为查阅0 已1 隐藏2
                        clerksid:"",    //店员id
                        lastcomment:"", //最后评论时间
                        isfollowcomment:"", //是否有新的追评
                        lastcommenta:"",    //最后追评/回复时间
                        isfollowcommenta:'',    //是否有新的追评/回复
                    };
                评价列表.push(评价对象);
            }
            openloading(true)
            api_添加评论(评价列表).then(x=>{
                console.log(x);
                if(x.data.code==200){
                    mui.toast("评价成功", { duration: "long", type: "div" });
                    this.设置支付成功弹出框(false);
                    this.findShopOrdersById()
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
            }).catch(err=>{
                openloading(false);
                mui.toast("网络错误，稍后再试。", { duration: "long", type: "div" });
            })
            console.log(评价列表);
        }
    },
    mounted() {
        this.userInfo=JSON.parse(localStorage.userInfo);
    },
};
</script>

<style lang="scss" scoped>
.支付成功 {
    position: fixed;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    > ul {
        width: 246px;
        background: #ffffff;
        border-radius: 16px;
        padding: 0px 25px;
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        position: relative;
        li {
            margin: 0px 0px 17px;
        }
    }
    .item{
        display: flex;
    }
    .标题2{
        text-align-last: justify;
        width: 42px;
        display: inline-block;
        flex-shrink: 0;
    }
    .关闭{
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 16px;
        color:rgba(153, 153, 153, 1);
    }
    .标题 {
        padding: 14px 0px 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            color: rgba(32, 220, 4, 1);
            font-size: 22px;
            height: 22px;
        }
        span {
            margin: 0px 0px 0px 7px;
            color: #18a968;
            font-size: 14px;
        }
    }
    .money {
        font-size: 22px;
        color: #d9393b;
    }
    .按钮框 {
        display: flex;
        justify-content: space-between;
        color: rgba(0, 122, 255, 1);
    	font-size: 14px;
        margin: 0px;
        padding: 6px 25px 20px;
    }
    .好评{
        display: flex;
    }
}
</style>
