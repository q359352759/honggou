<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">待取货</h1>
            <span class="扫一扫" @click="扫一扫()">
                <i class="icon iconfont icon-iconfontscan"></i>
                <span>扫码提货</span>
            </span>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <div class="列表" v-for="(item, index) in 待取货.list" :key="index">
                <div class="顾客">
                    <span>顾客：
                        <span v-if="item.用户 && item.用户.nickname">{{item.用户.nickname}}</span>
                        <span v-if="item.用户 && !item.用户.nickname">{{item.用户.phone}}</span>
                    </span>
                    <span>{{item.createTime}}</span>
                </div>
                <ul>
                    <li v-for="(item_1, index_1) in item.商品列表" :key="index_1">
                        <span>{{item_1.name}}</span>
                        <span>x{{item_1.购买数量}}</span>
                    </li>
                </ul>
            </div>
            <loading :loadingtype="待取货.loading" :end="!待取货.loading && 待取货.total!=0 && 待取货.list.length>=待取货.total" :nodata="!待取货.loading && 待取货.total==0"/>
        </div>
    </div>
</template>

<script>
import { api_查询订单列表 } from "@/api/订单接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { mapGetters, mapActions } from 'vuex';
import loading from '@/components/loading.vue'
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import { openloading } from "@/assets/js/currency.js";
export default {
    name:"",
    components:{
        loading
    },
    data() {
        return {
            待取货:{
                query:{
                    start: 0 ,
                    length: 10 ,
                    shopid: "" ,
                    logstatus: 3 ,
                    state: 1 ,
                },
                list:[],
                loading:true,
                page_index:0,
                total:0
            }
        }
    },
    computed: {
        ...mapGetters({
            myshop: "get_myshop",
        })
    },
    methods: {
        ...mapActions({
            获取店铺: "getMyshop",
        }),
        扫一扫(){
            if(ApplicationType=='app'){
                this.$router.push('/appSaoyisao');
            }else{
                var agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                    if (this.$store.state.weixin_ready) {
                        try {
                            openloading(false);
                            wx.scanQRCode({
                                needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                                success: function (res) {
                                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                }
                            });
                        } catch (error) {
                            setTimeout(() => {
                                this.扫一扫();
                            }, 1000);
                        }
                    } else {
                        openloading(true);
                        setTimeout(() => {
                            this.扫一扫();
                        }, 1000);
                    }
                }
            }
        },
        async 初始化(){
            if(!this.myshop || !this.myshop.shopid){
                await this.获取店铺();
            }
            this.待取货.query.shopid=this.myshop.shopid;
            this.查询订单();
        },
        scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (h + t >= sh - 10 && !this.待取货.loading && this.待取货.list.length < this.待取货.total) {
                this.待取货.page_index++;
                this.查询订单();
            }
        },
        查询订单(){
            this.待取货.loading=true;
            this.待取货.query.start=this.待取货.page_index*this.待取货.query.length;
            api_查询订单列表(this.待取货.query).then(x => {
                if(x.data.code==200){
                    var list=x.data.data.data;
                        list.forEach(item => {
                            //商品去重
                            let hash = {};
                            let newArr = item.shopOrderCommoditys.reduceRight((item, next) => {
                                if(hash[next.commodityid]){
                                    hash[next.commodityid].购买数量++
                                }else{
                                    var obj=Object.assign(next);
                                        obj.购买数量=1
                                    hash[next.commodityid] = obj
                                    item.push(next);
                                }
                                return item
                            }, []);
                            item.商品列表=newArr;
                            item.用户="";
                            api_通过username查询用户(item.userid).then((r) => {
                                item.用户=r.data.code==200 ? r.data.data : "";
                                try {
                                    item.用户.nickname=b64DecodeUnicode(item.用户.nickname)
                                } catch (error) {}
                            }).catch((err) => {});
                        });
                    this.待取货.list=this.待取货.list.concat(list);
                    this.待取货.total=x.data.data.total;
                }
                this.待取货.loading=false;
            }).catch(err => {
                this.待取货.loading=false;
            });
        }
    },
    mounted() {
        this.初始化();
    },
}
</script>

<style lang="scss" scoped>
.mui-bar{
    .扫一扫{
        position: absolute;
        top: 0px;
        right: 20px;
        height: 100%;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i{
            font-size: 24px;
            height: 24px;
            line-height: 24px;
        }
        span{
            color: rgba(255, 255, 255, 1);
        	font-size: 8px;
        }
    }
}
.列表{
    background: #ffffff;
    margin: 3px 0px 0px;
    .顾客{
        height: 30px;
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        border-bottom: 1px solid #f6f6f6;
        >span:nth-child(1){
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            font-weight: bold;
        }
        >span:nth-child(2){
            color: rgba(128, 128, 128, 1);
        	font-size: 12px;
        }
    }
    ul{
        min-height: 36px;
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        padding: 10px 10px;
        li{
            display: flex;
            justify-content: space-between;
        }
        >li:not(:first-child){
            margin: 5px 0px 0px;
        }
    }
}
</style>

