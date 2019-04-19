<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">奖赏历史</h1>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <ul class="列表">
                <li v-for="(item, index) in 奖赏.list" :key="index" @click="$router.push('/myshop/js/tjjs?id='+item.id)">
                    <div>
                        <div>
                            <img v-if="item.commoditypicture && item.commoditypicture.split(',').length>0" :src="item.commoditypicture.split(',')[0]" alt="" srcset="">
                        </div>
                        <div>
                            <div>
                                <span>{{item.commodityname}}</span>
                                <span class="蓝色字体">已奖赏{{item.havarewardnum}}份</span>
                            </div>
                            <div>
                                <span>专享价：{{item.deductiona ? Math.round((item.sellingprice - item.deductiona)*100)/100 : '--' }}元</span>
                                <span>首单奖赏：{{item.firstrewardamount}}元</span>
                            </div>
                            <div>
                                <span>红包价：{{ Math.round((item.sellingprice - item.deduction)*100)/100}}元</span>
                                <span>普通奖赏：{{item.generalrewardamount}}元</span>
                            </div>
                        </div>
                    </div>
                    <!-- <div>
                        <span>剩余奖赏次数：{{item.surplusrewardnum}}</span>
                        <span v-show="item.expirationtime>当前时间">截止时间：{{item.expirationtime | 时间过滤}}</span>
                        <span class="浅灰色字体" v-show="item.expirationtime<=当前时间">已失效</span>
                    </div> -->
                </li>
            </ul>

            <loading :loadingtype="奖赏.loading" :nodata="!奖赏.loading && 奖赏.total==0" :end="!奖赏.loading && 奖赏.total!=0 && 奖赏.list.length>=奖赏.total"/>
            
        </div>
    </div>
</template>

<script>
import { api_查询奖赏历史记录 } from "@/api/奖赏接口.js";
import { openloading , 当前时间格式化} from "@/assets/js/currency.js";

import loading from '@/components/loading.vue'

import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        loading
    },
    data() {
        return {
            奖赏:{
                query:{
                    start:0,
                    length:10,
                    shopid:"",
                },
                page_index:0,
                list:[],
                total:0,
                loading:true,
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
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (h + t >= sh - 10 && !this.奖赏.loading && this.奖赏.list.length < this.奖赏.total) {
                this.奖赏.page_index++;
                this.获取奖赏记录();
            }
        },
        获取奖赏记录(){
            this.奖赏.query.start=this.奖赏.page_index*this.奖赏.query.length;
            this.奖赏.query.shopid=this.myshop.shopid;
            this.奖赏.loading=true
            api_查询奖赏历史记录(this.奖赏.query).then(x=>{
                if(x.data.code==200){
                    this.奖赏.list=[...this.奖赏.list,...x.data.data.data];
                    this.奖赏.total=x.data.data.total;
                }
                this.奖赏.loading=false            
            }).catch(err=>{
                this.奖赏.loading=false            
            })
        },
        async 初始化(){
            if(!this.myshop || !this.myshop.shopid){
                openloading
                await this.获取店铺();
            }
            this.获取奖赏记录()
        }
    },
    mounted() {
        this.初始化()
    },

}
</script>

<style lang="scss" scoped>

.列表{
    margin: 3px 0px 0px 0px;
    color: rgba(80, 80, 80, 1);
	font-size: 12px;
    padding: 0px 20px 0px 8px;
    background: #ffffff;
    >li{
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            display: flex;
            padding: 8px 0px 8px 0px;
            >div:nth-child(1){
                width: 80px;
            	height: 60px;
                flex-shrink: 0;
                margin: 0px 12px 0px 0px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            >div:nth-child(2){
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                justify-content: space-between;
                div{
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
        >div:nth-child(2){
            height: 38px;
            line-height: 38px;
            display: flex;
            span{
                width: 50%;
                text-align: center;
            }
        }
    }
    .蓝色字体{
        color: rgba(0, 122, 255, 1);
    }
    .浅灰色字体{
        color: rgba(166, 166, 166, 1);
    }
}
</style>
