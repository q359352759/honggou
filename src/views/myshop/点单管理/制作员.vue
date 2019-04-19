<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">制作员管理</h1>
            <span @click="$router.push('/myshop/ddgl/tjzzy')">添加</span>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <div class="列表" ref="列表">
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell item_1" v-for="(item, index) in 制作员.list" :key="index">
                        <div class="mui-slider-right mui-disabled" @click="移除(item,index)">
                            <a class="mui-btn mui-btn-red">移除</a>
                        </div>
                        <div class="mui-slider-handle item">
                            <div>
                                <img v-if="item.用户信息 && item.用户信息.headImgUrl" :src="item.用户信息.headImgUrl" alt="" srcset="">
                                <img v-if="!item.用户信息 || !item.用户信息.headImgUrl" :src="WechatIMG311" alt="" srcset="">
                            </div>
                            <div>
                                <span>{{item.producername}}</span>
                                <span>{{item.producerjob}}</span>
                            </div>
                            <div>
                                <span v-if="item.state==0" class="待确认">待确认</span>
                                <span v-if="item.state==1" class="时间">{{item.accepttime | 时间格式化}}</span>
                                <span v-if="item.state==2" class="待确认">已拒绝</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <loading  :loadingtype="制作员.loading" :end="!制作员.loading && 制作员.total!=0 && 制作员.list.length>=制作员.total" :nodata="!制作员.loading && 制作员.total==0"/>
        </div>
    </div>
</template>

<script>
import { api_查询制作员列表 , api_删除制作员 } from "@/api/点单接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";

import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import { openloading , dateFtt} from "@/assets/js/currency.js";
import {WechatIMG311} from "@/assets/image_base64/WechatIMG311.js";

import { mapGetters , mapActions } from "vuex";
import loading from "@/components/loading.vue";
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
                total:0
            }
        }
    },
    components:{
        loading
    },
    computed: {
        ...mapGetters({
            店铺:'get_myshop'
        })
    },
    filters:{
        时间格式化(time){
            return dateFtt(time,'yyyy.MM.dd')
        }
    },
    methods: {
        ...mapActions({
            获取店铺:"getMyshop"
        }),
        收起() {
            var li=this.$refs.列表.querySelectorAll('.item_1')
            for(var i=0;i<li.length;i++){
                mui.swipeoutClose(li[i]);
            }
        },
        打开() {
            var box_2 = document.getElementsByClassName("box_2");
            for (let i = 0; i < box_2.length; i++) {
                mui.swipeoutOpen(box_2[i].querySelector("li"));
            }
        },
        scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (h + t >= sh - 10 && !this.制作员.loading && this.制作员.list.length < this.制作员.total) {
                this.制作员.page_index++
                this.查询数据();
            }
        },
        移除(item,index){
            mui.confirm("确定要移除？", "提示", ["取消", "确定"], value => {
                if (value.index == 1) {
                    api_删除制作员(item.id).then(x=>{
                        if(x.data.code==200){
                            mui.toast("移除成功", {duration: 1000,type: "div"});
                            this.制作员.list.splice(index,1);
                            this.收起()
                        }else{
                            mui.alert(x.data.msg ? x.data.msg : x.data.message,"提示","我知道了",function() {},"div");
                        }
                    }).catch(err=>{
                        mui.toast("系统错误稍后再试。", {duration: 1000,type: "div"});
                    })
                }
            });
        },
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
                        });
                    this.制作员.list=[...this.制作员.list,...list];
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
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.mui-bar{
   span{
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        position: absolute;
        line-height: 44px;
        top: 0px;
        right: 18px;
    } 
}

.列表{
    margin: 3px 0px 0px;
    .mui-table-view-cell:after{
        left: 0px;
    }
    .item_1{
        padding: 0px;
    }
    .item{
        display: flex;
        padding: 6px 10px;
        background: #ffffff;
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
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            justify-content: space-between;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        >div:nth-child(3){
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            min-width: 62px;
            .待确认{
                color:$header_background;
            }
            .时间{
                color: rgba(80, 80, 80, 1);
            }
        }
    }
}
</style>