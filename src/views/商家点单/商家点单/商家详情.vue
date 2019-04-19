<template>
    <div>
        <ul class="商家详情">
            <li class="商家图片" @click="设置显示大图([true,0])">
                <img :src="全部信息.店铺信息.signboard" alt="" srcset="">
                <span class="数量">{{环境图片.length}}</span>
            </li>
            <li class="右侧详情">
                <div class="地址">
                    <div class="详细地址">{{全部信息.店铺信息.address}}</div>
                    <div class="距离">{{全部信息.店铺距离}}</div>
                    <i @click="跳转地图()" class="icon iconfont icon-daohang"></i>
                </div>
                <div class="营业时间">
                    <span>营业时间：{{全部信息.店铺信息.openTime}}--{{全部信息.店铺信息.closeTime}}</span>
                    <span>（{{全部信息.店铺评分.scoreAvg ? Math.floor(全部信息.店铺评分.scoreAvg*10)/10 : 5 }}分）</span>
                    <a :href="'tel:'+全部信息.店铺信息.phone">
                        <i class="icon iconfont icon-dianhua"></i>
                    </a>
                </div>
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
                        <i @click="服务下一页()" v-if="当前店铺服务类型.length>6" class="mui-icon mui-icon-forward"></i>
                    </div>

                </div>
            </li>
        </ul>
    </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            swiper_type:'',
        }
    },
    computed: {
        ...mapGetters({
            当前店铺服务类型:"商家点单/当前店铺服务类型",
            环境图片:'商家点单/环境图片',
            全部信息:"商家点单/全部信息"
        }),
    },
    methods: {
        ...mapActions({
            跳转地图:"商家点单/跳转地图",
            设置显示大图:'商家点单/设置显示大图'
        }),
        服务下一页(){
            this.swiper_type.slideNext();
        }
    },
    mounted() {
        var this_1=this;
        this.swiper_type = new Swiper(this.$refs.服务轮播, {
            // loop: true,
            // autoplay: true,
            observer: true,
            observeParents: true,
            slidesPerView: 6,
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
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.商家详情{
    background: #ffffff;
    position: relative;
    z-index: 2;
    padding: 15px 10px;
    display: flex;
    .商家图片{
        width: 105px;
    	height: 79px;
        position: relative;
        margin: 0px 13px 0px 0px;
        >img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .数量{
            position: absolute;
            right: 0px;
            bottom: 0px;
            min-width: 20px;
        	height: 20px;
            background: rgba(0,0,0,0.6);
            border-radius: 5px;
        	font-size: 10px;
            color: #ffffff;
            text-align: center;
            line-height: 20px;
        }
    }
    .右侧详情{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        width: 0;
        .地址{
            display: flex;
            align-items: center;
            .详细地址{
                color: rgba(56, 56, 56, 1);
            	font-size: 12px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .距离{
                flex-shrink: 0;
                white-space: nowrap;
                color: $header_background;
                font-size: 12px;
                margin: 0px 5px;
            }
            i{
                flex-shrink: 0;
                white-space: nowrap;
                font-size: 16px;
                height: 16px;
                color: $header_background;
            }
        }
        .营业时间{
            display: flex;
            align-items: center;
            >span:nth-child(1){
                color: rgba(56, 56, 56, 1);
                font-size: 12px;
                margin: 0px 5px 0px 0px;
            }
            >span:nth-child(2){
                font-size: 12px;
                color: $header_background;
            }
            i{
                font-size: 16px;
                color: $header_background;
                height: 16px;
            }
        }
        .服务类型{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div:nth-child(1){
                flex-grow: 1;
            }
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
            }
        }
    }
}
</style>

