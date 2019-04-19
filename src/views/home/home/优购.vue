<template>
    <div>
        <!-- 商品 -->
        <ul class="优购列表">
            <li v-for="(item, index) in list" :key="index" @click="$router.push('/commodity/CommodityDetails?id='+item.id+'&isshop=1')">
                <div>
                    <div class="img_box">
                        <img v-if="item.img" :src="item.img.split(',')[0]" alt="" srcset="">
                    </div>
                    <h1>
                        <div>
                            <b>
                            {{item.name}}
                            </b>
                        </div>
                    </h1>
                    <div class="text_1">
                        <div class="价格">
                            <span class="xianjia">￥{{item.sellingPrice}}</span>
                            <s class="yuanjia">{{item.marketPrice}}</s>
                        </div>
                        <div class="dikou" v-if="!item.EXID">
                            <i class="icon iconfont icon-hongbao1"></i>
                            <span>省:{{parseFloat(item.deduction.toFixed(1))}}元</span>
                        </div>
                        <div v-if="item.EXID" class="专享信息">
                            <span class="zhuanxiang" v-if="item.EXTYPE==0">
                                新人
                            </span>
                            <span class="zhuanxiang" v-if="item.EXTYPE==1">
                                生日
                            </span>
                            <span>省:{{Math.round((item.EXDEDUCTION)*100)/100}}元</span>
                        </div>
                    </div>
                    <div class="text_2">
                        <div class="xiaoshou">
                            <div>销</div>
                            <div>{{item.sales}}笔</div>
                        </div>
                        <div class="人气">
                            <i class="icon iconfont icon-huo"></i>
                            {{item.popularity}}
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <!-- <loading :loadingtype="优购.loading" :nodata="!优购.loading && 优购.total==0" :end="!优购.loading && 优购.total!=0 && 优购.list.length==优购.total" /> -->
    </div>
</template>

<script>
import loading from "@/components/loading.vue";

import { mapGetters } from "vuex";

export default {
    name: "",
    props:{
        list:{
            default:()=>[]
        }
    },
    components: {
        loading
    },
    data() {
        return {};
    },
    computed: {
    }
};
</script>

<style lang="scss" scoped>
.优购列表 {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 5px;
    > li {
        width: 50%;
        padding: 5px;
        > div {
            background: #ffffff;
            border-radius: 4px;
            overflow: hidden;
        }
    }
    .img_box {
        width: 1.72rem;
        height: 1.29rem;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    h1 {
        padding: 0px 0.06rem;
        color: rgba(80, 80, 80, 1);
        font-size: 0.12rem;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        margin: 5px 0px 0px;
        > div:nth-child(1) {
            flex-grow: 1;
        }
        
    }
    .text_1 {
        display: flex;
        justify-content: space-between;
        padding: 0px 0.06rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        .价格{
        }
        .xianjia {
            color: #d43030;
            font-size: 0.12rem;
            font-weight: bold;
        }
        .yuanjia {
            font-size: 0.1rem;
            color: #a6a6a6;
            margin: 0px 0px 0px 0.05rem;
        }
        .dikou {
            i {
                color: #fc4c4c;
                font-size: 0.1rem;
            }
            span {
                margin: 0px 0px 0px 3px;
                font-size: 0.1rem;
                color: #fc4c4c;
            }
        }
    }
    .text_2 {
        padding: 0px 0.06rem 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .xiaoshou {
            display: flex;
            align-items: center;
            > div:nth-child(1) {
                flex-shrink: 0;
                flex-grow: 0;
                margin: 0px 3px 0px 0px;
                display: inline-block;
                width: 12px;
                height: 12px;
                font-size: 8px;
                line-height: 12px;
                text-align: center;
                border-radius: 100%;
                background: #ff5733;
                color: #ffffff;
            }
            > div:nth-child(2) {
                color: rgba(166, 166, 166, 1);
                font-size: 10px;
            }
        }
        
    }
    .专享信息{
        color: rgba(212, 48, 48, 1);
        font-size: 10px;
        display: flex;
        align-items: center;
        .zhuanxiang {
            margin: 0px 3px 0px 0px;
            border: 1px solid #e33c64;
            font-size: 8px;
            height: 12px;
            color: #e33c64;
            line-height: 10px;
            padding: 0px 2px;
            border-radius: 4px;
        }
    }
    .人气{
        color: rgba(128, 128, 128, 1);
        font-size: 10px;
        i {
            color: rgba(224, 28, 4, 1);
        }
    }
}
</style>
