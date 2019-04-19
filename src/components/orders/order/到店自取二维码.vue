<template>
    <div class="收货二维码">
        <ul class="提示语">
            <li></li>
            <li>向商家展示取货码</li>
            <li></li>
        </ul>
        <div class="取货码" @click="生成收款二维码()">
            <div ref="qrcode">
                <!-- <img src="image/12121.png" alt="" srcset=""> -->
            </div>
            <div>
                <img v-if="店铺信息" :src="店铺信息.signboard" />
            </div>
            <div v-show="!生成完成">
                <div>
                    二维码生成中
                </div>
            </div>
        </div>
        <ul class="商家地址">
            <li>地址：</li>
            <li>{{店铺信息 ? 店铺信息.address : ''}}</li>   
            <li>{{店铺距离}}</li>
            <li @click="跳转地图()">
                <i class="icon iconfont icon-daohang"></i>
            </li>
        </ul>
    </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { openloading , bd_decrypt } from "@/assets/js/currency.js";
import { mapGetters, mapActions } from "vuex";

import { 百度转标转WGS84  ,bd09togcj02 } from "@/assets/js/地图坐标转换.js";
export default {
    name:"",
    data() {
        return {
            生成完成:false,
        }
    },
    computed: {
        ...mapGetters({
            xianshi:"orders/order/显示取货二维码",
            订单详情:'orders/order/dingdanxiangqing',
            dingdanxiangqing:'orders/order/dingdanxiangqing',
            店铺信息:'orders/order/店铺信息',
            店铺距离:'orders/order/店铺距离',
            当前位置:"当前位置"
        })
    },
    methods: {
        ...mapActions({
            获取位置:"获取位置/获取位置"
        }),
        生成收款二维码(){
            this.生成完成=false
            return new Promise((resolve, reject) => {
                var url = 'http://m.lxad.vip/test/dist/index.html' + "#/myshop/xiaoshou/orderDetails?id="+this.订单详情.ordersid+'&th=1';
                console.log(url);
                var el = this.$refs.qrcode;
                el.innerHTML = "";
                let qrcode = new QRCode(el, {
                    width: 150,
                    height: 150, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
                    text: url, // 二维码内容
                    // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    background: "#fff",
                    foreground: "#fff"
                });
                setTimeout(()=>{
                    this.生成完成=true;
                },500)
            });
        },
        async 跳转地图(){
            var this_1=this;
            if(!this.店铺信息){
                mui.toast("店铺信息获取失败，稍后再试", { duration: "long", type: "div" });
                return
            }
            if(!this.当前位置 || this.当前位置.x=='' || this.当前位置.y==''){
                openloading(true)
                await this.获取位置();
                openloading(false);
            }
            if(!this.当前位置 || this.当前位置.x=='' || this.当前位置.y==''){
                mui.toast("获取位置失败，请点击重试。", { duration: "long", type: "div" });
                return
            }

            if(ApplicationType=='app'){
                function 跳转地图(){
                    var name=this_1.店铺信息.name
                    // 设置目标位置坐标点和其实位置坐标点
                    if(AppType=='ios'){
                        var 起点=bd09togcj02(this_1.当前位置.x, this_1.当前位置.y);
                        var 终点=bd09togcj02(this_1.店铺信息.x,this_1.店铺信息.y);
                        var dst = new plus.maps.Point(起点[0] , 起点[1]);
                        var src = new plus.maps.Point(终点[0] , 终点[1]);
                        // 调用系统地图显示 
                        plus.maps.openSysMap(src, name , dst);
                    }else{
                        var 起点=百度转标转WGS84(this_1.当前位置.x, this_1.当前位置.y);
                        var 终点=百度转标转WGS84(this_1.店铺信息.x,this_1.店铺信息.y);
                        var dst = new plus.maps.Point(起点[0] , 起点[1]);
                        var src = new plus.maps.Point(终点[0] , 终点[1]);
                        // 调用系统地图显示 
                        plus.maps.openSysMap(src, name , dst);
                    }
                }
                if (window.plus) {
                    跳转地图();
                } else {
                    document.addEventListener('plusready', 跳转地图, false);
                }
            }else{
                var ditu = bd_decrypt(this_1.店铺信息.x, this_1.店铺信息.y);
                wx.openLocation({
                    latitude: ditu.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: ditu.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: this_1.店铺信息.name, // 位置名
                    address: this_1.店铺信息.address, // 地址详情说明
                    scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
                });
            }
        }
    },
    mounted() {
        // if( this.订单详情.ordersid){
        //     this.生成收款二维码();
        // } 
        // http://m.lxad.vip/test/dist/index.html#/myshop/xiaoshou/orderDetails?id=1000001113378220&th=1
        this.生成收款二维码();
    },
    watch: {
        
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
.收货二维码{
    background: #ffffff;
    margin: 0px 0px 5px;
}
.提示语{
    display: flex;
    align-items: center;
    padding: 0px 14px;
    height: 34px;
    >:nth-child(1),
    >:nth-child(3){
        height: 1px;
        background: $header_background;
        flex-grow: 1;
    }
    >:nth-child(2){
        color: $header_background;
        font-size: 12px;
        margin: 0px 9px;
        font-weight: bold;
    }
}
.取货码{
    width: 150px;
    height: 150px;
    margin: 0px auto;
    position: relative;
    >div:nth-child(1){
        width: 100%;
        height: 100%;
        img{
            width: 100%;
            height: 100%;
        }
    }
    >div:nth-child(2){
        width: 40px;
    	height: 40px;
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        margin: auto;
        img{
            width: 100%;
            height: 100%;
        }
    }
    >div:nth-child(3){
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        color: #ffffff;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.商家地址{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 38px;
    padding: 0px 14px;
    >li:nth-child(1){
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
    }
    >li:nth-child(2){
        color: rgba(56, 56, 56, 1);
    	font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    >li:nth-child(3){
        font-size: 12px;
        color: $header_background;
        margin: 0px 5px 0px 5px;
    }
    >li:nth-child(4){
        font-size: 16px;
        color: $header_background;
    }
}
</style>

