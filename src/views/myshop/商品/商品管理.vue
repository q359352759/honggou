<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <!-- <a @tap="back()" class="mui-icon mui-icon-left-nav mui-pull-left"></a> -->
            <h1 class="mui-title">商品管理</h1>
            <span @click="点击排序()" class="add mui-pull-right">{{显示排序 ? '完成' :"排序"}}</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="查看类型">
                <li :class="{'active':查看类型==1}" @click="选择类型(1)">出售中({{已上架商品.total}})</li>
                <li :class="{'active':查看类型==0}" @click="选择类型(0)">仓库中({{已下架商品.total}})</li>
            </ul>

            <ul class="商品容器">
                <li class="分组列表">
                    <div :class="{'active':当前查看分组==index}" v-for="(item, index) in 商品分组" :key="index">
                        <span @click="点击分组(index)" class="名称">{{item.groupname}}</span>
                        <span @click="分组排序(item,index)" v-show="显示排序" class="排序"><i class="icon iconfont icon-shang"></i></span>
                    </div>
                </li>
                <li class="商品区" @scroll="scroll($event)" ref="商品区">
                    <div ref="去除高度"></div>
                    <div v-show="查看类型==1" ref="上架容器">
                        <div v-for="(item_1, index1) in 已上架" v-show="当前查看分组==index1" :key="index1">
                            <ul class="商品" v-for="(item, index) in item_1" :key="index">
                                <li @click="go_addGoods(item)">
                                    <img v-if="item.img.split(',').length>0" :src="item.img.split(',')[0]" />
                                    <span>编辑</span>
                                </li>
                                <li>
                                    <div class="商品名">
                                        <span>{{item.name}}</span>
                                        <span @click="updata_state(item,index)" v-if="item.state==1">下架</span>
                                        <span @click="updata_state(item,index)" v-if="item.state==0">上架</span>
                                    </div>
                                    <div class="价格">
                                        <span>售价：{{item.sellingPrice}}元</span>
                                        <s>{{item.marketPrice}}</s>
                                    </div>
                                    <div class="红包佣金">
                                        <span>可省：{{item.deduction}}元</span>
                                        <span v-if="item.commission">，佣金{{item.commission}}元</span>
                                    </div>
                                    <div class="销售量">
                                        <span class="已销售">
                                            <span>已售：{{item.sales}}，</span>
                                            <span v-show="item.isstock==1">库存：{{item.stock}}</span>
                                            <span v-show="item.isstock!=1">库存：无限制</span>
                                        </span>
                                        <span v-if="item.EXID && item.EXTYPE==0" class="专享类型">新人</span>
                                        <span v-if="item.EXID && item.EXTYPE==1" class="专享类型">生日</span>
                                        <span v-if="item.EXID" class="专享抵扣">省：{{item.EXDEDUCTION}}元</span>
                                        <i v-if="item.商品红包" class="红包_icon icon iconfont icon-hongbao1"></i>
                                        <span class="红包金额" v-if="item.商品红包">{{item.商品红包.amount}}元</span>
                                    </div>
                                </li>
                                <div @click="商品排序(item,index)" v-show="显示排序" class="排序"><i class="icon iconfont icon-shang"></i></div>
                            </ul>
                            <loading :nodata="item_1.length==0" text="暂无商品" :end="item_1.length>0"/>
                        </div>
                    </div>

                    <div v-show="查看类型==0" ref="下架容器">
                        <div v-for="(item_1, index1) in 已下架" v-show="当前查看分组==index1" :key="index1">
                            <ul class="商品" v-for="(item, index) in item_1" :key="index">
                                <li @click="go_addGoods(item)">
                                    <img v-if="item.img.split(',').length>0" :src="item.img.split(',')[0]" />
                                    <span>编辑</span>
                                </li>
                                <li>
                                    <div class="商品名">
                                        <span>{{item.name}}</span>
                                        <span @click="updata_state(item,index)" v-if="item.state==1">下架</span>
                                        <span @click="updata_state(item,index)" v-if="item.state==0">上架</span>
                                    </div>
                                    <div class="价格">
                                        <span>售价：{{item.sellingPrice}}元</span>
                                        <s>{{item.marketPrice}}</s>
                                    </div>
                                    <div class="红包佣金">
                                        <span>可省：{{item.deduction}}元</span>
                                        <span v-if="item.commission">，佣金{{item.commission}}元</span>
                                    </div>
                                    <div class="销售量">
                                        <span class="已销售">
                                            <span>已售：{{item.sales}}，</span>
                                            <span v-show="item.isstock==1">库存：{{item.stock}}</span>
                                            <span v-show="item.isstock!=1">库存：无限制</span>
                                        </span>
                                        <span v-if="item.EXID && item.EXTYPE==0" class="专享类型">新人</span>
                                        <span v-if="item.EXID && item.EXTYPE==1" class="专享类型">生日</span>
                                        <span v-if="item.EXID" class="专享抵扣">省：{{item.EXDEDUCTION}}元</span>
                                        <i v-if="item.商品红包" class="红包_icon icon iconfont icon-hongbao1"></i>
                                        <span class="红包金额" v-if="item.商品红包">{{item.商品红包.amount}}元</span>
                                    </div>
                                </li>
                                <div @click="商品排序(item,index)" v-show="显示排序" class="排序"><i class="icon iconfont icon-shang"></i></div>
                            </ul>
                            
                            <loading :nodata="item_1.length==0" text="暂无商品" :end="item_1.length>0"/>
                        </div>
                    </div>

                </li>
            </ul>
            
            <div @click="AddGoods()" class="发布商品">发布商品</div>
        </div>

        
    </div>
</template>

<script>
import { api_获取商品列表, api_修改商品 , api_查询商品分组列表 , api_修改商品分组} from "@/api/商品接口.js";
import { api_查询红包列表 } from "@/api/红包接口.js";
import { api_查询奖赏列表 } from "@/api/奖赏接口.js";

import { openloading , limit , 当前时间格式化} from "@/assets/js/currency";

import loading from "@/components/loading.vue";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "",
    components: {
        loading,
    },
    data() {
        return {
            查看类型:1,         //1已上架 0已下架
            显示排序:false,
            已上架商品:{
                loading: true,
                total:0,
                page_index:0,
                commodity_list:[],
                query:{
                    start: 0,
                    length: 10,
                    shopid: "",
                    state:1,
                }
            },
            已下架商品:{
                loading: true,
                total:0,
                page_index:0,
                commodity_list:[],
                query:{
                    start: 0,
                    length: 10,
                    shopid: "",
                    state:0,
                }
            },
            已上架:[

            ],
            已下架:[],
            商品分组:[],
            当前查看分组:0,
            点击了分组:false,
            scroll_list:[]
        };
    },
    computed: {
        ...mapGetters({
            myshop: 'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺: 'getMyshop',
            删除商品: "shangPing/删除商品",
            修改商品: "shangPing/修改商品",
            删除专享: "shangPing/删除专享",
            设置是否重新获取数据: "myshops/添加商品/设置是否重新获取数据"
        }),
        back() {
            var back = this.$route.query.back
            if (back) {
                history.back()
            } else {
                this.$router.push("/myshop");
            }
        },
        //跳转添加商品
        AddGoods() {
            this.设置是否重新获取数据(true);
            this.$router.push("/myshop/shangping/bianji");
        },
        //跳转修改
        async go_addGoods(x) {
            console.log(x)
            if(x.state == 1){
                var query={
                        start:0,
                        length:10,
                        commodityid:x.id
                    }
                openloading(true);
                try {
                    var 奖赏_r = await api_查询奖赏列表(query);
                    openloading(false)
                    if(奖赏_r.data.code==200){
                        if(奖赏_r.data.data.data.length>0){
                            var 奖赏=奖赏_r.data.data.data[0];
                            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm');
                            if(奖赏.expirationtime > 当前时间 && 奖赏.surplusrewardnum > 0){
                                mui.alert('该商品处于奖赏状态，未结束前不能进行修改', "提示", "我知道了", function () { }, "div");
                                return
                            }
                        }
                    }else{
                        mui.alert(奖赏_r.data.msg ? 奖赏_r.data.msg : 奖赏_r.data.message, "提示", "我知道了", function () { }, "div");
                        return
                    }
                } catch (error) {
                    openloading(false)
                    mui.toast("系统错误，稍后再试。", {duration: 2000,type: "div"});   
                    return             
                }
            }
            this.设置是否重新获取数据(true);
            // sessionStorage.commodity = JSON.stringify(x);
            // this.$store.state.in_index = 0;
            this.$router.push("/myshop/shangping/bianji?id=" + x.id);
        },
        点击排序(){
            this.显示排序=!this.显示排序;
            if(!this.显示排序){
                // openloading(true)
                var list=JSON.parse(JSON.stringify(this.商品分组));
                for(let i=0;i<list.length;i++){
                    list[i].sort=i
                }
                list.splice(list.length-1,1);
                if(this.查看类型==1){
                    var 商品数组=this.已上架[this.当前查看分组];
                }else{
                    var 商品数组=this.已下架[this.当前查看分组];
                }
                for(let i=0;i<商品数组.length;i++){
                    商品数组[i].sort=i;
                }
                
                openloading(true)
                Promise.all([
                    api_修改商品分组(list),
                    api_修改商品(商品数组)
                ]).then(x=>{
                    this.初始化()
                }).catch(err=>{
                    openloading(true)
                })
            }
        },
        分组排序(item,index){
            if(!item.id){
                mui.toast("该分组为系统默认，不能进行操作。", { duration: "long", type: "div" });
                return
            }
            if(index!=0){
                this.商品分组.splice(index,1)
                this.商品分组.splice(index-1,0,item);
            }else{
                // this.商品分组.splice(0,1);
                // this.商品分组.push(item);
                this.商品分组.splice(0,1)
                this.商品分组.splice(this.商品分组.length-1,0,item);
            }
        },
        商品排序(item,index){
            // console.log(index_1,item,index)
            var index_1=this.当前查看分组
            if(this.查看类型==1){
                if(index!=0){
                    this.已上架[index_1].splice(index,1)
                    this.已上架[index_1].splice(index-1,0,item);
                }else{
                    this.已上架[index_1].splice(0,1);
                    this.已上架[index_1].push(item);
                }
            }else{
                if(index!=0){
                    this.已下架[index_1].splice(index,1)
                    this.已下架[index_1].splice(index-1,0,item);
                }else{
                    this.已下架[index_1].splice(0,1);
                    this.已下架[index_1].push(item);
                }
            }
        },
        //删除
        delete_1(item, index) {
            if (item.EXID) {
                var 提示 = item.EXTYPE == 0 ? "该商品是“新人专享”商品，删除商品会同时会删除对应的专享商品，是否删除？" : "该商品是“生日专享”商品，删除商品会同时会删除对应的专享商品，是否删除？";
                mui.confirm(提示, "提示", ["取消", "删除"], value => {
                    if (value.index == 1) {
                        openloading(true);
                        Promise.all([this.删除商品(item), this.删除专享(item.EXID)]).then(x => {
                            if (x[0].data.code == 200 && x[0].data.code == 200) {
                                mui.toast("删除成功", {duration: 2000,type: "div"});
                            } else {
                                var str = "";
                                if (x[0].data.code != 200) {
                                    str += x[0].data.msg ? x[0].data.msg : x[0].data.message;
                                }
                                if (x[1].data.code != 200) {
                                    str += x[1].data.msg ? x[1].data.msg : x[1].data.message;
                                }
                                mui.alert(str, "提示", "我知道了", function () { }, "div");
                            }
                            this.初始化();
                            openloading(false);
                        }).catch(err => {
                            openloading(false);
                            mui.toast("系统错误，稍后再试。", {duration: 2000,type: "div"});
                        });
                    }
                }, "div");
            } else {
                mui.confirm("确定删除此商品吗？", "提示", ["取消", "删除"], value => {
                    if (value.index == 1) {
                        openloading(true);
                        this.删除商品(item).then(x => {
                            openloading(false);
                            if (x.data.code == 200) {
                                this.commodity_list.splice(index, 1);
                            } else {
                                mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                            }
                        }).catch(err => {
                            openloading(false);
                            mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
                        });
                    }
                }, "div");
            }
        },
        //修改商品接口 上架下架
        async updata_state(x,index){
            var obj = Object.assign({}, x);

            if(obj.state == 1){
                var query={
                        start:0,
                        length:10,
                        commodityid:obj.id
                    }
                openloading(true);
                try {
                    var 奖赏_r = await api_查询奖赏列表(query);
                    openloading(false)
                    if(奖赏_r.data.code==200){
                        if(奖赏_r.data.data.data.length>0){
                            var 奖赏=奖赏_r.data.data.data[0];
                            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm');
                            if(奖赏.expirationtime > 当前时间 && 奖赏.surplusrewardnum > 0){
                                mui.alert('该商品处于奖赏状态，未结束前不能进行下架。', "提示", "我知道了", function () { }, "div");
                                return
                            }
                        }
                    }else{
                        mui.alert(奖赏_r.data.msg ? 奖赏_r.data.msg : 奖赏_r.data.message, "提示", "我知道了", function () { }, "div");
                        return
                    }
                } catch (error) {
                    openloading(false)
                    mui.toast("系统错误，稍后再试。", {duration: 2000,type: "div"});   
                    return             
                }
            }

            obj.state = obj.state == 0 ? 1 : 0;
            obj.arrImg = x.img.split(",");
            if (x.EXID && x.state == 1) {
                var 提示 = x.EXTYPE == 0 ? "该商品是“新人专享”商品，下架商品会同时会删除对应的专享商品，是否下架？" : "该商品是“生日专享”商品，下架商品会同时会删除对应的专享商品，是否下架？";
                mui.confirm(提示, "提示", ["取消", "下架"], value => {
                    if (value.index == 1) {
                        openloading(true);
                        Promise.all([this.修改商品([obj]), this.删除专享(x.EXID)]).then(res => {
                            if (res[0].data.code != 200 || res[1].data.code != 200) {
                                var str = "";
                                if (res[0].data.code != 200) {
                                    str += res[0].data.msg ? res[0].data.msg : res[0].data.message;
                                }
                                if (res[1].data.code != 200) {
                                    str += res[1].data.msg ? res[1].data.msg : res[1].data.message;
                                }
                                mui.alert(str, "提示", "我知道了", function () { }, "div");
                            }else{
                                mui.toast("设置成功。", { duration: 2000, type: "div" });
                            }
                            this.初始化()
                            openloading(false);
                        }).catch(err => {
                            openloading(false);
                            mui.toast("系统错误，稍后再试。", {duration: 2000,type: "div"});
                        });
                    }
                }, "div");
            } else {
                openloading(true);
                api_修改商品([obj]).then(res => {
                    if (res.data.code == 200) {
                        mui.toast("设置成功。", { duration: 2000, type: "div" });
                    } else {
                        mui.alert(res.data.msg ? res.data.msg : res.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    this.初始化()
                    openloading(false);
                }).catch(err => {
                    mui.toast("系统错误。", { duration: 2000, type: "div" });
                    openloading(false);
                })
            }
        },
        点击分组(index){
            this.当前查看分组=index;
            // this.点击了分组=true;
            // this.$refs.商品区.scrollTop = this.scroll_list[index];
        },
        //滚动条
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            // var index = limit(this.scroll_list, t);
            // if(!this.点击了分组){
            //     this.当前查看分组 = index;
            // }else{
            //     this.点击了分组 = false;
            // }
        },
        //手指头刚按下
        huoqu(e, x) {
            console.log(x);
            //手指头刚刚按下
            this.$set(x, "active", false);
            var targetTouches = e.targetTouches[0];
            this.touchstart_x = targetTouches.clientX - e.currentTarget.parentElement.offsetLeft;
        },
        //开始拖动
        touchmove(e) {
            var targetTouches = e.targetTouches[0];
            e.currentTarget.parentElement.style.left = targetTouches.clientX - this.touchstart_x + "px";
        },
        //拖动结束
        touchend(e, x) {
            x.active = true;
            var event = e;
            var parentElement = e.currentTarget.parentElement;
            setTimeout(() => {
                if (parentElement.offsetLeft < -60) {
                    this.$set(x, "pos_left", true);
                } else {
                    this.$set(x, "pos_left", false);
                }
                parentElement.removeAttribute("style");
            }, 100);
        },
        // 根据店铺查询商品
        get_commodity() {
            this.已上架商品.query.start = this.已上架商品.page_index * this.已上架商品.query.length;
            this.已上架商品.query.shopid = this.myshop.shopid;
            this.已上架商品.loading = true;
            api_获取商品列表(this.已上架商品.query).then(x => {
                this.已上架商品.loading = false;
                if (x.data.code == 200) {
                    var list = x.data.data.data;
                    this.已上架商品.commodity_list = this.已上架商品.commodity_list.concat(list);
                    this.已上架商品.total = x.data.data.total;
                }
            }).catch(err => {
                this.已上架商品.loading = false;
            })
        },
        获取已下架商品列表(){
            this.已下架商品.query.start = this.已下架商品.page_index * this.已下架商品.query.length;
            this.已下架商品.query.shopid = this.myshop.shopid;
            this.已下架商品.loading = true;
            api_获取商品列表(this.已下架商品.query).then(x => {
                this.已下架商品.loading = false;
                if (x.data.code == 200) {
                    var list = x.data.data.data;
                    this.已下架商品.commodity_list = this.已下架商品.commodity_list.concat(list);
                    this.已下架商品.total = x.data.data.total;
                }
            }).catch(err => {
                this.已下架商品.loading = false;
            })
        },
        async 查询已上架(){
            let 生成接口数组=()=>{
                return new Promise((resolve, reject) => {
                    let list=[];
                    this.商品分组.forEach(item=>{
                        var 查询条件={
                                start: 0,
                                length: 1000,
                                shopid: this.myshop.shopid,
                                state:1,
                                // groupid:""
                                order:"sort",
                                orderType:"ASC"
                            }
                        if(item.id){
                            查询条件.groupid=item.id
                        }else{
                            查询条件.isnull="1"
                        }
                        list.push(api_获取商品列表(查询条件))
                    })
                    resolve(list);
                });
            }
            var 接口数组=await 生成接口数组();
            return new Promise((resolve, reject) => {
                Promise.all(接口数组).then(x=>{
                    console.log('已上架',x);
                    this.已上架=[];
                    x.forEach(item=>{
                        var list=item.data.code==200 ? item.data.data.data : [];
                        list.forEach(商品=>{
                            商品.商品红包='';
                            var 查询红包参数 = {
                                start: 0,
                                length: 10,
                                ccc: 1,
                                type: 1,
                                commodityId: 商品.id
                            }
                            api_查询红包列表(查询红包参数).then(r => {
                                if (r.data.code == 200) {
                                    商品.商品红包 = r.data.data.data.length > 0 ? r.data.data.data[0] : '';
                                }
                            })
                        })
                        this.已上架.push(list)
                    })
                    resolve()
                }).catch(err=>{
                    reject();
                })
            });
        },
        async 查询已下架(){
            let 生成接口数组=()=>{
                return new Promise((resolve, reject) => {
                    let list=[];
                    this.商品分组.forEach(item=>{
                        var 查询条件={
                                start: 0,
                                length: 1000,
                                shopid: this.myshop.shopid,
                                state:0,
                                // groupid:""
                                order:"sort",
                                orderType:"ASC"
                            }
                        if(item.id){
                            查询条件.groupid=item.id
                        }else{
                            查询条件.isnull="1"
                        }
                        list.push(api_获取商品列表(查询条件))
                    })
                    resolve(list);
                });
            }
            var 接口数组=await 生成接口数组();
            return new Promise((resolve, reject) => {
                Promise.all(接口数组).then(x=>{
                    console.log('已下架',x);
                    this.已下架=[];
                    x.forEach(item=>{
                        var list=item.data.code==200 ? item.data.data.data : []
                        list.forEach(商品=>{
                            商品.商品红包='';
                            var 查询红包参数 = {
                                start: 0,
                                length: 10,
                                ccc: 1,
                                type: 1,
                                commodityId: 商品.id
                            }
                            api_查询红包列表(查询红包参数).then(r => {
                                if (r.data.code == 200) {
                                    商品.商品红包 = r.data.data.data.length > 0 ? r.data.data.data[0] : '';
                                }
                            })
                        })
                        this.已下架.push(list);
                    })
                    resolve()
                }).catch(err=>{
                    reject();
                })
            });
        },
        选择类型(type){
            this.查看类型=type;
            // this.当前查看分组=0;
            // setTimeout(x=>{
            //     this.获取高度()
            // },500)
        },
        获取高度(){
            if(this.查看类型==1){
                var dom=this.$refs.上架容器.childNodes;
            }else{
                var dom=this.$refs.下架容器.childNodes;
            }
            var 去除高度=this.$refs.去除高度.offsetTop;
            dom.forEach(x => {
                if (x.offsetTop){
                    console.log(x.offsetTop-去除高度)
                    this.scroll_list.push(x.offsetTop-去除高度);
                }
            });
        },
        async 初始化() {
            var this_1=this;
            openloading(true)
            if (!this.myshop || !this.myshop.shopid) {
                await this.获取店铺()
            }
            var 商品分组_query={
                    start:0,
                    length:1000,
                    shopid:this.myshop.shopid
                }
            try {
                var 分组返回值=await api_查询商品分组列表(商品分组_query);
            } catch (error) {
                mui.toast("查询分组错误，稍后再试。", { duration: 2000, type: "div" });
                openloading(false);
                return
            }
            if(分组返回值.data.code==200){
                this.商品分组=分组返回值.data.data.data;
                this.商品分组.push({'groupname':"未分组"});
            }else{
                openloading(false);
                mui.alert(分组返回值.data.msg ? 分组返回值.data.msg : 分组返回值.data.message, "提示", "我知道了", function () { }, "div");
                return
            }

            Promise.all([
                this.查询已上架(),
                this.查询已下架()
            ]).then(x=>{
                var 已上架=this.已上架;
                if(this.当前查看分组==0){
                    for(var i=0;i<已上架.length;i++){
                        if(已上架[i].length>0){
                            this_1.当前查看分组=i
                            break;
                        }
                    }
                }
            }).catch(err=>{

            })

            this.get_commodity();
            this.获取已下架商品列表();
            openloading(false);
        }
    },
    beforeCreate: function () {
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        this.初始化()
        this.$store.state.Select_picture.list = [];

        // console.group('------mounted 挂载结束状态------');
    },
    activated() {
        console.log("再次进入页面");
    },
    beforeUpdate: function () {
        // console.log('状态更新了')
        // console.group('beforeUpdate 更新前状态===============》');
    },
    updated: function () {
        // console.group('updated 更新完成状态===============》');
    },
    beforeDestroy: function () {
        // console.group('beforeDestroy 销毁前状态===============》');
    },
    destroyed: function () {
        // this.editor.destroy();	//销毁
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
// header_background
.mui-content {
    display: flex;
    flex-direction: column;
}
.mui-bar {
    .add {
        color: #ffffff;
        font-size: 15px;
        line-height: 44px;
        position: relative;
        z-index: 1;
    }
}
.发布商品 {
    // position: fixed;
    // bottom: 0px;
    // left: 0px;
    flex-shrink: 0;
    width: 100%;
    height: 44px;
    background: $header_background;
    font-size: 14px;
    line-height: 44px;
    color: #ffffff;
    text-align: center;
}

.查看类型 {
    flex-shrink: 0;
    background: #ffffff;
    height: 42px;
    display: flex;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    line-height: 42px;
    justify-content: space-around;
    .active {
        color: $header_background;
        font-weight: bold;
        position: relative;
    }
    .active::after {
        width: 100%;
        height: 2px;
        background: $header_background;
        content: "";
        position: absolute;
        left: 0px;
        bottom: 0px;
    }
}
.商品容器 {
    flex-grow: 1;
    display: flex;
    .分组列表 {
        flex-shrink: 0;
        overflow: auto;
        width: 70px;
        div {
            height: 50px;
            border-bottom: 1px solid #f6f6f6;
            background: #ffffff;
            line-height: 49px;
            text-align: center;
            position: relative;
            .名称 {
                font-size: 12px;
                color: rgba(128, 128, 128, 1);
            }
            .排序 {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                background: rgba(166, 166, 166, 0.46);
                border-bottom: 1px solid #ffffff;
                font-size: 20px;
                color: #ffffff;
            }
        }
        div:last-child {
            .排序 {
                border: none;
            }
        }
        div.active {
            background: #f6f6f6;
            .名称 {
                color: $header_background;
            }
        }
    }
    .商品区 {
        flex-grow: 1;
        padding: 7px;
        overflow: auto;
        .商品 {
            display: flex;
            background: #ffffff;
            border-bottom: 1px solid #f6f6f6;
            padding: 7px 10px;
            position: relative;
            .排序{
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                color: #ffffff;
                background:  rgba(166, 166, 166, 0.4);
                border-bottom: 1px solid #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 38px;
            }
            > li:nth-child(1) {
                width: 83px;
                height: 62px;
                flex-shrink: 0;
                margin: 0px 8px 0px 0px;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                span {
                    position: absolute;
                    font-size: 12px;
                    background: rgba(153, 153, 153, 0.41);
                    left: 0px;
                    bottom: 0px;
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    color: #ffffff;
                    text-align: center;
                }
            }
            > li:nth-child(2) {
                flex-grow: 1;
                .商品名 {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    span:nth-child(1) {
                        flex-grow: 1;
                        width: 0;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: rgba(80, 80, 80, 1);
                    }
                    span:nth-child(2) {
                        color: rgba(166, 166, 166, 1);
                    }
                }
                .价格 {
                    color: rgba(128, 128, 128, 1);
                    font-size: 10px;
                    span {
                        margin: 0px 3px 0px 0px;
                    }
                }
                .红包佣金 {
                    color: rgba(166, 166, 166, 1);
                    font-size: 10px;
                }
                .销售量 {
                    display: flex;
                    align-items: center;
                    .已销售 {
                        color: rgba(166, 166, 166, 1);
                        font-size: 10px;
                        flex-grow: 1;
                    }
                    .专享类型 {
                        margin: 0px 4px 0px 0px;
                        min-width: 20px;
                        white-space: nowrap;
                        height: 12px;
                        font-size: 7px;
                        border-radius: 4px;
                        color: $header_background;
                        text-align: center;
                        line-height: 10px;
                        border: 1px solid $header_background;
                    }
                    .专享抵扣 {
                        color: $header_background;
                        font-size: 10px;
                    }
                    .红包_icon {
                        font-size: 12px;
                        color: $header_background;
                        margin: 0px 4px 0px 0px;
                    }
                    .红包金额 {
                        color: $header_background;
                        font-size: 10px;
                    }
                }
            }
        }
    }
}

.box_2 {
    overflow: hidden;
    > li.active {
        transition: all 0.3s;
    }
    > li {
        position: relative;
        left: 0px;
        display: flex;
        background: #ffffff;
        border-bottom: 1px solid #e5e5e5;
        // >div:nth-child(2){
        //     flex-grow: 1;
        // }
        .content_1 {
            flex-grow: 1;
        }
    }
    > li.pos_left {
        left: -60px;
    }
    .left_1 {
        padding: 0px 0.16rem 0px 0px;
        position: absolute;
        width: 100%;
        left: -100%;
        height: 100%;
        top: 0px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .right_1 {
        position: absolute;
        width: 100%;
        left: 100%;
        top: 0px;
        height: 100%;
        background: #d43030;
        font-size: 0.14rem;
        color: #ffffff;
        display: flex;
        align-items: center;
        padding: 0px 0.16rem 0px;
    }
    .cont_1 {
        display: flex;
        padding: 0.1rem;
        > li:nth-child(1) {
            width: 83px;
            // height: 62px;
            flex-shrink: 0;
            margin: 0px 8px 0px 0px;
            font-size: 0;
            img {
                width: 100%;
            }
        }
        > li:nth-child(2) {
            width: 0;
            flex-grow: 1;
            h1 {
                font-weight: 400;
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
                .title_1 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .active {
                    color: #2a82e4;
                }
            }
            h2 {
                font-weight: 400;
                color: rgba(128, 128, 128, 1);
                font-size: 12px;
                margin: 7px 0px;
            }
            h3 {
                font-weight: 400;
                color: rgba(166, 166, 166, 1);
                font-size: 12px;
                margin: 0px;
            }
        }
    }
}
</style>
