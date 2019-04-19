<template>
    <div class="购物车">
        <div class="遮罩层" v-show="全部信息.显示购物车详情 && 全部信息.购买商品列表.length>0" @click="全部信息.显示购物车详情=false"></div>
        <ul class="mui-table-view 购物详情" v-show="全部信息.显示购物车详情 && 全部信息.购买商品列表.length>0">
            <li class="mui-table-view-cell item" v-for="(item, index) in 去重后的商品" :key="index">
                <div>
                    {{item.name}}
                </div>
                <div class="mui-text-center">
                    <span>￥{{item.sellingPrice}}</span>
                    <s>{{item.marketPrice}}</s>
                </div>
                <div>
                    <div class="购买按钮">
                        <i @click="减去商品(item)" class="icon iconfont icon-jian-tianchong"></i>
                        <div>{{item.购买数量}}</div>
                        <i @click="添加商品(item)" class="icon iconfont icon-jia-tianchong"></i>
                    </div>
                </div>
            </li>
        </ul>
        <div class="买单按钮" v-show="全部信息.购买商品列表.length>0">
            <ul class="">
                <li>
                    <div @click="全部信息.显示购物车详情=!全部信息.显示购物车详情">
                        <i class="icon iconfont icon-qicheqianlian-"></i>
                        <span>{{全部信息.购买商品列表.length}}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <span>￥{{销售总价}}</span>
                        <s>{{市场总价}}</s>
                    </div>
                    <div>
                        <i class="icon iconfont icon-hongbao1"></i>
                        <div>再省：{{总抵扣金额}}元</div>
                    </div>
                </li>
                <!-- <li @click="去支付()">去付款</li> -->
                <li @click="$router.push('/sjzst2/qrzf')">去付款</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { openloading } from "@/assets/js/currency.js";
import { api_添加订单 } from "@/api/订单接口.js";
import { mapGetters, mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            userInfo:'',

        }
    },
    computed: {
        ...mapGetters({
            全部信息:'商家展示厅2/全部信息',
            带抵扣购买商品:"商家展示厅2/带抵扣购买商品"
        }),
        销售总价(){
            var 价格=0;
            this.全部信息.购买商品列表.forEach(item => {
                价格= Math.round( (价格+item.sellingPrice)*100)/100 
            });
            return 价格
        },
        市场总价(){
            var 价格=0;
            this.全部信息.购买商品列表.forEach(item => {
                // 价格+=item.marketPrice
                价格= Math.round((价格+item.marketPrice)*100)/100
            });
            return 价格
        },
        去重后的商品(){
            let hash = {};
            const newArr = this.全部信息.购买商品列表.reduceRight((item, next) => {
                if(hash[next.id]){
                    hash[next.id].购买数量++
                }else{
                    var obj=Object.assign(next);
                        obj.购买数量=1
                    hash[next.id] = obj
                    item.push(next);
                }
                return item
            }, []);
            newArr.sort(function(a,b){
                return a.id-b.id;    // -1 升序排列 
            })
            return newArr
        },
        总抵扣金额(){
            var 总抵扣金额=0
            this.带抵扣购买商品.forEach(item=>{
                item.使用红包.forEach(x=>{
                    总抵扣金额 =  Math.round( (总抵扣金额+x.实际抵扣)*100)/100
                })
            })
            return 总抵扣金额;
        }
    },
    methods: {
        ...mapActions({
            设置是否显示登录框:'设置是否显示登录框'
        }),
        添加商品(item){
            var obj=Object.assign(item);
            if(obj.isstock){
                if(obj.购买数量>=obj.stock){
                    mui.toast("不能再添加了，剩余库存不足", { duration: 2000, type: "div" });
                    return
                }
            }
                delete obj.购买数量;
            this.全部信息.购买商品列表.push(obj);
        },
        减去商品(item){
            var index=-1;
            var 购买商品=this.全部信息.购买商品列表
            for (let i = 0; i < 购买商品.length; i++) {
                if(item.id==购买商品[i].id){
                    index=i
                    break
                }
            }
            if(index!=-1){
                this.全部信息.购买商品列表.splice(index,1);
            }
        },
        去支付(){
            if(!this.userInfo){
                this.设置是否显示登录框();
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // },'div');
                return;
            }
            var 支付总金额=this.销售总价-this.总抵扣金额
            var submitCommodity=[]
            this.带抵扣购买商品.forEach(item=>{
                var item_1=Object.assign({},item);
                    if(item_1.使用新人专享){
                        item_1.exclusive=1;
                    }else if(item_1.使用生日专享){
                        item_1.exclusive=2;                            
                    }
                let 支付金额=item_1.sellingPrice;   //实际售价
                let 抵扣金额=0;
                    item_1.使用红包.forEach(x=>{
                        x.paymentAmount=x.实际抵扣;
                        抵扣金额=Math.round((抵扣金额+x.实际抵扣)*100)/100
                    })

                var obj={}
                    obj.actualPayment=Math.round((支付金额-抵扣金额)*100)/100;     //单个商品支付金额 
                    obj.deduction= 抵扣金额;        //单个商品抵扣金额
                    obj.shopCommodity=item_1        //商品
                    obj.shopCommodity.shopRedEnvelope=item_1.使用红包   //使用的红包
                submitCommodity.push(obj);
            })
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
            var obj={
                identifying:支付类型,  //微信 安卓 ios  
                typeOne:"2",     //设1为当面付,设2位到店取货
                orderType: 0,   //0购买商品 1 表示输入金额
                appUser: this.userInfo, //用户
                shopBasics: this.全部信息.店铺信息, //店铺信息
                amount: 支付总金额,         //支付总金额
                submitCommodityList: submitCommodity //商品实体类
            }

            openloading(true);
            api_添加订单(obj).then(x=>{
                if (x.data.code == 200) {
                    this.全部信息.购买商品列表=[];
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
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.购物车{
    .遮罩层{
        position: fixed;
        top: 0px;
        left: 0px;
        background: rgba(0,0,0,0.4);
        width: 100%;
        height: 100%;
        z-index: 2;
    }
    .购物详情{
        position: fixed;
        width: 100%;
        max-height: 60%;
        min-height: 150px;
        overflow: auto;
        left: 0px;
        bottom: 72px;
        z-index: 3;
        align-items: center;
        .mui-table-view-cell:after{
            left: 0px;
        }
        .item{
            display: flex;
            >div{
                width: calc(100% / 3);
            }
            >div:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            >div:nth-child(2){
                span{
                    font-size: 12px;
                    color: $header_background;
                }
                s{
                    color: rgba(166, 166, 166, 1);
                    font-size: 10px;
                }
            }
            >div:nth-child(3){
                display: flex;
                justify-content: flex-end;
            }
        }
        .购买按钮{
            flex-shrink: 0;
            display: flex;
            align-items: center;
            .icon-jian-tianchong{
                font-size: 18px;
                height: 18px;
                color: #DBDBDB;
            }
            div{
                color: $header_background;
                font-size: 14px;
                min-width: 32px;
                padding: 0px 3px;
                text-align: center;
            }
            .icon-jia-tianchong{
                font-size: 18px;
                height: 18px;
                color: $header_background;
            }
        }
    }
    .买单按钮{
        background: #ffffff;
        width: 100%;
        height: 72px;
        position: fixed;
        left: 0px;
        bottom: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        ul{
            width: 229px;
            height: 52px;
            background: $header_background;
            border-radius: 52px;
            display: flex;
            >li:nth-child(1){
                width: 52px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                div{
                    position: relative;
                    i{
                        font-size: 27px;
                        color: #ffffff;
                    }
                    span{
                        position: absolute;
                        top: 0px;
                        left: 18px;
                        min-width: 12px;
                    	height: 12px;
                        font-size: 10px;
                        background: #ffffff;
                        color: $header_background;
                        text-align: center;
                        line-height: 12px;
                        border-radius: 12px;
                    }
                }
            }
            >li:nth-child(2){
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                >div:nth-child(1){
                    overflow: auto;
                    span{
                        font-size: 14px;
                        color: #ffffff;
                        font-weight: bold;
                        margin: 0px 3px 0px 0px;
                    }
                    s{
                        font-size: 10px;
                        color: #ffffff;
                    }
                }
                >div:nth-child(2){
                    display: flex;
                    align-items: center;
                    i{
                        font-size: 16px;
                        height: 16px;
                        line-height: 16px;
                        background: #ffffff;
                        color: $header_background;
                        box-shadow: 0px 0px 0px 1px #ffffff;
                        border-radius: 100%;
                        margin: 0px 6px 0px 0px;
                        flex-shrink: 0;
                    }
                    div{
                        width: 0;
                        flex-grow: 1;
                        white-space: nowrap;
                        overflow: auto;
                        color: rgba(255, 255, 255, 1);
                    	font-size: 10px;
                    }
                }
            }
            >li:nth-child(3){
                width: 70px;
                flex-shrink: 0;
                border-left: 1px solid #ffffff;
                color: rgba(255, 255, 255, 1);
                font-size: 12px;
                line-height: 52px;
                text-align: center;
            }
        }
    }
}
</style>

