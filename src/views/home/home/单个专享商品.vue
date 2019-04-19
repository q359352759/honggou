<template>
    <ul class="专享" @click="$router.push('/commodity/CommodityDetails?id='+item.comId+'&isshop=1')">
        <li>
            <img v-if="item.comImg.split(',').length>0" :src="item.comImg.split(',')[0]" alt="" srcset="">
        </li>
        <li>
            <b class="商品名">{{item.comName}}</b>
            <div class="价格销量">
                <b class="销售价">￥{{item.comSellingPrice}}</b>
                <s class="原价">{{item.comMarketPrice}}</s>
                <span class="售">销</span>
                <span class="销量">{{item.comSales}}笔</span>
            </div>
            <div class="抵扣人气">
                <i class="icon iconfont icon-hongbao1"></i>
                <span class="省">省:￥{{item.comDeduction}}</span>
                <i class="icon iconfont icon-renqi"></i>
                <span class="人气">{{item.comPopularity}}</span>
            </div>
        </li>
        <li></li>
        <li>
            <img v-if="item.type==0" src="image/xingren1.png" alt="">
            <img v-if="item.type==1" src="image/shengri1.png" alt="">
            <div>
                <i class="icon iconfont icon-shengji"></i>
                <b>
                    {{item.deduction}}元
                </b>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name:"",
    props:{
        item:{
            default:()=>{
                return {}
            }
        }
    },
    data() {
        return {
            
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.专享{
    height: 72px;
    padding: 5px 0px 5px 5px;
    margin: 5px;
    background: #ffffff;
    display: flex;
    >li{
        height: 100%;
    }
    >li:nth-child(1){
        width: 77px;
        margin: 0px 7px 0px 0px;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
            flex-shrink: 0;
        }
    }
    >li:nth-child(2){
        flex-grow: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .商品名{
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
        }
        .价格销量{
            display: flex;
            align-items: center;
            .销售价{
                font-size: 12px;
                color: $header_background;
                margin: 0px 3px 0px 0px;
            }
            .原价{
                color: rgba(166, 166, 166, 1);
            	font-size: 10px;
            }
            .售{
                width: 12px;
                height: 12px;
                border-radius: 100%;
                background: $header_background;
                color: #ffffff;
                font-size: 8px;
                line-height: 12px;
                text-align: center;
                margin: 0px 3px 0px 5px;
            }
            .销量{
                color: rgba(166, 166, 166, 1);
                font-size: 10px;
            }
        }
        .抵扣人气{
            display: flex;
            align-items: center;
            .icon-hongbao1{
                font-size: 12px;
                line-height: 12px;
                height: 12px;
                color: $header_background;
                margin: 0px 5px 0px 0px;
            }
            .省{
                color: rgba(128, 128, 128, 1);
                font-size: 10px;
            }
            .icon-renqi{
                font-size: 12px;
                line-height: 12px;
                color: $header_background;
                height: 12px;
                margin: 0px 3px 0px 6px;
            }
            .人气{
                color: rgba(166, 166, 166, 1);
                font-size: 10px;
            }
        }
    }
    >li:nth-child(3){
        width: 1px;
        flex-shrink: 0;
        position: relative;
        border-left: 1px dashed #ff5733;
    }
    >li:nth-child(3)::after,
    >li:nth-child(3)::before {
        position: absolute;
        width: 14px;
        height: 14px;
        background: #f6f6f6;
        border-radius: 100%;
        left: -7px;
        content: "";
    }
    >li:nth-child(3)::after {
        top: -12px;
    }
    >li:nth-child(3)::before {
        bottom: -12px;
    }

    >li:nth-child(4){
        width: 104px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        img {
            width: 30px;
            height: 30px;
            margin: 0px 0px 4px 0px;
        }
        > div {
            display: flex;
            justify-content: center;
            color: rgba(212, 48, 48, 1);
            i {
                font-size: 14px;
                line-height: 14px;
                height: 14px;
                margin: 0px 4px 0px 0px;
            }
            b {
                font-size: 12px;
            }
        }
    }
}
</style>

