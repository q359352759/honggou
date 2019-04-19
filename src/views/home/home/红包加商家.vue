<template>
    <ul class="红包加商家" >
        <li  @click="跳转商家()">
            <img :src="红包.signboard" alt="">
        </li>
        <li>
            <div class="title_1" @click="跳转商家()">
                <div><b>{{红包.shopName}}</b></div>
                <div>{{红包.scoreAvg ? Math.floor(红包.scoreAvg*10)/10 : 5.0}}分</div>
            </div>
            <div class="dizhi" @click="跳转商家()">
                <div>{{红包.address}}</div>
                <div class="人气 icon iconfont icon-renqi"></div>
                <div>{{红包.popularity ? 红包.popularity : 0}}</div>
            </div>
            <div class="抵扣信息" v-if="红包.deductionType==0">
                <div @click="跳转商家()" class="icon iconfont icon-hongbao1"></div>
                <div @click="跳转商家()">
                    省&nbsp;{{红包.percentage}}%
                </div>
                <div @click="打开地图()">
                    <i class="icon iconfont icon-location"></i>{{红包.distance>0.5 ? 红包.distance.toFixed(1)+'km' : 红包.distance.toFixed(1)*1000+'m' }}
                </div>
            </div>
            <div class="抵扣信息" v-if="红包.deductionType==1">
                <div class="icon iconfont icon-hongbao1"></div>
                <div @click="跳转商家()">
                    满{{红包.expire}}，省{{红包.deduction}}元
                </div>
                <div @click="打开地图()">
                    <i class="icon iconfont icon-location"></i>{{红包.distance>0.5 ? 红包.distance.toFixed(1)+'km' : 红包.distance.toFixed(1)*1000+'m'}}
                </div>
            </div>
        </li>
        <li>
            <div></div>
            <div></div>
        </li>
        <li @click="领取红包(红包)">
            <div>
                <img src="image/redpackage.png" alt="">
                <div>
                    <span :style="{'font-size':红包.font_size}" ref="font-size">{{红包.amount}}</span>
                </div>
            </div>
            <div>点击领取</div>
        </li>
        <!-- <li @click="RedEnvelopesList(红包)">
            <hongbaobili :max="红包.quantityMax" :lingqu="红包.quantity" />
            <div class="btn">领取</div>
        </li> -->
    </ul>
</template>

<script>
import { api_用户领取红包 } from "@/api/红包接口.js";
import { openloading } from "@/assets/js/currency.js";
import { 跳转地图 } from "@/assets/js/跳转地图.js";
import hongbaobili from "./红包比例.vue";
import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        hongbaobili
    },
    props:{
        红包:{
            default:()=>{}
        },
    },
    data() {
        return {
            userInfo:""
        }
    },
    computed: {
        ...mapGetters({
            当前位置:'当前位置',
        })
    },
    methods: {
        ...mapActions({
            设置是否显示登录框:'设置是否显示登录框'
        }),
        跳转商家(){
            this.$router.push("/sjzst2?shopid=" + this.红包.shopid);
        },
        领取红包(){
            if (!this.userInfo) {
                this.设置是否显示登录框(true);
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // });
                return;
            }
            var obj = {
                id: "",
                userid: this.userInfo.username,
                envelopeId: this.红包.id,
                state: "0", //状态(使用等等)  0 刚领取
                type: this.红包.type,
                startTime: "", //生日使用有效期
                endTime: "",
                amount: this.红包.amount ? this.红包.amount : 0
            };
            openloading(true)
            api_用户领取红包(obj).then(x=>{
                if (x.data.code == 200) {
                    mui.toast("恭喜您，领取成功。", { duration: 2000, type: "div" });
                    this.$router.push('/sjzst2?shopid='+this.红包.shopid)
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.messag, "提示", "我知道了", ()=>{
                        this.$router.push('/sjzst2?shopid='+this.红包.shopid)
                    }, "div");
                }
                openloading(false);
            }).catch(err=>{
                openloading(false);
                mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
            })
        },
        打开地图() {
            跳转地图(this.当前位置,this.红包,this.红包.shopName,this.红包.address);
            // return
            // if(ApplicationType=='app'){
            //     var this_1=this;
            //     function 跳转地图(){
            //         var name=item.shopName ? item.shopName : item.name
            //         // 设置目标位置坐标点和其实位置坐标点
            //         if(AppType=='ios'){
            //             var 起点=bd09togcj02(this_1.当前位置.x, this_1.当前位置.y);
            //             var 终点=bd09togcj02(item.x,item.y);
            //             var dst = new plus.maps.Point(起点[0] , 起点[1]);
            //             var src = new plus.maps.Point(终点[0] , 终点[1]);
            //             // 调用系统地图显示 
            //             plus.maps.openSysMap(src, name , dst);
            //         }else{
            //             var 起点=百度转标转WGS84(this_1.当前位置.x, this_1.当前位置.y);
            //             var 终点=百度转标转WGS84(item.x,item.y);
            //             var dst = new plus.maps.Point(起点[0] , 起点[1]);
            //             var src = new plus.maps.Point(终点[0] , 终点[1]);
            //             // 调用系统地图显示 
            //             plus.maps.openSysMap(src, name , dst);
            //         }
            //     }
            //     if (window.plus) {
            //         跳转地图();
            //     } else {
            //         document.addEventListener('plusready', 跳转地图, false);
            //     }
            // }else{
            //     var ditu = bd_decrypt(item.x, item.y);
            //     wx.openLocation({
            //         latitude: ditu.lat, // 纬度，浮点数，范围为90 ~ -90
            //         longitude: ditu.lng, // 经度，浮点数，范围为180 ~ -180。
            //         name: item.name, // 位置名
            //         address: item.address, // 地址详情说明
            //         scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            //         infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
            //     });
            // }
        },
    },
    mounted() {
        try {
            this.userInfo=JSON.parse(localStorage.userInfo);
        } catch (error) {}

    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
// header_background
.红包加商家{
    margin: 5px;
    background: #ffffff;
    display: flex;
    padding: 5px 0px 5px 5px;
    height: 72px;
    align-items: center;
    >li{
        height: 100%;
    }
    >li:nth-child(1){
        width: 77px;
    	height: 58px;
        flex-shrink: 0;
        margin: 0px 8px 0px 0px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 4px;
        }
    }
    > li:nth-child(2) {
        display: flex;
        width: 0;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        margin: 0px 14px 0px 0px;
        .title_1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div:nth-child(1){
                color: rgba(80, 80, 80, 1);
            	font-size: 14px;
                width: 0;
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            >div:nth-child(2){
                white-space: nowrap;
                flex-shrink: 0;
                font-size: 10px;
                color: $header_background;
            }
        }
        .dizhi {
            display: flex;
            align-items: center;
            >div:nth-child(1){
                width: 0;
                flex-grow: 1;
                color: rgba(166, 166, 166, 1);
            	font-size: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            >div:nth-child(2){
                font-size: 12px;
                line-height: 12px;
                height: 12px;
                color: $header_background;
                flex-shrink: 0;
            }
            >div:nth-child(3){
                font-size: 10px;
                color: $header_background;
                flex-shrink: 0;
                white-space: nowrap;
                margin: 0px 0px 0px 3px;
            }
        }
        .抵扣信息{
            display: flex;
            align-items: center;
            >div:nth-child(1){
                font-size: 12px;
                width: 12px;
                height: 12px;
                line-height: 12px;
                flex-shrink: 0;
                color: $header_background;
                margin: 0px 4px 0px 0px;
            }
            >div:nth-child(2){
                font-size: 10px;
                color: $header_background;
                font-weight: bold;
            }
            >div:nth-child(3){
                flex-grow: 1;
                text-align: right;
                color: rgba(166, 166, 166, 1);
            	font-size: 10px;
            }
        }
    }
    > li:nth-child(3) {
        width: 1px;
        flex-shrink: 0;
        position: relative;
        border-left: 1px dashed #ff5733;
        > div:nth-child(1) {
            position: absolute;
            width: 15px;
            height: 15px;
            background: #f6f6f6;
            top: -13px;
            left: -8px;
            border-radius: 50%;
        }
        > div:nth-child(2) {
            position: absolute;
            width: 15px;
            height: 15px;
            background: #f6f6f6;
            bottom: -13px;
            left: -8px;
            border-radius: 50%;
        }
    }
    > li:nth-child(4) {
        display: flex;
        align-items: center;
        width: 80px;
        flex-shrink: 0;
        justify-content: center;
        flex-direction: column;
        > div:nth-child(1) {
            width: 0.4rem;
            position: relative;
            font-size: 0;
            img {
                width: 100%;
            }
            div {
                font-size: 16px;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 15px 0px 0px;
            }
            span {
                // position: absolute;
                // top: 0.2rem;
                // bottom: 0px;
                // left: 0px;
                // right: 0px;
                text-align: center;
                color: #ffffff;
                overflow: auto;
            }
            .dikou {
                font-size: 12px;
            }
        }
        >div:nth-child(2){
            color: rgba(166, 166, 166, 1);
        	font-size: 8px;
        }
    }
    > li:nth-child(5) {
        padding: 5px 10px;
        .比例 {
            width: 0.45rem;
            height: 0.45rem;
            border: 2px #ff5733 solid;
            color: #ff5733;
            border-radius: 50%;
            font-size: 0.1rem;
            text-align: center;
            line-height: initial;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin: 0px auto;
            > div:nth-child(2) {
                position: absolute;
                width: 0.2rem;
                height: 5px;
                background: #ffffff;
                bottom: -2px;
                left: 0px;
                right: 0px;
                margin: auto;
            }
        }
        .btn {
            width: 0.4rem;
            height: 0.14rem;
            font-size: 0.1rem;
            line-height: 0.14rem;
            color: #ffffff;
            background: #ff5733;
            border-radius: 0.2rem;
            text-align: center;
            margin: 5px auto 0px;
        }
    }
}
</style>
