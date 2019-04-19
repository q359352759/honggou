<template>
    <div class="新主键">
        <div class="遮罩" v-show="显示" @click="隐藏()" @touchstart="开始拖动($event)"  @touchmove.prevent="滑动中($event)" @touchend="手指离开()">
            
        </div>
        <div class="圆圈" :class="{'回弹':回弹,'靠左':x<=10}" :style="{'top':y+'px','left':x+'px','webkitTransform':'rotate(' + 旋转角度 + 'deg)'}">
            <!-- <div class="中心点" :class="{'半透明':!显示}" @dblclick.native="双击()" @click="点击中心圆()" @touchstart="圆心开始拖动($event)" @touchmove.prevent="圆心滑动中($event)" @touchend="圆心手指离开()" :style="{'webkitTransform':'rotate(' + -旋转角度 + 'deg)'}"> -->
            <div class="中心点" :class="{'半透明':!显示}" @click="点击中心圆()" @touchstart="圆心开始拖动($event)" @touchmove.prevent="圆心滑动中($event)" @touchend="圆心手指离开()" :style="{'webkitTransform':'rotate(' + -旋转角度 + 'deg)'}">
                <img src="image/12121.png" alt="" srcset="">
            </div>
            <div class="item" :class="'item_'+index" @touchstart="开始拖动($event)" @touchmove.prevent="滑动中($event)" @touchend="手指离开()" v-show="显示" @click="点击单个(item)" :style="{'webkitTransform':'rotate(' + -旋转角度 + 'deg)'}" v-if="index<8" v-for="(item, index) in 主键按钮" :key="index">
                <div class="数字">
                    <i class="icon iconfont" :class="item.icon"></i>
                </div>
                <div class="名称">{{item.name}}</div>
            </div>

            <div class="提示1 主键提示" v-if="是否显示提示">
                <div>
                    菜单
                    <br>
                    可旋转
                </div>
                <div>
                    <img src="image/zhujian1.png" alt="" srcset="">
                </div>
            </div>
            <div class="提示2 主键提示" v-if="是否显示提示">
                <img src="image/zhujian2.png" alt="" srcset="">
            </div>
            <div class="提示3 主键提示" v-if="是否显示提示">
                <div>
                    主控按钮
                    <br>
                    可拖动
                </div>
                <div>
                    <img src="image/zhujian3.png" alt="" srcset="">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
    name:"",
    data() {
        return {
            x:0,
            y:0,
            startVector:{
                x1:0,
                y1:0,
                x2:0,
                y2:0
            },
            currentVector:{
                x1 : 0 ,
                y1 : 0 ,
                x2 : 0 ,
                y2 : 0 
            },
            旋转角度:0,
            上次角度:0,
            回弹:false,
            // 显示:false,
            单击次数:0,
            计时器:''
        }
    },
    computed: {
        ...mapGetters({
            定位坐标:'主键设置/定位坐标',
            是否显示提示:'主键设置/是否显示提示',
            显示:'主键设置/展开',
            主键按钮:'主键设置/主键按钮',
            代理人信息:"g_agentUser",
            店铺信息:'get_myshop',
        }),
    },
    methods: {
        ...mapMutations({
            保存坐标:'主键设置/保存坐标',
            设置是否展开:'主键设置/设置是否展开',
            设置是否显示提示:'主键设置/设置是否显示提示',
            隐藏提示:'主键设置/隐藏提示',
        }),
        计算点乘(vector1,vector2){
            return (vector1.x * vector2.x + vector1.y * vector2.y)  / ( Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y) * Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y)) ;
        },
        计算叉乘(vector1,vector2){
            return (vector1.x * vector2.y - vector2.x * vector1.y) > 0? 1: -1 ;
        },
        vector(x1, y1 , x2, y2){
            return {
                x:x2-x1,
                y: y2-y1
            }
        },
        隐藏(){
            // this.显示=false;
            this.设置是否展开(false);
            this.旋转角度=0
            this.上次角度=0
        },
        点击中心圆(){
            this.单击次数++
            try {
                clearTimeout(this.计时器)
            } catch (error) {}
            this.计时器=setTimeout(()=>{
                this.判断单击双击()
            },200)
        },
        判断单击双击(){
            if(this.单击次数==1){
                this.旋转角度=0
                this.上次角度=0
                // this.显示=!this.显示;
                this.设置是否展开(!this.显示);
            }else if(this.单击次数==2){
                this.$router.push('/news')
            }else{
                this.$router.push('/SetUp');
            }
            this.单击次数=0
        },
        点击单个(item){
            // this.显示=false;
            this.设置是否展开(false);
            this.旋转角度=0
            this.上次角度=0
            var userInfo="";
            try {
                userInfo=JSON.parse(localStorage.userInfo)
            } catch (error) {}
            switch (item.name) {
                case "主页":
                    this.$router.push('/home')
                    break;
                case "我的":
                    this.$router.push('/my')
                    break;
                case "消息":
                    this.$router.push('/news')
                    break;
                case "代理":
                    if(this.代理人信息){
                        if (this.代理人信息.type == 1) {
                            this.$router.push("/Agent"); //跳转代理人
                        }else{
                            this.$router.push("/shizhe/honggoushizhe");     //跳转红购使者
                        }
                    }else{
                        this.$router.push("/agent/ApplicationNotes"); //跳转注册代理人页面
                    }
                    break;
                case "店铺":
                    if(!this.店铺信息){
                        this.$router.push("/ShopInstructions");
                    }else if(this.店铺信息.state==0 || this.店铺信息.state==2){
                        this.$router.push("/shenqingkaidian");
                    }else if(this.店铺信息.state==1 || this.店铺信息.state==3){
                        this.$router.push("/myshop");
                    }else{
                        this.$router.push("/ShopInstructions");
                    }
                    break;
                case "订单":
                    this.$router.push('/orders/orderList')
                    break;
                case "分类":
                    this.$router.push('/classification')
                    break;
                case "收藏":
                    this.$router.push('/Collection')
                    break;
                case "资产":
                    this.$router.push('/AssetCenter')
                    break;
                case "足迹":
                    mui.toast("功能升级中", { duration: "long", type: "div" });
                    break
                default :
                    mui.toast("功能升级中！", { duration: "long", type: "div" });
                    break;
            }
        },
        开始拖动(event){
            this.隐藏提示();
            this.回弹=false
            this.startVector.x2 = event.touches[0].clientX ;
            this.startVector.y2 = event.touches[0].clientY ;
        },
        滑动中(event){
            this.currentVector.x2 = event.touches[0].clientX ;
            this.currentVector.y2 = event.touches[0].clientY ;
            var vector1 = this.vector(this.startVector.x1, this.startVector.y1, this.startVector.x2,this.startVector.y2);
            var vector2 = this.vector(this.currentVector.x1, this.currentVector.y1, this.currentVector.x2,this.currentVector.y2);
            var cos  = this.计算点乘( vector1 , vector2);
            var angle = Math.acos(cos) * 180/ Math.PI ;
            var direction = this.计算叉乘( vector1, vector2 );
            // console.log( ' ' + angle+ ' '+ direction);
            var _allDeg = direction*angle;
            this.旋转角度=this.上次角度 +_allDeg;
            // event.preventDefault();
        },
        手指离开(){
            this.回弹=true;
            var 计算角度=Math.round(this.旋转角度/45)*45
            this.旋转角度=计算角度
            this.上次角度=计算角度
        },
        圆心开始拖动(event){
            this.隐藏提示();
            try {
                clearTimeout(this.计时器)
            } catch (error) {}
            this.计时器=setTimeout(()=>{
                this.$router.push('/SearchShop')
            },1000)
            console.log('圆心开始拖动');
            this.回弹=false;
            this.旋转角度=0
            this.上次角度=0
        },
        圆心滑动中(event){
            try {
                clearTimeout(this.计时器)
            } catch (error) {}
            console.log('圆心正在拖动');
            // this.显示=false;
            var x=event.touches[0].clientX;
            var y=event.touches[0].clientY;
            this.x=x-40/2;
            this.y=y-40/2;
            if(this.显示){
                this.设置是否展开(false);
            }
        },
        圆心手指离开(){
            this.回弹=true;
            console.log('圆心拖动结束')
            var ww = window.innerWidth;
            var hh=window.innerHeight;
            var x中线=ww/2;
            console.log(x中线)
            if(this.x + 40/2>x中线){
                this.x=ww -40 - 5;
            }else{
                this.x=5
            }
            if(this.y<150/2 - 10){
                this.y=150/2 - 10
            }else if(this.y+150/2 + 50>hh){
                this.y= hh - 150/2 - 50
            }
            this.startVector.x1=this.x + 40/2;
            this.startVector.y1=this.y + 40/2;
            this.currentVector.x1=this.x + 40/2;
            this.currentVector.y1=this.y + 40/2;
            var obj={
                    x:this.x,
                    y:this.y
                }
            this.保存坐标(obj);
        }
    },
    mounted() {
        var ww = window.innerWidth;
        var hh=window.innerHeight
        // this.x=ww - 208 / 2 -55;
        if(this.定位坐标.x!=0 && this.定位坐标.y!=0){
            this.x=this.定位坐标.x;
            this.y=this.定位坐标.y;
        }else{
            this.x=ww - 40 - 5;
            this.y=hh/2-40;
        }
        this.startVector.x1=this.x + 40/2;
        this.startVector.y1=this.y + 40/2;
        this.currentVector.x1=this.x + 40/2;
        this.currentVector.y1=this.y + 40/2;
        this.设置是否显示提示()
    },
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/config.scss';
.新主键{
    .遮罩{
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1002;
    }
}
.圆圈.回弹{
    transition: all 1s;
    .中心点{
        transition: all 1s;
    }
    .item{
        transition: all 1s;
    }
}
// .圆圈::after{
//     width: 150px;
//     height: 150px;
//     border: 1px solid #ffffff;
//     content: "";
//     position: absolute;
//     top: calc(-150px / 2 + 40px /2);
//     left: calc(-150px / 2 + 40px /2);
//     border-radius: 100%;
// }
@keyframes circularNav_donghua {
    from {
        transform: scale(1);
        opacity: 1;
    }
    to {
        transform: scale(1.3);
        opacity: 0;
    }
}
.圆圈{
    z-index: 1003;
    height: 40px;
    width: 40px;
    border-radius: 100%;
    position: fixed;
    .主键提示{
        position: absolute;
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
    }
    .提示1{
        top: 2px;
        left: -140px;
        display: flex;
        align-items: center;
        >div:nth-child(1){
            flex-shrink: 0;
            white-space: nowrap;
            text-align: center;
        }
        >div:nth-child(2){
            width: 42px;
            flex-grow: 1;
            img{
                width: 100%;
            }
        }
    }
    .提示2{
        top: 40px;
        left: -68px;
        height: 48px;
        img{
            height: 100%;
        }
    }
    .提示3{
        top: 42px;
        left: -152px;
        display: flex;
        align-items: flex-end;
        >div:nth-child(1){
            flex-shrink: 0;
            white-space: nowrap;
            text-align: center;
        }
        >div:nth-child(2){
            width: 105px;
            flex-grow: 1;
            padding: 0px 0px 14px 0px;
            img{
                width: 100%;
            }
        }
    }
    .中心点{
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        margin: auto;
        z-index: 1;
        img{
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }
    .中心点::after {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        margin: auto;
        border: 1px solid #e97869;
        content: "";
        border-radius: 100%;
        animation: circularNav_donghua 3s ease infinite;
    }
    .半透明{
        opacity: 0.5;
    }
    .item{
        position: absolute;
        width: 30px;
        height: 30px;
        z-index: 1;
        .数字{
            width: 30px;
            height: 30px;
            border-radius: 100%;
            margin: 0px auto 3px;
            display: flex;
            justify-content: center;
            align-items: center;
            color:#ffffff;
            background: $header_background;
            i{
                font-size: 20px;
                height: 20px;
            }
        }
        .名称{
            color: #ffffff;
            font-size: 10px;
            text-align: center;
        }
    }
    .item_0{
        top: calc(-150px / 2 + 40px / 2 );
        left: 0px;
        right: 0px;
        margin: auto;
    }
    //宽度 100vw - 100px 
    .item_1{
        top: calc(-150px / 2 + 38px);
        left: calc(-150px / 2 + 38px);
    }
    .item_2{
        top:calc(100% / 2 - 15px);
        left: calc(-150px / 2 + 40px / 2 );
    }
    .item_3{
        bottom: calc(-150px / 2 + 38px);
        left: calc(-150px / 2 + 38px);
    }
    .item_4{
        bottom: calc(-150px / 2 + 40px / 2 );
        left: calc(100% / 2 - 15px);
    }
    .item_5{
        right: calc(-150px / 2 + 38px);
        bottom: calc(-150px / 2 + 38px);
    }
    .item_6{
        right: calc(-150px / 2 + 40px / 2 );
        top: calc(100% / 2 - 15px);
    }
    .item_7{
        right: calc(-150px / 2 + 38px);
        top: calc(-150px / 2 + 38px);
    }
}
.圆圈.靠左{
    .item_1{
        right: calc(-150px / 2 + 38px);
        top: calc(-150px / 2 + 38px);
        left: auto;
    }
    .item_2{
        right: calc(-150px / 2 + 40px / 2 );
        top: calc(100% / 2 - 15px);
        left: auto;
    }
    .item_3{
        right: calc(-150px / 2 + 38px);
        bottom: calc(-150px / 2 + 38px);
        left: auto;
    }
    .item_5{
        bottom: calc(-150px / 2 + 38px);
        left: calc(-150px / 2 + 38px);
        right: auto;
    }
    .item_6{
        top:calc(100% / 2 - 15px);
        left: calc(-150px / 2 + 40px / 2 );
        right: auto;
    }
    .item_7{
        top: calc(-150px / 2 + 38px);
        left: calc(-150px / 2 + 38px);
        right: auto;
    }
}   
</style>

