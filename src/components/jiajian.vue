<template>
    <ul class="jiajian">
        <li @click="jia(false)" class="select">-</li>
        <li class="input_box">
            <input type="tel" @input="input()" v-model="number">
        </li>
        <li @click="jia(true)" class="select">+</li>
    </ul>
</template>

<script>
export default {
    props: {
        zongshu: {
            //当前显示的数量
            default: 1
        },
        max:{
            default:0   //0表示无限制
        }
    },
    name: "",
    data() {
        return {
            number: 0
        };
    },
    methods: {
        input() {
            var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
            if (!zhengshu_test.test(this.number)) {
                if (!isNaN(this.number)) {
                    this.number = 1;
                } else {
                    var 数量=parseInt(this.number);
                    console.log(数量);
                    if(this.max==0){
                        this.number =数量;
                    }else{
                        if(this.max>=数量){
                            this.number=数量
                        }else{
                            this.number=this.max;
                            this.$emit("ccMax");    //超出最大值
                        }
                    }
                }
            }else{
                var 数量=parseInt(this.number);
                    console.log(数量);
                    if(this.max==0){
                        this.number =数量;
                    }else{
                        if(this.max>=数量){
                            this.number=数量
                        }else{
                            this.number=this.max;
                            this.$emit("ccMax");    //超出最大值
                        }
                    }
            }
            this.set_zongshu();
        },
        //加减
        jia(x) {
            if (x) {
                //无限制
                if(this.max==0){
                    this.number++;
                }else{
                    if(this.max>this.number){
                        this.number++;
                    }else{
                        this.$emit("ccMax");    //超出最大值
                    }
                }
            } else {
                if (this.number > 1) {
                    this.number--;
                }
            }
            this.set_zongshu();
        },
        set_zongshu() {
            this.$emit("getNumber", this.number);
        }
    },
    mounted() {
        this.number = this.zongshu;
    },
    watch: {
        zongshu() {
            // console.log('zongshu发生变化',this.zongshu);
            this.number = this.zongshu;
        }
    }
};
</script>

<style lang="scss" scoped>
.jiajian {
    // width: 83px;
    height: 25px;
    border: 1px solid rgba(204, 204, 204, 1);
    display: flex;
    background: #e5e5e5;
    text-align: center;
    .select {
        width: 24px;
        flex-shrink: 0;
        font-size: 14px;
        line-height: 23px;
    }
    .input_box {
        width: 34px;
        flex-grow: 1;
        input {
            width: 100%;
            height: 100%;
            padding: 0px;
            margin: 0px;
            text-align: center;
            border-top: none;
            border-bottom: none;
            border-radius: 0px;
            background: none;
            font-size: 14px;
        }
    }
}
</style>
