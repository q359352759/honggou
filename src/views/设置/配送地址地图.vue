<template>
    <div ref="地图">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">选择收货地址</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="搜索框">
                <div>
                    <div class="icon图标">
                        <i class="icon iconfont icon-ziyuan"></i>
                    </div>
                    <input type="text" v-model="输入内容" ref="输入框" @blur="失去焦点()" @focus="获得焦点=true" placeholder="搜索地址">
                </div>
            </div>
            <div class="地图容器" >
                <div class="地图容器1" ref="地图容器"></div>
                <div class="地图遮罩" v-show="获得焦点"></div>
            </div>
            <div class="搜索结果" :class="{'active':首次检索}" ref="搜索结果">
                <i class="icon iconfont icon-weizhi1"></i>
                <div>{{address}}</div>
            </div>
            <div class="提交按钮">
                确定
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
            查找结果:'',
            获得焦点:false,
            // 当前位置:{
            //     x:104.00051694445845,
            //     y:30.640618777723684
            // },
            选择位置:{
                x:"",
                y:""
            }
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
            this.获得焦点=false
            this.setPlace(this.输入内容)
        },
        setPlace(myValue){
            var this_1=this;
            var map=this.map;
            map.clearOverlays();
            var local = new BMap.LocalSearch(map, { //智能搜索
                // renderOptions:{
                //     map: map, 
                //     panel: this_1.$refs.搜索结果,
                //     autoViewport:true,      //检索结束后是否自动调整地图视野。此属性对LocalCity无效
                //     selectFirstResult:true, //是否选择第一个检索结果。此属性仅对LocalSearch有效
                // },
                onSearchComplete: function(results){
                    console.log(1,results)
                    
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    map.centerAndZoom(pp, 20);
                    //逆地址解析
                    var geoc = new BMap.Geocoder();
                    var point = new BMap.Point(pp.lng, pp.lat);
                    geoc.getLocation(point, function (rs) {
                        var addComp = rs.addressComponents;
                        // this_1.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                        this_1.address = addComp.district + addComp.street + addComp.streetNumber;
                        this_1.选择位置.x=rs.point.lng
                        this_1.选择位置.y=rs.point.lat
                        console.log(rs)
                        // this_1.setPlace(this_1.输入内容);
                    });
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
                this_1.address = addComp.district + addComp.street + addComp.streetNumber;
                this_1.选择位置.x=rs.point.lng
                    this_1.选择位置.y=rs.point.lat
                console.log(rs)
                // this_1.setPlace(this_1.输入内容);
            });


            //添加一个中心圆点
            var m_height = (map.getSize().height - 24) / 2;
            var m_width = (map.getSize().width - 19) / 2;
            function ZoomControl() {
                // 默认停靠位置和偏移量
                this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
                this.defaultOffset = new BMap.Size(m_width, m_height);
            }
            ZoomControl.prototype = new BMap.Control();
            ZoomControl.prototype.initialize = function (map) {
                // 创建一个DOM元素
                var div = document.createElement("div");
                // 添加文字说明
                // 设置样式
                div.style.width = "20px";
                div.style.height = "30px";
                div.style.cursor = "pointer";
                div.style.backgroundImage = "url('image/dingwei_1.png')";
                div.style.backgroundPosition = "center";
                div.style.backgroundSize = "cover";
                // div.style.backgroundColor="red"
                // 添加DOM元素到地图中
                map.getContainer().appendChild(div);
                return div;
            };
            // 创建控件
            var myZoomCtrl = new ZoomControl();
            // 添加到地图当中
            map.addControl(myZoomCtrl);

            map.addEventListener("touchend", function () {
                var p = map.getCenter();
                this_1.longitude = p.lng;
                this_1.latitude = p.lat;
                geoc.getLocation(p, function (rs) {
                    var addComp = rs.addressComponents;
                    console.log(rs)
                    this_1.address = addComp.district + addComp.street + addComp.streetNumber;
                    this_1.选择位置.x=rs.point.lng
                    this_1.选择位置.y=rs.point.lat
                });
            });



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
@import '@/assets/css/config.scss';
.地图容器{
    // height: 100%;
    flex-grow: 1;
    flex-shrink: 0;
    position: relative;
    .地图遮罩{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .地图容器1{
        height: 100%;
    }
}
.mui-content{
    display: flex;
    flex-direction: column;
}
.搜索框{
    flex-shrink: 0;
    height: 52px;
    padding: 9px 12px;
    background: #ffffff;
    >div{
        height: 100%;
        display: flex;
        align-items: center;
        background: rgba(246, 246, 246, 1);
    }
    .icon图标{
        padding: 0px 10px;
        width: 32px;
        text-align: center;
        color: #ffffff;
    }
    input{
        height: 100%;
        border: none;
        margin: 0px;
        padding: 0px;
        background: none;
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
    height: 66px;
    display: flex;
    padding: 0px 12px;
    align-items: center;    
    color: rgba(56, 56, 56, 1);
	font-size: 14px;
    i{
        font-size: 20px;
        line-height: 20px;
        height: 20px;
        color: $header_background;
        margin: 0px 12px 0px 0px;
        flex-shrink: 0;
    }
    div{
        flex-grow: 1;
        width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.提交按钮{
    height: 40px;
    flex-shrink: 0;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    letter-spacing: 3px;
    padding-left: 3px;
    background: $header_background;
    color: #ffffff;
}
// .地图容器{
//     /deep/ a{
//         display: none;
//     }
// }
// .搜索结果{
//     /deep/ a{
//         display: none;
//     }
// }
</style>

