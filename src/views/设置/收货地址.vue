<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">快递收货地址</h1>
            <span @click="$router.push('/shezhi/tjdz')">添加地址</span>
        </header>
        <div class="mui-content mui-fullscreen">

            <ul class="地址列表" v-for="(item, index) in 3" >
                <li :key="index">
                    <div>
                        <span>测试专用</span>
                        <span>1800000000</span>
                    </div>
                    <div>
                        <div>默认</div>
                        <div>四川省成都市武侯区xxxxxx小区xxxxxx号四川省成都市武侯区xxxxxx小区xxxxxx号</div>
                    </div>
                </li>
                <li>
                    <div>编辑</div>
                </li>
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
.mui-bar{
    span{
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        position: absolute;
        line-height: 44px;
        top: 0px;
        right: 16px;
    }
}
.地址列表{
    background: #ffffff;
    margin: 3px 0px 0px 0px;
    padding: 7px 0px 7px 15px;
    height: 58px;
    display: flex;
    >li:nth-child(1){
        flex-grow: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        >div:nth-child(1){
            >span:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
                font-weight: bold;
                margin: 0px 3px 0px 0px;
            }
            >span:nth-child(2){
                color: rgba(128, 128, 128, 1);
            	font-size: 12px;
            }
        }
        >div:nth-child(2){
            display: flex;
            align-items: center;
            >div:nth-child(1){
                flex-shrink: 0;
                width: 29px;
            	height: 14px;
                background: rgba(217, 57, 59, 1);
                margin: 0px 3px 0px 0px;
                font-size: 10px;
                border-radius: 2px;
                line-height: 14px;
                color: #ffffff; 
                text-align: center;
            }
            >div:nth-child(2){
                width: 0;
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
            }
        }
    }
    >li:nth-child(2){
        width: 62px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        border-left: 1px solid rgba(229, 229, 229, 1);
    }
}
</style>
