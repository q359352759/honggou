<template>
    <div class="预定弹出框">
        <ul class="内容">
            <li class="标题1">预订选项</li>
            <li class="input_1">
                <div>到店时间：</div>
                <input type="text" v-model="obj.消费时间" placeholder="请选择" @click="选择时间()" readonly>
                <div></div>
            </li>
            <li class="input_1">
                <div>消费人数：</div>
                <input type="number" v-model="obj.消费人数" placeholder="请输入" >
                <div>人</div>
            </li>
            <li class="textarea_1">
                <div>留言：</div>
                <div class="描述" ref="描述" contenteditable="true"></div>
                <!-- <textarea class="描述" name="" id="" placeholder="请输入特殊要求，如需要包间等。"></textarea> -->
            </li>
            <li class="按钮">
                <div>
                    <span @click="取消()">取消</span>
                </div>
                <div>
                    <span @click="确定()">确定</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { 当前时间格式化 } from "@/assets/js/currency.js";
import { getDaysByDateString } from "@/assets/js/time.js";

export default {
    name:"",
    data() {
        return {
            obj:{
                消费时间:"",
                消费人数:"",
                留言:"",
            }
        }
    },
    inject:['设置预定描述'],
    methods: {
        选择时间(){
            var picker = new mui.DtPicker({});
            picker.show((res)=>{
                this.obj.消费时间=res.value;
                picker.dispose();
				picker = null;
            })
        },
        取消(){
            this.设置预定描述(false,'');
        },
        确定(){
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm');
            var 时间差=getDaysByDateString(当前时间,this.obj.消费时间);
            var 正整数=/^[1-9]+[0-9]*]*$/;
            if(!this.obj.消费时间 || this.obj.消费时间<当前时间){
                mui.toast("消费时间不能小于当前时间", { duration: "long", type: "div" });
                return
            }else if(时间差>1){
                mui.toast("预定时间不能超过24小时", { duration: "long", type: "div" });
                return
            }else if(!this.obj.消费人数 || this.obj.消费人数<1 || !正整数.test(this.obj.消费人数)){
                mui.toast("消费人数有误", { duration: "long", type: "div" });
                return
            }
            this.obj.留言 = this.$refs.描述.innerHTML
            this.设置预定描述(true,this.obj);
        }
    },
}
</script>

<style lang="scss" scoped>
.预定弹出框{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    .内容{
        padding: 0px 15px;
        width: 227px;
        background: #ffffff;
        border-radius: 16px;
        .标题1{
            padding: 10px 0px;
            text-align: center;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        .input_1{
            margin: 14px 0px 0px;
            display: flex;
            align-items: center;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            >div:nth-child(1){
                white-space: nowrap;
                flex-shrink: 0;
            }
            input{
                text-align: center;
                margin: 0px;
                padding: 0px;
                height: 26px;
                border: none;
                background-color: rgba(246, 246, 246, 1);
                color: inherit;
                font-size: inherit;
            }
            >div:nth-child(3){
                width: 19px;
                text-align: right;
                flex-shrink: 0;
            }
        }
        .textarea_1{
            color: rgba(80, 80, 80, 1);
        	font-size: 12px;
            margin: 14px 0px 0px;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            .描述{
                margin: 5px 0px 0px;
                color: inherit;
                font-size: inherit;
                background-color: rgba(246, 246, 246, 1);
                border: none;
                height: 46px;
                padding: 10px 5px;
            }
            .描述:empty:before{
                content: '请输入特殊要求，如需要包间等。';
                font-size: inherit;
                color: rgba(166, 166, 166, 1);
            }
        }
        .按钮{
            height: 64px;
            display: flex;
            align-items: center;
            font-size: 14px;
            text-align: center;
            div{
                width: 50%;
            }
            >div:nth-child(1){
                color: rgba(128, 128, 128, 1);
            }
            >div:nth-child(2){
                color: rgba(0, 122, 255, 1);
            }
        }
    }
}
</style>
