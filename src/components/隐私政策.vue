<template>
    <div class="隐私政策">
        <div class="弹框内容">
            <div class="标题">用户隐私政策概要</div>
            <div class="文本">
                本《隐私政策》将向您说明:
                1.为帮助你浏览推荐、发布信息、互动
                交流、注册认证，我们会收集你的部分
                必要信息;
                <br>
                2.为提供上述服务，我们可能会收集联
                络方式、位置、通讯录等部分敏感信
                息，你有权拒绝或撤回授权;
                <br>
                3.未经你同意，我们不会从第三方获
                取、共享或提供你的信息;
                <br>
                4.你可以访问、更正、删除你的个人信
                息，我们也将提供注销、投诉的方式。
                如你点击不同意，我们将仅收集浏览推
                荐所必需的信息，不会收集上述敏感信
                息，但推荐精准度、互动交流、发布信
                息可能会受影响。
            </div>
            <div class="提示语">
                <span>前往查看完整版</span>
                <span @click="跳转隐私政策()">隐私政策</span>
            </div>
            <ul class="按钮">
                <li @click="关闭()">仅浏览</li>
                <li @click="关闭()">同意</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            
        }
    },
    methods: {
        关闭(){
            this.$emit('close')
        },
        跳转隐私政策(){
            localStorage.yinsizhengce=true;
            this.$router.push('/xieyi/yinsizhengce')
        }
    },
}
</script>

<style lang="scss" scoped>
.隐私政策{
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1002;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    .弹框内容{
        width: 254px;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 16px;
    }
    .标题{
        color: rgba(80, 80, 80, 1);
    	font-size: 16px;
        height: 54px;
        line-height: 54px;
        font-weight: bold;
        text-align: center;
    }
    .文本{
        padding: 0px 25px;
        color: rgba(56, 56, 56, 1);
    	font-size: 12px;
        line-height: 150%;
    }
    .提示语{
        padding: 0px 25px;
        height: 36px;
        line-height: 36px;
        display: flex;
    	font-size: 12px;
        span:nth-child(1){
            color: rgba(0, 0, 0, 1);
        }
        span:nth-child(2){
            color: rgba(0, 122, 255, 1);
            margin: 0px 0px 0px 5px;
        }
    }
    .按钮{
        border-top: 1px solid rgba(246, 246, 246, 1);
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        color: rgba(0, 122, 255, 1);
    	font-size: 14px;
        padding: 0px 46px;
    }
}
</style>

