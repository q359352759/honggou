<template>
    <div class="introduction">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">店铺简介</h1>
        </header>
        <!-- <div class="mui-content mui-fullscreen">
            <ul class="contenteditable_box">
                <li class="header">
                    <div>
                        <select name="16px" v-model="font_size" @change="change_font_size()">
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
                    <div class="content_1" ref="content_1" :style="{'font-size':font_size,'color':font_color}" v-html="html" contenteditable="true"></div>
                </li>
            </ul>
            <div @tap="submit()" class="btn_1">保&nbsp;存</div>
            <div class="box_2" v-show="video_show">
                <div class="mask"></div>
                <div class="cont_1">
                    <div @tap="close_1()" class="close_1"><i class="icon iconfont icon-quxiao"></i> </div>
                    <div class="title">请输入视频链接</div>
                    <div class="input_box">
                        <input type="text" v-model="video_url">
                    </div>
                    <button @tap="queding()" class="btn_2">确定</button>
                </div>
            </div>
        </div> -->
        <div class="editor" ref="editor" ></div>
        <div @click="submit()" class="btn_1">保&nbsp;存</div>
        <Album v-if="Album_show" :size="size" :seetype="seetype" :type="seetype" v-on:setlist="reslist" />
    </div>
</template>

<script>
import Editor from 'wangeditor'

import { isAndroid, openloading } from "@/assets/js/currency";
import Album from "@/components/Album.vue";
import $ from "jquery";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "",
    components: {
        Album
    },
    data() {
        return {
            
            editor:'',


            font_size: "16px",
            font_color: "#000000",
            isAndroid: true,
            get_index: 0,
            seetype: 5, //1店招  2环境 3商品 4描述 5其他
            Album_show: false,
            video_show: false,
            size: 10,
            video_url: "",
            synopsis: {
                //简介
                id: "",
                shopid: "",
                state: 0,
                remark: ""
            },
            html: ""
        };
    },
    computed: {
        ...mapGetters({
            myshop: 'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺: 'getMyshop'
        }),
        //选择字体大小
        change_font_size() {
            console.log(this.font_size);
        },
        //选择颜色
        chnage_font_color() {
            console.log(this.font_color);
            this.$refs.font_color.click();
        },
        //选择图片返回值
        reslist(list) {
            console.log("取得参数", list);
            if (list.length > 0) {
                var html = "";
                for (var i = 0; i < list.length; i++) {
                    html += '<p style="margin:0px;font-size:0px;"><img style="max-width: 100%;" width="100%" src="' + list[i].url + '" alt=""></p><div style="min-height:20px;"></div>';
                }
                console.log(html);
                // $(".content_1").append(html);
                 var div=this.editor.selection.getSelectionContainerElem()[0]
                $(div).after(html)
            }
        },
        //选择图片
        set_Album_show() {
            window.scroll(0, 0);
            // this.Album_show=true;
            this.$router.push("/introduction?Album_show=1");
        },
        //点击添加视频
        add_shiping() {
            window.scroll(0, 0);
            this.video_show = true;
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
        //关闭视频输入框
        close_1() {
            history.back();
        },
        submit() {
            // this.$refs.content_1.setAttribute('contenteditable',false)
            // this.synopsis.remark = this.$refs.content_box.innerHTML;
            var 内容=$(this.$refs.editor).find('.w-e-text').html();
            console.log(内容)
            this.synopsis.remark=内容;
            this.synopsis.shopid = this.myshop.shopid;
            if (this.synopsis.id) {
                this.update();
            } else {
                this.add();
            }
        },
        update() {
            this.$axios({
                method: "post",
                url: "/api-s/shops/synopsis/update",
                data: this.synopsis
            }).then(x => {
                console.log("修改返回值", x);
                if (x.data.code == 200) {
                    // this.img_list=this.img_list.concat(x.data.data.data);
                    mui.toast("设置成功。", { duration: "long", type: "div" });
                    history.back();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.messag, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err => {
                console.log(err);
                mui.toast("系统失败，稍后再试。", { duration: "long", type: "div" });
            });
        },
        add() {
            this.$axios({
                method: "post",
                url: "/api-s/shops/synopsis/add",
                data: this.synopsis
            }).then(x => {
                console.log("添加返回值", x);
                if (x.data.code == 200) {
                    // this.img_list=this.img_list.concat(x.data.data.data);
                    mui.toast("设置成功。", { duration: "long", type: "div" });
                    history.back();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err => {
                console.log(err);
                mui.toast("系统失败，稍后再试。", { duration: "long", type: "div" });
            });
        },
        //查询简介接口
        get_synopsis() {
            this.get_index = 1;

            this.$axios({
                method: "get",
                url: "/api-s/shops/synopsis/" + this.myshop.shopid
            }).then(x => {
                console.log("查询简介", x);
                if (x.data.code == 200) {
                    if (!x.data.data) {
                        return;
                    }
                this.synopsis=x.data.data;
                var content_box内容= this.synopsis.remark
                    content_box内容=content_box内容.replace(/contenteditable/g,'a')
                    if(content_box内容){
                        this.editor.txt.append(content_box内容)
                    }
                    // var this_1 = this;
                    // var str = this.synopsis.remark;
                    // var div = $(str);
                    // this.font_size = div.css("font-size") ? div.css("font-size") : "16px";
                    // this.font_size = parseInt(this.font_size) > 10 ? this.font_size : "10px";
                    // this.font_color = div.css("color") ? div.css("color") : "#000000";
                    // this.html = div.html();
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.messag, "提示", "我知道了", function () { }, "div");
                }
            }).catch(err => {
                mui.toast("系统错误，稍后再试。", { duration: "long", type: "div" });
            });
        },
        async 初始化() {
            if (!this.myshop || !this.myshop.shopid) {
                await this.获取店铺()
            }
            this.get_synopsis();
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
        // console.log(this.myshop);
        var this_1 = this;
        this.editor = new Editor(this.$refs.editor);
        this.editor.customConfig.menus = [
                    'bold',  // 粗体
                    'italic',  // 斜体
                    'underline',  // 下划线
                    'strikeThrough',  // 删除线
                    // 'backColor',  // 背景颜色
                    'link',  // 插入链接
                    // 'list',  // 列表
                    
                    'quote',  // 引用
                    'emoticon',  // 表情
                    // 'image',  // 插入图片
                    'table',  // 表格
                    'video',  // 插入视频
                    // 'code',  // 插入代码
                    // 'undo',  // 撤销
                    // 'redo',  // 重复
                    'foreColor',  // 文字颜色
                    'head',  // 标题
                    'fontSize',  // 字号
                    'fontName',  // 字体
                    'justify',  // 对齐方式
            ]
            this.editor.create()
            var 自定义按钮='<div class="跳转相册 w-e-menu"><i class="w-e-icon-image"></i></div>'
            $('.w-e-toolbar').append(自定义按钮)
            $('.editor').on('click','.跳转相册',()=>{
                this.$router.push("?Album_show=1");
            })


            $(this.$refs.editor).on('blur','.w-e-text-container',function(){
                setTimeout(()=>{
                    openloading(true)
                },200)
                setTimeout(()=>{
                    window.scroll(0, 0);
                    openloading(false)
                },1000)
            })
        this.初始化();
        

        var query = this.$route.query;
        if (!query.video_show) {
            this.video_show = false;
        } else {
            this.video_show = true;
        }

        //判断是不是安卓
        // alert(isAndroid())
    },
    activated() { },
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
        // this.editor.destroy()
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {
        $route(to, from) {
            var query = this.$route.query;
            //选择图片
            if (!query.Album_show) {
                this.Album_show = false;
            } else {
                this.Album_show = true;
            }
            //输入视频
            if (!query.video_show) {
                this.video_show = false;
            } else {
                this.video_show = true;
            }
        },
        myshop() {
            if (this.myshop && this.myshop.id) {
                if (this.get_index == 0) {
                    this.get_synopsis();
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";


.editor{
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    padding: 44px 0px 44px;
    width: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .w-e-toolbar{
        flex-shrink: 0;
        background: #ffffff !important;
        border:none !important;
        flex-wrap: wrap;
        position: relative;
        z-index: 3;
    }
    /deep/ .w-e-text-container{
        flex-grow: 1;
        height: 400px !important;
        margin:  3px;
        border: none !important;
        background: #ffffff;
        overflow: auto !important;
         z-index:2 !important;
    }
    /deep/ .w-e-menu{
        z-index: 3 !important;
    }
}

.mui-content {
    display: flex;
    flex-direction: column;
    position: fixed;
}
.contenteditable_box {
    flex-grow: 1;
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
        min-height: 200px;
        padding: 5px;
        // -webkit-user-select:text;
        user-select: text;
        -webkit-user-select: text;
    }
    .content_1:empty:before {
        content: "说点啥好呢？";
        color: gray;
    }
}
#editor_1 {
    height: 100%;
    overflow: auto;
}
.btn_1 {
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    height: 44px;
    background: $header_background;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 44px;
    z-index: 1000;
}

.box_2 {
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
