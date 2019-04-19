<template>
    <ul class="预定备注">
        <li v-show="预定订单 && 预定订单.remark">
            <div>备注：</div>
            <div v-html="预定订单.remark"></div>
        </li>
        <li v-show="预定订单 && 预定订单.reply">
            <div>商家回复：</div>
            <div v-html="预定订单.reply"></div>
        </li>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name:"",
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters({
            预定订单:'orders/order/预定订单'
        })
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.预定备注{
    background: #ffffff;
    margin: 1px 0px 0px 0px;
    padding: 0px 15px;
    font-size: 12px;
    >li{
        display: flex;
        >div:nth-child(1){
            white-space: nowrap;
            flex-shrink: 0;
        }
    }
    >li:nth-child(1){
        padding: 13px 0px;
        border-bottom: 1px solid #f6f6f6;
        color: $header_background;
    }
    >li:nth-child(2){
        color: rgba(128, 128, 128, 1);
        padding: 13px 20px;
    }
}
</style>
