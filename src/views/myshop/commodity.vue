<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <!-- <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a> -->
            <a @tap="back()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 @click="$router.push('/myshop/shangping/guanli')" class="mui-title">商品管理</h1>
            <span @click="AddGoods()" class="add mui-pull-right">发布商品</span>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <ul class="box_2">
                <li v-for="(x, index) in commodity_list" :key="index" :class="{'pos_left':x.pos_left,'active':x.active}">
                    <!-- <div class="left_1">
                        <div class="radio_1" :class="{'active':x.active}">
                            <i class="icon iconfont icon-xuanze"></i>
                        </div>
                    </div> -->
                    <div class="content_1" v-on:touchend="touchend($event,x)" v-on:touchstart="huoqu($event,x)" v-on:touchmove="touchmove($event)">
                        <ul class="cont_1">
                            <li @click="go_addGoods(x)">
                                <img v-if="x.img.split(',').length>0" :src="x.img.split(',')[0]" alt="" srcset="">
                            </li>
                            <li>
                                <h1>
                                    <div class="mui-pull-right shangjia">
                                        <span :class="{'active':x.state==1}" @click="updata_state(x)">
                                            <span v-if="x.state==1">(已上架)</span>
                                            <span v-if="x.state==0">(已下架)</span>
                                        </span>
                                        <span :class="{'active':x.state==0}" @click="updata_state(x)">
                                            <span v-if="x.state==1">下架</span>
                                            <span v-if="x.state==0">上架</span>
                                        </span>
                                    </div>
                                    <div class="title_1" @click="go_addGoods(x)">{{x.name}}</div>
                                </h1>
                                <h2 @click="go_addGoods(x)">价格：{{x.sellingPrice}}元</h2>
                                <h3 @click="go_addGoods(x)">
                                    <span class="mui-pull-right">累计销售：{{x.sales}}份</span>
                                    <div>可省：{{x.deduction}}元
                                        <span v-if="x.commission">，佣金{{x.commission}}元</span>
                                    </div>
                                </h3>
                            </li>
                        </ul>
                    </div>
                    <div class="right_1" @tap="delete_1(x,index)">
                        <div>删除</div>
                    </div>
                </li>
            </ul>
            <loading :loadingtype="loading" :nodata="!loading && total==0" :end="!loading && total!=0 && total==commodity_list.length" />
        </div>
    </div>
</template>

<script>
import { api_获取商品列表, api_修改商品 } from "@/api/商品接口.js";

import { openloading } from "@/assets/js/currency";
import loading from "@/components/loading.vue";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "",
    components: {
        loading
    },
    data() {
        return {
            get_index: 0,
            query: {
                start: 0,
                length: 10,
                shopid: ""
            },
            page_index: 0,
            commodity_list: [],
            total: 0,
            loading: true
        };
    },
    computed: {
        ...mapGetters({
            myshop: 'get_myshop'
        })
    },
    methods: {
        ...mapActions({
            获取店铺: 'getMyshop',
            删除商品: "shangPing/删除商品",
            修改商品: "shangPing/修改商品",
            删除专享: "shangPing/删除专享"
        }),
        back() {
            var back = this.$route.query.back
            if (back) {
                history.back()
            } else {
                this.$router.push("/myshop");
            }
        },
        //跳转添加商品
        AddGoods() {
            this.$store.state.in_index = 0;
            this.$router.push("/AddGoods");
        },
        //跳转修改
        go_addGoods(x) {
            sessionStorage.commodity = JSON.stringify(x);
            this.$store.state.in_index = 0;
            this.$router.push("/AddGoods?type=update");
        },
        //删除
        delete_1(item, index) {
            if (item.EXID) {
                var 提示 =
                    item.EXTYPE == 0
                        ? "该商品是“新人专享”商品，删除商品会同时会删除对应的专享商品，是否删除？"
                        : "该商品是“生日专享”商品，删除商品会同时会删除对应的专享商品，是否删除？";
                mui.confirm(
                    提示,
                    "提示",
                    ["取消", "删除"],
                    value => {
                        if (value.index == 1) {
                            openloading(true);
                            Promise.all([this.删除商品(item), this.删除专享(item.EXID)])
                                .then(x => {
                                    if (x[0].data.code == 200 && x[0].data.code == 200) {
                                        this.commodity_list.splice(index, 1);
                                    } else {
                                        var str = "";
                                        if (x[0].data.code != 200) {
                                            str += x[0].data.msg ? x[0].data.msg : x[0].data.message;
                                        }
                                        if (x[1].data.code != 200) {
                                            str += x[1].data.msg ? x[1].data.msg : x[1].data.message;
                                        }
                                        mui.alert(str, "提示", "我知道了", function () { }, "div");
                                    }
                                    openloading(false);
                                })
                                .catch(err => {
                                    openloading(false);
                                    mui.toast("系统错误，稍后再试。", {
                                        duration: 2000,
                                        type: "div"
                                    });
                                });
                        }
                    },
                    "div"
                );
            } else {
                mui.confirm(
                    "确定删除此商品吗？",
                    "提示",
                    ["取消", "删除"],
                    value => {
                        if (value.index == 1) {
                            openloading(true);
                            this.删除商品(item)
                                .then(x => {
                                    openloading(false);
                                    if (x.data.code == 200) {
                                        this.commodity_list.splice(index, 1);
                                    } else {
                                        mui.alert(
                                            x.data.msg ? x.data.msg : x.data.message,
                                            "提示",
                                            "我知道了",
                                            function () { },
                                            "div"
                                        );
                                    }
                                })
                                .catch(err => {
                                    openloading(false);
                                    mui.toast("系统错误，稍后再试。", {
                                        duration: 2000,
                                        type: "div"
                                    });
                                });
                        }
                    },
                    "div"
                );
            }
        },
        //修改商品接口 上架下架
        updata_state(x) {
            var obj = Object.assign({}, x);
            obj.state = obj.state == 0 ? 1 : 0;
            obj.arrImg = x.img.split(",");
            if (x.EXID && x.state == 1) {
                var 提示 =
                    x.EXTYPE == 0
                        ? "该商品是“新人专享”商品，下架商品会同时会删除对应的专享商品，是否下架？"
                        : "该商品是“生日专享”商品，下架商品会同时会删除对应的专享商品，是否下架？";
                mui.confirm(
                    提示,
                    "提示",
                    ["取消", "下架"],
                    value => {
                        if (value.index == 1) {
                            openloading(true);
                            Promise.all([this.修改商品([obj]), this.删除专享(x.EXID)])
                                .then(res => {
                                    if (res[0].data.code == 200 && res[0].data.code == 200) {
                                        x.state = x.state == 0 ? 1 : 0;
                                    } else {
                                        var str = "";
                                        if (res[0].data.code != 200) {
                                            str += res[0].data.msg
                                                ? res[0].data.msg
                                                : res[0].data.message;
                                        }
                                        if (res[1].data.code != 200) {
                                            str += res[1].data.msg
                                                ? res[1].data.msg
                                                : res[1].data.message;
                                        }
                                        mui.alert(str, "提示", "我知道了", function () { }, "div");
                                    }
                                    openloading(false);
                                })
                                .catch(err => {
                                    openloading(false);
                                    mui.toast("系统错误，稍后再试。", {
                                        duration: 2000,
                                        type: "div"
                                    });
                                });
                        }
                    },
                    "div"
                );
            } else {
                openloading(true);
                api_修改商品([obj]).then(res => {
                    if (res.data.code == 200) {
                        x.state = x.state == 0 ? 1 : 0;
                        mui.toast("设置成功。", { duration: 2000, type: "div" });
                    } else {
                        mui.alert(res.data.msg ? res.data.msg : res.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false);
                }).catch(err => {
                    mui.toast("系统错误。", { duration: 2000, type: "div" });
                    openloading(false);
                })
            }
        },
        //滚动条
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (
                h + t >= sh - 10 &&
                !this.loading &&
                this.commodity_list.length < this.total
            ) {
                this.page_index++;
                this.get_commodity();
                console.log("到底底部");
            }
        },
        //手指头刚按下
        huoqu(e, x) {
            console.log(x);
            //手指头刚刚按下
            this.$set(x, "active", false);
            var targetTouches = e.targetTouches[0];
            this.touchstart_x =
                targetTouches.clientX - e.currentTarget.parentElement.offsetLeft;
        },
        //开始拖动
        touchmove(e) {
            var targetTouches = e.targetTouches[0];
            e.currentTarget.parentElement.style.left =
                targetTouches.clientX - this.touchstart_x + "px";
        },
        //拖动结束
        touchend(e, x) {
            x.active = true;
            var event = e;
            var parentElement = e.currentTarget.parentElement;
            setTimeout(() => {
                if (parentElement.offsetLeft < -60) {
                    this.$set(x, "pos_left", true);
                } else {
                    this.$set(x, "pos_left", false);
                }
                parentElement.removeAttribute("style");
            }, 100);
        },
        // 根据店铺查询商品
        get_commodity() {
            this.get_index = 1;
            this.query.start = this.page_index * this.query.length;
            this.query.shopid = this.myshop.shopid;
            this.loading = true;
            api_获取商品列表(this.query).then(x => {
                this.loading = false;
                if (x.data.code == 200) {
                    this.commodity_list = this.commodity_list.concat(x.data.data.data);
                    this.total = x.data.data.total;
                }
            }).catch(err => {
                this.loading = false;
            })
        },
        async 初始化() {
            if (!this.myshop || !this.myshop.shopid) {
                await this.获取店铺()
            }
            this.get_commodity();
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
        this.初始化()
        // console.group('------mounted 挂载结束状态------');
    },
    activated() {
        console.log("再次进入页面");
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
        // this.editor.destroy();	//销毁
        // console.group('destroyed 销毁完成状态===============》');
    },
    watch: {

    }
};
</script>

<style lang="scss" scoped>
.mui-bar {
    .add {
        color: #ffffff;
        font-size: 15px;
        line-height: 44px;
        position: relative;
        z-index: 1;
    }
}

.box_2 {
    overflow: hidden;
    > li.active {
        transition: all 0.3s;
    }
    > li {
        position: relative;
        left: 0px;
        display: flex;
        background: #ffffff;
        border-bottom: 1px solid #e5e5e5;
        // >div:nth-child(2){
        //     flex-grow: 1;
        // }
        .content_1 {
            flex-grow: 1;
        }
    }
    > li.pos_left {
        left: -60px;
    }
    .left_1 {
        padding: 0px 0.16rem 0px 0px;
        position: absolute;
        width: 100%;
        left: -100%;
        height: 100%;
        top: 0px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .right_1 {
        position: absolute;
        width: 100%;
        left: 100%;
        top: 0px;
        height: 100%;
        background: #d43030;
        font-size: 0.14rem;
        color: #ffffff;
        display: flex;
        align-items: center;
        padding: 0px 0.16rem 0px;
    }
    .cont_1 {
        display: flex;
        padding: 0.1rem;
        > li:nth-child(1) {
            width: 83px;
            // height: 62px;
            flex-shrink: 0;
            margin: 0px 8px 0px 0px;
            font-size: 0;
            img {
                width: 100%;
            }
        }
        > li:nth-child(2) {
            width: 0;
            flex-grow: 1;
            h1 {
                font-weight: 400;
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
                .title_1 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .active {
                    color: #2a82e4;
                }
            }
            h2 {
                font-weight: 400;
                color: rgba(128, 128, 128, 1);
                font-size: 12px;
                margin: 7px 0px;
            }
            h3 {
                font-weight: 400;
                color: rgba(166, 166, 166, 1);
                font-size: 12px;
                margin: 0px;
            }
        }
    }
}
</style>
