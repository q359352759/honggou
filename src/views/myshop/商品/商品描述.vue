<template>
    <div class="最外成">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">商品描述</h1>
            <span @click="保存()">保存</span>
        </header>
        <div class="mui-content mui-fullscreen">
    

            <ul class="contenteditable_box">
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
                    <div class="zitiyanse bg" v-show="isAndroid" @click="选择颜色()"></div>
                    <div @click="点击添加视频()" class="shiping bg"></div>
                    <div @click="编辑器选择图片()" class="tupian bg"></div>
                    <input type="color" class="font_color mui-hidden" v-model="font_color" ref="font_color">
                </li>
                <li class="content_box" ref="content_box">
                    <div class="content_1" @blur="编辑框失去焦点()" ref="content_1" :style="{'font-size':font_size,'color':font_color}" v-html="html" contenteditable="true"></div>
                </li>
                
            </ul>

            <!-- 视频选择框 -->
            <div class="video_box" v-show="video_show">
                <div class="mask"></div>
                <div class="cont_1">
                    <div @click="关闭视频输入框()" class="close_1"><i class="icon iconfont icon-quxiao"></i> </div>
                    <div class="title">请输入视频链接</div>
                    <div class="input_box">
                        <input type="text" v-model="video_url">
                    </div>
                    <button @click="queding()" class="btn_2">确定</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

import $ from "jquery";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { openloading, isAndroid } from "@/assets/js/currency";
export default {
    name:"",
    data() {
        return {
            font_size: "16px",
            font_color: "#000000",
            isAndroid: true,
            html: "",
            //视频选择器
            video_show: false,
            video_url: "",
        }
    },
    computed: {
        ...mapGetters({
            商品:'myshops/添加商品/商品',
            img_type:'myshops/添加商品/选择图片类型',       //图片类型用于放在哪里 1表示选择的商品图片 2表示编译器的图片
            是否重新获取数据:"myshops/添加商品/是否重新获取数据",
        }),
        
    },
    methods: {
        ...mapMutations({
            设置图片选择类型:"myshops/添加商品/设置图片选择类型",
        }),
        编辑器选择图片() {
            this.商品.remark = this.$refs.content_1.innerHTML;
            this.设置图片选择类型(2)
            this.$store.state.Select_picture.list = [];
            window.scroll(0, 0);
            this.$router.push('/Album?seetype=3')
        },
        编辑框失去焦点(){
            $('html').css('height','100%');
            window.scroll(0, 0);
        },
        点击添加视频() {
            window.scroll(0, 0);
            this.video_show = true;
        },
        关闭视频输入框() {
            this.video_show = false;
        },
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
        选择颜色() {
            if (!isAndroid()) {
                mui.toast("您的手机无此功能", { duration: "long", type: "div" });
            } else {
                this.$refs.font_color.click();
            }
        },
        获取选择的图片() {
            var list=this.$store.state.Select_picture.list;
            if (this.img_type == 1) {
                
            } else {
                var html = "";
                for (var i = 0; i < list.length; i++) {
                    if(list[i].url){
                        html += '<div style="margin:0px;"><img style="max-width: 100%;" width="100%" src="' + list[i].url + '" alt=""></div><div style="min-height:20px;"></div>';
                    }else{
                        html += '<div style="margin:0px;"><img style="max-width: 100%;" width="100%" src="' + list[i] + '" alt=""></div><div style="min-height:20px;"></div>';                        
                    }
                }
                // $(".content_1").append(html);
                $(this.$refs.content_1).append(html)
            }
        },
        保存(){
            var 商品描述=this.$refs.content_1.innerHTML
            if(商品描述){
                var content_box内容=this.$refs.content_box.innerHTML;
                content_box内容.replace('contenteditable="true"','').replace("contenteditable='true'",'');
                this.商品.remark = content_box内容;
            }else{
                this.商品.remark = "";
            }
            history.back();
        }
        
    },
    mounted() {
        if(this.商品.remark){
            var div=$(this.商品.remark);
            // this.font_size=div.
            console.log(div.css('font-size'));
            var font_size = div.css("font-size") ? div.css("font-size") : "16px";
            this.font_size = parseInt(font_size) > 10 ? font_size : "12px";
            this.font_color = div.css("color") ? div.css("color") : "#000000";
            this.html = div.html();  
        }

        if(!this.是否重新获取数据){
            this.获取选择的图片();
        }
  
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";

.mui-bar{
    span{
        position: absolute;
        line-height: 44px;
        top: 0px;
        right: 15px;
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
    }    
}


.contenteditable_box {
    height: 100%;
    // flex-grow: 1;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    .header {
        flex-shrink: 0;
        display: flex;
        background: #ffffff;
        padding: 3px;
        flex-wrap: wrap;
        height: 40px;
        align-items: center;
        div {
            height: 22px;
            font-size: 12px;
            padding: 0px 3px;
            line-height: 22px;
            color: #565656;
            margin: 0px 5px;
        }
        select {
            height: 100%;
            padding: 0px 5px;
            margin: 0px;
            border: 1px solid #c8c8ca;
            appearance: menulist;
            background: #ececec;
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
        margin: 3px;
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
            margin: 0px 0px 5px ;
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

