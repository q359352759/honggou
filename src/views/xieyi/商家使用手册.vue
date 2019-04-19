<template>
    <div class="使用手册">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">商家使用手册</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="图片容器">
                <img src="image/pdf.png" />
            </div>
            <ul class="下载进度" >
                <li v-show="下载中">23M</li>
                <li v-show="下载中">
                    <p class="mui-progressbar 进度条" data-progress="20">
                        <span :style="{'transform':'translate3d('+(进度-100)+'%, 0px, 0px)'}"></span>
                    </p>
                </li>
                <li v-show="下载中">
                    {{进度}}%
                </li>
            </ul>

            <div class="按钮">
                <a v-if="ApplicationType!='app'" @click="点击下载()" href="http://m.lxad.vip/test/shangjiashouce1.pdf">
                    <btn value="下载"/>
                </a>
                <btn v-if="ApplicationType=='app'" @click="第三方下载()" value="下载"/>
            </div>

            <div class="遮罩提示" v-show="显示遮罩" @click="显示遮罩=false">
                <p>
                    <img src="image/live_weixin.png" alt="" srcset="">
                </p>
            </div>

        </div>
    </div>
</template>

<script>
import btn from '@/components/button.vue'
export default {
    name:"",
    components:{
        btn
    },
    data() {
        return {
            ApplicationType:ApplicationType,
            显示遮罩:false,
            下载中:false,
            进度:10
        }
    },
    mounted() {
        
    },
    methods: {
        点击下载(){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                setTimeout(x=>{
                    this.显示遮罩=true;
                },3000)
            }
        },
        第三方下载(){
            var url = "http://m.lxad.vip/test/shangjiashouce1.pdf";
        	plus.runtime.openURL(url);
        }
    },
    watch: {
        
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.图片容器{
    margin: 50px auto 7px;
    width: 122px;
    height: 174px;
    img{
        width: 100%;
        height: 100%;
    }
}
.下载进度{
    min-height: 44px;
    width: 188px;
    margin: 0px auto;
    color: rgba(80, 80, 80, 1);
    font-size: 12px;
    text-align: center;
    .进度条{
        height: 6px;
        margin: 5px auto;
        span{
            background: $header_background;
        }
    }
}
.按钮{
    margin: 17px 0px;
}

.遮罩提示{
    position: fixed;
    z-index: 1002;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    text-align: center;
    padding: 10% 5% 0px;
    img{
        width: 100%;
    }
}

</style>
