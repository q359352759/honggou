<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">自助买单</h1>
        </header>
        <div class="mui-content mui-fullscreen" ref="muiContent">
            <div class="店铺头部">
                <!-- <i class="icon iconfont icon-jinrudianpu"></i> -->
                <span>{{排号全部信息.店铺信息 ? 排号全部信息.店铺信息.name : ""}}</span>
                <!-- <div>追加</div> -->
                <b>{{排号全部信息.用户排号.详情 ? 排号全部信息.用户排号.详情.rownum : ''}}号</b>
            </div>
            <div class="通用标题">
                <span>商品列表：</span>
                <span>{{排号全部信息.用户排号.详情 ? 排号全部信息.用户排号.详情.createtime : ''}}</span>
            </div>
            <ul class="mui-table-view 列表" v-if="排号全部信息.用户排号.详情">
                <li class="mui-table-view-cell item" v-for="(item, index) in 排号全部信息.用户排号.详情.shopRowNumberCommodities" :key="index">
                    <div>{{item.商品 ? item.商品.name : ''}}</div>
                    <div class="mui-text-center">
                        <span>￥{{item.商品 ? item.商品.sellingPrice : ''}}</span>
                        <s>{{item.商品 ? item.商品.marketPrice : ''}}</s>
                    </div>
                    <div class="mui-text-right">x{{item.num}}</div>
                    <div>
                        <div @click="取消(item)" v-if="!item.state">取消</div>
                    </div>
                </li>
                <li class="mui-table-view-cell item">
                    <div>合计：</div>
                    <div class="mui-text-center">
                        <span>￥{{销售总价}}</span>
                        <s>{{市场总价}}</s>
                    </div>
                    <div class="mui-text-right">{{排号全部信息.购买商品列表.length}}件</div>
                    <div>
                        
                    </div>
                </li>
            </ul>
            <!-- <div class="通用标题">
                <span>红包省钱：</span>
                <span>*提示：开始制作后不可取消</span>
            </div>
            <ul class="mui-table-view 列表">
                <li class="mui-table-view-cell item" v-for="(item, index) in 使用红包列表" :key="index">
                    <div>
                        <span v-if="item.type || item.type==0">{{红包类型[item.type]}}</span>
                        <span v-if="!item.type && item.type!=0">平台红包</span>
                    </div>
                    <div class="mui-text-center">
                       <span>省：{{item.总抵扣}}元</span>
                    </div>
                    <div class="mui-text-right"></div>
                </li>
            </ul> -->

            <ul class="红包省钱">
                <li>
                    <div class="">
                        <i class="icon iconfont icon-hongbao"></i>
                        <b>红包省钱</b>
                    </div>
                    <div class="红色字体"><b>省：{{总抵扣金额}}元</b></div>
                    <div>{{使用红包总数}}个红包</div>
                </li>
                <li v-for="(item, index) in 使用的商品红包" :key="index">
                    <div><span>商品红包</span><span class="商品红包名称">({{item.commodityName}})</span></div>
                    <div class="红色字体">省：{{item.总抵扣}}元</div>
                    <div class="数量">x{{item.使用数量}}</div>
                </li>
                <!-- dikou==6 -->
                <li v-show="红包可抵扣.新人红包可抵扣>0 || 红包可抵扣.平台红包可抵扣>0">
                    <div v-if="红包可抵扣.新人红包可抵扣>0 && 红包可抵扣.平台红包可抵扣==0">店铺红包</div>
                    <div v-if="红包可抵扣.新人红包可抵扣==0 && 红包可抵扣.平台红包可抵扣>0">平台红包</div>
                    <div v-if="红包可抵扣.新人红包可抵扣!=0 && 红包可抵扣.平台红包可抵扣!=0">平台+店铺红包</div>
                    <div class="红色字体">省：{{红包可抵扣.新人加平台总和}}元</div>
                    <div @click="选择红包类型(0)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':排号全部信息.最佳抵扣规则==0,'icon-choose':排号全部信息.最佳抵扣规则!=0}"></i>
                    </div>
                </li>
                <li v-show="红包可抵扣.生日红包可抵扣>0">
                    <div>
                        <span>生日红包</span>
                        <span class="商品红包名称" v-if="用户生日红包">({{用户生日红包.endTime | 时间格式化}})</span>
                    </div>
                    <div class="红色字体">省：{{红包可抵扣.生日红包可抵扣}}元</div>
                    <div @click="选择红包类型(3)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':排号全部信息.最佳抵扣规则==3,'icon-choose':排号全部信息.最佳抵扣规则!=3}"></i>
                    </div>
                </li>
                <li v-show="红包可抵扣.节日红包可抵扣>0">
                    <div>
                        <span>节日红包</span>
                        <span class="商品红包名称" v-if="用户节日红包">({{用户节日红包.endTime | 时间格式化}})</span>
                    </div>
                    <div class="红色字体">省：{{红包可抵扣.节日红包可抵扣}}元</div>
                    <div @click="选择红包类型(1)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':排号全部信息.最佳抵扣规则==1,'icon-choose':排号全部信息.最佳抵扣规则!=1}"></i>
                    </div>
                </li>
                <li v-show="红包可抵扣.庆典红包可抵扣>0">
                    <div>
                        <span>庆典红包</span>
                        <span class="商品红包名称" v-if="用户庆典红包">({{用户庆典红包.endTime | 时间格式化}})</span>
                    </div>
                    <div class="红色字体">省：{{红包可抵扣.庆典红包可抵扣}}元</div>
                    <div @click="选择红包类型(2)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':排号全部信息.最佳抵扣规则==2,'icon-choose':排号全部信息.最佳抵扣规则!=2}"></i>
                    </div>
                </li>
            </ul>




        </div>
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
                <span>实付：{{支付总金额}}元</span>
                <div class="追加" @click="追加()">追&nbsp;加</div>
                <div class="支付" @click="去支付()">支&nbsp;付</div>
            </div>
        </div>
    </div>
</template>

<script>

import { openloading , dateFtt , 当前时间格式化 } from "@/assets/js/currency.js";
import { api_添加订单 } from "@/api/订单接口.js";
import { api_修改排号 , api_修改排号商品 } from '@/api/点单接口.js'
import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    data() {
        return {
            //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            红包类型:['店铺红包','商品红包','节日红包','签到红包','庆典红包','节生日红包'],
            取货类型:1,     //设1为当面付,设2位到店取货
        }
    },
    filters:{
        时间格式化(time){
            return dateFtt(time,'yyyy.MM.dd')
        }
    },
    computed: {
        ...mapGetters({
            排号全部信息:"用户点单排号/排号全部信息",
            
            带抵扣购买商品1:"用户点单排号/带抵扣购买商品",
             红包可抵扣:"用户点单排号/红包可抵扣"
        }),
        使用的商品红包(){
            var list=[];
                this.带抵扣购买商品1.forEach(item=>{
                    item.使用红包.forEach(item_1=>{
                        if(item_1.type==1){
                            var obj=list.find(x=>x.redCommodityId==item_1.redCommodityId);
                            if(obj){
                                obj.使用数量++
                                obj.总抵扣 = Math.round((obj.总抵扣+item_1.实际抵扣)*100)/100;
                            }else{
                                var obj_1=Object.assign({},item_1);
                                obj_1.使用数量=1;
                                obj_1.总抵扣=item_1.实际抵扣;
                                list.push(obj_1);
                            }
                        }
                    })
                })
            return list;
        },
        使用红包总数(){
            var number=0;
            this.使用的商品红包.forEach(x=>{
                number+=x.使用数量
            })
            if(this.排号全部信息.最佳抵扣规则==0 && (this.红包可抵扣.新人红包可抵扣>0 || this.红包可抵扣.平台红包可抵扣>0)){
                if(this.红包可抵扣.新人红包可抵扣>0 && this.红包可抵扣.平台红包可抵扣>0){
                    number +=2
                }else{
                    number +=1
                }
            }else if(this.排号全部信息.最佳抵扣规则==1 && this.红包可抵扣.节日红包可抵扣>0){
                number++
            }else if(this.排号全部信息.最佳抵扣规则==2 && this.红包可抵扣.庆典红包可抵扣>0){
                number++
            }
            return number
        },
        用户生日红包(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var obj=this.排号全部信息.用户红包.find(x=>x.type==5 && 当前时间>x.startTime && 当前时间<x.endTime);
            return obj;
        },
        用户节日红包(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var obj=this.排号全部信息.用户红包.find(x=>x.type==2 && 当前时间>x.startTime && 当前时间<x.endTime);
            return obj;
        },
        用户庆典红包(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var obj=this.排号全部信息.用户红包.find(x=>x.type==4 && 当前时间>x.startTime && 当前时间<x.endTime);
            return obj;
        },

        销售总价(){
            var 价格=0;
            this.排号全部信息.购买商品列表.forEach(item => {
                价格= Math.round( (价格+item.sellingPrice)*100)/100 
            });
            return 价格
        },
        市场总价(){
            var 价格=0;
            this.排号全部信息.购买商品列表.forEach(item => {
                // 价格+=item.marketPrice
                价格= Math.round((价格+item.marketPrice)*100)/100
            });
            return 价格
        },
        去重后的商品(){
            let hash = {};
            const newArr = this.排号全部信息.购买商品列表.reduceRight((item, next) => {
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
            this.带抵扣购买商品1.forEach(item=>{
                item.使用红包.forEach(x=>{
                    总抵扣金额 =  Math.round( (总抵扣金额+x.实际抵扣)*100)/100
                })
            })
            return 总抵扣金额;
        },
        支付总金额(){
            var 支付总金额=this.销售总价-this.总抵扣金额;
            return Math.round(支付总金额*100)/100
        },
        使用红包列表(){
            var list=[];
            this.带抵扣购买商品1.forEach(item=>{
                item.使用红包.forEach(item_1=>{
                    var obj=Object.assign({},item_1);
                    var obj_1='';
                    if(obj.redId){  //红包
                        obj_1=list.find(x=>x.redId == obj.redId)
                    }else{      //平台红包
                        obj_1=list.find(x=>x.id == obj.id && !x.redId)
                    }
                    if(obj_1){
                        obj_1.总抵扣=Math.round((obj_1.总抵扣+obj.实际抵扣)*100)/100;
                    }else{
                        obj.总抵扣=obj.实际抵扣;
                        list.push(obj)
                    }
                })
            })
            return list;
        }
    },
    methods: {
        ...mapActions({
            排号初始化:"用户点单排号/排号初始化",
            设置是否显示登录框:"设置是否显示登录框"
        }),
        取消(item){
            if(item.state==1){
                mui.alert('商品已开始制作，不能取消订单', "提示", "我知道了", function () { }, "div");
                return;
            }
            mui.confirm("确定取消？", "提示", ["取消", "是的"], value => {
                if (value.index == 1) {
                    var obj=Object.assign({},item);
                        obj.state=2     //1:开始2取消3完成
                    api_修改排号商品(obj).then(x=>{
                        if(x.data.code==200){
                            mui.toast("取消成功", { duration: "long", type: "div" });
                        }else{
                            mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                        }
                        this.排号初始化().then(r=>{
                            if(!this.排号全部信息.用户排号.查询成功 || !this.排号全部信息.用户排号.详情){
                                history.back();
                            }
                        })
                    }).catch(err=>{
                        mui.toast("系统错误，稍后再试", { duration: "long", type: "div" });
                    })
                }
            },'div');
        },
        追加(){
            this.$router.push('/sjdd?shopid='+this.排号全部信息.shopid+'&ph='+this.排号全部信息.用户排号.详情.rownum);
        },
        去支付(){
            if(!this.userInfo){
                this.设置是否显示登录框(true);
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // },'div');
                return;
            }
            var 支付总金额= Math.round((this.销售总价-this.总抵扣金额)*100)/100 
            var submitCommodity=[]
            this.带抵扣购买商品1.forEach(item=>{
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
                    obj.deduction = 抵扣金额;        //单个商品抵扣金额
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
                typeOne:1,      //设1为当面付,设2位到店取货
                orderType: 0,   //0购买商品 1 表示输入金额
                appUser: this.userInfo, //用户
                shopBasics: this.排号全部信息.店铺信息, //店铺信息
                amount: 支付总金额,         //支付总金额
                submitCommodityList: submitCommodity //商品实体类
            }

            openloading(true);
            api_添加订单(obj).then(x=>{
                if (x.data.code == 200) {
                    this.排号全部信息.购买商品列表=[];
                    var 排号=this.排号全部信息.用户排号.详情;
                        排号.ordersid=x.data.data.ordersid
                    api_修改排号(排号).then(r=>{
                        if(r.data.code==200){
                            this.排号初始化()
                            this.$router.replace({ name: "ordersOrder", query: { ordreId: x.data.data.id }, params: { zhifu: 1 } });
                        }else{
                            mui.alert(r.data.msg ? r.data.msg : r.data.message, "提示", "我知道了", function () { }, "div");
                        }
                    }).catch(err=>{
                        mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                    })
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

        this.排号初始化()
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background

.mui-content{
    padding-bottom: 60px;
}

.店铺头部{
    margin: 3px 0px 0px;
    height: 44px;
    background: #ffffff;
    display: flex;
    padding: 0px 15px;
    align-items: center;
    i{
        font-size: 20px;
        line-height: 20px;
        color: rgba(232, 100, 52, 1);
        margin: 0px 5px 0px 0px;
    }
    span{
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        flex-grow: 1;
    }
    div{
        flex-shrink: 0;
        width: 48px;
        height: 18px;
        margin: 0px 10px 0px 0px;
        border:1px solid rgba(0, 122, 255, 1);
        color: rgba(0, 122, 255, 1);
        line-height: 16px;
        text-align: center;
        font-size: 12px;
        border-radius: 18px;
    }
    b{
        font-size: 14px;
        color: $header_background;
    }
}
.通用标题{
    height: 38px;
    line-height: 38px;
    padding: 0px 15px;
    color: rgba(80, 80, 80, 1);
	font-size: 12px;
    display: flex;
    justify-content: space-between;
}
.列表{
    .mui-table-view-cell:after{
        left: 0px;
    }
    .item{
        display: flex;
        align-items: center;
        >div{
            width: calc(100% / 4);
        }
        >div:nth-child(1){
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            font-weight: bold;
        }
        >div:nth-child(2){
            span{
                color: $header_background;
                font-size: 12px;
            }
            s{
                margin: 0px 0px 0px 3px;
                color: rgba(166, 166, 166, 1);
            	font-size: 10px;
            }
        }
        >div:nth-child(3){
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
        }
        >div:nth-child(4){
            div{
                width: 48px;
            	height: 18px;
                font-size: 12px;
                color: rgba(166, 166, 166, 1);
                border:1px solid rgba(166, 166, 166, 1);
                line-height: 16px;
                text-align: center;
                border-radius: 12px;
                margin: 0px auto;
            }
        }
    }
}


.红包省钱{
    margin: 3px 0px 0px;
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
            flex-grow: 1;
        }
        .支付,
        .追加{
            width: 88px;
            height: 30px;
            text-align: center;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            margin: 0px 0px 0px 17px;
        }
        .追加{
            line-height: 28px;
            color: #ffffff;
            border: 1px solid #ffffff;
        }
        .支付{
            line-height: 30px;
            background: #ffffff;
            color: $header_background;
        }
    }
}

</style>
