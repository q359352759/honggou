<template>
    <div ref="地图">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">选择收货地址</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="搜索框">
                <div>
                    <input type="text" v-model="输入内容" ref="输入框" @blur="失去焦点()" @focus="获取焦点()" placeholder="搜索地址">
                    <div class="icon图标">
                        <i class="icon iconfont icon-ziyuan"></i>
                    </div>
                </div>
            </div>
            <div class="地图容器" ref="地图容器">

            </div>
            <div class="搜索结果" :class="{'active':首次检索}" ref="搜索结果">

            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import { openloading } from "@/assets/js/currency.js";
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
    name:"",
    data() {
        return {
            address:"",
            输入内容:"",
            map:"",
            首次检索:true,
        }
    },
    computed: {        
        ...mapGetters({
            当前位置: '当前位置'
        })
    },
    methods: {
        ...mapActions({
            获取位置: '获取位置/获取位置'
        }),
        失去焦点(){
            this.setPlace(this.输入内容)
        },
        setPlace(myValue){
            var this_1=this;
            var map=this.map;
            map.clearOverlays();
            var local = new BMap.LocalSearch(map, { //智能搜索
                renderOptions:{
                    map: map, 
                    panel: this_1.$refs.搜索结果,
                    autoViewport:true,      //检索结束后是否自动调整地图视野。此属性对LocalCity无效
                    selectFirstResult:true, //是否选择第一个检索结果。此属性仅对LocalSearch有效
                },
                onSearchComplete: function(results){
                    console.log(1,results)
                    
                    // var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    // map.centerAndZoom(pp, 10);
                    // map.addOverlay(new BMap.Marker(pp));    //添加标注
                    // if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    //     var s = [];
                    //     console.log(results.getCurrentNumPois());
                    //     console.log(results);
                    //     console.log(local.getResults());
                    // }
                },
                onMarkersSet:function (array) {
                    this_1.首次检索=false;
                    console.log(2,array);
                },
                onInfoHtmlSet:function (LocalResultPoi) {
                    console.log(3,LocalResultPoi);
                },
                onResultsHtmlSet:function (element) {
                    console.log(4,element);
                },
            });
            local.search(myValue);
        },
        async 初始化() {
            var this_1 = this;
            if (!this.当前位置 || this.当前位置.x == '' || this.当前位置.y == '') {
                await this.获取位置()
            }
            if (!this.当前位置 || this.当前位置.x == '' || this.当前位置.y == '') {
                mui.toast("获取位置失败，稍后再试", { duration: "long", type: "div" });
                return
            }

            this.longitude = this.当前位置.x     //104.06792346
            this.latitude = this.当前位置.y;

            var map=this.map = new BMap.Map(this.$refs.地图容器);
            map.centerAndZoom(new BMap.Point(this.当前位置.x, this.当前位置.y), 20);
            map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

            // var marker = new BMap.Marker(new BMap.Point(this.当前位置.x, this.当前位置.y));  // 创建标注
            // map.addOverlay(marker);              // 将标注添加到地图中
            
            //逆地址解析
            var geoc = new BMap.Geocoder();
            var point = new BMap.Point(this.当前位置.x, this.当前位置.y);
            geoc.getLocation(point, function (rs) {
                var addComp = rs.addressComponents;
                // this_1.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                this_1.输入内容 = addComp.district + addComp.street + addComp.streetNumber;
                this_1.setPlace(this_1.输入内容);
            });


            // var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            //         {"input" : this.$refs.输入框,"location" : map
            //     });
            //     //鼠标放在下拉列表上的事件
            //     ac.addEventListener("onhighlight", function(e) {
            //         console.log('鼠标放在下拉列表上的事件',e)
            //         console.log(e.fromitem.value)
            //     })
            //     //鼠标点击下拉列表后的事件
            //     ac.addEventListener("onconfirm", function(e) {
            //         console.log('鼠标点击下拉列表后的事件',e)
            //         this_1.$refs.输入框.blur();
            //         console.log(e.item.value);
            //         var _value = e.item.value;
            //         var myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            //         this_1.setPlace(myValue);
            //     })


            openloading(false);
            

        }
    },
    mounted() {
        
        
        // $(this.$refs.搜索结果).on('click','a',function(){
        //     console.log('阻止跳转')
        //     return false
        // })
        $(this.$refs.地图).on('click','a',function(){
            console.log('阻止跳转2')
            return false
        })

        this.初始化();
        this.$refs.地图.style.height=window.outerHeight+'px';
    },

}
</script>

<style lang="scss" scoped>
.地图容器{
    // height: 100%;
    flex-grow: 1;
    flex-shrink: 0;
}
.mui-content{
    display: flex;
    flex-direction: column;
}
.搜索框{
    flex-shrink: 0;
    height: 52px;
    padding: 9px 12px;
    >div{
        height: 100%;
        display: flex;
        align-items: center;
        background: #ffffff;
    }
    .icon图标{
        padding: 0px 10px;
    }
    input{
        height: 100%;
        border: none;
        margin: 0px;
        padding: 0px 32px;
        font-size: 14px;
    }
    input::-webkit-input-placeholder{
        color: rgba(166, 166, 166, 1);
    }
    input:-moz-placeholder{
        color: rgba(166, 166, 166, 1);
    }
    input::-moz-placeholder{
        color: rgba(166, 166, 166, 1);
    }
    input:-ms-input-placeholder{
        color: rgba(166, 166, 166, 1);
    }
}
.搜索结果{
    max-height: 330px;
    overflow: auto;
}
.搜索结果.active{
    height: 300px;
}
.地图容器{
    /deep/ a{
        display: none;
    }
}
.搜索结果{
    /deep/ a{
        display: none;
    }
}
</style>

