<template>
    <div class="选择商品单位" v-show="显示选择单位">

        <div class="选择单位" v-show="显示单位">
            <span @click="取消1()" class="取消按钮">取消</span>
            <div class="头部">
                请选择单位
            </div>
            <ul class="单位列表">
                <li><div @click="添加自定义()">自定义</div></li>
                <li v-for="(item, index) in 自定义单位">
                    <div @click="选择单位(item)">{{item}}</div>
                </li>
                <li v-for="(item, index) in list">
                    <div @click="选择单位(item)">{{item}}</div>
                </li>
            </ul>
        </div>

        <ul class="自定义输入框" v-show="显示自定义">
            <li>
                <input type="text" v-model="自定义名称" placeholder="请输入单位名称">
            </li>
            <li>
                <div @click="取消()">取消</div>
                <div @click="确定()">确定</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            list:[
                "个",
                "件",
                "台",
                "套",
                "份",
                "盒",
                "包",
                "瓶",
                "杯",
                "壶",
                "次",
                "间",
                "双",
                "只",
                "付",
                "尊",
                "把",
                "块",
                "罐",
                "辆",
                "升",
                "方",
                "斤",
                "吨",
                "包月",
                "包季",
                "包年",
                "小时",
                "天",
                "人"
            ],
            显示选择单位:false,
            显示单位:true,
            显示自定义:false,
            自定义单位:[],
            自定义名称:''
        }
    },
    methods: {
        选择单位(item){
            console.log(item);
            this.$emit('setdw', item);
            this.显示选择单位=false;
        },
        添加自定义(){
            this.自定义名称="";
            this.显示单位=false;
            this.显示自定义=true;
        },
        取消1(){
            this.显示选择单位=false;
        },
        取消(){
            this.显示选择单位=false;
            this.显示单位=true;
            this.显示自定义=false;
        },
        确定(){
            if(!this.自定义名称){
                mui.toast("请输入单位", { duration: 1000, type: "div" });
                return
            }else if(this.自定义名称.length>5){
                mui.toast("单位长度不能大于5", { duration: 1000, type: "div" });
                return
            }
            this.显示选择单位=false;
            this.显示单位=true;
            this.显示自定义=false;
            this.$emit('setdw', this.自定义名称);

            var obj1=this.list.find(x=>x==this.自定义名称);
            var obj2=this.自定义单位.find(x=>x==this.自定义名称);
            if(!obj1 && !obj2){
                this.自定义单位.unshift(this.自定义名称);
                if(this.自定义单位.length>10){
                    this.自定义单位.splice(10);
                }
                localStorage.spdw=JSON.stringify(this.自定义单位)
            }
        }
    },
    mounted() {
        this.自定义单位=[];
        try {
            this.自定义单位=JSON.parse(localStorage.spdw)
        } catch (error) {}

    },
}
</script>

<style lang="scss" scoped>
.选择商品单位{
    position: fixed;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.4);
    width: 100%;
    height: 100%;
    z-index: 1;
    .选择单位{
        background: #ffffff;
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        height: 380px;
        display: flex;
        flex-direction: column;
        .取消按钮{
            position: absolute;
            color: rgba(166, 166, 166, 1);
        	font-size: 14px;
            top: 12px;
            left: 13px;
        }
        .头部{
            flex-shrink: 0;
            height: 45px;
            text-align: center;
            line-height: 45px;
            color: rgba(80, 80, 80, 1);
	        font-size: 14px;
        }
        .单位列表{
            flex-grow: 1;
            overflow: auto;
            display: flex;
            flex-wrap: wrap;
            padding: 0px 6px 40px;
            li{
                width: 25%;
                padding: 0px 6px 10px;
                div{
                    background: rgba(246, 246, 246, 1);
                    height: 28px;
                    line-height: 28px;
                    text-align: center;
                    color: rgba(80, 80, 80, 1);
                    font-size: 12px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .自定义输入框{
        width: 210px;
        background: #ffffff;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        margin: auto;
        padding: 15px 0px;
        height: 117px;
        border-radius: 16px;
        >li:nth-child(1){
            padding: 0px 20px;
            input{
                height: 43px;
                background-color: rgba(246, 246, 246, 1);
                font-size: 14px;
                padding: 0px;
                margin: 0px;
                border: none;
                text-align: center;
            }
        }
        li:nth-child(2){
            margin: 20px 0px 0px 0px;
            display:flex;
            justify-content: space-around;
            >div:nth-child(1){
                color: rgba(166, 166, 166, 1);
            	font-size: 14px;
            }
            >div:nth-child(2){
                color: rgba(0, 122, 255, 1);
	            font-size: 14px;
            }
        }
    }
}
</style>

