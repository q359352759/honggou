<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">点单管理系统</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="列表">
                <li v-for="(item, index) in 制作员.list" :key="index">
                    <div>
                        <img v-if="item.用户信息 && item.用户信息.headImgUrl" :src="item.用户信息.headImgUrl" alt="" srcset="">
                        <img v-if="!item.用户信息 || !item.用户信息.headImgUrl" :src="WechatIMG311" alt="" srcset="">
                    </div>
                    <div>
                        <div>{{item.producername}}</div>
                        <div>
                            <span>本周：{{item.本周}}份</span>
                            <span>本月：{{item.本月}}份</span>
                            <span>累计：{{item.累计}}份</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import { api_查询制作员列表 , api_查询排号商品} from "@/api/点单接口.js";

import { api_通过username查询用户 } from "@/api/用户接口.js";

import { openloading , getDateStr} from "@/assets/js/currency.js";
import { getCurrentMonthFirst } from "@/assets/js/time.js";
import {WechatIMG311} from "@/assets/image_base64/WechatIMG311.js";

import { mapGetters , mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            WechatIMG311:WechatIMG311,
            制作员:{
                query:{
                    start:0,
                    length:10,
                    shopid:"",
                },
                page_index:0,
                list:[],
                loading:true,
                total:0,

            }
        }
    },
    computed: {
        ...mapGetters({
            店铺:'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺:"getMyshop"
        }),
        查询数据(){
            this.制作员.query.shopid=this.店铺.shopid;
            this.制作员.query.start=this.制作员.page_index*this.制作员.query.length;
            this.制作员.loading=true
            api_查询制作员列表(this.制作员.query).then((x) => {
                if(x.data.code==200){
                    var list=x.data.data.data
                        list.forEach(item => {
                            item.用户信息="";
                            api_通过username查询用户(item.producerid).then(r=>{
                                item.用户信息=r.data.code==200 ? r.data.data : "";
                            })
                            item.本周=0;
                            item.本月=0;
                            item.累计=0;
                            var 星期=new Date().getDay();
                            var 星期一=getDateStr( (星期==0) ? -7 : -(星期-1) )+' 00:00';
                            let 查询本周_qyery={
                                    start:0,
                                    length:10,
                                    startTimea:星期一,
                                    endTimea:getDateStr(0)+' 24:00',
                                    producerid:item.producerid,
                                    state:3,
                                    shopid:this.店铺.shopid
                                }
                            api_查询排号商品(查询本周_qyery).then(r=>{
                                item.本周=r.data.code==200 ? r.data.data.total : 0
                            })
                            let 查询本月_query={
                                    start:0,
                                    length:10,
                                    startTimea:getCurrentMonthFirst()+' 00:00',
                                    endTimea:getDateStr(0)+' 24:00',
                                    producerid:item.producerid,
                                    state:3,
                                    shopid:this.店铺.shopid
                                }
                            api_查询排号商品(查询本月_query).then(r=>{
                                item.本月=r.data.code==200 ? r.data.data.total : 0
                            })
                            let 查询累计_query={
                                    start:0,
                                    length:10,
                                    producerid:item.producerid,
                                    state:3,
                                    shopid:this.店铺.shopid
                                }
                            api_查询排号商品(查询累计_query).then(r=>{
                                item.累计=r.data.code==200 ? r.data.data.total : 0
                            })
                        });
                    this.制作员.list=list;
                    this.制作员.total=x.data.data.total
                }
                this.制作员.loading=false
            }).catch((err) => {
                this.制作员.loading=false           
            });
        },
        async 初始化(){
            openloading(true)
            if(!this.店铺 || !this.店铺.shopid){
                await this.获取店铺()
            }
            this.查询数据();
            openloading(false);
        }
    },
    mounted() {
        this.初始化();
        console.log(new Date().getDay());
        var 星期=new Date().getDay();
        var 星期一=getDateStr( (星期==0) ? -7 : -(星期-1) )
        console.log(星期一);
        console.log(getDateStr(0));
        console.log(getCurrentMonthFirst());

        
    },
}
</script>

<style lang="scss" scoped>
.列表{
    background: #ffffff;
    margin: 6px 0px 0px 0px;
    >li{
        padding: 6px 10px;
        display: flex;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            width: 50px;
        	height: 50px;
            flex-shrink: 0;
            margin: 0px 8px 0px 0px;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 100%;
            }
        }
        >div:nth-child(2){
            width: 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >div:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
            }
            >div:nth-child(2){
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
}
</style>

