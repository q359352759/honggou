<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">奖赏规则</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="内容">
                <li>1、只有“新人专享商品”能发布奖赏。</li>
                <li>2、“首单奖赏”为用户以“专享价”购买“新人专享商品”时的赠与分享者奖励。</li>
                <li class="indent">若用户已经购买过该“新人专享商品”，再次购买该商品时将不能享有新人专享价，只能用“普通价”购买。</li>
                <li class="indent">“普通奖赏”为用户以“普通价”购买“新人专享商品”时的赠与分享者奖励。</li>
                <li class="indent">赏金不能大于售价的50%。</li>
                <li>3、“奖赏”发布后不能删除，也不可将“奖赏”中的商品取消“新人专享”。</li>
                <li class="indent">奖赏到期或奖赏剩余个数为0时才可以取消对应商品的“新人专享”。</li>
                <li class="indent">取消“新人专享”后系统自动删除奖赏商品。删除的奖赏商品可在奖赏历史中查看。</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {

        }
    },
}
</script>

<style lang="scss" scoped>
.内容{
    padding: 16px;
    color: rgba(80, 80, 80, 1);
	font-size: 12px;
    line-height: 150%;
    .indent{
        text-indent: 12px;
    }
}
</style>
