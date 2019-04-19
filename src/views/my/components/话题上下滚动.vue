<template>
    <ul class="话题">
        <li>
            <i class="icon iconfont icon-wujiaoxing1"></i>
        </li>
        <li>
            <div class="swiper-container" ref="上下滚动">
                <div class="swiper-wrapper">
                    <div class="swiper-slide"><div>滚动话题、上下滚动.，滚动话题、上下滚动1.，滚动话题、上下滚动2，滚动话题、上下滚动2，滚动话题、上下滚动2</div></div>
                    <div class="swiper-slide"><div>滚动话题、上下滚动.，滚动话题、上下滚动1.，滚动话题、上下滚动2，滚动话题、上下滚动2，滚动话题、上下滚动2</div></div>
                    <div class="swiper-slide"><div>滚动话题、上下滚动.，滚动话题、上下滚动1.，滚动话题、上下滚动2，滚动话题、上下滚动2，滚动话题、上下滚动2</div></div>
                    <div class="swiper-slide"><div>滚动话题、上下滚动.，滚动话题、上下滚动2.</div></div>
                </div>
                <!-- Add Pagination -->
                <!-- <div class="swiper-pagination"></div> -->
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    mame:"",
    data() {
        return {
            
        }
    },
    mounted() {
        var swiper = new Swiper(this.$refs.上下滚动, {
            direction: 'vertical',
            speed:2000,
            loop : true,
            autoplay:{
                delay: 3000,
                // stopOnLastSlide: true,
                // disableOnInteraction: false,
            },
        });
        // var swiper = new Swiper('.swiper-container', {
        //         direction: 'vertical',
        //         pagination: {
        //             // el: '.swiper-pagination',
        //             clickable: true,
        //         },
        //     });
    },
}
</script>

<style lang="scss" scoped>

@import "@/assets/css/config.scss";
// header_background
.话题{
    height: 44px;
    margin: 3px 0px 0px;
    display: flex;
    align-items: center;
    background: #ffffff;
    >li:nth-child(1){
        width: 58px;
        text-align: center;
        flex-shrink: 0;
        i{
            font-size: 26px;
            line-height: 26px;
            height: 26px;
            color: $header_background;
        }
    }
    >li:nth-child(2){
        color: rgba(80, 80, 80, 1);
        font-size: 12px;
        flex-grow: 1;
        padding: 0px 15px 0px 0px;
        height: 100%;
        .swiper-container{
            height: 100%;
        }
    }
    .swiper-slide{
        display: flex;
        align-items: center;
        >div{
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
