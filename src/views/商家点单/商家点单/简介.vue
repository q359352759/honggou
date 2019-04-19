<template>
    <div>
        <ul class="店铺信息">
            <li>营业时间：{{全部信息.店铺信息.openTime}}--{{全部信息.店铺信息.closeTime}}</li>
            <li>联系电话：{{全部信息.店铺信息.phone}}</li>
            <li>店铺地址：{{全部信息.店铺信息.address}}{{全部信息.店铺信息.address}}</li>
            <li class="红包好评">
                <span v-if="新人红包" class="红包信息">
                    <span>省钱信息：</span>
                    <span v-show="新人红包.deductionType==0">消费金额{{新人红包.percentage}}%</span>
                    <span v-show="新人红包.deductionType==1">满{{新人红包.expire}}省{{新人红包.deduction}}元</span>
                </span>
                <span class="好评">好评：{{全部信息.店铺评分.scoreAvg ? Math.floor(全部信息.店铺评分.scoreAvg*10)/10 : 5 }}分</span>
                <i class="人气 icon iconfont icon-renqi"></i>
                <span class="人气数量">{{全部信息.店铺信息.popularity ? 全部信息.店铺信息.popularity : 0}}</span>
            </li>
        </ul>
        <div class="服务类型">
            <div class="swiper-container" ref="服务轮播">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(x, index) in 当前店铺服务类型" :key="index">
                        <div class="img"><img v-if="x.logo" :src="x.logo" alt="" srcset=""></div>
                        <div class="name_1">{{x.name}}</div>
                    </div>
                </div>
            </div>
            <div class="左键">
                <i @click="服务下一页()" v-if="当前店铺服务类型.length>9" class="mui-icon mui-icon-forward"></i>
            </div>
        </div>

        <div class="环境图片">
            <div class="swiper-container" ref="环境图片轮播">
                <div class="swiper-wrapper">
                    <div class="swiper-slide item" v-for="(x, index) in 环境图片" :key="index">
                        <div @click="设置显示大图([true,index])" class="img"><img :src="x" alt="" srcset=""></div>
                        <!-- <div class="name_1">{{x.name}}</div> -->
                    </div>
                </div>
            </div>
        </div>

        <div class="通用标题">店铺简介</div>
        <div class="简介">
            <div v-if="全部信息.简介 && 全部信息.简介.remark_1" v-html="全部信息.简介.remark_1"></div>
            <loading v-if="!全部信息.简介 || !全部信息.简介.remark_1" :nodata="true" text="这个商家什么也没留下~" />
            <div v-if="!全部信息.简介 || !全部信息.简介.remark_1" style="height:50px;"></div>
        </div>

        <div class="通用标题" v-show="false">本店特色</div>

        <ul class="本店特色" v-show="false">
            <li>
                <div>
                    <img src="image/43.png" alt="" srcset="">
                </div>
                <div>
                        特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特
                </div>
            </li>
            <li>
                <div>
                    <img src="image/43.png" alt="" srcset="">
                </div>
                <div>
                        特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色描述特色
                </div>
            </li>
        </ul>

    </div>
</template>

<script>

import loading from "@/components/loading.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    name:"",
    components:{
        loading
    },
    data() {
        return {
            swiper_type:"",
            环境_swiper:""
        }
    },
    computed: {
        ...mapGetters({
            全部信息:"商家点单/全部信息",
            当前店铺服务类型:"商家点单/当前店铺服务类型",
            环境图片:'商家点单/环境图片',
            新人红包:'商家点单/新人红包',
            
        }),
        服务下一页(){
            this.swiper_type.slideNext();
        }
    },
    methods: {
        ...mapActions({
            设置显示大图:'商家点单/设置显示大图'
        })
    },
    mounted() {
        var this_1=this;
        this.swiper_type = new Swiper(this.$refs.服务轮播, {
            // loop: true,
            // autoplay: true,
            observer: true,
            observeParents: true,
            slidesPerView: 9,
            spaceBetween: 0,
            initialSlide: 1,
            // pagination: {
            //     el: ".swiper-pagination"
            // }
            on: {
                init() {
                    try {
                        setTimeout(() => {
                            this_1.swiper_type.slideTo(0, 0, false); //切换到第一个slide，速度为1秒
                        }, 500);
                    } catch (error) { }
                }
            }
        });

        this.环境_swiper = new Swiper(this.$refs.环境图片轮播,{
            // loop: true,
            // autoplay: true,
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            spaceBetween: 5,
            initialSlide: 1,
            // pagination: {
            //     el: ".swiper-pagination"
            // }
            on: {
                init() {
                    try {
                        setTimeout(() => {
                            this_1.环境_swiper.slideTo(0, 1000, false); //切换到第一个slide，速度为1秒
                        }, 500);
                    } catch (error) { }
                }
            }
        })

    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.店铺信息{
    padding: 5px 24px 0px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    li{
        margin: 15px 0px 0px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .红包好评{
        display: flex;
        align-items: center;
        .红包信息{
            margin: 0px 16px 0px 0px;
        }
        .好评{
            color: $header_background;
            font-size: 12px;
            margin: 0px 16px 0px 0px;
        }
        .人气{
            font-size: 16px;
            color: $header_background;
            height: 16px;
        }
        .人气数量{
            color: $header_background;
            font-size: 12px;
        }
    }
}
.服务类型{
    padding: 0px 30px 0px 14px;
    margin: 13px 0px 0px;
    position: relative;
    .img{
        width: 14px;
        height: 14px;
        margin: 0px auto 3px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .name_1{
        text-align: center;
        color: rgba(56, 56, 56, 1);
        font-size: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .左键{
        font-size: 14px;
        color: #c0bcbc;
        position: absolute;
        top: 0px;
        bottom: 0px;
        right: 9px;
        display: flex;
        align-items: center;
    }
}

.环境图片{
    padding: 17px 11px 0px 11px;
    .item{
        width: 106px;
        height: 79px;
    }
    .img{
        width: 106px;
        height: 79px;
        display: inline-block;
        img{
            width: 100%;
            height: 100%;
        }
    }
}

.通用标题{
    height: 40px;
    line-height: 40px;
    color: rgba(80, 80, 80, 1);
    font-size: 12px;
    padding: 0px 0px 0px 26px;
}
.简介{
    background: #ffffff;
    padding: 10px;
}
.本店特色{
    >li{
        background: #ffffff;
        margin: 0px 0px 3px 0px;
        padding: 7px 10px;
        display: flex;
        >div:nth-child(1){
            width: 106px;
            height: 79px;
            margin: 0px 10px 0px 0px;
            flex-shrink: 0;
            img{
                width: 100%;
                height: 100%;
            }
        }
        >div:nth-child(2){
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
        }
    }
}

</style>
