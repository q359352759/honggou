<template>
    <div>
        <ul class="团队奖励 定位" v-show="是否定位">
            <li class="header_1">
                <div><span>名字</span></div>
                <div><span>等级</span></div>
                <div><span>招商</span></div>
                <div><span>可得差额</span></div>
                <div><span>已得差额</span></div>
                <div><span>间推奖</span></div>
            </li>
        </ul>
        <ul class="团队奖励">
            <li class="header_1">
                <div><span>名字</span></div>
                <div><span>等级</span></div>
                <div><span>招商</span></div>
                <div><span>可得差额</span></div>
                <div><span>已得差额</span></div>
                <div><span>间推奖</span></div>
            </li>
            <li v-for="(item, index) in 招商团队.list" :key="index">
                <div><span>{{item.name}}</span></div>
                <div>
                    <span v-show="item.lelevel==1">实习专员</span>
                    <span v-show="item.lelevel==2">正式专员</span>
                    <span v-show="item.lelevel==3">招商主管</span>
                    <span v-show="item.lelevel==4">招商经理</span>
                </div>
                <div><span>-0</span></div>
                <div><span>{{item.pmaxdividendAll ? item.pmaxdividendAll : 0}}</span></div>
                <div><span>{{item.phavedividendAll ? item.phavedividendAll : 0}}</span></div>
                <div><span>{{item.pindirectjackpotAll ? item.pindirectjackpotAll : 0}}</span></div>
            </li>
        </ul>

        <loading :loadingtype="招商团队.loading" :nodata="!招商团队.loading && 招商团队.total==0" :end="!招商团队.loading && 招商团队.total!=0 && 招商团队.total==招商团队.list.length"/>
    </div>
</template>

<script>
import loading from '@/components/loading.vue';
import { mapGetters } from "vuex";
export default {
    name:"",
    components:{
        loading
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters({
            是否定位:'招商专员/招商管理/是否定位',
            招商团队:'招商专员/招商管理/招商团队',
        }),
    },
    mounted() {
        
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.团队奖励.定位{
    position: fixed;
    top: 44px;
    left: 0px;
    width: 100%;
}
.团队奖励{
    li{
        font-size: 10px;
        color: #000000;
        display: flex;
        min-height: 32px;
        div{
            width: calc(100% / 6);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-left: 1px solid #F6F6F6;
            padding: 3px 0px;
        }
        div:not(.地址){
            span{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        >div:nth-child(1){
            border-left: none;
        }
    }
    .header_1{
        background: $header_background;
        color: #ffffff;
    }
    >li:nth-child(2n){
        // background: #F0F0F0;
        background: #ffffff;
    }
}
</style>
