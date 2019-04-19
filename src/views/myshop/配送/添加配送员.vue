<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">配送员管理</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <form @submit.prevent="提交()" class="列表">
                <ul class="mui-table-view">
                    <li class="mui-table-view-cell item">
                        <div>手机号：</div>
                        <input type="text" required v-model="phone" pattern="^1[34578]\d{9}$" placeholder="请输入制作员手机号">
                    </li>
                    <li class="mui-table-view-cell item">
                        <div>名字：</div>
                        <input type="text" required v-model="制作员.producername" pattern="^[\s\S]*.*[^\s][\s\S]*$" maxlength="6" placeholder="请填写真实姓名">
                    </li>
                </ul>
                <div class="提示">*提示：需要对方接受后，完成添加</div>
                
                <btn  value="添加" type="submit"/>
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
            phone:"",
            制作员:""
        }
    },
    methods: {
        提交(){

        }
    },
}
</script>

<style lang="scss" scoped>
.列表{
    margin-top: 3px !important;
    .mui-table-view-cell:after{
        left: 0px;
    }
    .item{
        height: 44px;
        padding-top: 0px;
        padding-bottom: 0px;
        display: flex;
        align-items: center;
        color: rgba(80, 80, 80, 1);
    	font-size: 14px;
        div{
            flex-shrink: 0;
            white-space: nowrap;
            min-width: 56px;
        }
        input{
            padding: 0px;
            margin: 0px;
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            height: 100%;
            border: none;
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
.提示{
    color: rgba(166, 166, 166, 1);
    font-size: 12px;
    margin: 27px 0px 30px;
    text-align: center;
}
</style>
