<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">推广奖赏</h1>
            <span @click="$router.push('/myshop/js/jsgz')">奖赏规则</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="列表">
                <li v-for="(item, index) in 奖赏.list" :key="index" @click="$router.push('/myshop/js/tjjs?id='+item.id)">
                    <div>
                        <div>
                            <img v-if="item.商品 && item.商品.img.split(',').length>0" :src="item.商品.img.split(',')[0]" alt="" srcset="">
                        </div>
                        <div>
                            <div>
                                <span>{{item.商品 ? item.商品.name : ''}}</span>
                                <span class="蓝色字体">已奖赏{{item.havarewardnum}}份</span>
                            </div>
                            <div>
                                <span>专享价：{{ (item.专享 && item.商品) ? Math.round( (item.商品.sellingPrice - item.专享.deduction)*100 )/100 : '' }}元</span>
                                <span>首单奖赏：{{item.firstrewardamount}}元</span>
                            </div>
                            <div v-if="item.商品">
                                <span>红包价：{{item.商品 ? Math.round( (item.商品.sellingPrice-item.商品.deduction)*100)/100 : "" }}元</span>
                                <span>普通奖赏：{{item.generalrewardamount}}元</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span>剩余奖赏次数：{{item.surplusrewardnum}}</span>
                        <span v-show="item.expirationtime>当前时间">截止时间：{{item.expirationtime | 时间过滤}}</span>
                        <span class="浅灰色字体" v-show="item.expirationtime<=当前时间">已失效</span>
                    </div>
                </li>
            </ul>

            <div class="mui-text-center 按钮">
                <button class="添加按钮" @click="$router.push('/myshop/js/tjjs')">添加奖赏</button>
                <span class="记录按钮" @click="$router.push('/myshop/js/jslsjl')">历史记录</span>
            </div>

        </div>
    </div>
</template>

<script>
import { api_查询奖赏列表 } from "@/api/奖赏接口.js";
import { api_根据id查询商品 , api_获取商品列表 } from "@/api/商品接口.js";
import { api_根据商品id查询专享 } from "@/api/专享接口.js";
import { openloading , 当前时间格式化} from "@/assets/js/currency.js";

import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{},
    data() {
        return {
            当前时间:当前时间格式化('yyyy-MM-dd hh:mm'),
            奖赏:{
                query:{
                    start:0,
                    length:1000,
                    shopid:"",
                },
                list:[],
                total:0
            }
        }
    },
    computed: {
        ...mapGetters({
            myshop: "get_myshop", 
        })
    },
    filters:{
        时间过滤(time){
            return 当前时间格式化('yyyy.MM.dd',time)
        }
    },
    methods: {
        ...mapActions({
            获取店铺: "getMyshop",
        }),
        获取奖赏(){
            openloading(true);
            this.奖赏.query.shopid=this.myshop.shopid;
            api_查询奖赏列表(this.奖赏.query).then((x) => {
                if(x.data.code==200){
                    this.奖赏.total=x.data.data.total;
                    var list=x.data.data.data;
                    list.forEach(item => {
                        item.商品="";
                        item.专享="";
                        api_根据商品id查询专享(item.commodityid).then(r=>{
                            item.专享=(r.data.code==200 && r.data.data.length>0) ? r.data.data[0] : ''
                        })
                        api_根据id查询商品(item.commodityid).then(r=>{
                            item.商品=r.data.code==200 ? r.data.data : ''
                        }).catch(err=>{})
                    });
                    this.奖赏.list= list;
                }
                openloading(false);
            }).catch((err) => {
                openloading(false);
            });
        },
        async 初始化(){
            openloading(true);
            if(!this.myshop || !this.myshop.shopid){
                await this.获取店铺()
            }
            this.获取奖赏();
            
        }
    },
    mounted() {
        this.初始化();
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
        position: absolute;
        top: 0px;
        right: 14px;
        line-height: 44px;
    }
}

.列表{
    margin: 3px 0px 0px 0px;
    color: rgba(80, 80, 80, 1);
	font-size: 12px;
    >li{
        background: #ffffff;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            display: flex;
            padding: 8px 8px 0px 8px;
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

.按钮{
    margin: 58px 0px 30px;
    position: relative;
    .记录按钮{
        position: absolute;
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        right: 44px;
        top: 0px;
        line-height: 36px;
    }
}

.添加按钮{
    width: 120px;
    height: 36px;
    border: 1px solid $header_background;
    border-radius: 36px;
    background: none;
    color: $header_background;
    
    outline: none;
}
.添加按钮:active{
    background: none;
    color: $header_background;
}

</style>
