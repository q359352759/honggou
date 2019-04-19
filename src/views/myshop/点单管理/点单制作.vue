<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{制作员店铺 ? 制作员店铺.name : ''}}</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="制作状态">
                <li @click="设置查看类型(1)" :class="{'active':查看类型==1}">待制作</li>
                <li @click="设置查看类型(2)" :class="{'active':查看类型==2}">制作中</li>
                <li @click="设置查看类型(3)" :class="{'active':查看类型==3}">制作完成</li>
            </ul>
            <div class="内容" @scroll="scroll($event)">
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
                                <div @click="全部开始(item)" class="按钮">全部制作</div>
                            </div>
                        </div>
                        <div class="详细列表" v-for="(item1, index1) in item.商品排号" :key="index1">
                            <div class="详情">{{item1.座号}}号x{{item1.num}}{{item1.remark ? '（'+item1.remark+'）' : ''}}</div>
                            <div class="时间">{{item1.下单时间}}</div>
                            <div @click="开始制作(item,item1)" class="按钮">制 作</div>
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
                                <span class="制作员">{{item.制作员 ? item.制作员.producername : ''}}</span>
                            </div>
                            <div>
                                <span class="制作中">制作中</span>
                                <div @click="全部完成(item)" class="按钮">全部完成</div>
                            </div>
                        </div>
                        <div class="详细列表" v-for="(item1, index1) in item.商品排号" :key="index1">
                            <div class="详情">{{item1.座号}}号x{{item1.num}}{{item1.remark ? '（'+item1.remark+'）' : ''}}</div>
                            <div class="时间">{{item1.下单时间}}</div>
                            <div @click="单个完成(item,item1)" class="按钮">完 成</div>
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




            <ul class="收到邀请" v-if="制作员身份 && 制作员身份.state==0">
                <li>
                    <div>
                        <img v-if="制作员店铺" :src="制作员店铺.signboard" alt="" srcset="">
                    </div>
                    <div>
                        <b>
                            {{制作员店铺 ? 制作员店铺.name : ""}}
                        </b>
                        <span>
                            邀请你成为他的制作员
                        </span>
                    </div>
                </li>
                <li>
                    <div @click="接收和拒绝(2)">拒绝</div>
                    <div @click="接收和拒绝(1)">接受</div>
                </li>
            </ul>
        </div>

        <div class="提示语1" v-show="显示接单成功">
            <ul>
                <li>{{接单成功.类型==1 ? '接单成功' : '完成成功'}}</li>
                <li v-show="接单成功.类型==1">请以此信息为准开始制作</li>
                <li>
                    <span>{{接单成功.商品名}}</span>
                    <span>x{{接单成功.购买数量}}</span>
                </li>
                <li>
                    <span v-for="(item, index) in 接单成功.排号" :key="index">{{item.座号}}号x{{item.num}}</span>
                </li>
                <li @click="显示接单成功=false">好</li>
            </ul>
        </div>
        
    </div>
</template>
<script>
import { api_删除制作员,api_修改制作员状态 , api_查询排号商品 , api_查询排号  , api_修改排号商品 ,api_查询制作员列表 , api_根据id查询商品排号 } from "@/api/点单接口.js";
import { api_根据id查询商品 } from "@/api/商品接口.js";

import { openloading , dateFtt } from "@/assets/js/currency.js";
import { mapGetters , mapActions } from "vuex";
import loading from '@/components/loading.vue'
export default {
    name:"",
    data() {
        return {
            显示接单成功:false,
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
            制作员身份:"myshops/点单制作/制作员身份",
            制作员店铺:'myshops/点单制作/制作员店铺'
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
            查询制作员身份:"myshops/点单制作/查询制作员身份",
            查询制作员店铺:"myshops/点单制作/查询制作员店铺",
            设置下拉刷新:'设置下拉刷新',
        }),
        设置查看类型(type){
            this.查看类型=type;
            this.设置下拉刷新(type!=3)
        },
        async 开始制作(item,item1){
            try {
                var 商品排号_r= await api_根据id查询商品排号(item1.id)            
            } catch (error) {
                mui.toast("系统错误稍后再试", { duration: "long", type: "div" });
                return
            }
            console.log(商品排号_r)
            if(商品排号_r.data.code==200){
                if(商品排号_r.data.data.state==2){
                    this.查询待制作();
                    this.查询制作中();
                    this.查询制作完成();
                    mui.alert('点单已取消', "提示", "我知道了", ()=>{ },"div");
                    return
                }
            }else{
                mui.alert(商品排号_r.data.msg ? 商品排号_r.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                return 
            }
            var obj=Object.assign({},item1);
                obj.producerid=this.制作员身份.producerid;
                obj.state=1;
            openloading(true);
            api_修改排号商品(obj).then(x=>{
                if(x.data.code==200){
                    this.接单成功.商品名=item.name;
                    this.接单成功.购买数量=item1.num;
                    this.接单成功.类型=1
                    this.接单成功.排号=[];
                    this.接单成功.排号.push(item1);
                    this.查询制作中()
                    this.查询待制作();
                    this.显示接单成功=true;
                }else if(x.data.code==201){
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false)
            }).catch(err=>{
                mui.toast("系统错误", { duration: "long", type: "div" });
                openloading(false)
            })
        },
        async 全部开始(item){
            var this_1=this;
            var 新列表=[];
            for (let i = 0; i < item.商品排号.length; i++) {
                let 商品排号_r = await api_根据id查询商品排号(item.商品排号[i].id);
                if(商品排号_r.data.code==200 && 商品排号_r.data.data.state==0){
                    新列表.push(item.商品排号[i]);
                }
            }
            var length=新列表.length;
            if(length==0){
                this.查询制作中();
                this.查询待制作();
                mui.alert('点单已被取消', "提示", "我知道了", function () { }, "div");
                return
            }

            let 生成接口数组=()=>{
                return new Promise((resolve, reject) => {
                    let 接口list=[];
                    新列表.forEach(x=>{
                        let obj=Object.assign({},x);
                            obj.producerid=this.制作员身份.producerid;
                            obj.state=1;
                        接口list.push(api_修改排号商品(obj))
                    })
                    resolve(接口list);
                });
            }
            openloading(true)
            Promise.all(await 生成接口数组()).then(x=>{
                var 接单成功=[];
                var 已被人接单=[];
                var 接单失败=[];
                for(let i=0;i<x.length;i++){
                    if(x[i].data.code==200){
                        接单成功.push(i)
                    }else if(x[i].data.code==201){
                        已被人接单.push(i);
                    }else{
                        接单失败.push(i)
                    }
                }
                if(接单成功.length>0){
                    this.接单成功.商品名=item.name;
                    this.接单成功.购买数量=0;
                    this.接单成功.类型=1
                    this.接单成功.排号=[]
                    for(let i=0;i<接单成功.length;i++){
                        this_1.接单成功.排号.push(item.商品排号[接单成功[i]])
                        this_1.接单成功.购买数量+=item.商品排号[接单成功[i]].num;
                    }
                    this.显示接单成功=true;
                }else{

                }
                this.查询制作中()
                this.查询待制作();
                this.显示接单成功=true;
                openloading(false)
            }).catch(err=>{
                mui.toast("系统错误", { duration: "long", type: "div" });
                openloading(false)
            })
        },
        单个完成(item,item1){
            if(item.制作员id!=this.制作员身份.producerid){
                mui.alert('只能完成自己制作的商品。', "提示", "我知道了", function () { }, "div");
                return
            }
            var obj=Object.assign({},item1);
                obj.producerid=this.制作员身份.producerid;
                obj.state=3;
            openloading(true);
            api_修改排号商品(obj).then(x=>{
                if(x.data.code==200){
                    this.接单成功.商品名=item.name;
                    this.接单成功.购买数量=item1.num;
                    this.接单成功.类型=2
                    this.接单成功.排号=[];
                    this.接单成功.排号.push(item1);
                    this.查询制作中()
                    this.查询待制作();
                    this.查询制作完成();
                    this.显示接单成功=true;
                }else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false)
            }).catch(err=>{
                mui.toast("系统错误", { duration: "long", type: "div" });
                openloading(false)
            })
        },
        async 全部完成(item){
            if(item.制作员id!=this.制作员身份.producerid){
                mui.alert('只能完成自己制作的商品。', "提示", "我知道了", function () { }, "div");
                return
            }
            var this_1=this;
            var length=item.商品排号.length
            let 生成接口数组=()=>{
                return new Promise((resolve, reject) => {
                    let 接口list=[];
                    item.商品排号.forEach(x=>{
                        let obj=Object.assign({},x);
                            obj.producerid=this.制作员身份.producerid;
                            obj.state=3;
                        接口list.push(api_修改排号商品(obj))
                    })
                    resolve(接口list);
                });
            }
            openloading(true)
            Promise.all(await 生成接口数组()).then(x=>{
                var 接单成功=[];
                var 已被人接单=[];
                var 接单失败=[];
                for(let i=0;i<x.length;i++){
                    if(x[i].data.code==200){
                        接单成功.push(i)
                    }else if(x[i].data.code==201){
                        已被人接单.push(i);
                    }else{
                        接单失败.push(i)
                    }
                }
                if(接单成功.length>0){
                    this.接单成功.商品名=item.name;
                    this.接单成功.购买数量=0;
                    this.接单成功.类型=2
                    this.接单成功.排号=[]
                    for(let i=0;i<接单成功.length;i++){
                        this_1.接单成功.排号.push(item.商品排号[接单成功[i]])
                        this_1.接单成功.购买数量+=item.商品排号[接单成功[i]].num;
                    }
                    this.显示接单成功=true;
                }else{
                    mui.alert('完成失败，请稍后再试。', "提示", "我知道了", function () { }, "div");
                }
                this.查询制作中()
                this.查询待制作();
                this.查询制作完成();
                openloading(false)
            }).catch(err=>{
                console.log(err)
                mui.toast("系统错误", { duration: "long", type: "div" });
                openloading(false)
            })
        },
        查询待制作(){
            return new Promise((resolve, reject) => {
                this.待制作.query.start=this.待制作.page_index*this.待制作.query.length;
                this.待制作.query.shopid=this.制作员店铺.shopid;
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
                this.制作中.query.shopid=this.制作员店铺.shopid;
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
                this.制作完成.query.shopid=this.制作员店铺.shopid;
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
            this.设置下拉刷新(t==0)
            if (h + t >= sh - 10 && this.查看类型==3 && !this.制作完成.loading && this.制作完成.list.length < this.制作完成.total) {
                this.制作完成.page_index++;
                this.查询制作完成();
            }
        },
        接收和拒绝(type){
            if(type==1){
                var obj=Object.assign({},this.制作员身份);
                    obj.state=type;
                openloading(true);
                api_修改制作员状态(obj).then(x=>{
                    if(x.data.code==200){
                        mui.toast("设置成功", { duration: 1000, type: "div" });
                        this.查询制作员身份().then(r=>{
                            if(!this.制作员身份 || this.制作员身份.state==2){
                                history.back();
                            }
                            openloading(false)
                        }).catch(err1=>{
                            openloading(false)
                            mui.alert('查询制作员身份失败', "提示", "我知道了", function () {},"div");
                        })
                    }else{
                        openloading(false)
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () {},"div");
                    }
                }).catch(err=>{
                    console.log(err);
                    mui.toast("系统错误稍后再试.", { duration: 1000, type: "div" });
                    openloading(false);
                })
            }else{
                api_删除制作员(this.制作员身份.id).then(x=>{
                    if(x.data.code==200){
                        mui.toast("设置成功", { duration: 1000, type: "div" });
                        history.back();
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () {},"div");
                    }
                    openloading(false);
                }).catch(err=>{
                    mui.toast("系统错误稍后再试.", { duration: 1000, type: "div" });
                    openloading(false);
                })
            }
        },
        async 初始化(){
            
            if(!this.制作员身份){
                openloading(true);
                await this.查询制作员身份()
            }
            if(!this.制作员身份 || this.制作员身份.state==2){
                openloading(false)
                history.back();
                return
            }
            if(!this.制作员店铺){
                openloading(true);
                await this.查询制作员店铺();
            }
            if(!this.制作员店铺){
                openloading(false);
                mui.alert('获取店铺信息失败，稍后再试', "提示", "我知道了", function () {
                    history.back();
                },"div");
            }
            this.查询待制作();
            this.查询制作中();
            this.查询制作完成()

            openloading(false);
        }
    },
    mounted() {
        this.初始化();
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.mui-bar{
    .mui-title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.提示语1{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.4);
    >ul{
        width: 236px;
        background: #ffffff;
        border-radius: 16px;
        >li:nth-child(1){
            height: 42px;
            line-height: 42px;
            color: rgba(80, 80, 80, 1);
            font-weight: bold;
            text-align: center;
        }
        >li:nth-child(2){
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            text-align: center;
        }
        >li:nth-child(3){
            padding: 0px 15px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >span:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
            }
            >span:nth-child(2){
                color: rgba(217, 57, 59, 1);
            	font-size: 14px;
                font-weight: bold;
            }
        }
        >li:nth-child(4){
            display: flex;
            justify-content: center;
            padding: 0px 15px;
            flex-direction: column;
            white-space: nowrap;
            span{
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
                margin: 0px 18px;
            }
        }
        >li:nth-child(5){
            line-height: 40px;
            color: rgba(0, 122, 255, 1);
        	font-size: 14px;
            text-align: center;
        }
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
            .制作按钮{
                width: 63px;
            	height: 22px;
                text-align: center;
                line-height: 20px;
                font-size: 12px;
                color: rgba(0, 122, 255, 1);
                border:1px solid rgba(0, 122, 255, 1);
                border-radius: 22px;
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

.收到邀请{
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 44px 0px 0px;
    background: #ffffff;
    top: 0px;
    left: 0px;
    >li:nth-child(1){
        display: flex;
        padding: 22px;
        align-items: center;
        margin: 0px 0px 70px;
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 0;
            flex-grow: 1;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            b{
                margin: 0px 0px 3px 0px;
            }
        }
    }
    >li:nth-child(2){
        display: flex;
        padding: 0px 0.7rem;
        justify-content: space-between;
        div{
            width: 88px;
        	height: 32px;
            letter-spacing: 2px;
            padding: 0px 0px 0px 2px;
            line-height: 30px;
            font-size: 14px;
            border-radius: 32px;
            text-align: center;
        }
        >div:nth-child(1){
            border:1px solid rgba(166, 166, 166, 1);
            color: rgba(166, 166, 166, 1);
        }
        >div:nth-child(2){
            color: rgba(0, 122, 255, 1);
            border: 1px solid rgba(0, 122, 255, 1);
        }
    }
}
</style>
