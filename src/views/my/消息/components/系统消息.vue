<template>
    <div class="mui-clearfix 系统消息">
        <div class="img_box mui-pull-left">
            <img src="image/news_1.png" alt="" srcset="">
            <!-- <span>2</span> -->
        </div>
        <div class="time_1 mui-pull-right">{{item.sendtime | 过滤时间}}</div>
        <div class="title_1">{{msgblob.title}}</div>
        <div class="text_1">{{msgblob.body}}</div>
    </div>
</template>

<script>
import { dateFtt } from "@/assets/js/currency.js";
export default {
    name:"",
    props:{
        item:{
            default:()=>{}
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        msgblob(){
            var obj={};
            try {
                obj=JSON.parse(this.item.msgblob)
            } catch (error) {}
            return obj;
        }
    },
    filters:{
        过滤时间(time){
            return dateFtt(time,' yyyy.MM.dd hh:mm')
        }
    },
    methods: {
        
    },
}
</script>

<style lang="scss" scoped>
.系统消息{
    background: #ffffff;
    border-bottom: 1px solid #f6f6f6;
    padding: 9px 13px 14px;
    .img_box {
        width: 36px;
        height: 36px;
        margin: 0px 8px 0px 0px;
        position: relative;
        img {
            width: 100%;
            height: 100%;
        }
        span {
            position: absolute;
            top: 0px;
            right: 0px;
            min-width: 12px;
            height: 12px;
            border-radius: 12px;
            color: #ffffff;
            text-align: center;
            font-size: 10px;
            line-height: 10px;
            background: rgba(212, 48, 48, 1);
        }
    }
    .time_1 {
        color: rgba(166, 166, 166, 1);
        font-size: 10px;
    }
    .title_1 {
        color: rgba(80, 80, 80, 1);
        font-size: 12px;
        margin: 0px 0px 4px 0px;
    }
    .text_1 {
        color: rgba(166, 166, 166, 1);
        font-size: 10px;
    }
}
</style>
