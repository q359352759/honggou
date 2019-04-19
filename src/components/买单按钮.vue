<template>
    <div class="买单按钮" @click="点击中心圆()" :class="{'回弹':回弹}" :style="{'top':y+'px','left':x+'px'}" @touchstart="圆心开始拖动($event)" @touchmove.prevent="圆心滑动中($event)" @touchend="圆心手指离开()">
        <div></div>
        <span>买单</span>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            回弹:true,
            x:0,
            y:0
        }
    },
    methods: {
        点击中心圆(){
            this.$router.push('/sjdd/qrzf')
        },
        圆心开始拖动(event){
            this.回弹=false;
        },
        圆心滑动中(event){
            var x=event.touches[0].clientX;
            var y=event.touches[0].clientY;
            this.x=x-42/2;
            this.y=y-42/2;
        },
        圆心手指离开(){
            this.回弹=true;
            console.log('圆心拖动结束')
            var ww = window.innerWidth;
            var hh=window.innerHeight;
            var x中线=ww/2;
            if(this.x + 42/2>x中线){
                this.x=ww -42 - 35;
            }else{
                this.x=35
            }
            if(this.y<80){
                this.y=80
            }else if(this.y+80>hh){
                this.y= hh - 80
            }
        }
    },
    mounted() {
        var ww = window.innerWidth;
        var hh=window.innerHeight;
        this.y=80;
        this.x=ww-35-42
    },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/config.scss';
//header_background
.买单按钮.回弹{
    >div{
        width: 100%;
        height: 100%;
        opacity: 0.8;
    }
    transition: all 0.3s;
}
.买单按钮{
    >div{
        background: $header_background;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        transition:  all 0.3s;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    span{
        position: relative;
        z-index: 1;
    }
    width: 42px;
	height: 42px;
    text-align: center;
    line-height: 42px;
    position: fixed;
    top: 80px;
    right: 35px;
    border-radius: 100%;
    z-index: 2;
    color: rgba(255, 255, 255, 1);
	font-size: 12px;
    box-shadow: 0px 0px 3px 1px #ffffff;
}

</style>
