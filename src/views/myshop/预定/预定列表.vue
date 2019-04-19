<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">预订</h1>
            <span @click="$router.push('/myshop/yd/ydsz')">预定设置</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="导航">
                <li @click="查看类型=1" :class="{'active':查看类型==1}">
                    <div>待消费</div>
                    <span v-if="待消费.total>0">{{待消费.total>100 ? '99+':待消费.total}}</span>
                </li>
                <li @click="查看类型=2" :class="{'active':查看类型==2}"><div>已完成</div></li>
                <li @click="查看类型=3" :class="{'active':查看类型==3}"><div>已取消</div></li>
            </ul>

            <div class="内容区">
                <div v-show="查看类型==1">
                    <dgyddd v-for="(item, index) in 待消费.list" :obj="item" :key="index"/>
                    <loading :loadingtype="待消费.loading" :nodata="!待消费.loading && 待消费.total==0" :end="!待消费.loading && 待消费.total!=0 && 待消费.list.length>=待消费.total"/>
                </div>

                <div v-show="查看类型==2">
                    <dgyddd v-for="(item, index) in 已完成.list" :obj="item" :key="index"/>
                    <loading :loadingtype="已完成.loading" :nodata="!已完成.loading && 已完成.total==0" :end="!已完成.loading && 已完成.total!=0 && 已完成.list.length>=已完成.total"/>
                </div>

                <div v-show="查看类型==3">
                    <dgyddd v-for="(item, index) in 已取消.list" :obj="item" :key="index"/>
                    <loading :loadingtype="已取消.loading" :nodata="!已取消.loading && 已取消.total==0" :end="!已取消.loading && 已取消.total!=0 && 已取消.list.length>=已取消.total"/>
                </div>

            </div>
        </div>

        <ul class="未开启提示" v-show="显示未开启提示">
            <li>提示：您还未开启预订功能</li>
            <li @click="$router.push('/myshop/yd/ydsz')">开启</li>
        </ul>
    </div>
</template>

<script>
import dgyddd from './components/单个预定订单.vue'
import loading from '@/components/loading.vue'

import { api_根据shopid查询预定 } from "@/api/预定接口.js";
import { api_查询订单列表 } from "@/api/订单接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { api_查询预订订单记录 } from "@/api/预定接口.js";
import { openloading } from "@/assets/js/currency.js";
import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        dgyddd,
        loading
    },
    data() {
        return {
            查看类型:1, // 1 待消费 2 已完成 3 已取消
            预定:'',
            待消费:{
                query:{
                    shopid:'',
                    start:0,
                    length:10,
                    state:3,
                    typeOne:3
                },
                list:[],
                total:0,
                loading:true,
                page_index:0
            },
            已完成:{
                query:{
                    shopid:'',
                    start:0,
                    length:10,
                    state:1,
                    typeOne:3
                },
                list:[],
                total:0,
                loading:true,
                page_index:0
            },
            已取消:{
                query:{
                    shopid:'',
                    start:0,
                    length:10,
                    state:4,
                    typeOne:3
                },
                list:[],
                total:0,
                loading:true,
                page_index:0
            },
        }
    },
    computed: {
        ...mapGetters({
            myshop:'get_myshop' 
        }),
        显示未开启提示(){
            if((this.预定 && this.预定.isopen==1) || this.待消费.list.length>0 || this.已完成.list.length>0 || this.已取消.list.length>0){
                return false;
            }else{
                return true
            }
        }
    },
    methods: {
        ...mapActions({
            获取店铺:'getMyshop'
        }),
        获取待消费(){
            this.待消费.query.start=this.待消费.page_index*this.待消费.query.length;
            this.待消费.query.shopid=this.myshop.shopid;
            this.待消费.loading=true
            return new Promise((resolve, reject) => {
                api_查询订单列表(this.待消费.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data.data;
                        list.forEach(item => {
                            item.消费者="";
                            item.预定信息='';
                            api_通过username查询用户(item.userid).then(r=>{
                                item.消费者=r.data.code==200 ? r.data.data : '';
                            })
                            var query={
                                    start:0,
                                    length:10,
                                    commodityorderid:item.ordersid
                                }
                            api_查询预订订单记录(query).then(r=>{
                                item.预定信息=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';
                            })
                        });
                        this.待消费.list=[...this.待消费.list,...list]
                        this.待消费.total=x.data.data.total;
                    }
                    this.待消费.loading=false
                    resolve()
                }).catch(err=>{
                    this.待消费.loading=false
                    reject()
                })
            });
        },
        获取已完成(){
            this.已完成.query.start=this.已完成.page_index*this.已完成.query.length;
            this.已完成.query.shopid=this.myshop.shopid;
            this.已完成.loading=true
            return new Promise((resolve, reject) => {
                api_查询订单列表(this.已完成.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data.data;
                        list.forEach(item => {
                            item.消费者="";
                            item.预定信息='';
                            api_通过username查询用户(item.userid).then(r=>{
                                item.消费者=r.data.code==200 ? r.data.data : '';
                            })
                            var query={
                                    start:0,
                                    length:10,
                                    commodityorderid:item.ordersid
                                }
                            api_查询预订订单记录(query).then(r=>{
                                item.预定信息=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';
                            })
                        });
                        this.已完成.list=[...this.已完成.list,...list]
                        this.已完成.total=x.data.data.total;
                    }
                    this.已完成.loading=false
                    resolve()
                }).catch(err=>{
                    this.已完成.loading=false
                    reject()
                })
            });
        },
        获取已取消(){
            this.已取消.query.start=this.已取消.page_index*this.已取消.query.length;
            this.已取消.query.shopid=this.myshop.shopid;
            this.已取消.loading=true
            return new Promise((resolve, reject) => {
                api_查询订单列表(this.已取消.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data.data;
                        list.forEach(item => {
                            item.消费者="";
                            item.预定信息='';
                            api_通过username查询用户(item.userid).then(r=>{
                                item.消费者=r.data.code==200 ? r.data.data : '';
                            })
                            var query={
                                    start:0,
                                    length:10,
                                    commodityorderid:item.ordersid
                                }
                            api_查询预订订单记录(query).then(r=>{
                                item.预定信息=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';
                            })
                        });
                        this.已取消.list=[...this.已取消.list,...list]
                        this.已取消.total=x.data.data.total;
                    }
                    this.已取消.loading=false
                    resolve()
                }).catch(err=>{
                    this.已取消.loading=false
                    reject()
                })
            });
        },
        async 初始化(){
            openloading(true);
            if(!this.myshop || !this.myshop.shopid){
                await this.获取店铺();
            }

            Promise.all([
                api_根据shopid查询预定(this.myshop.shopid),
                this.获取待消费(),
                this.获取已完成(),
                this.获取已取消()
            ]).then(x=>{
                this.预定=x[0].data.code==200 ? x[0].data.data : '';
                openloading(false);
            }).catch(err=>{
                console.log(err);
                openloading(false);
            })
        }
    },
    mounted() {
        this.初始化()
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.mui-bar{
    span{
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        line-height: 44px;
        position: absolute;
        top: 0px;
        right: 13px;
    }
}
.mui-content{
    display: flex;
    flex-direction: column;
}
.未开启提示{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    text-align: center;
    padding: 80px 0px 0px;
    >li:nth-child(1){
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
    }
    >li:nth-child(2){
        width: 51px;
    	height: 24px;
        margin: 38px auto 0px;
        border-radius: 24px;
        line-height: 22px;
        font-size: 14px;
        border: 1px solid rgba(0, 122, 255, 1);
        color: rgba(0, 122, 255, 1);
    }
}
.导航{
    flex-shrink: 0;
    display: flex;
    height: 44px;
    justify-content: space-around;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    background: #ffffff;
    // line-height: 44px;
    text-align: center;
    div{
        line-height: 44px;
    }
    li{
        width: 60px;
        position: relative;
    }
    span{
        position: absolute;
        top: 6px;
        left: 42px;
        min-width: 16px;
    	height: 16px;
        padding: 0px 2px;
        background: $header_background;
        border-radius: 16px;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #ffffff;
    }
    .active{
        border-bottom: 2px solid $header_background;
    }
}
.内容区{
    flex-grow: 1;
    overflow: auto;
}




</style>
