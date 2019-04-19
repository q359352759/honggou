<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title 搜索框">
                <div>
                    <i class="icon iconfont icon-chazhao"></i>
                    <input @focus="搜索框获取焦点()" v-model="订单.query.name" ref="搜索框" type="text" placeholder="搜索全部订单" />
                </div>
            </h1>
            <span @click="点击搜索()" class="搜索按钮">搜索</span>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <div v-for="(item, index) in 订单.list" :key="index">
                <shangping @click.native="点击单个订单(index)" v-if="item.orderType==0" :shangping="item" />
                <xianjin @click.native="点击单个订单(index)" v-if="item.orderType==1" :dingdan="item" />
            </div>
            <loading :loadingtype="订单.loading" :nodata="!订单.loading && 订单.total==0" :end="!订单.loading && 订单.total!=0 && 订单.total==订单.list.length" />
                
        </div>
        <div class="搜索历史" v-show="显示搜索记录">
            <div class="标题">
                <span>搜索历史：</span>
                <span @click="清空记录()">清除</span>
            </div>
            <ul>
                <li v-for="(item, index) in 搜索记录" :key="index">
                    <div @click="点击记录(item)">{{item}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { api_查询订单列表 , api_取消订单 , api_查询待评价订单} from "@/api/订单接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";

// 商品订单
import shangping from "@/components/orders/orderList/shangping.vue";
// 输入金额订单
import xianjin from "@/components/orders/orderList/xianjin.vue";

import loading from "@/components/loading.vue";
import { openloading } from "@/assets/js/currency.js";
import { mapGetters , mapActions } from "vuex";
export default {
    name:"",
    components:{
        shangping,
        xianjin,
        loading
    },
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            显示搜索记录:"orders/订单搜索记录/显示搜索记录",
            订单:"orders/订单搜索记录/订单",
            搜索记录:"orders/订单搜索记录/搜索记录",
            点击索引:"orders/订单搜索记录/点击索引",
            点击的订单:"orders/订单搜索记录/点击的订单",
        })
    },
    methods: {
        ...mapActions({
            重置数据:'orders/订单搜索记录/重置数据',
            点击搜索:'orders/订单搜索记录/点击搜索',
            搜索框获取焦点:'orders/订单搜索记录/搜索框获取焦点',
            点击记录:'orders/订单搜索记录/点击记录',
            清空记录:'orders/订单搜索记录/清空记录',
            下一页:'orders/订单搜索记录/下一页',
            点击单个订单:'orders/订单搜索记录/点击单个订单',
            更新单个订单:'orders/订单搜索记录/更新单个订单',
        }),
        scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (h + t >= sh - 10) {
                if(!this.订单.loading && this.订单.list.length<this.订单.total){
                    this.下一页()
                }
            }
        }
    },
    mounted() {
        //搜索记录
        if(!this.订单.query.name){
            this.重置数据();
            this.$refs.搜索框.focus();
        }
        this.更新单个订单();
    },
}
</script>

<style lang="scss" scoped>
.mui-bar{
    .搜索框{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 44px;
        >div{
            width: 242px;
            height: 28px;
            display: flex;
            align-items: center;
            background: #E57475;
            border-radius: 28px;
            i{
                margin: 0px 9px;
                font-size: 18px;
            }
        }
        input{
            height: 100%;
            padding: 0px;
            margin: 0px;
            height: 100%;
            background: none;
            border: none;
            color: #ffffff;
            font-size: 12px;
        }
        input::-webkit-input-placeholder{
           color: rgba(229, 229, 229, 1);
        }
        input:-moz-placeholder{
           color: rgba(229, 229, 229, 1);
        }
        input::-moz-placeholder{
            color: rgba(229, 229, 229, 1);
        }
        input:-ms-input-placeholder{
            color: rgba(229, 229, 229, 1);
        }
    }
    .搜索按钮{
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        position: absolute;
        top: 0px;
        right: 12px;
        line-height: 44px;
    }
}
.搜索历史{
    position: fixed;
    top: 44px;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: #f6f6f6;
    .标题{
        line-height: 43px;
        color: rgba(80, 80, 80, 1);
        padding: 0px 14px;
    	font-size: 12px;
        display: flex;
        justify-content: space-between;
    }
    >ul{
        display: flex;
        flex-wrap: wrap;
        padding: 0px 10px;
        >li{
            width: 25%;
            padding: 0px 4px;
            margin: 0px 0px 8px;
        	height: 29px;
            >div{
                line-height: 29px;
                height: 100%;
                background: #ffffff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                font-size: 12px;
                color: rgba(128, 128, 128, 1);
            }
        }
    }
}
</style>
