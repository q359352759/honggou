<template>
    <ul class="外层">
        <li :class="{'active':查看类型==0}" @click="设置查看类型(0)">
            <div class="icon_box">
                <i class="icon iconfont icon-shangjin"></i>
            </div>
            <div class="name">赚外快</div>
            <div class="money"></div>
        </li>
        <li :class="{'active':查看类型==1}" @click="设置查看类型(1)">
            <div class="icon_box">
                <i class="icon iconfont icon-jinrudianpu"></i>
            </div>
            <div class="name">店铺分润</div>
            <div class="money">0</div>
        </li>
        <li :class="{'active':查看类型==2}" @click="设置查看类型(2)">
            <div class="icon_box">
                <i class="icon iconfont icon-tuandui"></i>
            </div>
            <div class="name">会员分润</div>
            <div class="money">0</div>
        </li>
        <li :class="{'active':查看类型==3}" @click="设置查看类型(3)">
            <div class="icon_box">
                <i class="icon iconfont icon-zhifubaozhanneidaeshoufukuan"></i>
            </div>
            <div class="name">店铺赏金</div>
            <div class="money">{{奖赏所有数据.奖赏收益.balance}}</div>
        </li>
        <li :class="{'active':查看类型==4}" @click="设置查看类型(4)">
            <div class="icon_box">
                <i class="icon iconfont icon-ketixianjine"></i>
            </div>
            <div class="name">可提现</div>
            <div class="money">{{总可提现}}</div>
        </li>
    </ul>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "",
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            查看类型: "红购使者/红购使者/查看类型",
            代理人信息: "agent/代理人信息",
            代理人分润资产: "agent/ShopBonus/dailiren_fenrun_zichan", //代理人分润资产
            奖赏所有数据:'agent/奖赏/奖赏所有数据'
        }),
        总可提现(){
            var 总可提现=(this.代理人分润资产 && this.代理人分润资产.balance) ? this.代理人分润资产.balance : 0;
                总可提现+=this.奖赏所有数据.奖赏收益.balance
                总可提现=Math.floor(总可提现*10000)/10000
            return 总可提现
        }
    },
    methods: {
        ...mapActions({
            设置查看类型: "红购使者/红购使者/设置查看类型"
        })
    }
    // http://192.168.1.126:10002/api-s/shops/findShopCustomerAll?start=0&length=10&shopid=D5995964EE8D9AA3B630CAE96679253F&order=PAYMENTAMOUNT&orderType=desc
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
// header_background
.外层 {
    background: #ffffff;
    text-align: center;
    padding: 6px 13px 0px;
    margin: 0px 0px 4px 0px;
    display: flex;
    justify-content: space-between;
    li {
        padding: 0px 10px 4px;
    }
    li.active {
        border-bottom: 2px solid $header_background;
    }
    .icon_box {
        width: 38px;
        height: 38px;
        background: $header_background;
        text-align: center;
        line-height: 38px;
        font-size: 24px;
        border-radius: 100%;
        margin: 0px auto;
        color: #ffffff;
    }
    .name {
        color: rgba(128, 128, 128, 1);
        font-size: 10px;
        margin: 3px 0px;
    }
    .money {
        color: $header_background;
        font-size: 10px;
    }
}
</style>
