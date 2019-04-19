<template>
    <div class="">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 @click="收起删除()" class="mui-title">分组</h1>
            <span @click="点击编辑()" class="拖动排序提示">{{显示排序 ? "完成" : "编辑" }}</span>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="现有类型" ref="现有类型">
                <!-- <draggable v-model="myArray" @start="kaishituodong" @end="tuodongjiesu" :options="{group:'people'}"> -->
                    <ul class="mui-table-view 单列" v-for="(item, index) in myArray" :key="index">
                        <li class="排序" v-show="显示排序" @click="点击排序(item,index)">
                            <i class="icon iconfont icon-shang"></i>
                        </li>
                        <li class="mui-table-view-cell">
                            <div class="mui-slider-right mui-disabled" @click="删除(item)">
                                <a class="mui-btn mui-btn-red">删除</a>
                            </div>
                            <div class="mui-slider-handle item">
                                <div class="标题">
                                    <span>{{item.groupname}}</span>
                                    <i @click="点击修改(item)" class="icon iconfont icon-bianji2"></i>
                                </div>
                                <div class="数量 mui-text-center">{{item.commoditynum}}个商品</div>
                                <div class="mui-text-right">
                                    <i @click="选择分组(item)" :class="{'icon-choose':item.id!=选择的id,'icon-xuanze2':item.id==选择的id}" class="单选 icon iconfont"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                <!-- </draggable> -->
            </div>

            <div class="添加分组">
                <div @click="点击添加()">添加分组</div>
                <span>左滑删除分组</span>    
            </div>

            <div class="添加弹出框" v-show="显示添加框">
                <form @submit.prevent="提交()">
                    <ul>
                        <li>
                            <input type="text" v-model="详情.groupname" placeholder="输入分组名称" maxlength="5" required pattern="^[\s\S]*.*[^\s][\s\S]*$"/>
                        </li>
                        <li class="按钮组">
                            <div @click="显示添加框=false" class="红色字体">取消</div>
                            <button class="蓝色字体">确定</button>
                        </li>
                    </ul>
                </form>
            </div>


        </div>
    </div>
</template>

<script>
import { api_添加商品分组 , api_查询商品分组列表 , api_删除商品分组 , api_修改商品分组} from "@/api/商品接口.js";

import { openloading } from "@/assets/js/currency.js";
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        // draggable
    },
    data() {
        return {
            选择的id:'',
            显示添加框:false,
            myArray:[],
            显示排序:false,
            详情:{
                id:'',
                shopid:"",
                groupname:"",
                sort:0
            },
        }
    },
    computed: {
        ...mapGetters({
            店铺:"get_myshop",
        })
    },
    methods: {
        ...mapActions({
            查询店铺:"getMyshop",
            设置选择的分组id:"myshops/添加商品/设置选择的分组id"
        }),
        kaishituodong(){
            console.log('开始拖动')
        },
        tuodongjiesu(){
            console.log('拖动结束了')
        },
        点击修改(item){
            this.显示添加框=true;
            this.详情=Object.assign({},item);
            this.显示排序=false;
        },
        点击添加(){
            this.显示添加框=true;
            this.详情={
                shopid:"",
                groupname:"",
                sort:0
            }
            this.显示排序=false;
        },
        点击编辑() {
            var box_2 = this.$refs.现有类型.querySelectorAll('li');
            for (let i = 0; i < box_2.length; i++) {
                mui.swipeoutClose(box_2[i]);
            }
            this.显示排序=!this.显示排序;
            if(!this.显示排序){
                openloading(true)
                var list=this.myArray;
                for(var i=0;i<list.length;i++){
                    list[i].sort=i
                }
                api_修改商品分组(list).then(x=>{
                    if(x.data.code==200){
                        mui.toast("设置成功", { duration: "long", type: "div" });
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false)
                    this.查询分组()
                }).catch(err=>{
                    openloading(false);
                    mui.toast("系统错误。", { duration: "long", type: "div" });
                })
            }
        },
        点击排序(item,index){
            console.log(item,index);
            if(index!=0){
                this.myArray.splice(index,1)
                this.myArray.splice(index-1,0,item);
            }else{
                this.myArray.splice(0,1);
                this.myArray.push(item);
            }
        },
        收起删除() {
            var box_2 = this.$refs.现有类型.querySelectorAll('li');
            console.log(box_2)
            for (let i = 0; i < box_2.length; i++) {
                mui.swipeoutOpen(box_2[i],'right');
            }
        },
        删除(item){
            mui.confirm('确定删除？','提示',['取消','是的'],value=>{
                if(value.index==1){
                    openloading(true)
                    api_删除商品分组(item.id).then(x=>{
                        if(x.data.code==200){
                            mui.toast("设置成功", { duration: "long", type: "div" });
                        }else{
                            mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                        }
                        this.查询分组();
                        //收起删除
                        var box_2 = this.$refs.现有类型.querySelectorAll('li');
                        for (let i = 0; i < box_2.length; i++) {
                            mui.swipeoutClose(box_2[i]);
                        }
                        openloading(false)
                    }).catch(err=>{
                        this.收起删除()
                        openloading(false);
                        mui.toast("系统错误。", { duration: "long", type: "div" });
                    })
                }
            })
        },
        提交(){
            this.显示添加框=false;
            openloading(true);
            this.详情.shopid=this.店铺.shopid;
            if(this.详情.length>5){
                mui.toast("字数不能大于5", { duration: "long", type: "div" });
                return
            }
            if(this.详情.id){
                api_修改商品分组([this.详情]).then(x=>{
                    if(x.data.code==200){
                        mui.toast("修改成功", { duration: "long", type: "div" });
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    this.查询分组()
                    openloading(false);
                }).catch(err=>{
                    mui.toast("系统错误", { duration: "long", type: "div" });
                    openloading(false)
                })
            }else{
                api_添加商品分组(this.详情).then(x=>{
                    if(x.data.code==200){
                        mui.toast("添加成功", { duration: "long", type: "div" });
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    this.查询分组()
                    openloading(false);
                }).catch(err=>{
                    mui.toast("系统错误", { duration: "long", type: "div" });
                    openloading(false)
                })
            }
        },
        选择分组(item){
            this.选择的id=item.id;
            this.设置选择的分组id(item.id);
            history.back();
        },
        查询分组(){
            var query={
                shopid:this.店铺.shopid,
                start:0,
                length:1000
            }
            openloading(true);
            api_查询商品分组列表(query).then(x=>{
                if(x.data.code==200){
                    this.myArray=x.data.data.data;
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
            }).catch(err=>{
                openloading(false);
                mui.toast("系统错误", { duration: "long", type: "div" });
            })
        },
        async 初始化(){
            if(!this.店铺 || !this.店铺.shopid==''){
                await this.查询店铺();
            }
            this.查询分组()

        }
    },
    mounted() {
        this.初始化();
        this.选择的id=this.$route.query.id ? this.$route.query.id : '';
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
// header_background
.mui-bar{
    .拖动排序提示{
        color: rgba(255, 255, 255, 1);
    	font-size: 12px;
        line-height: 44px;
        position: absolute;
        top: 0px;
        right: 12px;
    }
}

.现有类型{
    .mui-table-view{
        border-bottom: 1px solid #f6f6f6;
    }
    // .mui-table-view-cell:after{
    //     left: 0px;
    // }
    .单列{
        position: relative;
        .排序{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: rgba(166, 166, 166, 0.46);
            border-bottom: 1px solid #ffffff;
            font-size: 20px;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }
    }
    .item{
        align-items: center;
        display: flex;
        >div{
            width: calc(100% / 3);
        }
        .标题{
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            display: flex;
            align-items: center;
            i{
                margin: 0px 0px 0px 5px;
                font-size: 22px;
                color: rgba(24, 148, 220, 1);
                height: 22px;
            }
        }
        .数量{
            color: rgba(166, 166, 166, 1);
        	font-size: 12px;
        }
        .单选{
            font-size: 22px;
            height: 22px;
            display: inline-block;
        }
        .icon-xuanze2{
            color: rgba(44, 164, 236, 1);
        }
    }
}
.添加分组{
    position: relative;
    margin: 40px 0px ;
    >div{
        width: 80px;
    	height: 30px;
        text-align: center;
        line-height:28px;
        border-radius: 30px;
        border: 1px solid $header_background;
        text-align: center;
        font-size: 12px;
        color: $header_background;
        margin: 0px auto;
    }
    span{
        position: absolute;
        top: 0px;
        right: 42px;
        color: rgba(166, 166, 166, 1);
        font-size: 12px;
        line-height: 30px;
    }
}

.添加弹出框{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    ul{
        width: 165px;
        background: #ffffff;
        border-radius: 16px;
        padding: 20px 15px 15px;
    }
    input{
        height: 40px;
        margin: 0px 0px 14px;
        padding: 0px;
        background: rgba(229, 229, 229, 1);
        border: none;
        text-align: center;
        font-size: 12px;
    }
    .按钮组{
        display: flex;
        justify-content: space-between;
        padding: 0px 15px;
        font-size: 14px;
        button{
            padding: 0px;
            border: none;
        }
        button:focus{
            background: none;
        }
    }
    .红色字体{
        color: $header_background;
    }
    .蓝色字体{
        color: rgba(0, 122, 255, 1);
    }
}
</style>
