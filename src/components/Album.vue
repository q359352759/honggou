<template>
    <div id="Album">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">选择图片</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="box_1" v-if="!seetype">
                <!-- <ul class="box_1"> -->
                <li :class="{'active':type==3}" @click="selset_type(3)">
                    <div>商品</div>
                </li>
                <li :class="{'active':type==1}" @click="selset_type(1)">
                    <div>店招</div>
                </li>
                <li :class="{'active':type==2}" @click="selset_type(2)">
                    <div>环境</div>
                </li>
                <li :class="{'active':type==4}" @click="selset_type(4)">
                    <div>描述</div>
                </li>
                <li :class="{'active':type==5}" @click="selset_type(5)">
                    <div>其他</div>
                </li>
            </ul>
            <ul class="box_2" @scroll="scroll($event)">
                <li class="add" @click="add_img()">
                    <div>
                        <!-- <span>+</span> -->
                        <i class="icon iconfont icon-plus-add"></i>
                    </div>
                </li>
                <li v-for="(item, index) in img_list_1" :key="index">
                    <div>
                        <img @click="select_img(item)" :src="item.url" alt="">
                        <div @click="select_img(item)" class="radio_1" :class="{'active':item.active}">
                            <i class="icon iconfont icon-xuanze"></i>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="box_3">
                <li>可用：{{capacity}}M</li>
                <li>
                    <span>已选择{{Select_picture.length}}张</span>
                    <button @click="Sure()">确 定</button>
                </li>
            </ul>
        </div>

        <div class="Cropper_box" v-show="Cropper_show">
            <div class="cont_1">
                <VueCropper ref="cropper" :mode="option.mode" :outputSize="option.outputSize" :centerBox="option.centerBox" :viewMode="1" :img="option.img" :outputType="option.outputType" :info="true" :canMove="option.canMove" :fixedBox="option.fixedBox" :canMoveBox="option.canMoveBox" :autoCrop="true" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight"></VueCropper>
            </div>
            <ul class="footer_1">
                <li @click="close_1()">
                    <i class="icon iconfont icon-quxiao"></i>
                </li>
                <li @click="rotateLeft()">
                    <i class="icon iconfont icon-xuanzhuan1"></i>
                </li>
                <li @click="rotateRight()">
                    <i class="icon iconfont icon-xuanzhuan"></i>
                </li>
                <li @click="confirm()">
                    <i class="icon iconfont icon-xuanze"></i>
                </li>
            </ul>
        </div>

        <div class="mui-hidden zhengmianInput">
            <input type="file" accept="image/*" name="" id="">
        </div>

        <canvas ref="myCanvas" class="myCanvas" width="1920px"></canvas>

    </div>
</template>

<script>
// 1店招  2环境 3商品 4描述 5其他
import { openloading } from "@/assets/js/currency.js";
import { VueCropper } from "vue-cropper";
import $ from "jquery";
import { mapGetters ,mapActions } from "vuex";
export default {
    name: "",
    props: {
        size: {
            // type:String,
            // required:true,
            default: "0"
        },
        type: {
            //图片类型
            default: 3
        },
        seetype: {
            //查看类型
            default: ""
        }
    },
    //size 选择长度 'sesstype'
    components: {
        VueCropper
    },
    data() {
        return {
            画布base64: "",
            画布img: "",
            degree: 0, //旋转角度
            //==============裁剪框配置
            Cropper_show: false, //显示裁剪框
            option: {
                img: "",
                outputSize: 1, //outputSize
                outputType: "png", //png,jpeg,webp
                canMove: true, //上传图片是否可以移动
                fixedBox: true, //裁剪框固定大小不动 true 固定
                canMoveBox: false, //截图框能否拖动
                autoCrop: true, //是否默认生成截图框
                fixedNumber: [30, 22], //截图框的宽高比例
                autoCropWidth: 300,
                autoCropHeight: 220,
                fixed: true, //是否开启截图框宽高固定比例 默认true
                centerBox: true, //截图框是否被限制在图片里面
                canScale: true, //图片是否允许滚轮缩放
                mode: "auto 220px" //contain , cover, 100px, 100% auto
            },
            // type:3,
            radio_type_2: true,
            page_index: 0,
            page_size: 20,
            img: "",
            get_index: 0, //第一次加载
            // seetype:'',          //url参数 1店招  2环境 3商品 4描述 5其他
            img_list: [], //图片列表
            total: 0,
            loading: true,
            capacity: 0, //容量
            Select_picture: []
        };
    },
    computed: {
        ...mapGetters({
            myshop:'get_myshop'
        }),
        img_list_1() {
            var this_1 = this;
            var Select_picture = this.Select_picture;
            var img_list = this.img_list;

            for (var i = 0; i < img_list.length; i++) {
                for (var j = 0; j < Select_picture.length; j++) {
                    if (img_list[i].url == Select_picture[j]) {
                        // img_list[i].active=true;
                        this_1.$set(img_list[i], "active", true);
                    }
                }
            }
            return img_list;
        },
        Select_picture_1() {
            return this.$store.state.Select_picture.list;
        }
    },
    methods: {
        ...mapActions({
            查询店铺:"getMyshop"
        }),
        init_img() {
            var this_1 = this;
            var img_list = this.img_list;
            for (var i = 0; i < img_list.length; i++) {
                this_1.$set(img_list[i], "active", false);
            }
        },
        //确定
        Sure() {
            if (this.size == 0) {
                this.$emit("setlist", this.Select_picture);
                history.back();
            } else if (this.size != 0 && this.Select_picture.length <= this.size) {
                this.$emit("setlist", this.Select_picture);
                history.back();
            } else {
                mui.toast("最多选择" + this.size + "张。", {
                    duration: "long",
                    type: "div"
                });
            }
        },
        //选择
        select_img(x) {
            this.$set(x, "active", !x.active);
            this.Select_picture = this.img_list.filter(x => x.active);
        },
        //滚动条
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (
                h + t >= sh - 10 &&
                !this.loading &&
                this.img_list.length < this.total
            ) {
                this.page_index++;
                this.get_photo();
                console.log("到底底部");
            }
        },
        //添加图片
        add_img() {
            // openloading(true);
            $(".zhengmianInput").html(
                '<input type="file" accept="image/*" name="" id="">'
            );
            $(".zhengmianInput")
                .children()
                .click();
        },
        //关闭裁剪弹出框
        close_1() {
            this.Cropper_show = false;
        },
        //确定裁剪
        confirm() {
            openloading(true);
            this.loading = true;
            this.Cropper_show = false;
            this.$refs.cropper.getCropData(data => {
                this.img = data;
                this.add_phone();
                this.get_capacity();
            });
        },
        //添加图片
        add_phone() {
            var obj = [
                {
                    type: this.type,
                    url: this.img,
                    shopid: this.myshop.shopid
                }
            ];

            this.$axios({
                method: "post",
                url: "/api-s/shops/photo/add",
                data: obj
            })
                .then(x => {
                    openloading(false);
                    this.loading = false;
                    if (x.data.code == 200) {
                        this.img_list.push(x.data.data[0]);
                    } else if (x.data.code) {
                        mui.alert(x.data.msg, "提示", "我知道了", function () { }, "div");
                    } else {
                        mui.alert(x.data.error, "提示", "我知道了", function () { }, "div");
                    }
                    console.log("添加", x);
                })
                .catch(err => {
                    openloading(false);
                    this.loading = false;
                    mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                    console.log("添加失败", err);
                });
        },
        //设置画布
        set_myCanvas() {
            console.log("设置画布");
            var this_1 = this;
            var ww = window.outerWidth;
            var c = this.$refs.myCanvas;
            var cxt = c.getContext("2d");
            // this.cxt=c.getContext("2d");
            cxt.clearRect(0, 0, c.width, c.height); //清除画布
            this.画布img = new Image();
            this.画布img.src = this.画布base64;
            this.画布img.onload = () => {
                console.log(
                    0,
                    0,
                    c.width,
                    (this_1.画布img.height * c.width) / this_1.画布img.width
                );
                this_1.degree = 0;
                c.height = (this_1.画布img.height * c.width) / this_1.画布img.width;
                cxt.drawImage(this_1.画布img, 0, 0, c.width, c.height);
                var imgData = c.toDataURL();
                this_1.Cropper_show = true;
                if (30 / 22 > c.width / c.height) {
                    this_1.option.mode = "300px auto";
                } else {
                    this_1.option.mode = "auto 225px";
                }
                this_1.option.img = imgData;
                openloading(false);
            };
        },
        旋转画布(type) {
            openloading(true);
            var this_1 = this;
            this.degree += type ? 90 : -90;
            var degree = (this.degree %= 360);
            var c = this.$refs.myCanvas;
            var cxt = c.getContext("2d");
            var 新高度 = (this.画布img.height * c.width) / this.画布img.width;
            if ((degree / 90) % 2 == 0 || (degree / 90) % 2 == -0) {
                //旋转了180度
                c.height = (this.画布img.height * c.width) / this.画布img.width;
            } else {
                c.height = (c.width / this.画布img.height) * this.画布img.width;
            }
            cxt.save();
            cxt.clearRect(0, 0, c.width, c.height);
            cxt.translate(c.width / 2, c.height / 2);
            cxt.rotate((degree / 180) * Math.PI);
            if ((degree / 90) % 2 == 0 || (degree / 90) % 2 == -0) {
                cxt.translate(-c.width / 2, -c.height / 2);
                cxt.drawImage(this.画布img, 0, 0, c.width, c.height);
            } else {
                cxt.translate(-c.height / 2, -c.width / 2);
                cxt.drawImage(this.画布img, 0, 0, c.height, c.width);
            }
            cxt.restore();
            var imgData = c.toDataURL();
            this_1.option.img = imgData;
            if (30 / 22 > c.width / c.height) {
                this_1.option.mode = "300px auto";
            } else {
                this_1.option.mode = "auto 225px";
            }
            setTimeout(() => {
                openloading(false);
            }, 500);
        },
        //左转
        rotateLeft() {
            // this.$refs.cropper.rotateLeft();
            this.旋转画布(false);
        },
        //右转
        rotateRight() {
            this.旋转画布(true);
            // this.$refs.cropper.rotateRight();
        },
        //选择类型
        selset_type(x) {
            this.type = x;
            this.img_list = [];
            this.page_index = 0;
            this.get_photo();
        },
        //查询相册
        get_photo() {
            openloading(true);
            this.loading = true;
            this.get_index = 1;
            this.$axios({
                method: "get",
                url: "/api-s/shops/photo/findAll",
                params: {
                    type: this.type,
                    start: this.page_index * this.page_size,
                    length: this.page_size,
                    shopid: this.myshop.shopid
                }
            }).then(x => {
                if (x.data.code == 200) {
                    this.img_list = this.img_list.concat(x.data.data.data);
                    this.total = x.data.data.total;
                } else if (x.data.code) {
                    mui.alert(x.data.msg, "提示", "我知道了", function () { }, "div");
                } else {
                    mui.alert(x.data.error, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
                this.loading = false;
                console.log("获取数据", x);
            }).catch(err => {
                openloading(false);
                this.loading = false;
                mui.toast("系统错误，请稍后再试。", { duration: "long", type: "div" });
            });
        },
        //查看店铺相册容量
        get_capacity() {
            this.$axios({
                method: "get",
                url: "/api-s/shops/photo/capacity",
                params: {
                    shopid: this.myshop.shopid
                }
            }).then(x => {
                if (x.data.code == 200) {
                    this.capacity = x.data.data;
                }
                console.log("获取相册容量", x);
            }).catch(err => {
                console.log(err);
            });
        },
        async 初始化(){
            if(!this.myshop || !this.myshop.shopid){
                await this.查询店铺()
            }
            this.get_photo();
            //获取相册容量
            this.get_capacity();
        }

        //
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
        var query = this.$route.query;

        this.Select_picture = this.$store.state.Select_picture.list;
        this.初始化()
        //选择文件
        $(".zhengmianInput").on("change", "input", function () {
            var file = $(this)[0].files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file); // 读出 base64
            reader.onloadend = function () {
                var img = new Image();
                img.src = reader.result;
                img.onload = function () {
                    this_1.画布base64 = reader.result;
                    this_1.set_myCanvas();
                };
                openloading(false);
            };
        });

        // console.group('------mounted 挂载结束状态------');
    },
    activated() {
        console.log(11111111);
    },
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
        // document.querySelector(".mui-slider_1").removeEventListener("slide", function() {});
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {
        Select_picture_1() {
            console.log("选择的图片数据发生变化");
            this.Select_picture = this.$store.state.Select_picture.list;
            this.init_img();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.myCanvas {
    border: 1px solid red;
    position: fixed;
    left: -1940px;
}
.mui-bar {
    z-index: 1060;
}
.mui-content {
    display: flex;
    flex-direction: column;
    z-index: 1050;
}

.box_1 {
    flex-shrink: 0;
    display: flex;
    background: #ffffff;
    text-align: center;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    line-height: 0.38rem;
    padding: 0px 0.15rem;
    > li {
        width: 20%;
    }
    > li.active div {
        border-bottom: 2px solid $header_background;
    }
}

.box_2 {
    // flex-grow: 1;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 12px 0.11rem 0.5rem;
    > li {
        width: calc(100% / 3);
        padding: 0px 0.04rem 5px;
        img {
            width: 100%;
        }
        > div {
            min-height: 0.8rem;
            position: relative;
            font-size: 0px;
            border: 1px solid #dedede;
        }
    }
    .radio_1 {
        position: absolute;
        right: 0.08rem;
        bottom: 0.08rem;
    }
    .add {
        height: 0.87rem;
        display: flex;
        > div {
            flex-grow: 1;
            height: 100%;
            background: #999999;
            color: #ffffff;
            font-size: 0.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.box_3 {
    position: absolute;
    width: 100%;
    bottom: 0px;
    left: 0px;
    display: flex;
    background: #ffffff;
    height: 0.44rem;
    padding: 0px 0.15rem;
    justify-content: space-between;
    align-items: center;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    // z-index: 1050;
    > li {
        display: flex;
        align-items: center;
    }
    button {
        width: 0.7rem;
        height: 0.26rem;
        padding: 0px;
        background: $header_background;
        color: #ffffff;
        margin: 0px 0px 0px 11px;
        border: none;
    }
}

// 单选
.radio_1 {
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 16px;
    border-radius: 100%;
    border: 2px solid #cccccc;
    overflow: hidden;
    i {
        font-size: 8px;
        display: none;
    }
}
.radio_1.active {
    background: rgba(58, 182, 237, 1);
    border: 2px solid rgba(58, 182, 237, 1);
    color: #ffffff;
    i {
        display: inline-block;
    }
}
</style>
<style lang="scss">
// 裁剪框
#Album .Cropper_box {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #cdcdcd;
    z-index: 1061;
    .cont_1 {
        height: 100%;
    }
    .footer_1 {
        position: absolute;
        width: 100%;
        left: 0px;
        bottom: 0px;
        display: flex;
        font-size: 20px;
        color: #ffffff;
        padding: 25px 0px;
        justify-content: space-around;
    }

    .vue-cropper {
        background: #e5e5e5;
    }
    .cropper-modal {
        background: rgba(181, 181, 181, 0.5);
    }
    .cropper-face {
        background-size: cover;
        background-color: rgba(0, 0, 0, 0);
        opacity: 1;
        border: 1px solid #ffffff;
    }
    .cropper-view-box {
        outline: none;
    }
}
</style>
