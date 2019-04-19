<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">配送店铺</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="店铺列表">
                <li v-for="(item, index) in 3" :key="index">
                    <div><img src="image/43.png" alt="" srcset=""></div>
                    <div>
                        <b>MC火锅店MC火锅店MC火锅店MC火锅店MC火锅店</b>
                        <div>邀请你成为他的配送员</div>
                    </div>
                    <div>
                        <div>拒绝</div>
                        <div>接受</div>
                    </div>
                </li>
            </ul>
            <ul class="分割线">
                <li></li>
                <li>配送店铺</li>
                <li></li>
            </ul>

            <ul class="店铺列表">
                <li v-for="(item, index) in 3" :key="index">
                    <div><img src="image/43.png" alt="" srcset=""></div>
                    <div>
                        <b>MC火锅店</b>
                        <div>
                            <span>已配送：666单</span>
                            <span>2019.03.06</span>
                        </div>
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
.店铺列表{
    >li{
        padding: 6px 14px;
        display: flex;
        background: #ffffff;
        margin: 0px 0px 1px 0px;
        >div:nth-child(1){
            width: 64px;
            height: 48px;
            margin: 0px 7px 0px 0px;
            flex-shrink: 0;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        >div:nth-child(2){
            width: 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            >*{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            >div{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
        >div:nth-child(3){
            flex-shrink: 0;
            display: flex;
            align-items: center;
            div{
                width: 50px;
                height: 20px;
                margin: 0px 0px 0px 16px;
                border-radius: 20px;
                text-align: center;
                line-height: 18px;
                font-size: 12px;
            }
            >div:nth-child(1){
                color: rgba(166, 166, 166, 1);
                border: 1px solid rgba(166, 166, 166, 1);
            }
            >div:nth-child(2){
                color: rgba(0, 122, 255, 1);
                border: 1px solid rgba(0, 122, 255, 1);
            }
        }
    }
}
.分割线{
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(128, 128, 128, 1);
    font-size: 14px;
    >li:nth-child(2){
        margin: 0px 18px;
    }
    >li:nth-child(1),
    >li:nth-child(3){
        width: 60px;
    	height: 1px;
        background-color: rgba(229, 229, 229, 1);
    }
}
</style>
