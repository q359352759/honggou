<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">自助买单</h1>
        </header>
        <div class="mui-content mui-fullscreen" ref="muiContent">
            <ul class="店铺信息">
                <li>
                    <img :src="全部信息.店铺信息.signboard" alt="" srcset="">
                </li>
                <li>
                    <div>{{全部信息.店铺信息.name}}</div>
                    <div>感谢您的惠顾！</div>
                </li>
                <li @click="领红包()">
                    <div>
                        <img src="image/hongbao_1.png" alt="" srcset="">
                    </div>
                    <div>领红包</div>
                </li>
            </ul>

            <ul class="支付金额">
                <li>￥：</li>
                <li><input type="text" @input="输入发生改变()" v-model="全部信息.输入金额" placeholder="请输入支付金额"></li>
                <li>元</li>
            </ul>

            <ul class="红包省钱">
                <li>
                    <div class="">
                        <i class="icon iconfont icon-hongbao"></i>
                        <b>红包省钱</b>
                    </div>
                    <div class="红色字体"><b>省：{{最大省钱.金额}}元</b></div>
                    <div>
                        <span v-if="最大省钱.type==-1 && 店铺红包抵扣>0 && 平台红包抵扣>0">2</span>
                        <span v-if="最大省钱.type==-1 && 店铺红包抵扣==0 && 平台红包抵扣==0">0</span>
                        <span v-if="最大省钱.type==-1 && 店铺红包抵扣>0 && 平台红包抵扣==0">1</span>
                        <span v-if="最大省钱.type==-1 && 店铺红包抵扣==0 && 平台红包抵扣>0">1</span>
                        <span v-if="最大省钱.type!=-1 && 最大省钱.金额==0">0</span>
                        <span v-if="最大省钱.type!=-1 && 最大省钱.金额!=0">1</span>
                        <span>个红包</span>
                    </div>
                </li>
                <!-- 最大省钱.type==-1 -->
                <li v-show="店铺红包抵扣>0 || 平台红包抵扣>0">
                    <div>
                        <span v-if="店铺红包抵扣>0 && 平台红包抵扣>0">平台+店铺红包</span>
                        <span v-if="店铺红包抵扣>0 && 平台红包抵扣==0">店铺红包</span>
                        <span v-if="店铺红包抵扣==0 && 平台红包抵扣>0">平台红包</span>
                    </div>
                    <div class="红色字体">
                        <span>省：{{店铺红包抵扣 + 平台红包抵扣}}元</span>
                    </div>
                    <div @click="选择红包类型(-1)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':抵扣类型==-1,'icon-choose':抵扣类型!=-1}"></i>
                    </div>
                </li>
                <!-- <li v-show="平台红包抵扣>0">
                    <div>平台红包：</div>
                    <div class="红色字体">
                        <span>省：{{平台红包抵扣}}元</span>
                    </div>
                    <div @click="选择红包类型(-1)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':最大省钱.type==-1,'icon-choose':最大省钱.type!=-1}"></i>
                    </div>
                </li> -->
                <!-- 最大省钱.type==2 -->
                <li v-show="节日红包抵扣>0">
                    <div>节日红包：</div>
                    <div class="红色字体">
                        <span>省：{{节日红包抵扣}}元</span>
                    </div>
                    <div @click="选择红包类型(2)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':抵扣类型==2,'icon-choose':抵扣类型!=2}"></i>
                    </div>
                </li>
                <!-- 最大省钱.type==3 &&  -->
                <li v-show="签到红包抵扣>0">
                    <div>签到红包：</div>
                    <div class="红色字体">
                        <span>省：{{签到红包抵扣}}元</span>
                    </div>
                    <div @click="选择红包类型(3)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':抵扣类型==3,'icon-choose':抵扣类型!=3}"></i>
                    </div>
                </li>
                <!-- 最大省钱.type==4 &&  -->
                <li v-show="庆典红包抵扣>0">
                    <div>庆典红包：</div>
                    <div class="红色字体">
                        <span>省：{{庆典红包抵扣}}元</span>
                    </div>
                    <div @click="选择红包类型(4)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':抵扣类型==4,'icon-choose':抵扣类型!=4}"></i>
                    </div>
                </li>
                <!-- 最大省钱.type==5 &&  -->
                <li v-show="生日红包抵扣>0">
                    <div>生日红包：</div>
                    <div class="红色字体">
                        <span>省：{{生日红包抵扣}}元</span>
                    </div>
                    
                    <div @click="选择红包类型(5)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':抵扣类型==5,'icon-choose':抵扣类型!=5}"></i>
                    </div>
                </li>
            </ul>
            <div class="付款方式">
                <!-- <ul class="mui-table-view 提货类型">
                    <li class="mui-table-view-cell item" @click="取货类型=1">
                        <i class="icon iconfont" :class="{'icon-xuanze2':取货类型==1,'icon-choose':取货类型==2}"></i>
                        <span>当面付（已拿到商品）</span>
                    </li>
                    <li class="mui-table-view-cell item"  @click="取货类型=2">
                        <i class="icon iconfont" :class="{'icon-xuanze2':取货类型==2,'icon-choose':取货类型==1}"></i>
                        <span>到店自取（先付款，再到店铺拿货）</span>
                    </li>
                </ul> -->
                <div class="支付按钮">
                    <span>实付：{{实际支付}}元</span>
                    <div @click="去支付()">支&nbsp;付</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api_添加订单 } from "@/api/订单接口.js";
import { mapGetters , mapActions } from "vuex";
import { 当前时间格式化 , openloading } from "@/assets/js/currency.js";
export default {
    name:"",
    data() {
        return {
            userInfo:"",
            抵扣类型:-1,
            是否手动选择抵扣类型:false,
        }
    },
    computed: {
        ...mapGetters({
            全部信息:'自助买单/全部信息',
            店铺红包抵扣:"自助买单/店铺红包抵扣",
            平台红包抵扣:"自助买单/平台红包抵扣",
            节日红包抵扣:"自助买单/节日红包抵扣",
            签到红包抵扣:"自助买单/签到红包抵扣",
            庆典红包抵扣:"自助买单/庆典红包抵扣",
            生日红包抵扣:"自助买单/生日红包抵扣",
        }),
        最大省钱(){
            //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            if(!this.是否手动选择抵扣类型){
                var list=[
                    {'type':-1,金额:this.店铺红包抵扣+this.平台红包抵扣},
                    {'type':2,金额:this.节日红包抵扣},
                    {'type':3,金额:this.签到红包抵扣},
                    {'type':4,金额:this.庆典红包抵扣},
                    {'type':5,金额:this.生日红包抵扣}
                ]
                list.sort(function (num1, num2) {
                    return num1.金额 - num2.金额;
                });
                this.抵扣类型=list[list.length - 1].type;
                return list[list.length - 1];
            }else{
                var list=[
                    {'type':-1,金额:this.店铺红包抵扣+this.平台红包抵扣},
                    {'type':2,金额:this.节日红包抵扣},
                    {'type':3,金额:this.签到红包抵扣},
                    {'type':4,金额:this.庆典红包抵扣},
                    {'type':5,金额:this.生日红包抵扣}
                ]
                var obj=list.find(x=>x.type==this.抵扣类型);
                return obj;
            }
        },
        实际支付(){
            var 实际支付=this.全部信息.输入金额-this.最大省钱.金额;
            return Math.round(实际支付*100)/100
        }
    },
    methods: {
        ...mapActions({
            数据初始化:'自助买单/数据初始化' 
        }),
        选择红包类型(type){
            this.是否手动选择抵扣类型=true;
            this.抵扣类型=type;
        },
        输入发生改变(){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            if(number_test.test(this.全部信息.输入金额) && this.全部信息.输入金额[this.全部信息.输入金额.length-1]!='.'){
                this.全部信息.输入金额=Math.floor(this.全部信息.输入金额*100)/100
            }
        },
        领红包(){
            history.back();
        },
        去支付(){
            var number_test = /^[0-9]+.?[0-9]*$/;   //可带小数
            if(!number_test.test(this.全部信息.输入金额)){
                mui.toast("请输入金额", { duration: 2000, type: "div" });
                return
            }
            var 支付类型="";
            if(ApplicationType=='app'){
                if(AppType=="ios"){
                    支付类型="ios"
                }else{
                    支付类型="安卓"
                }
            }else{
                let agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                    支付类型="微信"
                }else{
                    支付类型="非微信浏览器";
                }
            }
             var 当前时间 = 当前时间格式化('yyyy-MM-dd hh:mm')
            var 使用的红包=[];
            if(this.最大省钱.金额>0){
                if(this.最大省钱.type==-1){
                    if(this.店铺红包抵扣>0){
                        var 用户新人红包 = this.全部信息.用户红包.find(x=>x.type==0);
                        var 红包1=Object.assign({},用户新人红包);
                            红包1.paymentAmount=this.店铺红包抵扣;
                        使用的红包.push(红包1)
                    }
                    if(this.平台红包抵扣>0){
                        var 红包2=Object.assign({},this.全部信息.用户平台红包);
                            红包2.paymentAmount=this.平台红包抵扣;
                        使用的红包.push(红包2)
                    }
                }else if(this.最大省钱.type==2){
                    var 用户节日红包 = this.全部信息.用户红包.find(x=>(x.type==2 && x.redStartTime<=当前时间 && x.redEndTime>=当前时间));
                    var 红包1=Object.assign({},用户节日红包);
                        红包1.paymentAmount=this.最大省钱.金额;
                    使用的红包.push(红包1)
                }else if(this.最大省钱.type==3){
                    //目前没有签到红包
                }else if(this.最大省钱.type==4){
                    var 用户庆典红包 = this.全部信息.用户红包.find(x=>(x.type==4 && x.redStartTime<=当前时间 && x.redEndTime>=当前时间));
                    var 红包1=Object.assign({},用户庆典红包);
                        红包1.paymentAmount=this.最大省钱.金额;
                    使用的红包.push(红包1)
                }else if(this.最大省钱.type==5){
                    var 用户生日红包 = this.全部信息.用户红包.find(x=>(x.type==5 && x.redStartTime<=当前时间 && x.redEndTime>=当前时间));
                    var 红包1=Object.assign({},用户生日红包);
                        红包1.paymentAmount=this.最大省钱.金额;
                    使用的红包.push(红包1)
                }
            }

            var submitCommodity=[];
                submitCommodity[0] = {
                    shopCommodity: {
                        shopRedEnvelope: 使用的红包
                    },
                    deduction: this.最大省钱.金额,      //抵扣金额
                    actualPayment: this.实际支付 //实际金额
                };
            var obj={
                identifying:支付类型,  //微信 安卓 ios  
                typeOne: 1,     //设1为当面付,设2位到店取货
                orderType: 1,   //0购买商品 1 表示输入金额
                appUser: this.userInfo, //用户
                shopBasics: this.全部信息.店铺信息, //店铺信息
                amount: this.实际支付,         //支付总金额
                submitCommodityList: submitCommodity //商品实体类
            }
            openloading(true);
            api_添加订单(obj).then(x=>{
                if (x.data.code == 200) {
                    this.$router.push({ name: "ordersOrder", query: { ordreId: x.data.data.id }, params: { zhifu: 1 } });
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
            }).catch(err=>{
                mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                openloading(false);
            })
        }
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}
        var shopid=this.$route.query.shopid;
        this.数据初始化(shopid);
        
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.店铺信息{
    display: flex;
    background: #ffffff;
    padding: 10px 20px 10px 13px;
    >li:nth-child(1){
        width: 80px;
        height: 60px;
        margin: 0px 13px 0px 0px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    >li:nth-child(2){
        flex-grow: 1;
        width: 0px;
        >div:nth-child(1){
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0px 0px 14px 0px;
        }
        >div:nth-child(2){
            color: $header_background;
            font-size: 12px;
        }
    }
    >li:nth-child(3){
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        white-space: nowrap;
        >div:nth-child(1){
            width: 32px;
            height: 32px;
            margin: 0px 0px 3px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        >div:nth-child(2){
            font-size: 12px;
            color: $header_background;
        }
    }
}
.支付金额{
    height: 55px;
    background: #ffffff;
    margin: 3px 0px 0px ;
    display: flex;
    align-items: center;
    padding: 0px 18px 0px 13px;
    >li:nth-child(1){
        font-size: 22px;
        color: $header_background;
        white-space: nowrap;
        flex-shrink: 0;
    }
    >li:nth-child(2){
        flex-grow: 1;
        margin: 0px 13px 0px 0px;
        input{
            height: 37px;
            padding: 0px;
            margin: 0px;
            background: rgba(246, 246, 246, 1);
            border-radius: 4px;
            border: none;
            font-size: 20px;
            color: $header_background;
            text-align: center;
            font-weight: bold;
        }
    }
    >li:nth-child(3){
        flex-shrink: 0;
        font-weight: bold;
        font-size: 15px;
        color: $header_background;
    }
}


.红包省钱{
    li{
        background: #ffffff;
        border-bottom: 1px solid #f6f6f6;
        height: 40px;
        display: flex;
        align-items: center;
        color: rgba(80, 80, 80, 1);
        font-size: 12px;
        padding: 0px 15px;
        div{
            width: calc(100% / 3);    
        }
        >div:nth-child(1){
            display: flex;
            align-items: center;
            >span:nth-child(1){
                flex-shrink: 0;
            }
            >span:nth-child(2){
                width: 0;
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        >div:nth-child(2){
            text-align: center;
        }
        >div:nth-child(3){
            text-align: right;
        }
        .icon-xuanze2,
        .icon-choose{
            font-size: 20px;
            line-height: 20px;
            height: 20px;
        }
        .icon-xuanze2{
            color: rgba(44, 172, 236, 1);
        }
        .icon-hongbao{
            font-size: 20px;
            line-height: 20px;
            height: 20px;
            margin: 0px 7px 0px 0px;
            color: $header_background;
        }
        .红色字体{
            color: $header_background;
            flex-grow: 1;
            text-align: center;
        }
        .数量{
            color: rgba(166, 166, 166, 1);
        }
        .商品红包名称{
            color: rgba(166, 166, 166, 1);
        	font-size: 10px;

        }
    }
}


.付款方式{
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    .提货类型{
        .mui-table-view-cell:after{
            left: 0px;
        }
        .item{
            display: flex;
            align-items: center;
            i{
                font-size: 20px;
                height: 20px;
                line-height: 20px;
                margin: 0px 8px 0px 0px;
            }
            .icon-xuanze2{
                color: rgba(44, 164, 236, 1);
            }
            .icon-choose{
                color: rgba(156, 156, 156, 1);
            }
            span{
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
            }
        }
    }
    .支付按钮{
        height: 44px;
        display: flex;
        background: $header_background;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        span{
            color: rgba(255, 255, 255, 1);
            font-size: 14px;
            font-weight: bold;
        }
        div{
            width: 88px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            background: #ffffff;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            color: $header_background;
        }
    }
}
</style>
