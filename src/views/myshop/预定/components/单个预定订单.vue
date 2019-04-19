<template>
    <ul class="预定列表">
        <li class="头部">
            <div>
                <div>顾客：{{item.消费者.nickname | 过滤昵称}}</div>
                <div>
                    <span v-if="item.state==3">
                        已支付订金：{{item.预定信息 ? item.预定信息.deposit : ''}}元
                    </span>
                    <span v-if="item.state==1">
                        支付订金：{{item.预定信息 ? item.预定信息.deposit : ''}}元
                    </span>
                    <span v-if="item.state==4">
                        支付订金：{{item.预定信息 ? item.预定信息.deposit : ''}}元
                    </span>
                </div>
                <div>{{item.createTime | 格式时间}}</div>
            </div>
            <div>
                <div class="联系方式">
                    <div>电话：{{item.消费者.phone}}</div>
                    <!-- <i class="icon iconfont icon-dianhua"></i> -->
                </div>
                <div>预订消费时间：<span v-if="item.预定信息">{{item.预定信息.reservationtime | 格式时间}}</span></div>
                <div>预订消费人数：{{item.预定信息 ? item.预定信息.reservationtotal : ''}}人</div>
                <!-- <div class="预定时间">
                    <div>预订消费时间</div>
                    <div>{{item.预定信息 ? item.预定信息.reservationtime : ''}}</div>
                </div> -->
            </div>                        
        </li>
        <li class="商品列表" v-for="(item_1, index) in 商品列表" :key="index">
            <div>
                <img v-if="item_1.img && item_1.img.split(',').length>0" :src="item_1.img.split(',')[0]" alt="" srcset="">
            </div>
            <div>
                <div>{{item_1.name}}</div>
                <div>￥{{item_1.sellingPrice}}</div>
            </div>
            <div>
                <div>x{{item_1.购买数量}}</div>
                <div>
                    <img v-if="item_1.exclusive==1" src="image/xingren1.png" alt="" srcset="">
                    <img v-if="item_1.exclusive==2" src="image/shengri1.png" alt="" srcset="">
                </div>
            </div>
        </li>
        <li class="备注回复" v-show="item.预定信息 && (item.预定信息.remark || item.预定信息.reply)">
            <div v-if="item.预定信息.remark">
                <div>备注：</div>
                <div v-html="item.预定信息.remark"></div>
                <div v-if="item.state==3 && !item.预定信息.reply" @click="显示回复框=true">回复</div>
            </div>
            <div v-if="item.预定信息.reply">
                <div>商家回复：</div>
                <div v-html="item.预定信息.reply"></div>
            </div>
        </li>
        <li class="合计">
            <div class="商品金额">合计：{{item.shopOrderCommoditys.length}}件商品，{{item.paymentAmount}}元</div>
            <a class="联系电话" :href="'tel:'+item.消费者.phone" v-if="item.state==3 && item.消费者">联系顾客</a>
            <div class="状态时间" v-show="item.state==1">
                <div>消费时间</div>
                <div>{{item.createTime | 格式时间}}</div>
            </div>
            <div class="状态时间" v-show="item.state==4">
                <div>取消时间</div>
                <div v-if="item.预定信息">{{item.预定信息.reservationtime | 格式时间}}</div>
            </div>
        </li>

        <div class="回复弹框" v-show="显示回复框">
            <ul>
                <li>回复</li>
                <li contenteditable="true" ref="回复内容"></li>
                <li>
                    <div @click="显示回复框=false">取消</div>
                    <div @click="确定回复()">确定</div>
                </li>
            </ul>
        </div>
    </ul>
</template>

<script>
import { api_修改预定订单 , api_根据id查询预定订单} from "@/api/预定接口.js";
import { openloading , dateFtt } from "@/assets/js/currency.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
export default {
    name:"",
    // inject:['点击回复'],
    props:{
        obj:{
            default:()=>{
                return {}
            }
        }
    },
    data() {
        return {
            item:this.obj,
            显示回复框:false
        }
    },
    filters:{
        过滤昵称(name){
            try {
                return b64DecodeUnicode(name)
            } catch (error) {
                return name
            }
        },
        格式时间(time){
            return dateFtt(time,'yyyy.MM.dd hh:mm')
        }
    },
    computed: {
        商品列表(){
            var list=[];
            this.item.shopOrderCommoditys.forEach(item => {
                // exclusive //1 新人 2 生日
                var obj=list.find(x=>x.commodityid == item.commodityid);
                if(obj){
                    obj.购买数量++;
                    if(item.exclusive){
                        obj.exclusive=item.exclusive
                    }
                }else{
                    var obj1 = Object.assign({},item);
                        obj1.购买数量=1;
                    list.push(obj1);
                }
            });
            return list;
        }
    },
    methods: {
        async 确定回复(){
            console.log(this.$refs.回复内容.innerHTML);
            var 内容=this.$refs.回复内容.innerText
                内容=内容.replace(/\' '/g,"").replace(/[\r\n]/g, "")
            if(!内容){
                mui.toast("请输入内容", { duration: "long", type: "div" });
                return
            }
            openloading(true)
            var obj=Object.assign({},this.item.预定信息);
                obj.reply=this.$refs.回复内容.innerHTML;
            try {
                var 修改预定_r = await api_修改预定订单(obj);
                if(修改预定_r.data.code!=200){
                    openloading(false)
                    mui.alert(修改预定_r.data.msg ? 修改预定_r.data.修改预定_r : 修改预定_r.data.message, "提示", "我知道了", function () { }, "div");
                    return
                }
            } catch (error) {
                openloading(false)
                mui.toast("系统错误稍后再试", { duration: "long", type: "div" });
                return
            }
            api_根据id查询预定订单(this.item.预定信息.id).then(x=>{
                if(x.data.code==200){
                    this.item.预定信息=x.data.data;
                    this.显示回复框=false;
                }else{
                    mui.alert(x.data.msg ? x.data.修改预定_r : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false)
            }).catch(err=>{
                openloading(false)
                mui.toast("系统错误稍后再试", { duration: "long", type: "div" });
                return
            })
            
        },
    },
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/config.scss';
// header_background

.预定列表{
    background: #ffffff;
    margin: 3px 0px 0px 0px;
    .头部{
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        padding: 7px 13px 7px 10px;
        display: flex;
        justify-content: space-between;
        height: 80px;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        >div:nth-child(2){
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
        }
        .联系方式{
            display: flex;
            i{
                font-size: 20px;
                line-height: 20px;
                height: 20px;
                color: $header_background;
                margin: 0px 0px 0px 4px;
            }
        }
        .预定时间{
            width: 118px;
        	height: 38px;
            text-align: center;
            border: 1px solid rgba(229, 229, 229, 1);
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
    }   
    .商品列表{
        padding: 8px 20px 8px 10px;
        display: flex;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            width: 50px;
            height: 38px;
            flex-shrink: 0;
            margin: 0px 12px 0px 0px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        >div:nth-child(2){
            flex-grow: 1;
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        >div:nth-child(3){
            text-align: center;
            >div:nth-child(1){
                color: rgba(166, 166, 166, 1);
            	font-size: 14px;
            }
            >div:nth-child(2){
                width: 16px;
                height: 16px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .备注回复{
        border-bottom: 1px solid #f6f6f6;
        color: rgba(128, 128, 128, 1);
    	font-size: 12px;
        padding: 0px 10px;
        >div{
            padding: 13px 0px 13px 24px;
            border-top: 1px solid #f6f6f6;
            display: flex;
            >div:nth-child(1){
                flex-shrink: 0;
                white-space: nowrap;
            }
            >div:nth-child(2){
                flex-grow: 1;
            }
            >div:nth-child(3){
                flex-shrink: 0;
                color: rgba(0, 122, 255, 1);
            	font-size: 12px;
            }
        }
        >div:nth-child(1){
            color: $header_background;
            border-top: none;
            padding: 13px 0px 13px 0px;
        }
    }
    .合计{
        height: 50px;
        padding: 0px 20px 0px 10px;
        color: rgba(80, 80, 80, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        .商品金额{
        	font-size: 14px;
        }
        .联系电话{
            width: 64px;
        	height: 24px;
            text-align: center;
            font-size: 12px;
            line-height: 22px;
            border-radius: 24px;
            color: rgba(0, 122, 255, 1);
            border:1px solid rgba(0, 122, 255, 1);
        }
        .状态时间{
            font-size: 12px;
            text-align: center;
        }
    }
}
.回复弹框{
    position: fixed;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    >ul{
        padding: 0px 13px; 
        width: 217px;
        background: #ffffff;
        border-radius: 16px;
        font-size: 14px;
        >li:nth-child(1){
            color: rgba(80, 80, 80, 1);
            padding: 14px 0px 19px;
            text-align: center;
        }
        >li:nth-child(2){
            width: 191px;
        	height: 64px;
            background-color: rgba(246, 246, 246, 1);
            padding: 10px;
            color: rgba(80, 80, 80, 1);
        }
        >li:nth-child(2):empty:before{
            content: '请输入'; 
            color: rgba(166, 166, 166, 1);
        	font-size: 14px;
        }
        >li:nth-child(3){
            height: 59px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            >div:nth-child(1){
                color: rgba(128, 128, 128, 1);
            }
            >div:nth-child(2){
                color: rgba(0, 122, 255, 1);
            }
        }
    }
}

</style>


