<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">配送员管理</h1>
            <span @click="$router.push('/myshop/ps/tjpsy')">添加</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="店员列表">
                <li v-for="(item, index) in 2" :key="index">
                    <div>
                        <img src="image/10.png" alt="" srcset="">
                    </div>
                    <div>
                        <span>张三</span>
                        <span>18227754002</span>
                    </div>
                    <div>
                        <span v-show="item==1" class="待确认">待确认</span>
                        <span v-show="item!=1" class="时间">2018.10.12</span>
                    </div>
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
@import '@/assets/css/config.scss';
// header_background
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

.店员列表{
    background: #ffffff;
    margin: 3px 0px 0px 0px;
    >li{
        padding: 6px 10px;
        height: 62px;
        display: flex;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            width: 50px;
        	height: 50px;
            margin: 0px 8px 0px 0px;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 100%;
            }
        }
        >div:nth-child(2){
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        >div:nth-child(3){
            min-width: 61px;
            white-space: nowrap;
            flex-shrink: 0;
            font-size: 12px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            .待确认{
                color: $header_background;
            } 
            .时间{
                color: rgba(80, 80, 80, 1);
            }
        }
    }
}
</style>
