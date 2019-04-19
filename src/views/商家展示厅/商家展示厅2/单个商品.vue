<template>
    <ul class="单个商品">
        <li @click="$router.push('/commodity/CommodityDetails?id='+obj.id)">
            <img :src="图片" alt="" srcset="">
        </li>
        <li>
            <div class="商品名称" @click="$router.push('/commodity/CommodityDetails?id='+obj.id)">
                <span>{{obj.name}}</span>
                <span>销</span>
                <span>{{obj.sales}}</span>
            </div>
            <div class="价格数量">
                <div class="价格">
                    <span>￥{{obj.sellingPrice}}</span>
                    <s>{{obj.marketPrice}}</s>
                </div>            
                <div class="购买按钮">
                    <i v-show="购买数量>0" @click="减去商品()" class="icon iconfont icon-jian-tianchong"></i>
                    <div v-show="购买数量>0">{{购买数量}}</div>
                    <i @click="添加商品()" class="icon iconfont icon-jia-tianchong"></i>
                </div>
            </div>
            <div class="省钱详情">
                <i class="icon iconfont icon-hongbao1"></i>
                <span class="省钱">省:{{parseFloat(obj.deduction.toFixed(1))}}元</span>
                <span class="新人专享" v-if="obj.EXID && obj.EXTYPE==0">
                    新人
                </span>
                <span class="生日专享" v-if="obj.EXID && obj.EXTYPE==1">
                    生日
                </span>
                <span class="省钱" v-if="obj.EXID">省:{{Math.round((obj.EXDEDUCTION)*100)/100}}元</span>
                <i v-if="obj.商品红包" class="icon iconfont icon-hongbao"></i>
                <span v-if="obj.商品红包" @click="领取红包()" class="领红包">领红包</span>
            </div>
        </li>
    </ul>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { api_用户领取红包 } from "@/api/红包接口.js";
import { dateFtt, openloading, getDateStr } from "@/assets/js/currency.js";
export default {
    name:"",
    props:{
        obj:{
            default:()=>{}
        }
    },
    data() {
        return {
            userInfo:""
        }
    },
    computed: {
        ...mapGetters({
            全部信息:'商家展示厅2/全部信息',
        }),
        图片(){
            var img="";
            if(this.obj.img && this.obj.img.split(',').length>0){
                img= this.obj.img.split(',')[0]
            }
            return img
        },
        购买数量(){
            var list=this.全部信息.购买商品列表.filter(x=>x.id==this.obj.id);
            return list.length
        }
    },
    methods: {
        ...mapActions({
            获取用户红包:'商家展示厅2/获取用户红包',
            设置是否显示登录框:'设置是否显示登录框'

        }),
        添加商品(){
            // if(obj.购买数量){
            //     obj.购买数量++
            // }else{
            //     obj.购买数量=1
            // }
            if(this.obj.isstock){
                if(this.购买数量>=this.obj.stock){
                    mui.toast("不能再添加了，剩余库存不足", { duration: 2000, type: "div" });
                    return
                }
            }
            
            this.全部信息.购买商品列表.push(this.obj);
            this.全部信息.显示购物车详情=false;
        },
        减去商品(){
            var obj=this.obj;
            var index=-1;
            var 购买商品=this.全部信息.购买商品列表
            for (let i = 0; i < 购买商品.length; i++) {
                if(obj.id==购买商品[i].id){
                    index=i
                    break
                }
            }
            if(index!=-1){
                this.全部信息.购买商品列表.splice(index,1);
            }
        },
        领取红包(){
            if (!this.userInfo) {
                this.设置是否显示登录框()
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // }, 'div');
                return
            }
            var obj = {
                id: "",
                userid: this.userInfo.username,
                envelopeId: this.obj.商品红包.id,
                state: "0", //状态(使用等等)  0 刚领取
                type: this.obj.商品红包.type,
                amount: this.obj.商品红包.amount ? this.obj.商品红包.amount : 0,
                startTime:  "", //生日使用有效期
                endTime:  ""
            };
            openloading(true);
            api_用户领取红包(obj).then(x => {
                if (x.data.code == 200) {
                    console.log(1);
                    mui.toast("恭喜您，领取成功。", { duration: 2000, type: "div" });
                    this.获取用户红包().then(x=>{
                        openloading(false);
                    }).catch(err=>{
                        openloading(false);
                    })
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    openloading(false);
                }
            }).catch(err => {
                mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
                openloading(false);
            })

        }
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {
            
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.单个商品{
    background: #ffffff;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    padding: 4px 10px 4px 4px;
    >li:nth-child(1){
        width: 92px;
        height: 69px;
        flex-shrink: 0;
        margin: 0px 8px 0px 0px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    >li:nth-child(2){
        flex-grow: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .商品名称{
        display: flex;
        align-items: center;
        >span:nth-child(1){
            width: 0;
            flex-grow: 1;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        >span:nth-child(2){
            width: 12px;
            height: 12px;
            flex-shrink: 0;
            background: $header_background;
            font-size: 8px;
            border-radius: 100%;
            margin: 0px 4px;
            text-align: center;
            line-height: 12px;
            color: #ffffff;
        }
        >span:nth-child(3){
            color: rgba(166, 166, 166, 1);
        	font-size: 10px;
            white-space: nowrap;
            flex-shrink: 0;
        }
    }
    .价格数量{
        display: flex;
        .价格{
            flex-grow: 1;
            span{
                color: $header_background;
            	font-size: 12px;
            }
            s{
                color: rgba(166, 166, 166, 1);
            	font-size: 10px;
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
    .省钱详情{
        display: flex;
        align-items: center;
        .icon-hongbao1{
            font-size: 12px;
            height: 12px;
            line-height: 12px;
            color: $header_background;
            margin: 0px 4px 0px 0px;
        }
        .省钱{
            color: $header_background;
            font-size: 10px;
            margin: 0px 13px 0px 0px;
            line-height: 10px;
        }
        .新人专享,
        .生日专享{
            min-width: 20px;
            white-space: nowrap;
            height: 12px;
            text-align: center;
            font-size: 7px;
            line-height: 12px;
            border-radius: 4px;
            margin: 0px 4px 0px 0px;
        }
        .新人专享{
            padding: 0px 2px 0px 3px;
            color: $header_background;
            border:1px solid $header_background;
        }
        .生日专享{
            padding: 0px 2px 0px 3px;
            color:rgba(172, 51, 193, 1);
            border:1px solid rgba(172, 51, 193, 1);
        }
        .领红包{
            min-width: 20px;
            padding: 0px 3px;
            white-space: nowrap;
            height: 12px;
            text-align: center;
            color: $header_background;
            border:1px solid $header_background;
            font-size: 7px;
            line-height: 12px;
            border-radius: 4px;
            margin: 0px 4px 0px 0px;
        }
        .icon-hongbao{
            font-size: 12px;
            height: 12px;
            line-height: 12px;
            color: $header_background;
            margin: 0px 4px 0px 0px;
        }
    }
}
</style>
