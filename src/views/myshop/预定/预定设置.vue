<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">预订设置</h1>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="">
            <div class="开启设置">
                <div>店铺预订：</div>
                <i @click="预定.isopen=1" class="icon iconfont" :class="{'icon-xuanze2':预定.isopen==1,'icon-choose':预定.isopen==0}"></i>
                <div @click="预定.isopen=1">开启</div>
                <i @click="预定.isopen=0" class="icon iconfont" :class="{'icon-xuanze2':预定.isopen==0,'icon-choose':预定.isopen==1}"></i>
                <div @click="预定.isopen=0">关闭</div>
            </div>
            
            <form @submit.prevent="提交()">
                <ul class="定金设置">
                    <li>
                        <div>订 金：</div>
                    </li>
                    <li>
                        <div>
                            <i @click="预定.reservationtype=0" class="icon iconfont" :class="{'icon-xuanze2':预定.reservationtype==0,'icon-choose':预定.reservationtype!=0}"></i>
                            <div @click="预定.reservationtype=0">免订金</div>
                        </div>
                        <!-- <div @click="预定.reservationtype=1">
                            <i class="icon iconfont" :class="{'icon-xuanze2':预定.reservationtype==1,'icon-choose':预定.reservationtype!=1}"></i>
                            <div class="固定宽度">固定金额<span></span></div>
                            <input :type="预定.reservationtype==1 ? 'number' : 'text'" v-model="固定金额" min="0.1" step="0.1" :required="预定.reservationtype==1">
                            <div>元</div>
                        </div> -->
                        <div @click="预定.reservationtype=2">
                            <i class="icon iconfont" :class="{'icon-xuanze2':预定.reservationtype==2,'icon-choose':预定.reservationtype!=2}"></i>
                            <div class="固定宽度">比例<span></span></div>
                            <input :type="预定.reservationtype==2 ? 'number' : 'text'" min="0.1" max="100" step="0.1" v-model="百分比" :required="预定.reservationtype==2" readonly @click="选择定金比例()">
                            <div>%</div>
                        </div>
                    </li>
                </ul>

                <div class="提示语">提示：若用户取消订餐，订金不退还。</div>
                
                <btn type="submit" :styles="{'margin':'33px 0px'}" value="保存"/>
            </form>
        </div>
    </div>
</template>

<script>
import { api_商家添加预定 , api_商家修改预定 , api_根据shopid查询预定  } from "@/api/预定接口.js";

import btn from '@/components/button.vue'
import { openloading } from "@/assets/js/currency.js";
import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        btn
    },
    data() {
        return {
            预定:{
                id:"",
                isopen:1,       //是否开启
                reservationtype:0,     //订金方式 0 免佣金 1 固定金额 2 比例
                deposit:0,         //订金
                createtime:"",
                shopid:""
            },
            固定金额:"",
            百分比:""
        }
    },
    computed: {
        ...mapGetters({
            myshop:'get_myshop' 
        })
    },
    methods: {
        ...mapActions({
            getMyshop: "getMyshop",
        }),
        选择定金比例(){
            var PopPicker = new mui.PopPicker();
                PopPicker.setData([
                    {value: '10',text: '10%'},
                    {value: '20',text: '20%'},
                    {value: '30',text: '30%'},
                    {value: '40',text: '40%'},
                    {value: '50',text: '50%'},
                ]);
                PopPicker.show((items)=>{
                    console.log(items);
                    this.百分比=items[0].value;
                    PopPicker.dispose();
    				PopPicker = null;
                })

        },
        提交(){
            console.log('可以提交');
            if(this.预定.reservationtype==0){
                this.预定.deposit=0
            }else if(this.预定.reservationtype==1){
                this.预定.deposit=this.固定金额
            }else{
                if(!this.百分比){
                    mui.toast("请选择百分比", { duration: 1000, type: "div" });
                    return
                }
                this.预定.deposit=this.百分比
            }

            if(this.预定.id){
                api_商家修改预定(this.预定).then(x=>{
                    if(x.data.code==200){
                        mui.toast("设置成功", { duration: 1000, type: "div" });
                        history.back()
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                }).catch(err=>{
                    mui.toast("系统错误稍后再试", { duration: 1000, type: "div" });
                })
            }else{
                api_商家添加预定(this.预定).then(x=>{
                    if(x.data.code==200){
                        mui.toast("设置成功", { duration: 1000, type: "div" });
                        history.back()
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                }).catch(err=>{
                    mui.toast("系统错误稍后再试", { duration: 1000, type: "div" });
                })
            }
        },
        失去焦点(e,type){
            // e.target.setCustomValidity('');
            if(type==1){

            }else{

            }
        },
        async 初始化(){
            openloading(true)
            if(!this.myshop || !this.myshop.shopid){
                await this.getMyshop();
            }
            this.预定.shopid=this.myshop.shopid;
            api_根据shopid查询预定(this.myshop.shopid).then(x=>{
                console.log('预定',x)
                if(x.data.code==200){
                    if(x.data.data){
                        this.预定=x.data.data;
                        if(this.预定.reservationtype==1){
                            this.固定金额=this.预定.deposit
                        }else if(this.预定.reservationtype==2){
                            this.百分比=this.预定.deposit
                        }
                    }
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false)
            }).catch(err=>{
                console.log(err)
                openloading(false);
                mui.toast("系统错误稍后再试", { duration: 1000, type: "div" });
            })
        }
    },
    mounted() {
        this.初始化()
    },
}
</script>

<style lang="scss" scoped>
.开启设置{
    height: 44px;
    padding: 0px 23px;
    display: flex;
    align-items: center;
    color: rgba(80, 80, 80, 1);
	font-size: 14px;
    background: #ffffff;
    i{
        font-size: 16px;
        line-height: 16px;
        height: 16px;
        margin: 0px 6px 0px 20px;
    }
    .icon-xuanze2{
        color: rgba(60, 174, 236, 1);
    }
}
.定金设置{
    background: #ffffff;
    margin: 3px 0px 0px;
    >li{
        border-bottom: 1px solid #f6f6f6;
        >div{
            display: flex;
            align-items: center;
            height: 44px;
            padding: 0px 0px 0px 20px;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
            i{
                font-size: 16px;
                line-height: 16px;
                height: 16px;
                margin: 0px 10px 0px 0px;
                flex-shrink: 0;
            }
            .icon-xuanze2{
                color: rgba(60, 174, 236, 1);
            }
            .固定宽度{
                width: 56px;
                flex-shrink: 0;
                text-align: justify;
                height: 19px;
                span{
                    display:inline-block; 
                    padding-left: 100%; 
                    width:100%;
                }
            }
            input{
                width: 106px;
            	height: 32px;
                background: rgba(246, 246, 246, 1);
                margin: 0px 10px;
                border: none;
                padding: 0px ;
                font-size: inherit;
                color: inherit;
                text-align: center;
            }

        }
    }
}

.提示语{
    color: rgba(128, 128, 128, 1);
	font-size: 12px;
    padding: 0px 23px;
    margin: 12px 0px 0px;
}



</style>
