<template>
    <div>
        <ul class="列表">
            <li class="header">
                <div><div>商家</div></div>
                <div><div>商品</div></div>
                <div><div>剩余</div></div>
                <div><div>结束时间</div></div>
                <div><div>赏金</div></div>
                <div><div>操作</div></div>
            </li>
        </ul>
        <ul class="列表">
            <!-- <li>
                <div><div>商家</div></div>
                <div><div>时间</div></div>
                <div><div>消费额</div></div>
                <div><div>推广</div></div>
            </li> -->
        </ul>
        <loading :nodata="true"/>
        <ul class="底部">
            <li>获得奖赏：0元</li>
            <li>
                <span @click="$router.push('/shizhe/xxjj?userid='+userInfo.username)">奖赏记录</span>
            </li>
        </ul>
    </div>
</template>

<script>

import loading from "@/components/loading.vue";
import { mapGetters } from 'vuex';
export default {
    name:"",
    data() {
        return {
            
        }
    },
    components:{
        loading
    },
    computed: {
        ...mapGetters({
            userInfo:'红购使者/红购使者/用户信息'
        })
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.列表 {
    li {
        display: flex;
        min-height: 34px;
        text-align: center;
        font-size: 12px;
        > div {
            border-left: 1px solid #f6f6f6;
            width: calc(100% / 6);
            display: flex;
            flex-direction: column;
            justify-content: center;
            > div {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        > div:nth-child(1) {
            border-left: none;
        }
    }
    li:nth-child(2n-1) {
        background: #ffffff;
    }
    li.header {
        background: $header_background;
        color: #ffffff;
    }
    .蓝色字体 {
        color: #017aff;
    }
}
.底部 {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 32px;
    background-color: $header_background;
    color: rgba(255, 255, 255, 1);
    font-size: 11px;
    line-height: 32px;
    text-align: center;
    display: flex;
    > li {
        width: 50%;
    }
}
</style>
