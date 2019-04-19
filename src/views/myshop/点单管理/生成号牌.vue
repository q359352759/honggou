<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">生成号牌1</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="选择类型">
                <span>请选择桌牌号样式：</span>
                <i class="icon iconfont" @click="生成样式=1" :class="{'icon-choose':生成样式==2,'icon-xuanze2':生成样式==1}"></i>
                <span @click="生成样式=1">样式1</span>
                <i class="icon iconfont" @click="生成样式=2" :class="{'icon-choose':生成样式==1,'icon-xuanze2':生成样式==2}"></i>
                <span @click="生成样式=2">样式2</span>
            </div>

            <div class="样式区" >
                <ul class="样式1" :class="{'定位':生成样式==2}" ref="生成容器1">
                    <li class="圆形1">
                        <div class="二维码容器" ref="二维码容器">
                            <!-- <img src="image/7.jpg" alt="" srcset=""> -->
                        </div>
                        <div class="店铺logo">
                            <img v-if="!店铺logobase64" :src="WechatIMG311" alt="" srcset="">
                            <img v-if="店铺logobase64" :src="店铺logobase64" alt="" srcset="">
                        </div>
                    </li>
                    <li class="圆形2">
                        <div class="圆弧字体1" ref="圆弧字体1">红购：一个专注省钱的消费平台</div>
                        <div class="扫码">扫码</div>
                        <div class="点单">点单</div>
                        <div class="座位号">{{正在成功号数}}号</div>
                    </li>
                    <li class="圆形3">
                        <div class="圆弧字体2" ref="圆弧字体2">{{店铺 ? 店铺.name : ''}}在线点单系统</div>
                        <div class="圆弧字体3" ref="圆弧字体3">扫码领取{{店铺新人红包 ? 店铺新人红包.amount : 50}}元红包</div>
                    </li>
                </ul>
                <ul class="样式2" :class="{'定位':生成样式==1}" ref="生成容器2">
                    <li>
                        <div>
                            <div>{{店铺 ? 店铺.name : ''}}</div>
                            <div>在线点单系统</div>
                        </div>
                        <div>{{正在成功号数}}号</div>
                        <div>
                            <div>红购：一个专注省钱的消费平台</div>
                            <div>用红包去消费笔笔都实惠</div>
                        </div>
                    </li>
                    <li>
                        <div>扫码买单</div>
                        <div>
                            <div class="二维码容器" ref="二维码容器2">
                                <!-- <img src="image/7.jpg" alt="" srcset=""> -->
                            </div>
                            <div class="店铺logo">
                                <img v-if="!店铺logobase64" :src="WechatIMG311" alt="" srcset="">
                                <img v-if="店铺logobase64" :src="店铺logobase64" alt="" srcset="">
                            </div>
                        </div>
                        <div>
                            <div>扫码领取</div>
                            <div>{{店铺新人红包 ? 店铺新人红包.amount : 50}}元红包</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <ul class="号牌类型">
                <li class="item" >
                    <i class="icon iconfont" @click="号牌类型=1" :class="{'icon-xuanze2':号牌类型==1,'icon-choose':号牌类型==2}"></i>
                    <span>按范围：</span>
                    <input type="text" v-model="起始号" class="mui-text-center">
                    <span class="号">号</span>
                    <div class="横线"></div>
                    <input type="text" v-model="结束号" class="mui-text-center">
                    <span class="号">号</span>
                </li>
                <li class="item">
                    <i class="icon iconfont" @click="号牌类型=2" :class="{'icon-xuanze2':号牌类型==2,'icon-choose':号牌类型==1}"></i>
                    <span>指定号：</span>
                    <input type="text" v-model="指定号" placeholder="（请输入多个号码，用逗号分隔）">
                </li>
            </ul>

            <div class="提示">*提示：生成号牌的图片自动保存到相册</div>
            
            <div class="按钮">
                <btn @click.native="生成号牌()" value="生成号牌"/>
            </div>

            <!-- <div @click="截图a4_1()">a4待截图</div> -->

            <ul :class="{'圆形图片列表':生成样式==1,'方形图片列表':生成样式==2}" ref="圆形图片列表">
                <li class="" v-for="(item, index) in 图片列表_1" :key="index">
                    <img :src="item" alt="" srcset="">
                </li>
            </ul>

            <!-- <img v-for="(item, index) in 圆形a4列表" :key="index" :src="item" alt="" srcset=""> -->


        </div>
    </div>
</template>

<script>
import { api_查询红包列表 } from "@/api/红包接口.js";
// 圆弧字体
import CircleType from "circletype";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { mapGetters , mapActions } from "vuex";
import { openloading } from "@/assets/js/currency.js";
import { WechatIMG311 } from "@/assets/image_base64/WechatIMG311.js";

import btn from "@/components/button.vue";
export default {
    name:"",
    data() {
        return {
            WechatIMG311:WechatIMG311,
            店铺logobase64:"",
            生成样式:2,
            店铺新人红包:'',
            
            号牌类型:1,
            起始号:"",
            结束号:"",
            指定号:"",
            正在成功号数:1,

            号牌列表:[],
            图片列表_1:[],
            圆形a4列表:[]
        }
    },
    components:{
        btn
    },
    computed: {
        ...mapGetters({
            店铺:'get_myshop',
        })
    },
    methods: {
        ...mapActions({
            getMyshop:"getMyshop"
        }),
        生成号牌(){
            if(ApplicationType!='app'){
                mui.alert('非app环境无法保存图片，请使用app生成号牌。', "提示", "我知道了", function () { }, "div");  
                return
            }
            this.图片列表_1=[];
            this.圆形a4列表=[];
            var 整数 = /^[0-9]+[0-9]*]*$/; //整数
            if(this.号牌类型==1){
                if(this.起始号 && this.结束号){
                    if(!整数.test(this.起始号) || !整数.test(this.结束号)){
                        mui.toast("请输入整数", { duration: "long", type: "div" });
                        return
                    }
                }else{
                    mui.toast("请输入号牌", { duration: "long", type: "div" });
                    return
                }
                this.号牌列表=[];
                var 起始号=parseInt(this.起始号);
                var 结束号=parseInt(this.结束号);
                for(let i=起始号;i<=结束号;i++){
                    this.号牌列表.push(i);
                }
                if(this.生成样式==1){
                    this.截图1()
                }else{
                    this.截图2()
                }
            }else{
                if(!this.指定号){
                    mui.toast("请填写指定号", { duration: "long", type: "div" });
                    return 
                }
                this.指定号=this.指定号.replace(/，/g,",")
                this.号牌列表=this.指定号.split(',');
                var 可以生成=true;
                this.号牌列表.forEach(item => {
                    if(!整数.test(item)){
                        可以生成=false;
                    }else{
                        item=parseInt(item);
                    }
                });
                if(!可以生成){
                    mui.toast("制定号请输入整数", { duration: "long", type: "div" });
                    return;
                }
                console.log(this.号牌列表);
                if(this.生成样式==1){
                    this.截图1()
                }else{
                    this.截图2()
                }
            }
        },
        async 截图1(){
            openloading(true)
            var this_1=this;
            var 号牌列表=this.号牌列表;
            mui.toast("开始成功号牌", { duration: "long", type: "div" });
            for(let i=0;i<号牌列表.length;i++){
                this_1.正在成功号数=号牌列表[i];
                await this_1.生成店铺二维码_1(号牌列表[i]);
                var base64 = await this_1.开始截图_1();
                if(this_1.图片列表_1.length>3){
                    var a4_base64_1= await this_1.截图a4_1();
                    this_1.圆形a4列表.push(a4_base64_1)
                    this_1.图片列表_1=[base64];
                }else{
                    this_1.图片列表_1.push(base64);
                }
                if(i==号牌列表.length-1 && this_1.图片列表_1.length>0){
                    var a4_base64_1= await this_1.截图a4_1();
                    this_1.圆形a4列表.push(a4_base64_1)
                }
            }
            var 圆形a4列表=this.圆形a4列表;
            mui.toast("开始保存", { duration: 1000, type: "div" });
            for(let i=0;i<圆形a4列表.length;i++){
                await this_1.保存图片到相册(圆形a4列表[i])
            }
            mui.alert('保存成功', "提示", "我知道了", function () { }, "div");            
            openloading(false);
        },
        开始截图_1(){
            return new Promise((resolve, reject) => {
                const el = this.$refs.生成容器1;
                const options = {
                    useCORS: true,
                    logging: false,
                    // backgroundColor:null,
                    scale:2
                };
                html2canvas(el, options).then(canvas => {
                    resolve(canvas.toDataURL());
                });
            });
        },
        截图a4_1(){
            return new Promise((resolve, reject) => {
                const el = this.$refs.圆形图片列表;
                const options = {
                    useCORS: true,
                    logging: false,
                    // backgroundColor:null,
                    scale:2
                };
                html2canvas(el, options).then(canvas => {
                    resolve(canvas.toDataURL());
                });
            });
        },
        生成店铺二维码_1(牌号){
            return new Promise((resolve, reject) => {
                var url = 'http://m.lxad.vip/test/dist/index.html' + "#/sjdd?shopid="+ this.店铺.shopid+'&fenxiang=1&ph='+牌号;
                console.log(url);
                var el = this.$refs.二维码容器;
                el.innerHTML = "";
                let qrcode = new QRCode(el, {
                    width: 300,
                    height: 300, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
                    text: url, // 二维码内容
                    // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    background: "#fff",
                    foreground: "#fff"
                });
                setTimeout(()=>{
                    el.querySelector("img").style.width = "100%";
                    setTimeout(()=>{
                        resolve()
                    },200)
                },300)
            });
        },
        async 截图2(){
            openloading(true)
            var this_1=this;
            var 号牌列表=this.号牌列表;
            for(let i=0;i<号牌列表.length;i++){
                this_1.正在成功号数=号牌列表[i];
                await this_1.生成店铺二维码_2(号牌列表[i]);
                var base64 = await this_1.开始截图_2();
                if(this_1.图片列表_1.length>3){
                    var a4_base64_1= await this_1.截图a4_1();
                    this_1.圆形a4列表.push(a4_base64_1)
                    this_1.图片列表_1=[base64];
                }else{
                    this_1.图片列表_1.push(base64);
                }
                if(i==号牌列表.length-1 && this_1.图片列表_1.length>0){
                    var a4_base64_1= await this_1.截图a4_1();
                    this_1.圆形a4列表.push(a4_base64_1)
                }
            }
            var 圆形a4列表=this.圆形a4列表;
            mui.toast("开始保存", { duration: 1000, type: "div" });
            for(let i=0;i<圆形a4列表.length;i++){
                await this_1.保存图片到相册(圆形a4列表[i])
            }
            
            mui.alert('保存成功', "提示", "我知道了", function () { }, "div");            
            openloading(false);
        },
        生成店铺二维码_2(牌号){
            return new Promise((resolve, reject) => {
                var url = 'http://m.lxad.vip/test/dist/index.html' + "#/sjdd?shopid="+ this.店铺.shopid+'&fenxiang=1&ph='+牌号;
                console.log(url);
                var el = this.$refs.二维码容器2;
                el.innerHTML = "";
                let qrcode = new QRCode(el, {
                    width: 300,
                    height: 300, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
                    text: url, // 二维码内容
                    // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    background: "#fff",
                    foreground: "#fff"
                });
                setTimeout(()=>{
                    el.querySelector("img").style.width = "100%";
                    setTimeout(()=>{
                        resolve()
                    },200)
                },300)
            });
        },
        开始截图_2(){
            return new Promise((resolve, reject) => {
                const el = this.$refs.生成容器2;
                const options = {
                    useCORS: true,
                    logging: false,
                    // backgroundColor:null,
                    scale:2
                };
                html2canvas(el, options).then(canvas => {
                    resolve(canvas.toDataURL());
                });
            });
        },
        生成店铺log(){
            return new Promise((resolve, reject) => {
                this.$axios.post("/api-u/users/imgtobase64", this.$qs.stringify({ url: this.店铺.signboard })).then(x => {
                    if (x.data.code == 200) {
                        this.店铺logobase64 = "data:image/jpeg;base64," + x.data.data;
                        resolve();
                    } else {
                        reject();
                    }
                }).catch(err => {
                    reject();
                });
            });
        },
        保存图片到相册(base64Str){
            return new Promise((resolve, reject) => {
                function plusReady(){
                    var bitmap = new plus.nativeObj.Bitmap("test");  
                        bitmap.loadBase64Data(base64Str, function(){
                            console.log("加载Base64图片数据成功");
                            var name =  '_doc/'+(new Date()).getTime()+'.png';
                                console.log('图片名称：'+name);
                            bitmap.save(name,{format:'png'},function(i){

                                plus.gallery.save(name, function(e){
                                    console.log('保存相册成功：'+JSON.stringify(e));
                                    var main = plus.android.runtimeMainActivity();   
                                    var intent= plus.android.importClass('android.content.Intent');  
                                    var Uri= plus.android.importClass('android.net.Uri');  
                                        main.sendBroadcast(new intent(intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse(name)));
                                })
                                
                                    
                                bitmap.recycle();
                                console.log('保存图片成功：'+JSON.stringify(i));
                                resolve()
                            },function(e){
                                bitmap.recycle();
                                console.log('保存图片失败：'+JSON.stringify(e));
                                resolve() 
                            });  
                        }, function(){
                            console.log('加载Base64图片数据失败：'+JSON.stringify(e));
                            bitmap.recycle();
                            resolve();
                        });
                } 
                if(window.plus){  
                    plusReady();
                }else{  
                    document.addEventListener("plusready",plusReady,false);  
                }
            });
        },
        async 初始化(){
            openloading(true)
            if(!this.店铺 || !this.店铺.shopid){
                await this.getMyshop();
            }
            var 查询店铺红包_query={
                    start:0,
                    length:10,
                    shopid:this.店铺.shopid,
                    ccc:1,
                    type:0
                }
            this.生成店铺log();
            var 新人红包_r=await api_查询红包列表(查询店铺红包_query);
            if(新人红包_r.data.code==200 && 新人红包_r.data.data.data.length>0){
                this.店铺新人红包=新人红包_r.data.data.data[0]
            }
            openloading(false);
            setTimeout(()=>{
                this.生成样板圆弧();
            },500)
            
            this.生成店铺二维码_1(1);
            this.生成店铺二维码_2(1);
        },
        生成样板圆弧(){
            var 圆弧字体1 = new CircleType(this.$refs.圆弧字体1);
            圆弧字体1.radius(80).dir(1);
            
            var 圆弧字体2 = new CircleType(this.$refs.圆弧字体2);
            圆弧字体2.radius(134).dir(1);
            
            var 圆弧字体3 = new CircleType(this.$refs.圆弧字体3);
            圆弧字体3.radius(134).dir(-1);
        },
        
    },
    mounted() {
        this.初始化()

        var list=[];
        var 数量=50;
        for(var i=0;i<50;i++){
            if(list.length==0){
                var list1=[i];
                list.push(list)
            }else{
                if(list[list.length-1].length>9){
                    var list1=[i];
                    list.push(list)
                }else{
                    
                }
            }
        }
        console.log(list);


    },
}
</script>

<style lang="scss" scoped>
.选择类型{
    display: flex;
    height: 44px;
    background: #ffffff;
    padding: 0px 15px;
    align-items: center;
    color: rgba(80, 80, 80, 1);
	font-size: 12px;
    i{
        font-size: 20px;
        height: 20px;
        line-height: 20px;
        margin: 0px 8px 0px 28px;
    }
    .icon-xuanze2{
        color: rgba(44, 164, 236, 1);
    }
}

.样式区{
    background: #ffffff;
    padding: 1px 0px;
}

.样式1.定位{
    position: fixed;
    left: -100%;
}
.样式1{
    width: 285px;
    height: 285px;
    position: relative;
    margin: 0px auto 20px;
    .圆形1,
    .圆形2,
    .圆形3{
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        margin: auto;
        border-radius: 100%;
    }
    .圆形1{
        width: 105px;
        height: 105px;
        background: #ffffff;
        z-index: 3;
        .二维码容器{
            position: absolute;
            width: 70px;
            height: 70px;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            margin: auto;
            overflow: hidden;
            border: 2px solid #ffffff;
        }
        .店铺logo{
            width: 20px;
            height: 20px;
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            margin: auto;
        }
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .圆形2{
        width: 200px;
        height: 200px;
        background: rgba(28, 114, 172, 1);
        z-index: 2;
        color: #ffffff;
        .圆弧字体1{
            white-space: nowrap;
            position: absolute;
            left: 0px;
            width: 100%;
            top: 15px;
            font-size: 14px;
        }
        .扫码{
            font-size: 18px;
            position: absolute;
            bottom: 40px;
            left: 24px;
        }
        .点单{
            font-size: 18px;
            position: absolute;
            bottom: 40px;
            right: 24px;
        }
        .座位号{
            position: absolute;
            left: 0px;
            width: 100%;
            bottom: 0px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            line-height: 44px;
        }
    }
    .圆形3{
        width: 285px;
        height: 285px;
        background: rgba(188, 68, 76, 1);
        z-index: 1;
        white-space: nowrap;
        .圆弧字体2{
            position: absolute;
            top: 10px;
            left: 0px;
            width: 100%;
            text-align: center;
            color: #ffffff;
            font-size: 20px;
        }
        .圆弧字体3{
            position:absolute;
            bottom: 10px;
            left: 0px;
            width: 100%;
            text-align: center;
            color: #ffffff;
            font-size: 20px;
        }
    }
    
}
.样式2.定位{
    position: fixed;
    left: -100%;
}
.样式2{
    margin: 62px auto 80px;
    width: 297px;
	height: 179px;
    border-radius: 14px;
    display: flex;
    overflow: hidden;
    text-align: center;
    color: #ffffff;
    >li:nth-child(1){
        width: 190px;
        background: rgba(196, 68, 68, 1);
        flex-shrink: 0;
        padding: 15px 0px 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        white-space: nowrap;
        >div:nth-child(1){
            font-size: 16px;
        }
        >div:nth-child(2){
            font-size: 30px;
            font-weight: bold;
        }
        >div:nth-child(3){
            font-size: 10px;
        }
    }
    >li:nth-child(2){
        flex-grow: 1;
        background: #4472C4;
        padding: 20px 0px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        >div:nth-child(1){
            font-size: 16px;
        }
        >div:nth-child(2){
            position: relative;
            .二维码容器{
                width: 60px;
                height: 60px;
                position: absolute;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                margin: auto;
                overflow: hidden;
                font-size: 0px;
                border: 2px solid #ffffff;
            }
            .店铺logo{
                width: 10px;
                height: 10px;
                position: absolute;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                margin: auto;
                font-size: 0px;
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
        >div:nth-child(3){
            font-size: 10px;
        }
    }
}


.号牌类型{
    margin: 5px 0px 0px;
    li{
        background: #ffffff;
        display: flex;
        height: 44px;
        padding: 0px 15px;
        align-items: center;
        border-bottom: 1px solid #f6f6f6;
        color: rgba(80, 80, 80, 1);
        font-size: 12px;
        i{
            font-size: 20px;
            line-height: 20px;
            height: 20px;
            margin: 0px 10px 0px 0px;
        }
        .icon-xuanze2{
            color:rgba(44, 164, 236, 1);
        }
        span{
            white-space: nowrap;
            flex-shrink: 0;
        }
        .号{
            margin: 0px 0px 0px 4px;
        }
        .横线{
            width: 40px;
        	height: 1px;
            background-color: rgba(229, 229, 229, 1);
            margin: 0px 8px;
        }
        input{
            height: 30px;
            background-color: rgba(229, 229, 229, 1);
            padding: 0px 5px;
            margin: 0px;
            border:none;
            font-size: 12px;
        }
    }
}

.圆形图片列表{
    position: fixed;
    left: -300mm;
    display: flex;
    flex-wrap: wrap;
    width: 210mm;
    height: 297mm;
    border: 1px solid #cccccc;
    align-content: baseline;
    >li{
        width: 50%;
        padding: 10px;
        img{
            width: 100%;
        }
    }
}

.方形图片列表{
    position: fixed;
    left: -300mm;
    display: flex;
    flex-wrap: wrap;
    height: 210mm;
    width: 297mm;
    border: 1px solid #cccccc;
    align-content: baseline;
    >li{
        width: 50%;
        padding: 16px;
        img{
            width: 100%;
        }
    }
}

.提示{
    color: rgba(80, 80, 80, 1);
    font-size: 12px;
    margin: 18px 0px;
    text-align: center;
}



.测试{
    color: red;
}
</style>
