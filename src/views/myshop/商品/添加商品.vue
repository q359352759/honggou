<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <!-- <a @tap="back()" class="mui-icon mui-icon-left-nav mui-pull-left"></a> -->
            <h1 class="mui-title">{{商品.id ? '编辑商品' : '发布商品'}}</h1>
        </header>
        <div class="mui-content mui-fullscreen">

            <div class="box_1">
                <ul class="mui-table-view ">
                    <li class="mui-table-view-cell " @click="$router.push('/myshop/shangping/fenzu?id='+商品.groupid)">
                        <a class="mui-navigate-right item_box">
                            <span class="text_1">分组：</span>
                            <input type="text" class="mui-text-center" :value="选择的分组名称" placeholder="请选择分组" readonly/>
                            <div class="text_3"></div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell item_box">
                        <span class="text_1">商品名：</span>
                        <input type="text" class="mui-text-center" v-model="商品.name">
                        <div class="text_3"></div>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right item_box" @click="selset_unit()">
                            <span class="text_1">单位：</span>
                            <input class="mui-text-center" type="text" v-model="商品.unit" readonly>
                            <div class="text_3"></div>
                        </a>
                    </li>
                    <li class="mui-table-view-cell item_box">
                        <span class="text_1">市场价：</span>
                        <input type="text" class="mui-text-center" v-model="商品.marketPrice">
                        <div class="text_3">元</div>
                    </li>
                    <li class="mui-table-view-cell item_box">
                        <span class="text_1">售价：</span>
                        <input type="text" class="mui-text-center" v-model.number="商品.sellingPrice" @input="input_change('sellingPrice')">
                        <div class="text_3">元</div>
                    </li>
                    <li class="mui-table-view-cell item_box">
                        <span class="title_2">可省：</span>
                        <input type="text" class="mui-text-center input_1" @input="input_change('deduction')" v-model.number="商品.deduction">
                        <span>元，即</span>
                        <input type="text" class="mui-text-center input_1" @input="input_change('percentage')" v-model.number="商品.percentage">
                        <span>%</span>
                    </li>
                    <li class="mui-table-view-cell item_box" v-if="招募信息">
                        <span class="title_2">佣金：</span>
                        <input type="text" class="mui-text-center input_1" @input="input_change('commission')" v-model.number="商品.commission">
                        <span>元，即</span>
                        <input type="text" class="mui-text-center input_1" @input="input_change('commissionPercentage')" v-model.number="商品.commissionPercentage">
                        <span>%</span>
                    </li>
                </ul>
            </div>

            <ul class="选择专享信息" v-show="!商品红包">
                <li>
                    <div>
                        <i @click="选择专享抵扣类型(0)" :class="{'icon-choose':(专享商品.type!=0 || !是否专享),'icon-xuanze2':(专享商品.type==0 && 是否专享)}" class="单选 icon iconfont"></i>
                        <span @click="选择专享抵扣类型(0)">新人专享</span>
                    </div>
                    <div>
                        <span>专享省：</span>
                        <input type="text" @blur="专享抵扣改变()" v-model.number="专享商品.deduction">
                        <span>元</span>
                    </div>
                </li>
                <li>
                    <div>
                        <i @click="选择专享抵扣类型(1)" :class="{'icon-choose':(专享商品.type!=1 || !是否专享),'icon-xuanze2':(专享商品.type==1 && 是否专享)}" class="单选 icon iconfont"></i>
                        <span @click="选择专享抵扣类型(1)">生日专享</span>
                    </div>
                    <div>
                        <span>最多购买：</span>
                        <input type="text" @blur="专享失去焦点('maxNumber')" v-model.number="专享商品.maxNumber">
                        <span>份</span>
                    </div>
                </li>
            </ul>

            <ul class="选择专享信息">
                <li>
                    <div>
                        <i @click="商品.isstock=0" :class="{'icon-choose':商品.isstock==1,'icon-xuanze2':商品.isstock==0}" class="单选 icon iconfont"></i>
                        <span  @click="商品.isstock=0">不限制库存</span>
                    </div>
                    <div>
                        <i  @click="商品.isstock=1" :class="{'icon-choose':商品.isstock==0,'icon-xuanze2':商品.isstock==1}" class="单选 icon iconfont"></i>
                        <span @click="商品.isstock=1">剩余：</span>
                        <input @blur="整数数去焦点('stock')" type="text" v-model.number="商品.stock">
                        <span>份</span>
                    </div>
                </li>
            </ul>

            <ul class="box_3">
                <li class="title_1">
                    <span>商品图片：(640*480)</span>
                    <span class="mui-pull-right">最多4张，已有{{商品.arrImg.length}}张</span>
                </li>
                <li class="lunbo">
                    <div class="left_1">
                        <!-- <i v-show="left" class="mui-icon mui-icon-back"></i> -->
                    </div>
                    <div class="img_list">
                        <div class="swiper-container" ref="环境图片">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide" v-for="(x, index) in 商品.arrImg" :key="index">
                                    <img :src="x" alt="">
                                    <span @click="delete_img(index)" class="delete_1" :inde="index"><i class="icon iconfont icon-del"></i></span>
                                </div>
                            </div>
                            <!-- Add Pagination -->
                            <!-- <div class="swiper-pagination"></div> -->
                        </div>
                    </div>
                    <div class="right_1" @click="Album()">
                        <span>
                            <i class="mui-icon mui-icon-plusempty"></i>
                        </span>
                    </div>
                </li>
            </ul>

            <!-- <div class="box_1">
                <ul class="mui-table-view ">
                    <li class="mui-table-view-cell " @click="$router.push('/myshop/shangping/miaoshu')">
                        <a class="mui-navigate-right item_box">
                            <span class="text_1">商品描述：</span>
                        </a>
                    </li>
                </ul>
            </div> -->
            <div class="box_1">
                <ul class="mui-table-view ">
                    <li class="mui-table-view-cell " @click="$router.push('/myshop/shangping/miaoshu1')">
                        <a class="mui-navigate-right item_box">
                            <span class="text_1">商品描述：</span>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- <div id="editor" class="editor"></div> -->

            <!-- <ul class="contenteditable_box">
                <li class="header">
                    <div>
                        <select name="16px" v-model="font_size">
                            <option value="24px">24px</option>
                            <option value="20px">20px</option>
                            <option value="16px">16px</option>
                            <option value="14px">14px</option>
                            <option value="12px">12px</option>
                        </select>
                    </div>
                    <div class="zitiyanse bg" v-show="isAndroid" @click="chnage_font_color()"></div>
                    <div @click="add_shiping()" class="shiping bg"></div>
                    <div @click="set_Album_show()" class="tupian bg"></div>
                    <input type="color" class="font_color mui-hidden" v-model="font_color" ref="font_color">
                </li>
                <li class="content_box" ref="content_box">
                    <div class="content_1" @blur="编辑框失去焦点()" ref="content_1" :style="{'font-size':font_size,'color':font_color}" v-html="html" contenteditable="true"></div>
                </li>
            </ul> -->

            <!-- 视频选择框 -->
            <!-- <div class="video_box" v-show="video_show">
                <div class="mask"></div>
                <div class="cont_1">
                    <div @tap="close_1()" class="close_1"><i class="icon iconfont icon-quxiao"></i> </div>
                    <div class="title">请输入视频链接</div>
                    <div class="input_box">
                        <input type="text" v-model="video_url">
                    </div>
                    <button @tap="queding()" class="btn_2">确定</button>
                </div>
            </div> -->
        </div>

        <div @click="add()" class="box_4">
            <div v-if="商品.id">
                {{商品.state==1 ? "保存" : "保存并上架"}}
            </div>
            <div v-if="!商品.id">确认发布</div>
        </div>

        
        <xzdw ref="xzdw" @setdw="getwd"/>
    </div>
</template>

<script>

import { api_根据商品id查询专享 } from "@/api/专享接口.js";
import { api_查询招募列表 } from "@/api/招募接口.js";
import { api_查询商品分组列表 } from "@/api/商品接口.js";

import { openloading, isAndroid } from "@/assets/js/currency";
// import Album from "@/components/Album.vue";
import xzdw from './components/选择单位.vue'
import $ from "jquery";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
    name: "",
    components: {
        // Album
        xzdw
    },
    data() {
        return {
            id:"",
            sol: "-",
            font_size: "16px",
            font_color: "#000000",
            isAndroid: true,
            html: "",
            //视频选择器
            video_show: false,
            video_url: "",
            //图片选择器
            // img_type: 1, //图片类型用于放在哪里 1表示选择的商品图片 2表示编译器的图片
            Album_show: false,
            seetype: 3, //1店招  2环境 3商品 4描述 5其他
            
            left: false,
            deduction: "", //省钱输入框中的内容
            commission: "", //佣金输入框中的内容
            Picker1: "",
            editor: "",
            um: "",
            招募信息: '',
            商品分组类型:[]
        };
    },
    computed: {
        ...mapGetters({
            myshop: "get_myshop",
            商品:'myshops/添加商品/商品',
            专享商品:'myshops/添加商品/专享商品',
            img_type:'myshops/添加商品/选择图片类型',       //图片类型用于放在哪里 1表示选择的商品图片 2表示编译器的图片
            是否重新获取数据:"myshops/添加商品/是否重新获取数据",
            是否专享:'myshops/添加商品/是否专享',
            商品红包: "myshops/添加商品/商品红包",
        }),
        选择的分组名称(){
            var obj=this.商品分组类型.find(x=>x.id==this.商品.groupid);
            if(obj){
                return obj.groupname
            }else{
                return "";
            }
        },
        deduction_money() {
            if (isNaN((this.deduction * this.商品.sellingPrice) / 100)) {
                return 0;
            } else {
                return ((this.deduction * this.商品.sellingPrice) / 100).toFixed(2);
            }
        },
        commission_money() {
            if (isNaN((this.commission * this.商品.sellingPrice) / 100)) {
                return 0;
            } else {
                return ((this.commission * this.商品.sellingPrice) / 100).toFixed(2);
            }
        }
    },
    methods: {
        ...mapMutations({
            设置图片选择类型:"myshops/添加商品/设置图片选择类型",
            选择专享抵扣类型:'myshops/添加商品/选择专享抵扣类型'
        }),
        ...mapActions({
            获取店铺: "getMyshop",
            添加商品: "shangPing/添加商品",
            修改商品: "shangPing/修改商品",
            添加专享: "shangPing/添加专享",
            修改专享: "shangPing/修改专享",
            删除专享: "shangPing/删除专享",
            数据初始化:"myshops/添加商品/数据初始化",
            设置是否重新获取数据:"myshops/添加商品/设置是否重新获取数据",
        }),
        编辑框失去焦点(){
            window.scroll(0, 0);
        },
        专享失去焦点(key) {
            var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
            var 转换后 = parseInt(this.专享商品[key]);
            if (!zhengshu_test.test(转换后)) {
                this.专享商品[key] = '';
            } else {
                this.专享商品[key] = 转换后;
            }
        },
        整数数去焦点(key){
            var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
            if(!zhengshu_test.test(this.商品[key])){
                this.商品[key]=''
            }else{
                this.商品[key]=parseInt(this.商品[key])
            }
        },
        //点击添加视频
        add_shiping() {
            window.scroll(0, 0);
            this.video_show = true;
        },
        //关闭视频输入框
        close_1() {
            this.video_show = false;
        },
        //确定视频
        queding() {
            //http://www.runoob.com/try/demo_source/movie.mp4
            if (!this.video_url) {
                mui.toast("请输入视频链接。", { duration: "long", type: "div" });
            } else {
                var html =
                    '<video width="100%" controls src="' + this.video_url + '">' +
                    '<source src="' + this.video_url + '" type="video/mp4">' +
                    '<source src="' + this.video_url + '" type="video/ogg">' +
                    '</video><div style="min-height:20px;"></div>';
                // this.editor.execCommand('insertHtml', html);
                $(".content_1").append(html);
                this.video_url = "";
                this.video_show = false;
                // history.back();  //这个是用于百度输入框的时候用
            }
        },
        //选择颜色
        chnage_font_color() {
            if (!isAndroid()) {
                mui.toast("您的手机无此功能", { duration: "long", type: "div" });
            } else {
                this.$refs.font_color.click();
            }
        },
        //编辑器选择图片
        set_Album_show() {
            this.商品.remark = this.$refs.content_1.innerHTML;
            this.设置图片选择类型(2)
            this.$store.state.Select_picture.list = [];
            window.scroll(0, 0);
            this.$router.push('/Album?seetype=3')
        },
        //选择商品图片
        Album() {
            // this.商品.remark = this.$refs.content_1.innerHTML;
            this.设置图片选择类型(1)
            window.scroll(0, 0);
            this.$store.state.Select_picture.list = this.商品.arrImg;
            this.$router.push("/Album?seetype=3&size=4");
        },
        获取选择的图片() {
            var list=this.$store.state.Select_picture.list;
            if (this.img_type == 1) {
                console.log('list',list);
                var newlist = [];
                list.forEach(item => {
                    if(item.url){
                        newlist.push(item.url);
                    }else{
                        newlist.push(item);
                    }
                });
                console.log(newlist)
                this.商品.arrImg = newlist;
            } else {
                
            }
        },
        //
        input_change(x) {
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            if (!number_test.test(this.商品[x])) {
                this.商品[x] = '';
                return
            }
            if (!this.商品.sellingPrice || !this.商品[x] || !number_test.test(this.商品[x])) {
                if (x == "sellingPrice") {
                    this.商品.percentage = "";
                    this.商品.commissionPercentage = "";
                } else if (x == "percentage") {
                    this.商品.deduction = "";
                } else if (x == "deduction") {
                    this.商品.percentage = "";
                } else if (x == "commissionPercentage") {
                    this.商品.commission = "";
                } else {
                    this.商品.commissionPercentage = "";
                }
                return;
            }
            if (x == "sellingPrice") {
                //售价
                if (this.商品.percentage && number_test.test(this.商品.percentage)) {
                    //比例
                    this.商品.percentage = Math.floor(parseFloat(this.商品.percentage) * 10) / 10;
                    this.商品.deduction = ((this.商品.percentage * this.商品.sellingPrice) / 100).toFixed(2);
                } else if (this.商品.deduction && number_test.test(this.商品.deduction)) {
                    this.商品.deduction = Math.floor(parseFloat(this.商品.deduction) * 100) / 100;
                    this.商品.percentage = ((this.商品.deduction / this.商品.sellingPrice) * 100).toFixed(1);
                }

                if (this.商品.commissionPercentage && number_test.test(this.商品.commissionPercentage)) {                    this.商品.commissionPercentage = Math.floor(parseFloat(this.商品.commissionPercentage) * 10) / 10;
                    this.商品.commission = ((this.商品.commissionPercentage * this.商品.sellingPrice) / 100).toFixed(1);
                } else if (this.商品.commission && number_test.test(this.商品.commission)) {
                    this.商品.commission = Math.floor(parseFloat(this.商品.commission) * 100) / 100;
                    this.商品.commissionPercentage = ((this.商品.commission / this.商品.sellingPrice) * 100).toFixed(1);
                }
            }

            if (x == "percentage") {
                //百分比
                this.商品.percentage = Math.floor(this.商品.percentage * 10) / 10; // this.商品.percentage.toFixed(1);
                var deduction = (this.商品.percentage / 100) * this.商品.sellingPrice;
                this.商品.deduction = Math.floor(deduction * 100) / 100;
            }
            if (x == "deduction") {
                //金额
                this.商品.deduction = Math.floor(this.商品.deduction * 100) / 100;
                var percentage = (this.商品.deduction / this.商品.sellingPrice) * 100;
                this.商品.percentage = Math.floor(percentage * 10) / 10;
            }

            if (x == "commissionPercentage") {
                //金额百分比
                this.商品.commissionPercentage = Math.floor(this.商品.commissionPercentage * 10) / 10;
                var commission = (this.商品.commissionPercentage / 100) * this.商品.sellingPrice;
                this.商品.commission = Math.floor(commission * 100) / 100;
            }
            if (x == "commission") {
                //金额
                this.商品.commission = Math.floor(this.商品.commission * 100) / 100;
                var commissionPercentage = (this.商品.commission / this.商品.sellingPrice) * 100;
                this.商品.commissionPercentage = Math.floor(commissionPercentage * 10) / 10;
            }
        },
        专享抵扣改变() {
            this.专享商品.deduction = Math.round(this.专享商品.deduction * 100) / 100;
        },
        //点击确定
        add() {
            var this_1 = this;
            // alert(text)
            var test_number = /^[0-9]*$/;
            if(!this.选择的分组名称){
                mui.toast("请选择分组", { duration: "long", type: "div" });
                return
            }else if (!this.商品.name) {
                mui.toast("请输入商品名称。", { duration: 2000, type: "div" });
                return;
            } else if (!this.商品.unit) {
                mui.toast("请输入单位。", { duration: 2000, type: "div" });
                return;
            } else if (!this.商品.marketPrice || isNaN(this.商品.marketPrice)) {
                mui.toast("请输入市场价。", { duration: 2000, type: "div" });
                return;
            } else if (!this.商品.sellingPrice || isNaN(this.商品.sellingPrice)) {
                mui.toast("请输入售价。", { duration: 2000, type: "div" });
                return;
            } else if (this.商品.sellingPrice > this.商品.marketPrice) {
                mui.toast("售价不能高于市场价", { duration: 2000, type: "div" });
                return;
            } else if (!this.商品.deduction || isNaN(this.商品.deduction)) {
                mui.toast("请输入省钱金额。", { duration: 2000, type: "div" });
                return;
            } else if (this.商品.deduction > this.商品.sellingPrice * 0.8) {
                mui.toast("可省不能大于售价的80%", { duration: 2000, type: "div" });
                return;
            } else if (this.商品.arrImg.length == 0) {
                mui.toast("请设置商品图片。", { duration: 2000, type: "div" });
                return;
            } else if (this.是否专享 && !this.专享商品.deduction) {
                mui.toast("请输入专享省钱。", { duration: 2000, type: "div" });
                return;
            } else if (this.是否专享 && this.专享商品.deduction <= this.商品.deduction) {
                mui.toast("专享省钱需大于商品省钱。", { duration: 2000, type: "div" });
                return;
            } else if (this.是否专享 && this.专享商品.deduction > this.商品.sellingPrice * 0.9) {
                mui.toast("省钱金额不能大于商品金额的90%即" + this.商品.sellingPrice * 0.9 + "元。", { duration: "long", type: "div" });
                return;
            } else if (this.是否专享 && !this.专享商品.maxNumber) {
                mui.toast("请输入专享最多购买数量", { duration: "long", type: "div" });
                return;
            } else if (this.是否专享 && (this.专享商品.maxNumber < 1 || this.专享商品.maxNumber > 100)) {
                mui.toast("专享购买数量为1-100", { duration: "long", type: "div" });
                return
            }
            if(this.商品.isstock==1){
                if(!this.商品.stock || this.商品.stock<0){
                    mui.toast("请输入库存", { duration: "long", type: "div" });
                    return
                }
            }
            
            if (this.招募信息) {
                if (this.商品.commission) {
                    if (this.商品.commission < 0 || this.商品.commission > this.商品.sellingPrice) {
                        mui.toast("佣金不能大于售价填写有误", { duration: 2000, type: "div" });
                        return
                    } else if (this.商品.sellingPrice * this.招募信息.mincommissionscale / 100 > this.商品.commission) {
                        mui.toast("佣金不能小于" + this.商品.sellingPrice * this.招募信息.mincommissionscale / 100, { duration: 2000, type: "div" });
                        return
                    }
                }
            } 

            // this.商品.img=[];
            this.商品.shopid = this.myshop.shopid;
            this.商品.isconsult = 0;
            // var 商品描述=this.$refs.content_1.innerHTML
            // if(商品描述){
            //     var content_box内容=this.$refs.content_box.innerHTML;
            //     content_box内容.replace('contenteditable="true"','').replace("contenteditable='true'",'');
            //     this.商品.remark = content_box内容;
            // }else{
            //     this.商品.remark = "";
            // }
            this.商品.state = 1;
            console.log('可以提交');
            if (this.是否专享) {
                this.专享商品.commodityId = this.商品.id;
                this.专享商品.typeName = this.专享商品.type == 0 ? "新人专享" : "生日专享";
                this.专享商品.shopid = this.myshop.shopid;
                this.专享商品.percentage = Math.fround((this.专享商品.deduction / this.商品.sellingPrice) * 100);
            }
            if (this.商品.id == "") {
                //添加商品
                if (!this.是否专享) {
                    openloading(true);
                    this.添加商品(this.商品).then(x => {
                        openloading(false);
                        if (x.data.code == 200) {
                            mui.toast("设置成功", { duration: "long", type: "div" });
                            history.back();
                        } else {
                            mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                        }
                    }).catch(err => {
                        mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                        openloading(false);
                    });
                } else {
                    this.添加商品返回值();
                }
            } else {
                // console.log('修改',this.商品)
                if (this.是否专享) {
                    if (this.专享商品.id) {
                        this.修改商品和修改专享();
                    } else {
                        this.修改商品和添加专享();
                    }
                } else if (!this.是否专享 && this.专享商品.id) {
                    this.修改商品和删除专享();
                } else {
                    openloading(true);
                    this.修改商品([this.商品]).then(x => {
                        openloading(false);
                        if (x.data.code == 200) {
                            mui.toast("设置成功", { duration: "long", type: "div" });
                            history.back();
                        } else {
                            mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                        }
                    }).catch(err => {
                        mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                        openloading(false);
                    });
                }
            }
        },
        async 添加商品返回值() {
            openloading(true);
            var res = await this.添加商品(this.商品);
            if (res.data.code == 200) {
                this.专享商品.commodityId = res.data.data;
                this.添加专享(this.专享商品).then(x => {
                    if (x.data.code == 200) {
                        mui.toast("添加成功", { duration: "long", type: "div" });
                        history.back();
                    } else {
                        var str = "<div>商品添加成功，设置专享失败</div>";
                        str += x.data.msg ? x.data.msg : x.data.message;
                        mui.alert(str, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false);
                }).catch(err => {
                    mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
                    openloading(false);
                });
            } else if (res.data.msg || res.data.message) {
                openloading(false);
                mui.alert(res.data.msg ? res.data.msg : res.data.message, "提示", "我知道了", function () { }, "div");
            } else {
                openloading(false);
                mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            }
        },
        修改商品和修改专享() {
            openloading(true);
            this.修改商品([this.商品]).then(x=>{
                if(x.data.code==200){
                    this.修改专享(this.专享商品).then(r=>{
                        if(r.data.code==200){
                            mui.toast("设置成功", { duration: "long", type: "div" });
                            history.back();
                        }else{
                            mui.alert(r.data.msg ? r.data.msg : r.data.message, "提示", "我知道了", function () { }, "div");
                        }
                    }).catch(er_1=>{
                        mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
                    })
                }else{
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err=>{
                openloading(false);
                mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            })
            // Promise.all([this.修改商品([this.商品]), this.修改专享(this.专享商品)]).then(x => {
            //     openloading(false);
            //     if (x[0].data.code == 200 && x[1].data.code == 200) {
            //         mui.toast("设置成功", { duration: "long", type: "div" });
            //         history.back();
            //     } else {
            //         var str = "";
            //         str += x[0].data.msg ? x[0].data.msg : x[0].data.message;
            //         str += x[1].data.msg ? x[1].data.msg : x[1].data.message;
            //         mui.alert(str, "提示", "我知道了", function () { }, "div");
            //     }
            // }).catch(err => {
            //     openloading(false);
            //     mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            // });
        },
        async 修改商品和添加专享() {
            openloading(true);
            await this.修改商品([this.商品]);
            this.添加专享(this.专享商品).then(x => {
                if (x.data.code == 200) {
                    mui.toast("设置成功", { duration: "long", type: "div" });
                    history.back();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
            }).catch(err => {
                openloading(false);
                mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            });
        },
        修改商品和删除专享() {
            openloading(true);
            Promise.all([this.修改商品([this.商品]), this.删除专享(this.专享商品)]).then(x => {
                if (x[0].data.code == 200 && x[1].data.code == 200) {
                    mui.toast("设置成功", { duration: "long", type: "div" });
                    history.back();
                } else {
                    var str = "";
                    str += x[0].data.msg ? x[0].data.msg : x[0].data.message;
                    str += x[1].data.msg ? x[1].data.msg : x[1].data.message;
                    mui.alert(str, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
            }).catch(err => {
                openloading(false);
                mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            });
        },
        getwd(x){
            this.商品.unit=x;
        },
        //选择单位
        selset_unit() {
            this.$refs.xzdw.显示选择单位=true;
            return
            var this_1 = this;
            this.Picker1.setData(obj);
            this.Picker1.show(x => {
                this.商品.unit=x[0].value
            });
        },
        //删除图片
        delete_img(index) {
            this.商品.arrImg.splice(index, 1);
            if (this.$store.state.Select_picture.type == "huanjing") {
                this.$store.state.Select_picture.list.splice(index, 1);
            }
        },
        async 初始化() {
            openloading(true)
            if (!this.myshop || !this.myshop.shopid) {
                await this.获取店铺()
            }
            await this.数据初始化(this.id)
            // this.$refs.content_1.innerHTML=this.商品.remark;
            if(!this.是否重新获取数据){
                this.获取选择的图片();
            }
            this.设置是否重新获取数据(false)


            openloading(false)

            var 查询招募信息_query = {
                start: 0,
                length: 10,
                shopid: this.myshop.shopid
            }
            var 商品分组_query={
                start:0,
                length:1000,
                shopid: this.myshop.shopid
            }
            Promise.all([
                api_查询招募列表(查询招募信息_query),
                api_查询商品分组列表(商品分组_query)
            ]).then(x=>{
                if (x[0].data.code == 200 && x[0].data.data.data.length > 0) {
                    this.招募信息 = x[0].data.data.data[0]
                }
                if(x[1].data.code == 200){
                    this.商品分组类型=x[1].data.data.data;
                }
            })


        }
    },
    beforeCreate: function () {
        // console.group('------beforeCreate创建前状态------');
    },
    created: function () {
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted: function () {
        var this_1 = this;
        this.id=this.$route.query.id;
        this.初始化(this.id)
        
        //店铺类型
        this.Picker1 = new mui.PopPicker({
            layer: 1
        });

        this.swiper = new Swiper(this.$refs.环境图片, {
            // loop: true,
            // autoplay: true,
            slidesPerView: "auto",
            observer: true,
            spaceBetween: 10,
            on: {
                transitionEnd() {
                    console.log("过渡结束transitionEnd", this.activeIndex);
                    if (this_1.商品.arrImg.length - this.activeIndex > 2) {
                        this_1.left = true;
                    } else {
                        this_1.left = false;
                    }
                }
            }
        });
        

    },
    activated() {
        console.log("再次进入页面");
    },
    deactivated() { },
    beforeUpdate: function () {
        // console.group('beforeUpdate 更新前状态===============》');
    },
    updated: function () {
        // console.group('updated 更新完成状态===============》');
    },
    beforeDestroy: function () {
        // console.group('beforeDestroy 销毁前状态===============》');
    },
    destroyed: function () {
        // this.editor.destroy();	//销毁
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {
        $route() {
            var query = this.$route.query;
            // console.log(query)
            //选择图片
            if (!query.Album_show) {
                this.Album_show = false;
            } else {
                this.Album_show = true;
            }
        }
    }
};
</script>

<style>
/* vue-html5-editor */
.editor {
    -webkit-user-select: text;
    -moz-user-select: text;
}
</style>
<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.mui-content {
    padding-bottom: 50px;
}
.box_1 .mui-table-view-cell:after {
    right: 15px;
}

.选择专享信息 {
    background: #ffffff;
    margin: 3px 0px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    padding: 5px 15px 1px;
    > li {
        display: flex;
        align-items: center;
        height: 30px;
        margin: 0px 0px 5px 0px;
        > div {
            display: flex;
            align-items: center;
        }
        > div:nth-child(1) {
            flex-grow: 1;
        }
    }
    input {
        background: #e5e5e5;
        width: 92px;
        height: 30px;
        margin: 0px;
        padding: 0px;
        text-align: center;
        color: rgba(80, 80, 80, 1);
        font-size: 14px;
        border: none;
        border-radius: 0px;
        margin: 0px 5px 0px 0px;
    }
    .单选 {
        font-size: 20px;
        margin: 0px 16px 0px 0px;
        height: 20px;
    }
    .icon-xuanze2 {
        color: #1894dc;
    }
}

.box_1 {
    margin: 3px 0px 3px 0px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .item_1 {
        padding-right: 37px;
    }
    .item_box {
        position: relative;
        display: flex;
        align-items: center;
        padding-top: 0px;
        padding-bottom: 0px;
        min-height: 44px;
        white-space: nowrap;
        .money {
            position: absolute;
            right: 50px;
            top: 0px;
            bottom: 0px;
            margin: auto;
            width: 80px;
            height: 30px;
            line-height: 30px;
            background: #eeeeee;
            font-size: 10px;
            text-align: center;
        }
        .text_1 {
            flex-shrink: 0;
            width: 90px;
        }
        .title_2 {
            flex-shrink: 0;
            width: 60px;
        }
        input {
            margin: 0px;
            padding: 0px;
            height: auto;
            border: none;
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            background: none;
        }
        .input_1 {
            background-color: rgba(229, 229, 229, 1);
            // max-width: 96px;
            height: 30px;
            margin: 0px 4px;
            // flex-shrink: 1;
            flex-grow: 1;
        }
        .text_3 {
            width: 90px;
            flex-shrink: 0;
            text-align: right;
        }
        .icon_1 i {
            font-size: 16px;
        }
        .zhanwei {
            flex-grow: 1;
        }
        .radio_1 {
            margin: 0px 16px 0px 0px;
        }
        .twtreid,
        .commissionType {
            padding: 0px 16px 0px 0px;
        }
    }
}

.box_3 {
    background: #ffffff;
    margin: 0px 0px 3px 0px;
    .title_1 {
        padding: 11px 15px;
        font-size: 0.14rem;
        color: rgba(80, 80, 80, 1);
    }
    .lunbo {
        display: flex;
        padding: 0px 0px 11px 0px;
        .left_1 {
            width: 15px;
            height: 0.9rem;
            line-height: 0.9rem;
            flex-shrink: 0;
            position: relative;
            i {
                font-size: 16px;
            }
        }
        .img_list {
            border: 1px solid #e4e4e4;
            flex-grow: 1;
            width: 0;
            .swiper-container {
                width: 100%;
            }
            .swiper-slide {
                width: 120px;
                height: 0.9rem;
                span {
                    position: absolute;
                    right: 0px;
                    top: 0px;
                    width: 0.32rem;
                    height: 0.32rem;
                    background-color: rgba(153, 153, 153, 0.5);
                    color: #ffffff;
                    text-align: center;
                    line-height: 0.32rem;
                    font-size: 0.22rem;
                }
            }
            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }
        .right_1 {
            width: 0.4rem;
            height: 0.9rem;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(229, 229, 229, 1);
            span {
                width: 0.26rem;
                height: 0.26rem;
                border-radius: 100%;
                border: 1px solid rgba(40, 148, 220, 1);
                text-align: center;
                color: rgba(40, 148, 220, 1);
            }
        }
    }
}

.editor {
    margin-bottom: 50px;
}

.box_4 {
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    // header_background
    background: $header_background;
    height: 0.44rem;
    line-height: 0.44rem;
    color: #ffffff;
    text-align: center;
}

.contenteditable_box {
    height: 400px;
    // flex-grow: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #c8c8ca;
    border-radius: 3px;
    .header {
        flex-shrink: 0;
        display: flex;
        background: #f4f4f4;
        padding: 3px;
        flex-wrap: wrap;
        div {
            height: 22px;
            font-size: 12px;
            padding: 0px 3px;
            line-height: 22px;
            color: #565656;
            margin: 0px 3px;
        }
        select {
            height: 100%;
            padding: 0px 5px;
            margin: 0px;
            border: 1px solid #c8c8ca;
            appearance: menulist;
        }
        .bg {
            width: 22px;
            background-image: url("~@/assets/image/icons.png");
            // background-image: url('/image/icons.png');
        }
        .zitiyanse {
            background-position: -760px 0;
        }
        .shiping {
            background-position: -320px -20px;
        }
        .tupian {
            background-position: -380px 0px;
        }
        .font_color {
        }
    }
    .content_box {
        flex-grow: 1;
        overflow: auto;
        position: relative;
    }
    .content_1 {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: #ffffff;
        padding: 5px;
        // -webkit-user-select:text;
        user-select: text;
        -webkit-user-select: text;
    }
    .content_1:empty:before {
        content: "请填写商品介绍，支持文字、图片、视屏链接。";
        color: gray;
        position: absolute;
        top: 3px;
        left: 5px;
    }
}

.video_box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    .close_1 {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #5a5a5a;
    }
    .mask {
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
    }
    .cont_1 {
        width: 250px;
        background: #ffffff;
        position: relative;
        z-index: 1;
        padding: 10px;
        .title {
            font-size: 14px;
            margin: 0px 0px 5px;
            color: #565656;
        }
        input {
            padding: 0px 15px;
            height: 30px;
            font-size: 14px;
        }
    }
    .btn_2 {
        background: $header_background;
        width: 100%;
        color: #ffffff;
    }
}
</style>
<style lang="scss">
.contenteditable_box {
    .content_1 * {
        user-select: text;
        -webkit-user-select: text;
    }
}
</style>
