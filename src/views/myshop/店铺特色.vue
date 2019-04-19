<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">店铺特色</h1>
            <span @click="添加列表()" class="添加特色">添加特色</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="内容区">
                <ul class="特色列表">
                    <li v-for="(item, index) in 店铺特色.list" :key="index">
                        <div class="mui-clearfix">
                            <div class="mui-pull-right 删除">删除</div>
                        </div>
                        <div class="内容">
                            <div>
                                <img v-if="item.image" src="image/43.png" alt="" srcset="">
                                <i v-if="!item.image" class="icon iconfont icon-tupian2"></i>
                                <span>更换图片</span>
                            </div>
                            <div contenteditable="true" v-html="item.html"></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="保存">保存</div>
        </div>
    </div>
</template>

<script>
import { mapGetters , mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            店铺特色:'myshops/店铺特色/店铺特色'
        })
    },
    methods: {
        ...mapActions({
            初始化:'myshops/店铺特色/初始化'
        })
    },
    mounted() {
        this.初始化();  
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.mui-bar{
    .添加特色{
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        position: absolute;
        line-height: 44px;
        top: 0px;
        right: 14px;
    }
}
.mui-content{
    display: flex;
    flex-direction: column;
}
.内容区{
    flex-grow: 1;
    overflow: auto;
}
.特色列表{
    >li{
        padding: 7px 10px;
        background: #ffffff;
        .删除{
            width: 68px;
        	height: 24px;
            text-align: center;
            border: 1px solid rgba(204, 204, 204, 1);
            line-height: 24px;
            border-radius: 24px;
            font-size: 12px;
            color: rgba(166, 166, 166, 1);;
        }
        .内容{
            margin: 7px 0px 0px;
            display: flex;
            >div:nth-child(1){
                flex-shrink: 0;
                width: 109px;
                height: 81px;
                margin: 0px 8px 0px 0px;
                background: rgba(217, 217, 217, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                i{
                    font-size: 34px;
                    color: rgba(162, 162, 162, 1);
                }
                span{
                    position: absolute;
                    width: 100%;
                    height: 25px;
                    left: 0px;
                    bottom: 0px;
                    background: rgba(153, 153, 153, 0.4);
                    line-height: 25px;
                    text-align: center;
                    font-size: 12px;
                    color: #ffffff;
                }
            }
            >div:nth-child(2){
                width: 0;
                flex-grow: 1;
                padding: 7px;
                background: #f6f6f6;
                font-size: 14px;
                color: rgba(80, 80, 80, 1);
                word-wrap:break-word;
                user-select: text;
                -webkit-user-select: text;
            }
        }
    }
}
.保存{
    flex-shrink: 0;
    height: 44px;
    line-height: 44px;
    color: #ffffff;
    background: $header_background;
    text-align: center;
    letter-spacing: 5px;
    padding: 0px 0px 0px 5px;
}






</style>
