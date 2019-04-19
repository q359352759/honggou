<template>
        <div class="付款方式">
            <div class="选择提货类型" v-show="显示选择">
                <ul class="mui-table-view 提货类型">
                    <li class="mui-table-view-cell item" @click="选择类型(1)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':取货类型==1,'icon-choose':取货类型!=1}"></i>
                        <span>当面付</span>
                        <span class="灰色字体">（已拿到商品）</span>
                    </li>
                    <li class="mui-table-view-cell item"  @click="选择类型(2)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':取货类型==2,'icon-choose':取货类型!=2}"></i>
                        <span>到店自取</span>
                        <span class="灰色字体">（先付款，再到店铺拿货）</span>
                    </li>
                    <li v-show="可预订" class="mui-table-view-cell item" @click="选择类型(3)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':取货类型==3,'icon-choose':取货类型!=3}"></i>
                        <span>预订</span>
                        <span class="灰色字体">（先付订金，到店消费后支付尾款）</span>
                    </li>
                    <li v-show="可送货" class="mui-table-view-cell item"  @click="选择类型(4)">
                        <i class="icon iconfont" :class="{'icon-xuanze2':取货类型==4,'icon-choose':取货类型!=4}"></i>
                        <span>配送</span>
                        <span class="灰色字体">（送货上门）</span>
                    </li>
                </ul>
            </div>
            
            <ul class="mui-table-view 提货类型">
                <li class="mui-table-view-cell" @click="显示选择=true">
                    <a class="mui-navigate-right item">
                        <span v-show="取货类型==1">消费方式：当面付</span>
                        <span v-show="取货类型==1" class="灰色字体">（已拿到商品）</span>

                        <span v-show="取货类型==2">消费方式：到店自取</span>
                        <span v-show="取货类型==2" class="灰色字体">（先付款，再到店铺拿货）</span>

                        <span v-show="取货类型==3">消费方式：预订</span>
                        <span v-show="取货类型==3" class="灰色字体">（先付订金）</span>

                        <span v-show="取货类型==4">消费方式：配送</span>
                        <span v-show="取货类型==4" class="灰色字体">（送货上门）</span>
                        <span class="蓝色字体">选择</span>
                    </a>
                </li>
            </ul>
            <div class="支付按钮">
                <span>实付：{{支付总金额}}元</span>
                <div @click="支付()">支&nbsp;付</div>
            </div>
        </div>
</template>

<script>
export default {
    name:"",
    inject:['去支付','切换支付类型'],
    props:{
        支付总金额:{
            default:0
        },
        默认类型:{
            default:1
        },
        可预订:{
            default:false
        },
        可送货:{
            default:false
        }
    },
    data() {
        return {
            显示选择:false,
            取货类型:this.默认类型,     //设1为当面付,设2位到店取货
        }
    },
    methods: {
        选择类型(type){
            this.取货类型=type;
            this.显示选择=false;
            this.切换支付类型(type);
        },
        支付(){
            this.去支付(this.取货类型);
        }
    },
    mounted() {
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background

.付款方式{
    // position: fixed;
    // left: 0px;
    // bottom: 0px;
    // width: 100%;
    .选择提货类型{
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 85px;
        width: 100%;
        background: rgba(0,0,0,0.4);
        >ul{
            position: absolute;
            left: 0px;
            width: 100%;
            bottom: 0px;
            border-bottom: 3px solid #f6f6f6;
        }
    }
    .提货类型{
        .mui-table-view-cell:after{
            left: 0px;
        }
        .item{
            display: flex;
            align-items: center;
            i{
                font-size: 20px;
                height: 20px;
                line-height: 20px;
                margin: 0px 8px 0px 0px;
            }
            .灰色字体{
                color: rgba(166, 166, 166, 1);
                flex-grow: 1;
            }
            .蓝色字体{
                color: rgba(0, 122, 255, 1);
                margin:0px 18px 0px 0px;
            }
            .icon-xuanze2{
                color: rgba(44, 164, 236, 1);
            }
            .icon-choose{
                color: rgba(156, 156, 156, 1);
            }
            span{
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
            }
        }
    }
    .支付按钮{
        height: 44px;
        display: flex;
        background: $header_background;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        span{
            color: rgba(255, 255, 255, 1);
            font-size: 14px;
            font-weight: bold;
        }
        div{
            width: 88px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            background: #ffffff;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            color: $header_background;
        }
    }
}
</style>
