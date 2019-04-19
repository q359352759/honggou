<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">点单管理系统</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="制作状态">
                <li @click="查看类型=1" :class="{'active':查看类型==1}">待制作</li>
                <li @click="查看类型=2" :class="{'active':查看类型==2}">制作中</li>
                <li @click="查看类型=3" :class="{'active':查看类型==3}">制作完成</li>
            </ul>
            <div class="内容"  @scroll="scroll($event)">
                <ul class="商品列表1" v-show="查看类型==1">
                    <li v-for="(item, index) in 新待制作" :key="index">
                        <div class="头部">
                            <div>
                                <img v-if="item.img && item.img.split(',').length" :src="item.img.split(',')[0]">
                            </div>
                            <div>
                                <span>{{item.name}}</span>
                                <span>x{{item.购买总数}}</span>
                            </div>
                            <div>
                                <!-- <span class="制作员">张三</span> -->
                            </div>
                            <div>
                                <span class="待制作">待制作</span>
                                <!-- <div @click="全部开始(item)" class="按钮">全部开始</div> -->
                            </div>
                        </div>
                        <div class="详细列表" v-for="(item1, index1) in item.商品排号" :key="index1">
                            <div class="详情">{{item1.座号}}号x{{item1.num}}{{item1.remark ? '（'+item1.remark+'）' : ''}}</div>
                            <div class="时间">{{item1.下单时间}}</div>
                            <!-- <div @click="开始制作(item,item1)" class="按钮">开始制作</div> -->
                        </div>
                    </li>
                </ul>
                <loading v-show="查看类型==1" :nodata="新待制作.length==0" :text="'暂无商品可制作~'"/>

                <ul class="商品列表1" v-show="查看类型==2">
                    <li v-for="(item, index) in 新制作中" :key="index">
                        <div class="头部">
                            <div>
                                <img v-if="item.img && item.img.split(',').length" :src="item.img.split(',')[0]">
                            </div>
                            <div>
                                <span>{{item.name}}</span>
                                <span>x{{item.购买总数}}</span>
                            </div>
                            <div>
                                <!-- <span class="制作员">{{item.制作员 ? item.制作员.producername : ''}}</span> -->
                            </div>
                            <div>
                                <span class="制作中">制作中</span>
                                <span class="制作员">{{item.制作员 ? item.制作员.producername : ''}}</span>
                                <!-- <div @click="全部完成(item)" class="按钮">全部完成</div> -->
                            </div>
                        </div>
                        <div class="详细列表" v-for="(item1, index1) in item.商品排号" :key="index1">
                            <div class="详情">{{item1.座号}}号x{{item1.num}}{{item1.remark ? '（'+item1.remark+'）' : ''}}</div>
                            <div class="时间">{{item1.下单时间}}</div>
                            <!-- <div @click="单个完成(item,item1)" class="按钮">完成</div> -->
                        </div>
                    </li>
                </ul>
                <loading v-show="查看类型==2" :nodata="新制作中.length==0" :text="'暂无商品需要完成~'"/>
                
                <ul class="商品列表" v-show="查看类型==3">
                    <li v-for="item in 制作完成.list">
                        <div>
                            <img v-if="item.商品 && item.商品.img.split(',').length>0" :src="item.商品.img.split(',')[0]" alt="" srcset="">
                        </div>
                        <div>
                            <div>
                                <span>{{item.商品 ? item.商品.name : ''}}</span>
                                <strong>x{{item.num}}</strong>
                            </div>
                            <div>
                                <span>{{item.排号 ? item.排号.createtime : ""}}</span>
                            </div>
                            <div>
                                <span v-if="item.排号">{{item.排号.rownum}}号x{{item.num}}</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <!-- <span class="制作中">制作中</span> -->
                                <span class="已完成">已完成</span>
                            </div>
                            <div >
                                <span>{{item.制作员 ? item.制作员.producername : ''}}</span>
                            </div>
                            <!-- <div @click="点击完成(item)" class="制作按钮">完成</div> -->
                            <div>{{item.finishtime | 时间格式化('MM.dd-hh:mm')}}</div>
                        </div>
                    </li>
                </ul>
                <loading v-show="查看类型==3" :loadingtype="制作完成.loading" :nodata="!制作完成.loading && 制作完成.total==0" :end="!制作完成.loading && 制作完成.total!=0 && 制作完成.list.length>=制作完成.total"/>

            </div>
            <ul class="底部内容">
                <li @click="$router.push('/myshop/ddgl/zzy')">制作员</li>
                <li @click="$router.push('/myshop/ddgl/schp')">号牌管理</li>
                <li @click="$router.push('/myshop/ddgl/zztj')">统计管理</li>
                <li @click="开发中()">采购管理</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { api_修改制作员状态 , api_查询排号商品 , api_查询排号  , api_修改排号商品 ,api_查询制作员列表 } from "@/api/点单接口.js";
import { api_根据id查询商品 } from "@/api/商品接口.js";

import { openloading , dateFtt } from "@/assets/js/currency.js";
import { mapGetters , mapActions } from "vuex";
import loading from '@/components/loading.vue'
export default {
    name:"",
    data() {
        return {
            userInfo:"",
            查看类型:1,
            接单成功:{
                商品名:"",
                购买数量:0,
                排号:[],
                类型:1,     // 1 接单 2 完成
            },
            待制作:{
                query:{
                    start:0,
                    length:1000,
                    shopid:"",
                    stateb:0
                },
                page_index:0,
                list:[],
                loading:true,
                total:0
            },
            制作中:{
                query:{
                    start:0,
                    length:1000,
                    shopid:"",
                    stateb:1
                },
                page_index:0,
                list:[],
                loading:true,
                total:0
            },
            制作完成:{
                query:{
                    start:0,
                    length:10,
                    shopid:"",
                    state:3
                },
                list:[],
                page_index:0,
                loading:true,
                total:0
            }
        }
    },
    components:{
        loading
    },
    filters:{
        时间格式化(time,type){
            try {
                return dateFtt(time,type);
            } catch (error) {
                return time
            }
        }
    },
    computed: {
        ...mapGetters({
            店铺:'get_myshop',
        }),
        新待制作(){
            var 待制作=this.待制作.list;
            var newlist=[];
                待制作.forEach(item=>{
                    item.shopRowNumberCommodities.forEach(item_1=>{
                        var obj=newlist.find(x=>x.id==item_1.commodityid);
                        if(obj){
                            var item_2=Object.assign({},item_1);
                                item_2.座号=item.rownum;
                                item_2.下单时间=item.createtime
                                delete item_2.商品
                            obj.商品排号.push(item_2);
                            obj.购买总数= obj.购买总数+item_2.num;
                        }else{
                            var 商品=Object.assign({},item_1.商品);
                                商品.商品排号=[];
                                var item_2=Object.assign({},item_1);
                                    item_2.座号=item.rownum
                                    item_2.下单时间=item.createtime
                                    delete item_2.商品
                                商品.商品排号.push(item_2)
                                商品.购买总数=item_2.num;
                            newlist.push(商品);
                        }
                    })
                })
            return newlist;
        },
        新制作中(){
            var 制作中=this.制作中.list;
            var newlist=[];
                制作中.forEach(item=>{
                    item.shopRowNumberCommodities.forEach(item_1=>{
                        var obj=newlist.find(x=>x.id==item_1.commodityid && x.制作员id==item_1.producerid);
                        if(obj){
                            var item_2=Object.assign({},item_1);
                                item_2.座号=item.rownum;
                                item_2.下单时间=item.createtime
                                delete item_2.商品
                            obj.商品排号.push(item_2);
                            obj.购买总数= obj.购买总数+item_2.num;
                        }else{
                            var 商品=Object.assign({},item_1.商品);
                                商品.制作员id=item_1.producerid;
                                商品.制作员=item_1.制作员
                                商品.商品排号=[];
                                var item_2=Object.assign({},item_1);
                                    item_2.座号=item.rownum
                                    item_2.下单时间=item.createtime
                                    delete item_2.商品
                                商品.商品排号.push(item_2)
                                商品.购买总数=item_2.num;
                            newlist.push(商品);
                        }
                    })
                })
            return newlist;
        },
    },
    methods: {
        ...mapActions({
            getMyshop:"getMyshop"
        }),
        开发中(){
            mui.toast("次功能暂未开放", { duration: "long", type: "div" });
        },
        查询待制作(){
            return new Promise((resolve, reject) => {
                this.待制作.query.start=this.待制作.page_index*this.待制作.query.length;
                this.待制作.query.shopid=this.店铺.shopid;
                api_查询排号(this.待制作.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data.data;
                        list.forEach(item=>{
                            item.shopRowNumberCommodities.forEach(item_1=>{
                                    item_1.商品='';
                                    item_1.制作员='';
                                if(item_1.producerid){
                                    var 查询制作员_query={
                                        start:0,
                                        length:10,
                                        producerid:item_1.producerid
                                    }
                                    api_查询制作员列表(查询制作员_query).then(r=>{
                                        item_1.制作员=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';  
                                    })
                                }
                                api_根据id查询商品(item_1.commodityid).then(r=>{
                                    item_1.商品 =r.data.code==200 ? r.data.data : '';
                                })
                            })
                        })
                        this.待制作.list=list;
                    }
                    this.待制作.loading=false;
                    resolve()
                }).catch(err=>{
                    this.待制作.loading=false;
                    reject()
                })
            });
        },
        查询制作中(){
            return new Promise((resolve, reject) => {
                this.制作中.query.start=this.制作中.page_index*this.制作中.query.length;
                this.制作中.query.shopid=this.店铺.shopid;
                api_查询排号(this.制作中.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data.data;
                        list.forEach(item=>{
                            item.shopRowNumberCommodities.forEach(item_1=>{
                                    item_1.商品='';
                                    item_1.制作员='';
                                if(item_1.producerid){
                                    var 查询制作员_query={
                                        start:0,
                                        length:10,
                                        producerid:item_1.producerid
                                    }
                                    api_查询制作员列表(查询制作员_query).then(r=>{
                                        item_1.制作员=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';  
                                    })
                                }
                                api_根据id查询商品(item_1.commodityid).then(r=>{
                                    item_1.商品 =r.data.code==200 ? r.data.data : '';
                                })
                            })
                        })
                        this.制作中.list=list;
                    }
                    this.制作中.loading=false;
                    resolve()
                }).catch(err=>{
                    this.制作中.loading=false;
                    reject()
                })
            });
        },
        查询制作完成(){
            return new Promise((resolve, reject) => {
                this.制作完成.query.start=this.制作完成.page_index*this.制作完成.query.length;
                this.制作完成.query.shopid=this.店铺.shopid;
                api_查询排号商品(this.制作完成.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data.data;
                        list.forEach(item_1=>{
                            item_1.排号='';
                            item_1.商品='';
                            item_1.制作员='';
                            if(item_1.producerid){
                                var 查询制作员_query={
                                    start:0,
                                    length:10,
                                    producerid:item_1.producerid
                                }
                                api_查询制作员列表(查询制作员_query).then(r=>{
                                    item_1.制作员=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';  
                                })
                            }
                            var 查询排号_query={
                                    start:0,
                                    length:10,
                                    rownumid:item_1.rownumid
                                }
                            api_查询排号(查询排号_query).then(r=>{
                                item_1.排号=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] : '';
                            })
                            api_根据id查询商品(item_1.commodityid).then(r=>{
                                item_1.商品 =r.data.code==200 ? r.data.data : '';
                            })
                        })
                        this.制作完成.list=list;
                        this.制作完成.total=x.data.data.total;
                    }
                    this.制作完成.loading=false;
                    resolve()
                }).catch(err=>{
                    this.制作完成.loading=false;
                    reject()
                })
            });
        },
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (h + t >= sh - 10 && this.查看类型==3 && !this.制作完成.loading && this.制作完成.list.length < this.制作完成.total) {
                this.制作完成.page_index++;
                this.查询制作完成();
            }
        },
        async 初始化(){
            openloading(true)
            if(!this.店铺 || !this.店铺.shopid){
                await this.getMyshop()
            }
            Promise.all([
                this.查询待制作(),
                this.查询制作中(),
                this.查询制作完成()
            ]).then(x=>{
                openloading(false)
            }).catch(err=>{
                openloading(false)
            })
        }
    },
    mounted() {
        this.初始化();
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.mui-bar{
    span{
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        line-height: 44px;
        position: absolute;
        top: 0px;
        right: 23px;
    }
}
.mui-content{
    display: flex;
    flex-direction: column;
}
.制作状态{
    flex-shrink: 0;
    display: flex;
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
    background: #ffffff;
    margin: 3px 0px 0px;
    line-height: 36px;
    height: 36px;
    justify-content: space-around;
    li{
        padding: 0px 5px;
    }
    .active{
        border-bottom:2px solid $header_background;
        color: $header_background;
        font-weight: bold;
    }
}
.内容{
    flex-grow: 1;
    overflow: auto;
    padding: 3px 0px 0px;
}


.商品列表1{
    >li{
        background: #ffffff;
        margin: 0px 0px 4px;
    }
    .制作员{
        color: rgba(80, 80, 80, 1);
        font-size: 10px;
    }
    .待制作{
        color: rgba(217, 57, 59, 1);
        font-size: 12px;
    }
    .制作中{
        color: rgba(253, 186, 44, 1);
        font-size: 12px;
    }
    .按钮{
        width: 63px;
        height: 22px;
        color: rgba(0, 122, 255, 1);
        font-size: 12px;
        line-height: 20px;
        border: 1px solid rgba(0, 122, 255, 1);
        border-radius: 22px;
        text-align: center;
    }
    .头部{
        display: flex;
        padding: 10px 15px;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            width: 60px;
        	height: 45px;
            margin: 0px 8px 0px 0px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        >div:nth-child(2){
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            >span:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
                font-weight: bold;
            }
            >span:nth-child(2){
                color: rgba(217, 57, 59, 1);
            	font-size: 14px;
                font-weight: bold;
            }
        }
        >div:nth-child(3){
            display: flex;
            align-items: flex-end;
            flex-shrink: 0;
            white-space: nowrap;
        }
        >div:nth-child(4){
            width: 64px;
            flex-shrink: 0;
            margin: 0px 0px 0px 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
        }
    }
    .详细列表{
        padding: 10px 15px;
        border-bottom: 1px solid #f6f6f6;
        display: flex;
        align-items: center;
        .按钮{
            flex-shrink: 0;
            margin: 0px 0px 0px 15px;
        }
        .时间{
            color: rgba(80, 80, 80, 1);
        	font-size: 10px;
            flex-shrink: 0;
            white-space: nowrap;
            margin: 0px 0px 0px 14px;
        }
        .详情{
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            flex-grow: 1;
        }
    }
}

.商品列表{
    background: #ffffff;
    >li{
        display: flex;
        padding: 10px 15px 10px 15px;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            width: 80px;
            height: 60px;
            margin: 0px 10px 0px 0px;
            flex-shrink: 0;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        >div:nth-child(2){
            flex-grow: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >div:nth-child(1){
                display: flex;
                align-items: center;
                color: rgba(80, 80, 80, 1);
                font-size: 12px;
                strong{
                    margin: 0px 0px 0px 23px;
                    font-size: 14px;
                    color: $header_background;
                }
            }
            >div:nth-child(2){
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
            }
            >div:nth-child(3){
                color: rgba(80, 80, 80, 1);
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                span{
                    margin: 0px 15px 0px 0px;
                }
            }
        }
        >div:nth-child(3){
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            white-space: nowrap;
            min-width: 65px;
            .待制作{
                color: $header_background
            }
            .制作中{
                color: rgba(253, 186, 44, 1);
            }
            .已完成{
                color: rgba(24, 169, 104, 1);
            }
            >div:nth-child(1){
                font-size: 12px;
            }
            >div:nth-child(2){
                font-size: 10px;
            }
            >div:nth-child(3){
                font-size: 10px;
            }
        }
    }
}


.底部内容{
    flex-shrink: 0;
    height: 44px;
    background: $header_background;
    color: 	#ffffff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    li{
        width: 57px;
        height: 26px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #ffffff;
        border-radius: 26px;
    }
}

</style>
