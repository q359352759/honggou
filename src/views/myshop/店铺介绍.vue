<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">店铺介绍</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="列表">
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right" @click="$router.push('/introduction')">
                            店铺简介
                        </a>
                    </li>
                    <li class="mui-table-view-cell" @click="$router.push('/myshops/tese')">
                        <a class="mui-navigate-right">
                            店铺特色
                        </a>
                    </li>
                </ul>
            </div>
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

<style lang="scss">
.列表{
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .mui-table-view-cell:after{
        left: 0px;
    }
}
</style>

