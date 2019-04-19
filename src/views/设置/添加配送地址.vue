<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">添加地址1</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <form @submit.prevent="提交()">
                <div class="列表">
                    <ul class="mui-table-view">
                        <li class="mui-table-view-cell" @click="$router.push('/shezhi/psdzdt')">
                            <a class="mui-navigate-right item" >
                                <div class="标题">收货地址：</div>
                                <div class="地区" :class="{'active':!地区名字}">
                                    请选择收货地址
                                </div>
                            </a>
                        </li>
                        <li class="mui-table-view-cell item">
                            <div class="标题">门牌号：</div>
                            <input type="text" required maxlength="6" pattern="^[\s\S]*.*[^\s][\s\S]*$" placeholder="详细地址，列：9号楼3层305室">
                        </li>
                        <li class="mui-table-view-cell item">
                            <div class="标题">联系人：</div>
                            <input type="text" required maxlength="6" pattern="^[\s\S]*.*[^\s][\s\S]*$" placeholder="请填写收货人姓名">
                        </li>
                        <li class="mui-table-view-cell item">
                            <div class="标题"></div>
                            <div class="性别">
                                <i class="icon iconfont icon-xuanze2"></i>
                                <span>先生</span>
                                <i class="icon iconfont icon-choose"></i>
                                <span>女士</span>
                            </div>
                        </li>
                        <li class="mui-table-view-cell item">
                            <div class="标题">手机号码：</div>
                            <input type="text" required pattern="^1[34578]\d{9}$" placeholder="请输入收货人手机号">
                        </li>
                    </ul>
                </div>
                <btn type="submit" :style="{'margin':'30px auto'}" value="保存"/>
            </form>
        </div>
    </div>
</template>

<script>
import { convert  , get_url } from "@/assets/js/currency.js";
import btn from '@/components/button.vue'

import { mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            是否默认:false,
            Picker3:"",
            地区三级列表:[],
            正在初始化:true,
            地区id:''
        }
    },
    components:{
        btn
    },
    computed: {
        地区名字(){
            return "";
        }
    },
    methods: {
        
    },
    mounted() {
        
    },
}
</script>

<style lang="scss" scoped>
.列表{
    margin: 3px 0px 0px;
    .item{
        display: flex;
        align-items: center;
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        position: relative;
        .遮罩{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
        }
        .标题{
            width: 75px;
            flex-shrink: 0;
            white-space: nowrap;
        }
        input{
            flex-grow: 1;
            margin: 0px ;
            padding: 0px;
            border: none;
            height: 100%;
            color: inherit;
            font-size: inherit;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .性别{
            display: flex;
            align-items: center;
            i{
                font-size: 16px;
                line-height: 16px;
                height: 16px;
            }
            .icon-xuanze2{
                color: rgba(44, 172, 236, 1);
            }
            span{
                margin: 0px 25px 0px 7px;
            }
        }
        .地区{
            overflow: hidden;
            width: 0;
            flex-grow: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0px 20px 0px 0px;
        }
        .地区.active{
            color: rgba(166, 166, 166, 1);
        }
        input::-webkit-input-placeholder{
           color: rgba(166, 166, 166, 1);
        }
        input:-moz-placeholder{
           color: rgba(166, 166, 166, 1);
        }
        input::-moz-placeholder{
            color: rgba(166, 166, 166, 1);
        }
        input:-ms-input-placeholder{
            color: rgba(166, 166, 166, 1);
        }
    }
}

.设为默认{
    height: 44px;
    background: #ffffff;
    margin: 5px 0px 0px;
    padding: 0px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;    
    >li:nth-child(1){
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
    }
    .切换按钮.active{
        background: #007aff;
        div{
            left: 16px;
        }
    }
    .切换按钮{
        background: #ffffff;
        width: 40px;
    	height: 24px;
        border-radius: 24px;
        box-shadow: 0px 0px 1px 1px rgba(188, 188, 188, 0.5);
        position: relative;
        transition: all 0.5s;
        div{
            background: #ffffff;
            position: absolute;
            top: 1px;
            left: 1px;
            width: 22px;
            height: 22px;
            border-radius: 100%;
            box-shadow: 0px 1px 5px 0px rgba(0,0,0,.4);
            transition: all 0.5s;
        }
    }
}
</style>
