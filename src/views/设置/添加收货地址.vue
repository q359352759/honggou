<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">添加地址</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <form @submit.prevent="提交()">
                <div class="列表">
                    <ul class="mui-table-view">
                        <li class="mui-table-view-cell item">
                            <div>姓名：</div>
                            <input type="text" required maxlength="6" pattern="^[\s\S]*.*[^\s][\s\S]*$" placeholder="请输入收货人姓名">
                        </li>
                        <li class="mui-table-view-cell item">
                            <div>手机号码：</div>
                            <input type="text" required pattern="^1[34578]\d{9}$" placeholder="请输入收货人手机号">
                        </li>
                        <li class="mui-table-view-cell">
                            <a class="mui-navigate-right item" @click="选择地区()">
                                <div>所在地区：</div>
                                <div class="地区" :class="{'active':!地区名字}">
                                    {{地区名字 ? 地区名字 : '请选择区域'}}
                                </div>
                                <!-- <div class="地区_input">
                                    <input type="text" :value="地区名字" required readonly placeholder="请选择区域">
                                </div> -->
                            </a>
                        </li>
                        <li class="mui-table-view-cell item">
                            <!-- <a class="mui-navigate-right item"> -->
                                <div>详细地址：</div>
                                <input type="text" required maxlength="20" pattern="^[\s\S]*.*[^\s][\s\S]*$" placeholder="如街道、小区、楼栋号、门牌号">
                            <!-- </a> -->
                        </li>
                    </ul>
                </div>

                <ul class="设为默认">
                    <li>设为默认地址</li>
                    <li class="切换按钮" :class="{'active':是否默认}" @click="是否默认=!是否默认">
                        <div></div>
                    </li>
                </ul>
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
            var list = get_url(this.地区三级列表, this.地区id);
            var str = "";
            if (list[0]) {
                str += list[0].name;
            }
            if (list[1]) {
                str += " " + list[1].name;
            }
            if (list[2]) {
                str += " " + list[2].name;
            }
            return str;
        }
    },
    methods: {
        ...mapActions({
            获取地区:"get_area"
        }),
        提交(){
            if(!this.地区id){
                mui.toast("请选择地区", { duration: "long", type: "div" });
                return 
            }
            console.log('提交');
        },
        选择地区(){
            if(this.地区三级列表.length==0 && this.正在初始化){
                mui.toast("地区正在初始化,请稍等", { duration: "long", type: "div" });
                return
            }else if(this.地区三级列表.length==0 && !this.正在初始化){
                mui.toast("地区初始化失败。", { duration: "long", type: "div" });
                return
            }
            this.Picker3.show(x => {
                var id = "";
                if (x[2].id) {
                    id = x[2].id;
                } else if (x[1].id) {
                    id = x[1].id;
                } else if (x[0].id) {
                    id = x[0].id;
                }
                console.log(x,id)
                this.地区id=id;
            });
        },
        async 地区初始化(){
            this.正在初始化=true;
            this.Picker3 = new mui.PopPicker({ layer: 3 });
            try {
                this.地区三级列表=JSON.parse(localStorage.cityData3);
            } catch (error) {}
            if(this.地区三级列表.length==0){
                var 地区="";
                try {
                    地区=JSON.parse(localStorage.area)
                } catch (error) {}
                if(!地区){
                    await this.获取地区();
                    try {
                        地区=JSON.parse(localStorage.area);
                    } catch (error) {
                        //没有获取到地区
                        this.正在初始化=false;
                        return
                    }
                }
                this.地区三级列表=convert(地区);
                this.Picker3.setData(this.地区三级列表);
            }else{
                this.Picker3.setData(this.地区三级列表);
            }
            this.正在初始化=false;
        }
    },
    mounted() {
        this.地区初始化()
        
        // this.Picker3.show(x => {
        //     console.log(x);
        // });
    },
}
</script>

<style lang="scss" scoped>
.列表{
    margin: 3px 0px 0px;
    .item{
        display: flex;
        align-items: center;
        >div:nth-child(1){
            flex-shrink: 0;
            white-space: nowrap;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        input{
            flex-grow: 1;
            margin: 0px ;
            padding: 0px;
            border: none;
            font-size: 14px;
            color: rgba(80, 80, 80, 1);
            height: 100%;
        }
        .地区{
            font-size: 14px;
            color: rgba(80, 80, 80, 1);
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
        .地区_input{

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
