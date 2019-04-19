<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">制作员管理</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <form @submit.prevent="提交()">
                <div class="列表">
                    <ul class="mui-table-view">
                        <li class="mui-table-view-cell item">
                            <!-- <a class="mui-navigate-right "> -->
                            <div>手机号：</div>
                            <input type="text" required v-model="phone" pattern="^1[34578]\d{9}$" placeholder="请输入制作员手机号">
                            <!-- </a> -->
                        </li>
                        <li class="mui-table-view-cell item">
                            <div>名字：</div>
                            <input type="text" required v-model="制作员.producername" pattern="^[\s\S]*.*[^\s][\s\S]*$" maxlength="6" placeholder="请填写真实姓名">
                        </li>
                        <li class="mui-table-view-cell item">
                            <div>职位：</div>
                            <input type="text" required v-model="制作员.producerjob" pattern="^[\s\S]*.*[^\s][\s\S]*$" maxlength="10" placeholder="请输入职位名称">
                        </li>
                    </ul>
                </div>
                <div class="提示">*提示：需要对方接受后，完成添加</div>
                
                <btn  value="添加" type="submit"/>
                <!-- <btn  @click.native="提交()" value="添加"/> -->
            </form>

        </div>
    </div>
</template>

<script>

import { api_根据phone查询用户 } from "@/api/用户接口.js";
import { api_添加制作员 } from "@/api/点单接口.js";

import { mapGetters , mapActions } from "vuex";
import { openloading } from "@/assets/js/currency.js";
import btn from '@/components/button.vue';
export default {
    name:"",
    components:{
        btn
    },
    data() {
        return {
            制作员:{
                id:"",
                shopid:"",
                producerid:"",          //制作员id
                producername:"",        //制作人姓名
                producerjob:"",         //职位
                state:"",               //状态
                createtime:"",          //添加时间
                accepttime:"",          //接受时间
            },
            phone:"",
            
        }
    },
    computed: {
        ...mapGetters({
            店铺:'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺:"getMyshop"
        }),
        async 提交(){
            console.log(123)
            if(!this.phone || !this.制作员.producername || !this.制作员.producerjob){
                mui.toast("请输入完成信息", { duration: "long", type: "div" });
                return
            }
            try {
                var 查询用户_r = await api_根据phone查询用户(this.phone)            
            } catch (error) {
                mui.toast("系统错误稍后再试.", { duration: "long", type: "div" });
                return
            }
            if(查询用户_r.data.code==200){
                this.制作员.producerid=查询用户_r.data.data.username;
            }else{
                mui.alert(查询用户_r.data.msg ? 查询用户_r.data.msg : 查询用户_r.data.message, "提示", "我知道了", function () { }, "div");
                return
            }
            api_添加制作员(this.制作员).then((x) => {
                console.log(x)
                if(x.data.code==200){
                    mui.alert('添加成功,等待接受。', "提示", "我知道了", function () {
                        history.back();
                    }, "div");
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
            }).catch((err) => {
                mui.toast("系统错误稍后再试.", { duration: "long", type: "div" });
            });
        },
        async 初始化(){
            openloading(true)
            if(!this.店铺 || !this.店铺.shopid){
                await this.获取店铺();
            }
            this.制作员.shopid=this.店铺.shopid;
            openloading(false)
        }
    }, 
    mounted() {
        this.初始化()
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
