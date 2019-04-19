<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>            
            <h1 class="mui-title">主键设置</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            
            <ul class="排序示例图">
                <li class="left_1">
                    <div class="圆圈">
                        <div class="中心点">
                            <img src="image/12121.png" alt="" srcset="">
                        </div>
                        <div class="item" :class="'item_'+index" v-if="index<8" v-for="(item, index) in myArray" :key="index">
                            <div class="数字" :class="{'红色背景':index<=4,'灰色背景':index>4}">{{index+1}}</div>
                            <div class="名称">{{item.name}}</div>
                        </div>
                    </div>
                    <ul class="说明">
                        <li>
                            <div class="方形 红色背景"></div>
                            <div>默认显示</div>
                        </li>
                        <li>
                           <div class="方形 灰色背景"></div> 
                           <div>旋转显示</div>
                        </li>
                    </ul>
                </li>
                <li class="right_1" >
                    <div class="标题">上下拖动排序</div>
                    <ul class="拖动排序">
                        <li class="拖动框">
                            <draggable v-model="myArray" :options="{group:'people'}">
                                <div class="item" v-for="item in myArray" :key="item.id">{{item.name}}</div>
                            </draggable>
                        </li>
                        <li class="标签框">
                            <div class="item" v-for="(item, index) in 8" :key="index">
                                <span>-</span>
                                <span :class="{'红色字体':item<7}">{{item}}</span>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>

            <ul class="功能说明">
                <li>更多功能说明</li>
                <li>
                    <div>双击：消息</div>
                    <div>三击：设置</div>
                    <div>长按：搜索</div>
                </li>
            </ul>

            <div class="按钮框">
                <btn @click.native="保存()" value="保存"/>
            </div>

        </div>
    </div>
</template>

<script>
import { mapGetters , mapMutations } from "vuex";
import btn from '@/components/button.vue'
import draggable from 'vuedraggable'
export default {
    name:"",
    components:{
        draggable,
        btn
    },
    data() {
        return {
            myArray:[
                {name:'主页','id':1},
                {name:'我的',id:2},
                {name:'消息',id:3},
                {name:'代理',id:4},
                {name:'店铺',id:5},
                {name:'订单',id:6},
                {name:'分类',id:7},
                {name:'收藏',id:8},
                {name:'资产',id:9},
                {name:'足迹',id:10},
            ]
        }
    },
    computed: {
        ...mapGetters({
            主键按钮:'主键设置/主键按钮'
        })
    },
    methods: {
        ...mapMutations({
            保存主键按钮:'主键设置/保存主键按钮'
        }),
        滑动中(){
            mui.toast("拖动成功", { duration: "long", type: "div" });
        },
        保存(){
            this.保存主键按钮(this.myArray);
            mui.toast("保存成功", { duration: "long", type: "div" });
            history.back();
        }
    },
    mounted() {
        this.myArray=this.主键按钮
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.排序示例图{
    display: flex;
    height: 360px;
    background: #ffffff;
    .left_1{
        // width: ;
        flex-grow: 1;
        // border-right: 1px solid #cccccc;
        .圆圈{
            height: 208px;
            width: 208px;
            // border: 1px solid #cccccc;
            border-radius: 100%;
            margin: 65px auto 0px;
            position: relative;
            .中心点{
                position: absolute;
                width: 52px;
                height: 52px;
                top: 0px;
                left: 0px;
                bottom: 0px;
                right: 0px;
                margin: auto;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 100%;
                }
            }
            .item{
                position: absolute;
                width: 36px;
                height: 36px;
                .数字{
                    width: 36px;
                	height: 36px;
                    text-align: center;
                    border-radius: 36px;
                    line-height: 36px;
                    color:#ffffff;
                    font-size: 14px;
                }
                .红色背景{
                    background: $header_background;
                }
                .灰色背景{
                    background: rgba(166, 166, 166, 1);
                }
                .名称{
                    color: rgba(80, 80, 80, 1);
                	font-size: 10px;
                    text-align: center;
                }
            }
            .item_0{
                top: 0px;
                left: 0px;
                right: 0px;
                margin: auto;
            }
            //宽度 100vw - 100px 
            .item_1{
                top: calc(100% / 4 - 27px);
                left: calc(100% / 4 - 27px);
            }
            .item_2{
                top:calc(100% / 2 - 18px);
                left: 0px;
            }
            .item_3{
                bottom: calc(100% / 4 - 27px);
                left: calc(100% / 4 - 27px);
            }
            .item_4{
                bottom: 0px;
                left: calc(100% / 2 - 18px);
            }
            .item_5{
                right: calc(100% / 4 - 27px);
                bottom: calc(100% / 4 - 27px);
            }
            .item_6{
                right: 0px;
                top: calc(100% / 2 - 18px);
            }
            .item_7{
                right: calc(100% / 4 - 27px);
                top: calc(100% / 4 - 27px);
            }
        }
        // .圆圈::after{
        //     width: calc(100% - 60px);
        //     height: calc(100% - 60px);
        //     top: 0px;
        //     left: 0px;
        //     right: 0px;
        //     bottom: 0px;
        //     margin: auto;
        //     position: absolute;
        //     content: "";
        //     border: 1px solid #000000;
        // }
        .说明{
            display: flex;
            justify-content: space-around;
            margin: 48px 0px 0px;
            >li{
                display: flex;
                align-items: center;
                color: rgba(80, 80, 80, 1);
            	font-size: 12px;
            }
            .方形{
                width: 12px;
            	height: 12px;
                margin: 0px 8px 0px 0px;
            }
            .红色背景{
                background: $header_background;
            }
            .灰色背景{
                background: rgba(166, 166, 166, 1);
            }
        }
    }
    .right_1{
        width: 100px;
        .标题{
            padding: 18px 0px 10px;
            color: rgba(80, 80, 80, 1);
        	font-size: 10px;
        }
        .拖动排序{
            display: flex;
            .拖动框{
                width: 60px;
                .item{
                    height: 25px;
                    line-height: 25px;
                    text-align: center;
                    font-size: 12px;
                    color: #ffffff;
                    background: $header_background;
                    text-align: center;
                    margin: 0px 0px 2px 0px;
                }
            }
            .标签框{
                padding: 0px 0px 0px 2px;
                .item{
                    height: 25px;
                    line-height: 25px;
                    margin: 0px 0px 2px 0px;
                    font-size: 12px;
                }
                .红色字体{
                    color: $header_background;
                }
            }
        }

    }
}

.功能说明{
    background: #ffffff;
    margin: 4px 0px 0px 0px;
    padding: 13px 32px 15px;
    >li:nth-child(1){
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        font-weight: bold;
        margin: 0px 0px 18px;
        text-align: center;
    }
    >li:nth-child(2){
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        display: flex;
        justify-content: space-between;
    }
}
.按钮框{
    margin: 50px auto;
}
</style>
