<template>
    <div class="Tuijianren" >
        <div class="cont_1">
            <div class="close_1" @click="关闭()"><i class="icon iconfont icon-quxiao"></i></div>
            <b>我的VIP客服</b>
            <ul>
                <li>姓名：{{name}}</li>
                <li>手机：{{phone}}</li>
            </ul>
            <div class="tel_1">
                <a :href="'tel:'+phone">拨打电话</a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    name: "",
    props:{
        name:{
            default:""
        },
        phone:{
            default:""
        }
    },
    data() {
        return {};
    },
    methods: {
        关闭(){
            this.$emit('close')
        }
    }
};
</script>

<style lang="scss" scoped>
.Tuijianren {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    .cont_1 {
        width: 177px;
        border-radius: 16px;
        background: #ffffff;
        position: relative;
        .close_1 {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #999999;
        }
        b {
            display: block;
            text-align: center;
            padding: 16px 0px;
            color: #505050;
        }
        ul {
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            padding: 0px 14px;
        }
        .tel_1 {
            display: block;
            text-align: center;
            padding: 18px 0px;
        }
    }
}
</style>
