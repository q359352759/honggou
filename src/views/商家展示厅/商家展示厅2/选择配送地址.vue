<template>
    <div>
        <div class="配送地址" >
            <div class="未选择地址" @click="显示选择地区=true">
                <i class="icon iconfont icon-weizhi"></i>
                <div>选择配送地址</div>
            </div>
        </div>

        <div class="选择地址" :class="{'隐藏':!显示选择地区}">
            <div class="选择区">
                <div class="取消" @click="显示选择地区=false">取消</div>
                <div class="标题">选择收货地址</div>
                <ul class="地址列表">
                    <li class="地址 可选地址" v-for="(item, index) in 3" >
                        <div>xxxxxx小区xxxxxx号</div>
                        <div><span>孟先生</span><span>18227754002</span></div>
                    </li>
                    <li class="分割线">超配送范围地址：</li>
                    <li class="地址 超范围地址" v-for="(item, index) in 2" >
                        <div>xxxxxx小区xxxxxx号</div>
                        <div><span>孟先生</span><span>18227754002</span></div>
                    </li>
                </ul>
                <div class="添加">
                    <i class="icon iconfont icon-jia-tianchong"></i>
                    <div>新增收货地址</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            显示选择地区:false
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background

.配送地址{
    height: 70px;
    margin: 3px 0px 0px 0px;
    background: #ffffff;
    .未选择地址{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        i{
            font-size: 24px;
            line-height: 24px;
            height: 24px;
            color: $header_background;
            margin: 0px 3px 0px 0px;
        }
        div{
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
    }
}

.选择地址.隐藏{
    opacity: 0;
    top: 100%;
}
.选择地址{
    transition: all 0.5s;
    opacity: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 1;
    .选择区{
        position: absolute;
        width: 100%;
        height: 55%;
        background: #ffffff;
        left:0px;
        bottom: 0px;
        display: flex;
        flex-direction: column;
    }
    .取消{
        position: absolute;
        height: 36px;
        line-height: 36px;
        top: 0px;
        left: 21px;
        color: rgba(166, 166, 166, 1);
    	font-size: 12px;
    }
    .标题{
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-bottom: 1px solid #f6f6f6;
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        flex-shrink: 0;
    }
    .地址列表{
        flex-grow: 1;
        overflow: auto;
        padding: 0px 0px 0px 38px;
        >li:last-child{
            border-bottom: none;
        }
        .地址{
            border-bottom: 1px solid #f6f6f6;
            height: 65px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            >div:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
                font-weight: bold;
            }
            >div:nth-child(2){
                span{
                    margin: 0px 20px 0px 0px;
                }
                color: rgba(128, 128, 128, 1);
            	font-size: 12px;
            }
        }
        .分割线{
            height: 26px;
            line-height: 26px;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
        }
    }
    .添加{
        flex-shrink: 0;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #f6f6f6;
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        i{
            color: $header_background;
            font-size: 20px;
            line-height: 20px;
            height: 20px;
            margin: 0px 6px 0px 0px;
        }
    }
}

</style>
