<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">确认支付</h1>
        </header>
        <div class="mui-content mui-fullscreen" ref="muiContent">
            
            <div class="内容区">
                <xzpsdz v-if="取货类型==4"/>

                <div class="店铺头部">
                    <i class="icon iconfont icon-jinrudianpu"></i>
                    <span v-show="全部信息.店铺信息">{{全部信息.店铺信息.name}}</span>
                </div>
                <div class="通用标题">商品列表：</div>
                <ul class="mui-table-view 列表">
                    <li class="mui-table-view-cell item" v-for="(item, index) in this.去重后的商品" :key="index">
                        <div>{{item.name}}</div>
                        <div class="mui-text-center">
                            <span>￥{{item.sellingPrice}}</span>
                            <s>{{item.marketPrice}}</s>
                        </div>
                        <div class="mui-text-right">x{{item.购买数量}}</div>
                    </li>
                    <li class="mui-table-view-cell item">
                        <div>合计：</div>
                        <div class="mui-text-center">
                            <span>￥{{销售总价}}</span>
                            <s>{{市场总价}}</s>
                        </div>
                        <div class="mui-text-right">{{带抵扣购买商品.length}}件</div>
                    </li>
                </ul>
                <!-- <div class="通用标题">红包省钱：</div>
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
                            <i class="icon iconfont" :class="{'icon-xuanze2':全部信息.最佳抵扣规则==0,'icon-choose':全部信息.最佳抵扣规则!=0}"></i>
                        </div>
                    </li>
                    <li v-show="红包可抵扣.生日红包可抵扣>0">
                        <div>
                            <span>生日红包</span>
                            <span class="商品红包名称" v-if="用户生日红包">({{用户生日红包.endTime | 时间格式化}})</span>
                        </div>
                        <div class="红色字体">省：{{红包可抵扣.生日红包可抵扣}}元</div>
                        <div @click="选择红包类型(3)">
                            <i class="icon iconfont" :class="{'icon-xuanze2':全部信息.最佳抵扣规则==3,'icon-choose':全部信息.最佳抵扣规则!=3}"></i>
                        </div>
                    </li>
                    <li v-show="红包可抵扣.节日红包可抵扣>0">
                        <div>
                            <span>节日红包</span>
                            <span class="商品红包名称" v-if="用户节日红包">({{用户节日红包.endTime | 时间格式化}})</span>
                        </div>
                        <div class="红色字体">省：{{红包可抵扣.节日红包可抵扣}}元</div>
                        <div @click="选择红包类型(1)">
                            <i class="icon iconfont" :class="{'icon-xuanze2':全部信息.最佳抵扣规则==1,'icon-choose':全部信息.最佳抵扣规则!=1}"></i>
                        </div>
                    </li>
                    <li v-show="红包可抵扣.庆典红包可抵扣>0">
                        <div>
                            <span>庆典红包</span>
                            <span class="商品红包名称" v-if="用户庆典红包">({{用户庆典红包.endTime | 时间格式化}})</span>
                        </div>
                        <div class="红色字体">省：{{红包可抵扣.庆典红包可抵扣}}元</div>
                        <div @click="选择红包类型(2)">
                            <i class="icon iconfont" :class="{'icon-xuanze2':全部信息.最佳抵扣规则==2,'icon-choose':全部信息.最佳抵扣规则!=2}"></i>
                        </div>
                    </li>
                </ul>

            </div>

            <zffs :支付总金额="支付总金额" :可预订="(全部信息.店铺预定 && 全部信息.店铺预定.isopen==1)" :可送货="false"/>

        </div>
        <ydtck v-show="显示预定描述"/>
    </div>
</template>

<script>
import xzpsdz from './商家展示厅2/选择配送地址.vue'
const zffs=()=>import('./商家展示厅2/付款方式选择.vue');
const ydtck=()=>import('./商家展示厅2/预定弹出框.vue');
import { openloading , dateFtt , 当前时间格式化} from "@/assets/js/currency.js";
import { api_添加订单 } from "@/api/订单接口.js";
import { api_添加预订 } from "@/api/预定接口.js";

import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        xzpsdz,
        zffs,
        ydtck
    },
    provide(){
        return {
            去支付:this.去支付,
            设置预定描述:this.设置预定描述,
            切换支付类型:this.切换支付类型
        }
    },
    data() {
        return {
            //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            红包类型:['店铺红包','商品红包','节日红包','签到红包','庆典红包','节生日红包'],
            取货类型:1,     //设1为当面付,设2位到店取货
            显示预定描述:false,
            userInfo:"",
            订单预订:{
                shopid:"",
                userid:"",
                orderid:"",
                commodityorderid:"",
                state:"",           //不用填写
                reservationtime:"", //预订消费时间
                reservationtotal:"",//消费人数
                remark:"",      //备注
                reply:"",       //商家回复
                deposit:0,     //订金
                paytype:"",     //支付方式
                payname:"",     //支付方式名称
                cardname:"",    //cardname
                cardid:"",      //卡号
                identity:"",    //平台
                appversions:"", //版本号
                createtime:"",  //支付时间
            }
        }
    },
    filters:{
        时间格式化(time){
            return dateFtt(time,'yyyy.MM.dd')
        }
    },
    computed: {
        ...mapGetters({
            带抵扣购买商品:"商家展示厅2/带抵扣购买商品",
            全部信息:'商家展示厅2/全部信息',
            红包可抵扣:"商家展示厅2/红包可抵扣"
        }),
        使用的商品红包(){
            var list=[];
                this.带抵扣购买商品.forEach(item=>{
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
            if(this.全部信息.最佳抵扣规则==0 && (this.红包可抵扣.新人红包可抵扣>0 || this.红包可抵扣.平台红包可抵扣>0)){
                if(this.红包可抵扣.新人红包可抵扣>0 && this.红包可抵扣.平台红包可抵扣>0){
                    number +=2
                }else{
                    number +=1
                }
            }else if(this.全部信息.最佳抵扣规则==1 && this.红包可抵扣.节日红包可抵扣>0){
                number++
            }else if(this.全部信息.最佳抵扣规则==2 && this.红包可抵扣.庆典红包可抵扣>0){
                number++
            }
            return number
        },
        用户生日红包(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var obj=this.全部信息.用户红包.find(x=>x.type==5 && 当前时间>x.startTime && 当前时间<x.endTime);
            return obj;
        },
        用户节日红包(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var obj=this.全部信息.用户红包.find(x=>x.type==2 && 当前时间>x.startTime && 当前时间<x.endTime);
            return obj;
        },
        用户庆典红包(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var obj=this.全部信息.用户红包.find(x=>x.type==4 && 当前时间>x.startTime && 当前时间<x.endTime);
            return obj;
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
                    console.log(x.实际抵扣);
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
            this.带抵扣购买商品.forEach(item=>{
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
            设置是否显示登录框:'设置是否显示登录框'
        }),
        选择红包类型(type){
            this.全部信息.最佳抵扣规则=type;
            this.全部信息.是否手动选择类型=true;
        },
        去支付(取货类型){
            
            if(!this.userInfo){
                this.设置是否显示登录框(true)
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // },'div');
                return;
            }
            if(取货类型==3){
                if(!this.订单预订.reservationtime || !this.订单预订.reservationtotal){
                    console.log('不能提交');
                    this.显示预定描述=true;
                    return
                }
            }
            var 支付总金额= Math.round((this.销售总价-this.总抵扣金额)*100)/100 
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
                // typeOne:this.取货类型,     //设1为当面付,设2位到店取货
                typeOne:取货类型,     //设1为当面付,设2位到店取货 3 预定
                orderType: 0,   //0购买商品 1 表示输入金额
                appUser: this.userInfo, //用户
                shopBasics: this.全部信息.店铺信息, //店铺信息
                amount: 支付总金额,         //支付总金额
                submitCommodityList: submitCommodity //商品实体类
            }

            openloading(true);
            api_添加订单(obj).then(x=>{
                if (x.data.code == 200) {
                    if(取货类型!=3){
                        openloading(false);
                        this.全部信息.购买商品列表=[];
                        this.$router.replace({ name: "ordersOrder", query: { ordreId: x.data.data.id }, params: { zhifu: 1 } });
                    }else{
                        //固定定金
                        if(this.全部信息.店铺预定.reservationtype==1){
                            this.订单预订.deposit=this.全部信息.店铺预定.deposit
                        }else if(this.全部信息.店铺预定.reservationtype==2){
                            this.订单预订.deposit=Math.round(支付总金额*this.全部信息.店铺预定.deposit)/100;
                        }
                        this.订单预订.shopid=this.全部信息.shopid;
                        this.订单预订.userid=this.userInfo.username;
                        // this.订单预订.orderid='';
                        this.订单预订.commodityorderid=x.data.data.ordersid;
                        this.订单预订.identity=支付类型
                        this.订单预订.appversions=当前版本号;
                        api_添加预订(this.订单预订).then(r=>{
                            if(r.data.code==200){
                                this.$router.replace({ name: "ordersOrder", query: { ordreId: x.data.data.id }, params: { zhifu: 1 } });
                            }else{
                                mui.alert(r.data.msg ? r.data.msg : r.data.message, "提示", "我知道了", function () { }, "div");
                            }
                            openloading(false);
                        }).catch(err_1=>{
                            mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                            openloading(false);
                        })
                    }
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    openloading(false);
                }
            }).catch(err=>{
                mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                openloading(false);
            })
        },
        设置预定描述(type,obj){
            console.log(obj);
            this.显示预定描述=false;
            if(type){
                this.订单预订.reservationtime=obj.消费时间;
                this.订单预订.reservationtotal=obj.消费人数;
                this.订单预订.remark=obj.留言;
            }
        },
        切换支付类型(type){
            if(type==3){
                this.显示预定描述=true;
            }
        }
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}
        if(this.带抵扣购买商品.length==0){
            history.back();
        }
        console.log('2019-04-10 11:10'<'2019-04-10 11:24');
        console.log('2019-04-10 11:10'>'2019-04-10 11:24');

        console.log(Math.round((50-100)*100)/100);
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background

.mui-content{
    // padding-bottom: 163px;
    display:flex;
    flex-direction: column;
    >*{
        flex-shrink: 0;
    }
    .内容区{
        flex-grow: 1;
        overflow: auto;
    }
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
    }
}
.通用标题{
    height: 38px;
    line-height: 38px;
    padding: 0px 15px;
    color: rgba(80, 80, 80, 1);
	font-size: 12px;
}
.列表{
    .mui-table-view-cell:after{
        left: 0px;
    }
    .item{
        display: flex;
        align-items: center;
        >div{
            width: calc(100% / 3);
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

// .付款方式{
//     // position: fixed;
//     // left: 0px;
//     // bottom: 0px;
//     // width: 100%;
//     .选择提货类型{
//         position: absolute;
//         top: 0px;
//         left: 0px;
//         bottom: 85px;
//         width: 100%;
//         background: rgba(0,0,0,0.4);
//         >ul{
//             position: absolute;
//             left: 0px;
//             width: 100%;
//             bottom: 0px;
//             border-bottom: 3px solid #f6f6f6;
//         }
//     }
//     .提货类型{
//         .mui-table-view-cell:after{
//             left: 0px;
//         }
//         .item{
//             display: flex;
//             align-items: center;
//             i{
//                 font-size: 20px;
//                 height: 20px;
//                 line-height: 20px;
//                 margin: 0px 8px 0px 0px;
//             }
//             .灰色字体{
//                 color: rgba(166, 166, 166, 1);
//                 flex-grow: 1;
//             }
//             .蓝色字体{
//                 color: rgba(0, 122, 255, 1);
//                 margin:0px 18px 0px 0px;
//             }
//             .icon-xuanze2{
//                 color: rgba(44, 164, 236, 1);
//             }
//             .icon-choose{
//                 color: rgba(156, 156, 156, 1);
//             }
//             span{
//                 color: rgba(80, 80, 80, 1);
//             	font-size: 14px;
//             }
//         }
//     }
//     .支付按钮{
//         height: 44px;
//         display: flex;
//         background: $header_background;
//         align-items: center;
//         justify-content: space-between;
//         padding: 0px 15px;
//         span{
//             color: rgba(255, 255, 255, 1);
//             font-size: 14px;
//             font-weight: bold;
//         }
//         div{
//             width: 88px;
//             height: 30px;
//             text-align: center;
//             line-height: 30px;
//             background: #ffffff;
//             border-radius: 30px;
//             font-size: 14px;
//             font-weight: bold;
//             color: $header_background;
//         }
//     }
// }

</style>
