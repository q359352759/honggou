<template>
    <div class="安卓更新">
        <ul class="下载状态">
            <li>
                {{安卓app更新.下载完成 ? "下载完成" : '下载中，请稍后'}}
            </li>
            <li>
                <div :style="{'width':安卓app更新.下载进度+'%'}" ></div>
            </li>
            <li @click="安装()" :class="{'active':安卓app更新.下载完成}">安装</li>
        </ul>
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
            安卓app更新:"app/安卓app更新/安卓app更新",
        })
    },
    methods: {
        ...mapActions({
            安装:"app/安卓app更新/安装"
        })
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.安卓更新{
    background: rgba(0,0,0,0.4);
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1003;
    .下载状态{
        background: #ffffff;
        width: 230px;
    	height: 113px;
        border-radius: 16px;
        padding: 10px;
        >li:nth-child(1){
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
            text-align: center;
        }
        >li:nth-child(2){
            margin: 10px 0px 14px;
            background-color: rgba(229, 229, 229, 1);
            height: 10px;
            border-radius: 10px;
            position: relative;
            div{
                position: absolute;
                left: 0px;
                top: 0px;
                height: 100%;
                background: $header_background;
                width: 50%;
                border-radius: 10px;
                transition: all 0.3s;
            }
        }
        >li:nth-child(3){
            width: 114px;
        	height: 36px;
            text-align: center;
            margin: 0px auto;
            font-size: 14px;
            border-radius: 36px;
            line-height: 34px;
            color: rgba(166, 166, 166, 1);
            border:1px solid rgba(166, 166, 166, 1);
        }
        >li.active{
            color: rgba(0, 122, 255, 1);
            border: 1px solid rgba(0, 122, 255, 1);
        }
    }
}
</style>
