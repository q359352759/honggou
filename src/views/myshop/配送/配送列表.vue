<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">配送</h1>
            <span @click="$router.push('/myshop/ps/pssz')">配送设置</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="导航">
                <li @click="查看类型=0" :class="{'active':查看类型==0}">
                    <div>
                        待揽件
                        <span>10</span>
                    </div>
                </li>
                <li @click="查看类型=1" :class="{'active':查看类型==1}">
                    <div>
                        待送达
                        <span>101</span>
                    </div>
                </li>
                <li @click="查看类型=2" :class="{'active':查看类型==2}">
                    <div>
                        已完成
                        <span>10</span>
                    </div>
                </li>
            </ul>

            <div class="内容区">
                <ul class="预定列表" v-for="(item, index) in 3" :key="index">
                    <li class="头部">
                        <div>
                            <div class="顾客">顾客：MCc</div>
                            <div>电话：18227754002</div>
                            <i class="icon iconfont icon-dianhua"></i>
                        </div>
                        <div>
                            <div class="下单时间">2019.03.29 13:21</div>
                            <div class="地址" v-show="item==1">地址：武青嘉苑9栋305武青嘉苑9栋305武青嘉苑9栋305（500米）</div>
                            <div class="地址" v-show="item==2">地址：武青嘉苑9栋305武（500米）</div>
                            <i class="icon iconfont icon-daohang"></i>
                        </div>                        
                    </li>
                    <li class="商品列表" v-for="(item, index) in 2" :key="index">
                        <div>
                            <img src="image/7.jpg" alt="" srcset="">
                        </div>
                        <div>
                            <div>毛肚</div>
                            <div>￥18</div>
                        </div>
                        <div>
                            <div>x1</div>
                            <div>
                                <img src="image/xingren1.png" alt="" srcset="">
                            </div>
                        </div>
                    </li>
                    <li class="合计">
                        <div>
                            <div v-show="item==1" class="备注">备注：多放辣椒。</div>
                            <div v-show="item==2" class="备注">备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。备注：多放辣椒。</div>
                            <div class="总数">合计：3件商品，94元</div>
                        </div>
                        <div>
                            <div v-show="item==1" class="待揽件">待揽件</div>

                            <div v-show="item==2" class="已揽件">已揽件</div>
                            <div v-show="item==2" class="已揽件">2019.03.30 12:30</div>
                            
                            <div v-show="item==3" class="已送达">已送达</div>
                            <div v-show="item==3" class="已送达">2019.03.30 12:30</div>
                        </div>
                    </li>
                    <li class="配送员">
                        配送员：张三（18227754002）
                    </li>
                </ul>
            </div>
        </div>

        <ul class="未开启提示" v-show="显示未开启提示">
            <li>提示：您还未开启配送功能</li>
            <li @click="$router.push('/myshop/ps/pssz')">开启</li>
        </ul>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            显示未开启提示:false,
            查看类型:0
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

.mui-content{
    display: flex;
    flex-direction: column;
}
.未开启提示{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    text-align: center;
    padding: 80px 0px 0px;
    >li:nth-child(1){
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
    }
    >li:nth-child(2){
        width: 51px;
    	height: 24px;
        margin: 38px auto 0px;
        border-radius: 24px;
        line-height: 22px;
        font-size: 14px;
        border: 1px solid rgba(0, 122, 255, 1);
        color: rgba(0, 122, 255, 1);
    }
}
.导航{
    flex-shrink: 0;
    display: flex;
    height: 44px;
    justify-content: space-around;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    background: #ffffff;
    text-align: center;
    li{
        width: 60px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        div{
            position: relative;
        }
        span{
            position: absolute;
            top: -5px;
            left:90%;
            min-width: 16px;
        	height: 16px;
            line-height: 16px;
            border-radius: 16px;
            color: #ffffff;
            background: $header_background;
            font-size: 10px;
            padding: 0px 2px;
        }
    }
    .active{
        box-shadow: inset 0px -2px 0px 0px $header_background;
    }
}
.内容区{
    flex-grow: 1;
    overflow: auto;
}

.预定列表{
    background: #ffffff;
    margin: 3px 0px 0px 0px;
    .头部{
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        padding: 7px 10px;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            height: 34px;
            display: flex;
            align-items: center;
            .顾客{
                flex-grow: 1;
            }
            i{
                color: $header_background;
                font-size: 20px;
                height: 20px;
                line-height: 20px;
                margin: 0px 0px 0px 4px;
            }
        }
        >div:nth-child(2){
            min-height: 34px;
            display: flex;
            align-items: center;
            .下单时间{
                flex-shrink: 0;
                white-space: nowrap;
                margin: 0px 30px 0px 0px;
                flex-grow: 1;
            }
            i{
                color: $header_background;
                font-size: 20px;
                height: 20px;
                line-height: 20px;
                margin: 0px 0px 0px 4px;
            }
        }
    }   
    .商品列表{
        padding: 8px 10px;
        display: flex;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            width: 50px;
            height: 38px;
            flex-shrink: 0;
            margin: 0px 12px 0px 0px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        >div:nth-child(2){
            flex-grow: 1;
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        >div:nth-child(3){
            text-align: center;
            >div:nth-child(1){
                color: rgba(166, 166, 166, 1);
            	font-size: 14px;
            }
            >div:nth-child(2){
                width: 21px;
                height: 21px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .合计{
        padding: 15px 10px;
        color: rgba(80, 80, 80, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(2){
            font-size: 12px;
            text-align: center;
            min-width: 94px;
            white-space: nowrap;
        }
        .备注{
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            margin: 0px 0px 10px 0px;
        }
        .总数{
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        .待揽件{
            color: $header_background;
        }
        .已揽件{
            color: rgba(253, 186, 44, 1);
        }
        .已送达{
            color: rgba(24, 169, 104, 1);
        }
    }
    .配送员{
        height: 36px;
        padding: 0px 10px;
        font-size: 14px;
        color: rgba(80, 80, 80, 1);
        line-height: 36px;
    }
}



</style>
