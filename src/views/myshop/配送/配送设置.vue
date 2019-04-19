<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">配送设置</h1>
            <span @click="$router.push('/myshop/ps/psygl')">配送员</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="开启设置">
                <div>店铺配送：</div>
                <i @click="配送.isopen=1" class="icon iconfont" :class="{'icon-xuanze2':配送.isopen==1,'icon-choose':配送.isopen==0}"></i>
                <div @click="配送.isopen=1">开启</div>
                <i @click="配送.isopen=0" class="icon iconfont" :class="{'icon-xuanze2':配送.isopen==0,'icon-choose':配送.isopen==1}"></i>
                <div @click="配送.isopen=0">关闭</div>
            </div>

            <form @submit.prevent="提交()">
                <div class="配送选项">
                    <ul>
                        <li>
                            <div class="标题">单次消费满：</div>
                            <input type="number" min="0.1" step="0.1" :required="配送.isopen==1">
                            <div>元起送</div>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <div class="标题">免费配送距离：</div>
                            <input v-model="配送距离" type="number" min="0.1" step="0.1" :required="配送.isopen==1">
                            <div>公里</div>
                        </li>
                        <li>
                            <div class="标题">每增加1公里：</div>
                            <input type="number" min="0.1" step="0.1" :required="配送.isopen==1">
                            <div>元</div>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <div class="标题">最大配送距离：</div>
                            <input type="number" :min="配送距离" step="0.1" :required="配送.isopen==1">
                            <div>公里</div>
                        </li>
                    </ul>
                </div>
                <btn type="submit" :styles="{'margin':'50px 0px 0px','width':'115px'}"/>
            </form>

        </div>
    </div>
</template>

<script>
import btn from '@/components/button.vue';
export default {
    name:"",
    components:{
        btn
    },
    data() {
        return {
            配送:{
                id:"",
                isopen:1,       //是否开启
                reservationtype:0,     //订金方式 0 免佣金 1 固定金额 2 比例
                deposit:"",         //订金
                createtime:"",
            },
            配送距离:""
        }
    },
    methods: {
        提交(){
            console.log('可以提交')
        }
    },
}
</script>

<style lang="scss" scoped>
.mui-bar{
    span{
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        line-height: 44px;
        position: absolute;
        top: 0px;
        right: 13px;
    }
}
.开启设置{
    height: 44px;
    padding: 0px 23px;
    display: flex;
    align-items: center;
    color: rgba(80, 80, 80, 1);
	font-size: 14px;
    background: #ffffff;
    i{
        font-size: 16px;
        line-height: 16px;
        height: 16px;
        margin: 0px 6px 0px 20px;
    }
    .icon-xuanze2{
        color: rgba(60, 174, 236, 1);
    }
}
.配送选项{
    ul{
        background: #ffffff;
        margin: 3px 0px 0px;
    }
    li{
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        height: 44px;
        padding: 0px 23px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f6f6f6;
    }
    .标题{
        min-width: 98px;
        white-space: nowrap;
    }
    input{
        width: 100px;
    	height: 31px;
        padding: 0px;
        margin: 0px;
        text-align: center;
        color: inherit;
        font-size: inherit;
        background-color: rgba(246, 246, 246, 1);
        margin: 0px 14px 0px 0px;
        border: none;
    }
}
</style>
