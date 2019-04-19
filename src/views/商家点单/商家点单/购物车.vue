<template>
    <div class="购物车">
        <div class="遮罩层" v-show="全部信息.显示购物车详情 && 全部信息.购买商品列表.length>0" @click="全部信息.显示购物车详情=false"></div>
        <ul class="mui-table-view 购物详情" v-show="全部信息.显示购物车详情 && 全部信息.购买商品列表.length>0">
            <li class="mui-table-view-cell item" v-for="(item, index) in 去重后的商品" :key="index">
                <div>
                    {{item.name}}
                </div>
                <div class="mui-text-center">
                    <div>
                        <span>￥{{item.sellingPrice}}</span>
                        <s>{{item.marketPrice}}</s>
                    </div>
                    <div>
                        <i v-show="!item.备注" @click="编辑备注(item)" class="编辑按钮 icon iconfont icon-bianji1"></i>
                        <span v-show="!item.备注" @click="编辑备注(item)" class="编辑提示">备注</span>
                        <div v-show="item.备注" @click="编辑备注(item)" class="备注内容">{{item.备注}}</div>
                    </div>
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
                        <!-- <i class="icon iconfont icon-qicheqianlian-"></i> -->
                        <b ref="字体大小">{{全部信息.牌号}}号</b>
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
                <li @click="下单()">下单</li>
                <!-- <li @click="去支付()">下单</li> -->
                <!-- <li @click="$router.push('/sjdd/qrzf')">下单</li> -->
            </ul>
        </div>

        <div class="备注弹出框" v-show="显示备注框">
            <ul>
                <li>备注</li>
                <li><input v-model="备注内容" type="text"></li>
                <li>
                    <div @click="显示备注框=false">取消</div>
                    <div @click="添加备注()">确定</div>
                </li>
            </ul>
        </div>


    </div>
</template>

<script>
import { api_添加排号 , api_添加排号商品表 } from "@/api/点单接口.js";

import { openloading } from "@/assets/js/currency.js";
import { api_添加订单 } from "@/api/订单接口.js";
import { mapGetters, mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            userInfo:'',
            显示备注框:false,
            备注内容:"",
            详情:""
        }
    },
    computed: {
        ...mapGetters({
            全部信息:'商家点单/全部信息',
            带抵扣购买商品:"商家点单/带抵扣购买商品",
            用户排号:"用户点单排号/用户排号"
        }),
        show(){
            return this.全部信息.购买商品列表.length>0
        },
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
                        obj.购买数量=1;
                        obj.备注=""
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
        编辑备注(item){
            this.详情=item;
            this.备注内容=item.备注;
            this.显示备注框=true;
        },
        添加备注(){
            this.详情.备注=this.备注内容;
            this.显示备注框=false;
        },
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
        async 下单(){
            if(!this.userInfo){
                this.设置是否显示登录框(true)
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // },'div');
                return;
            }
            
            if(!this.用户排号.查询成功){
                mui.alert('获取排号记录失败，请稍后再试', "提示", "我知道了", function () { }, "div");
                return
            }
            if(!this.全部信息.牌号){
                mui.alert('无桌号信息，请重新扫描', "提示", "我知道了", function () { }, "div");
                return
            }
            openloading(true);
            if(this.用户排号.详情){
                var 排号id=this.用户排号.详情.rownumid;
            }else{
                var 牌号对象={
                    id:"",
                    shopid:this.全部信息.shopid,
                    rownumid:"",
                    rownum:this.全部信息.牌号,
                    userid:this.userInfo.username,
                    ordersid:"",
                    state:0,
                    createtime:"",
                    updatetime:"",
                }
                try {
                    var 排号_r=await api_添加排号(牌号对象);            
                } catch (error) {
                    mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                    openloading(false)
                    return
                }
                var 排号id=''
                if(排号_r.data.code==200){
                    排号id=排号_r.data.data;
                }else{
                    openloading(false);
                    mui.alert(排号_r.data.msg ? 排号_r.data.msg : 排号_r.data.message, "提示", "我知道了", function () { }, "div");
                    return
                }
            }
            

            var list=[];
            this.去重后的商品.forEach(item=>{
                var obj={
                    id:"",
                    shopid:this.全部信息.shopid,
                    rownumid:排号id,
                    commodityid: item.id,
                    num: item.购买数量,
                    producerid:"",          //制作员id
                    starttime:"",
                    finishtime:"",
                    cancelstime:"",
                    remark:item.备注
                }
                list.push(obj)
            })
            api_添加排号商品表(list).then(x=>{
                if(x.data.code==200){
                    this.全部信息.购买商品列表=[];
                    mui.toast("下单成功", { duration: "long", type: "div" });
                    this.$router.push('/sjdd/qrzf')
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false)
            }).catch(err=>{
                openloading(false)
                mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
            })
        },
        去支付(){
            if(!this.userInfo){
                this.设置是否显示登录框(true)
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
        },
        设置字体大小(){
            var div = this.$refs.字体大小;
            console.log(div.clientWidth,div.parentElement.clientWidth)
            if(div.clientWidth>div.parentElement.clientWidth){
                div.style.zoom=div.parentElement.clientWidth / div.clientWidth
            }
        }
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}
    },
    watch: {
        show(){
            if(this.show){
                this.$nextTick(()=>{
                    this.设置字体大小();
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.购物车{
    .备注弹出框{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 3;
        >ul{
            width: 194px;
            background: #ffffff;
            border-radius: 16px;
            >li:nth-child(1){
                height: 34px;
                line-height: 34px;
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
                font-weight: bold;
            }
            >li:nth-child(2){
                padding: 0px 12px;
                input{
                    height: 32px;
                    padding: 0px 5px;
                    margin: 0px;
                    font-size: 14px;
                    border: none;
                    background: rgba(246, 246, 246, 1);
                }
            }
            >li:nth-child(3){
                display: flex;
                height: 34px;
                align-items: center;
                >div{
                    width: 50%;
                }
                >div:nth-child(1){
                    color: rgba(166, 166, 166, 1);
                	font-size: 14px;
                }
                >div:nth-child(2){
                    color: rgba(0, 122, 255, 1);
                	font-size: 14px;
                }
            }
        }
    }
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
            >div:nth-child(1){
                flex-grow: 1;
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            >div:nth-child(2){
                width: 130px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                >div:nth-child(1){
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    white-space: nowrap;
                    span{
                        font-size: 12px;
                        color: $header_background;
                    }
                    s{
                        color: rgba(166, 166, 166, 1);
                        font-size: 10px;
                    }
                } 
                >div:nth-child(2){
                    display: flex;
                    align-items: center;
                    flex-grow: 1;
                    justify-content: center;
                    width: 0;
                    .编辑按钮{
                        font-size: 18px;
                        line-height: 18px;
                        height: 18px;
                        color: rgba(128, 128, 128, 1);
                    }
                    .编辑提示{
                        color: rgba(128, 128, 128, 1);
                    	font-size: 10px;
                    }
                    .备注内容{
                        color: rgba(0, 122, 255, 1);
                    	font-size: 10px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
            >div:nth-child(3){
                width: 70px;
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
                    width: 34px;
                	height: 34px;
                    line-height: 34px;
                    text-align: center;
                    font-size: 14px;
                    color: $header_background;
                    border-radius: 100%;
                    background: #ffffff;
                    b{
                        white-space: nowrap;
                        width: fit-content;
                        display: block;
                        margin: 0px auto;
                    }
                    i{
                        font-size: 27px;
                        color: #ffffff;
                    }
                    span{
                        position: absolute;
                        top: 0px;
                        left: 22px;
                        min-width: 12px;
                    	height: 12px;
                        font-size: 10px;
                        background: #ffffff;
                        color: $header_background;
                        text-align: center;
                        line-height: 12px;
                        border-radius: 12px;
                        box-shadow: 0px 0px 0px 1px $header_background;
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

