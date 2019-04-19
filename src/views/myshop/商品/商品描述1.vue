<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">商品描述</h1>
            <span @click="保存()">保存</span>
        </header>
        <!-- <div class="mui-content mui-fullscreen">
            
        </div> -->
        <div class="editor" ref="editor" ></div>
        
        <Album v-if="显示相册" :seetype="seetype" :type="seetype" v-on:setlist="reslist" />

    </div>
</template>

<script>
import Album from "@/components/Album.vue";
import Editor from 'wangeditor'
import { mapGetters , mapMutations } from "vuex";
import { openloading } from "@/assets/js/currency";

import $ from "jquery";
export default {
    name:"",
    data() {
        return {
            editor:'',
            html:"",
            editorContent:"",
            seetype:3,
            seetype:3,
            显示相册:false
        }
    },
    components:{
        Album
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
        保存(){

            var 商品描述=$(this.$refs.editor).find('.w-e-text').html();
                this.商品.remark=商品描述;
            history.back();


            // var 商品描述=this.$refs.content_1.innerHTML
            // if(商品描述){
            //     var content_box内容=this.$refs.content_box.innerHTML;
            //     content_box内容.replace('contenteditable="true"','').replace("contenteditable='true'",'');
            //     this.商品.remark = content_box内容;
            // }else{
            //     this.商品.remark = "";
            // }
            // history.back();
            
        },
        reslist(list){
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
        插入内容(){
            this.editor.txt.append('<p>追加的内容</p>')
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
                // $(this.$refs.content_1).append(html)
                // this.editor.txt.append(html)
            }
        },
    },
    mounted() {
            // var Editor = window.wangEditor
            
            // this.editor = new Editor('#editor');
            // this.editor = new Editor(this.editorid);
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
            
            // this.editor.customConfig.onblur = function (html) {
            //     // html 即编辑器中的内容
            //     console.log('onblur', html)
            //     mui.toast("失去焦点", { duration: 1000, type: "div" });
            //     // window.scroll(0, 0);
            // }
            // this.editor.customConfig.onfocus = function () {
            //     console.log("onfocus")
            //     setTimeout(()=>{
            //         window.scroll(0, 0);
            //     },1000)
            //     mui.toast("onfocus", { duration: 1000, type: "div" });
            // }
            this.editor.create()

            $(this.$refs.editor).on('blur','.w-e-text-container',function(){
                setTimeout(()=>{
                    openloading(true)
                },200)
                setTimeout(()=>{
                    window.scroll(0, 0);
                    openloading(false)
                },1000)
            })

            if(this.商品.remark){
                var div=$(this.商品.remark);
                // this.font_size=div.
                // console.log(div.css('font-size'));
                // var font_size = div.css("font-size") ? div.css("font-size") : "16px";
                // this.font_size = parseInt(font_size) > 10 ? font_size : "12px";
                // this.font_color = div.css("color") ? div.css("color") : "#000000";
                // this.html = div.html();
                var content_box内容= this.商品.remark
                    content_box内容=content_box内容.replace('contenteditable="true"','').replace("contenteditable='true'",'');
                if(content_box内容){
                    this.editor.txt.append(content_box内容)
                }
                // this.editorContent=this.商品.remark
                // this.editor.$txt.html(this.商品.remark);
            }
            
            
            // var 自定义按钮='<div class="跳转相册 w-e-menu">相册</div>'
            var 自定义按钮='<div class="跳转相册 w-e-menu"><i class="w-e-icon-image"></i></div>'
            $('.w-e-toolbar').append(自定义按钮)
            $('.editor').on('click','.跳转相册',()=>{
                console.log('跳转相册');
                // this.显示相册=true;
                this.$router.push("?Album_show=1");
                console.log(this.editor.selection.getSelectionContainerElem()[0])
                // var div=this.editor.selection.getSelectionContainerElem()[0]
                // $(div).after('<div>13121</div>')
            })


            
            if(!this.是否重新获取数据){
                this.获取选择的图片();
            }
        
    },
    watch: {
        $route(to, from) {
            var query = this.$route.query;
            //选择图片
            if (!query.Album_show) {
                this.显示相册 = false;
            } else {
                this.显示相册 = true;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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

.editor{
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    padding: 44px 0px 0px;
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
    // /deep/ * {
    //     // user-select: text;
    //     // -webkit-user-select: text;
    //     -webkit-user-select:auto;
    // }
    /deep/ .w-e-menu{
        z-index: 3 !important;
    }
}

</style>

