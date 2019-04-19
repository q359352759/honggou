<template>
    <ul class="红包列表">
        <li @click="领取红包(新人红包)">
            <div>
                <div class="cont_1">
                    <div class="banyuan"></div>
                    <div class="title">店铺新人红包</div>
                    <div class="lingqu">领取</div>
                    <div class="money" v-if="新人红包">
                        <span>{{新人红包.amount}}</span>
                        <span>元</span>
                    </div>
                    <div class="tishi_1" v-if="!新人红包">尚未发布</div>
                    <div class="xinren_img">
                        <img v-if="店铺信息" :src="店铺信息.signboard" alt="" srcset="">
                    </div>
                    <div class="footer_1" v-if="新人红包">
                        <span v-if="新人红包.deductionType==1">满{{新人红包.expire}}，省{{新人红包.deduction}}元</span>
                        <span v-if="新人红包.deductionType!=1">红包买单省&nbsp;{{新人红包.percentage}}%</span>
                    </div>
                </div>
            </div>
        </li>
        <!-- 生日红包 -->
        <li @click="领取红包(生日红包)">
            <div>
                <div class="cont_1">
                    <div class="banyuan"></div>
                    <div class="title">生日红包</div>
                    <div class="lingqu">领取</div>
                    <div class="money" v-if="生日红包">
                        <span>{{生日红包.amount}}</span>
                        <span>元</span>
                    </div>
                    <div class="tishi_1" v-if="!生日红包">尚未发布</div>
                    <div class="shengri_img">
                        <img src="image/shengri.png" alt="" srcset="">
                    </div>
                    <!-- <div class="footer_1">
                        <span>店内通用</span>
                    </div> -->
                </div>
            </div>
        </li>
        <!-- 庆典红包 -->
        <li @click="领取红包(庆典红包)">
            <div>
                <div class="cont_1">
                    <div class="banyuan"></div>
                    <div class="title">庆典红包</div>
                    <div class="lingqu">领取</div>
                    <div class="money" v-if="庆典红包">
                        <span>{{庆典红包.amount}}</span>
                        <span>元</span>
                    </div>
                    <div class="tishi_1" v-if="!庆典红包">尚未发布</div>
                    <div class="qingdian_img">
                        <img src="image/qingdian.png" alt="" srcset="">
                    </div>
                    <div class="footer_1" v-if="庆典红包">
                        <span>{{庆典红包.startTime | filter_time}}-{{庆典红包.endTime | filter_time}}</span>
                    </div>
                </div>
            </div>
        </li>
        <!-- 节日红包 -->
        <li @click="领取红包(节日红包)">
            <div>
                <div class="cont_1">
                    <div class="banyuan"></div>
                    <div class="title">节日红包</div>
                    <div class="lingqu">领取</div>
                    <div class="money" v-if="节日红包">
                        <span>{{节日红包.amount}}</span>
                        <span>元</span>
                    </div>
                    <div class="tishi_1" v-if="!节日红包">尚未发布</div>
                    <div class="jieri_img">
                        <img src="image/jieri.png" alt="" srcset="">
                    </div>
                    <div class="footer_1" v-if="节日红包">
                        <span>{{节日红包.headline}}</span>
                    </div>
                </div>
            </div>
        </li>
        <!-- 商品红包 -->
        <li v-if="item.commodityName" v-for="(item, index) in 商品红包" :key="index" @click="领取红包(item)">
            <div>
                <div class="cont_1">
                    <div class="banyuan"></div>
                    <div class="title">{{item.commodityName ? item.commodityName : '未知'}}</div>
                    <div class="lingqu">领取</div>
                    <div class="money">
                        <span>{{item.amount}}</span>
                        <span>元</span>
                    </div>
                    <div class="shangping_img">
                        <img v-if="item.img && item.img.split(',').length>0" :src="item.img.split(',')[0]" alt="" srcset="">
                    </div>
                    <div class="footer_1">
                        <!-- <span>指定商品</span> -->
                        <span>{{item.startTime | filter_time}}-{{item.endTime | filter_time}}</span>
                    </div>
                </div>
            </div>
        </li>

    </ul>
</template>

<script>
import { api_用户领取红包 } from "@/api/红包接口.js";
import { dateFtt, openloading, getDateStr } from "@/assets/js/currency.js";
import { mapGetters, mapActions } from "vuex";
export default {
    name: "",
    data() {
        return {
            userInfo: '',
            startTime: "",
            endTime: ""
        }
    },
    filters: {
        filter_time(time) {
            return dateFtt(time, "yyyy.MM.dd");
        }
    },
    computed: {
        ...mapGetters({
            全部信息: '商家点单/全部信息',
            店铺信息: '商家点单/店铺信息',
            所有红包: '商家点单/所有红包',
            新人红包: '商家点单/新人红包',
            商品红包: '商家点单/商品红包',
            节日红包: '商家点单/节日红包',
            签到红包: '商家点单/签到红包',
            庆典红包: '商家点单/庆典红包',
            生日红包: '商家点单/生日红包',
        })
    },
    methods: {
        ...mapActions({
            获取用户红包:'商家点单/获取用户红包',
            设置是否显示登录框:"设置是否显示登录框"
        }),
        领取红包(x) {
            if (!x) {
                mui.toast("尚未发布此红包。", { duration: "long", type: "div" });
                return;
            } else if (!this.userInfo) {
                this.设置是否显示登录框(true);
                // mui.confirm("需要登录才能领取，是否现在去登录。", "提示", ["取消", "是的"], value => {
                //     if (value.index == 1) {
                //         this.$router.push("/login");
                //     }
                // }, 'div');
                return
            } else if (x.type == 5) {
                console.log("点击了生日红包");
                if (this.全部信息.用户实名信息) {
                    mui.confirm("确认将自己的生日信息（不包含年龄）授权给此商铺吗？", "提示", ["取消", "好的"], value => {
                        if (value.index == 1) {
                            var birthday = this.全部信息.用户实名信息.birthday;
                            var myDate = new Date();
                            var newdate = myDate.getFullYear() + "-" + birthday.substring(4, 6) + "-" + birthday.substring(6);
                            if (newdate >= getDateStr(0)) {
                                //领取今年的
                                this.startTime = getDateStr(-7, newdate);
                                this.endTime = getDateStr(7, newdate);
                                this.添加红包(x);
                            } else {
                                //领取明年的
                                var newdate = myDate.getFullYear() + 1 + "-" + birthday.substring(4, 6) + "-" + birthday.substring(6);
                                this.startTime = getDateStr(-7, newdate);
                                this.endTime = getDateStr(7, newdate);
                                this.添加红包(x);
                            }
                        }
                    }, "div");
                } else {
                    mui.confirm("领取生日红包需要实名认证，您还未认证，请先认证。", "提示", ["取消", "去认证"], value => {
                        if (value.index == 1) {
                            this.$router.push("/RealName");
                        }
                    }, 'div');
                }
                return;
            }
            this.添加红包(x);
        },
        添加红包(x) {
            var obj = {
                id: "",
                userid: this.userInfo.username, //红包id
                envelopeId: x.id,
                state: "0", //状态(使用等等)  0 刚领取
                type: x.type,
                amount: x.amount ? x.amount : 0,
                startTime: x.type == 5 ? this.startTime : "", //生日使用有效期
                endTime: x.type == 5 ? this.endTime : ""
            };
            openloading(true);
            api_用户领取红包(obj).then(x => {
                if (x.data.code == 200) {
                    console.log(1);
                    mui.toast("恭喜您，领取成功。", { duration: 2000, type: "div" });
                    this.获取用户红包().then(x=>{
                        openloading(false);
                    }).catch(err=>{
                        openloading(false);
                    })
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    openloading(false);
                }
            }).catch(err => {
                mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
                openloading(false);
            })
        }
    },
    mounted() {
        try {
            this.userInfo = JSON.parse(localStorage.userInfo)
        } catch (error) {

        }
    },
}
</script>

<style lang="scss" scoped>
.红包列表 {
    padding: 6px 3px 0px;
    display: flex;
    flex-wrap: wrap;
    > li {
        width: 50%;
        padding: 0px 3px 0px;
        margin: 0px 0px 6px;
        > div {
            background: #ffffff;
            border-radius: 10px;
            padding: 10px;
            height: 100%;
        }
    }
    .cont_1 {
        height: 100%;
        min-height: 148px;
        background: #f18a8a;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
    }
    .banyuan {
        width: 200%;
        height: 200px;
        background: #f55e5e;
        position: absolute;
        left: -50%;
        top: -165px;
        border-radius: 100%;
    }
    .title {
        text-align: center;
        color: rgba(255, 255, 255, 1);
        font-size: 10px;
        padding: 3px 0px 0px;
        position: relative;
        z-index: 1;
    }
    .lingqu {
        width: 32px;
        height: 32px;
        background-color: rgba(250, 111, 38, 1);
        font-size: 10px;
        color: #ffffff;
        margin: 0px auto;
        border-radius: 100%;
        position: relative;
        z-index: 1;
        line-height: 32px;
        text-align: center;
        box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.1357142857142857);
    }
    .money {
        text-align: center;
        color: #ffffff;
        padding: 0px 5px 0px 0px;
        margin: 5px 0px 0px 0px;
        > span:nth-child(1) {
            font-size: 19px;
            margin: 0px 3px;
            font-weight: bold;
        }
        > span:nth-child(2) {
            font-size: 9px;
        }
    }
    .tishi_1 {
        text-align: center;
        color: #ffffff;
        // padding: 0px 5px 0px 0px;
        margin: 5px 0px 0px 0px;
        // min-height: 29px;
        font-size: 14px;
        // line-height: 29px;
    }
    .xinren_img {
        width: 68px;
        height: 51px;
        margin: 0px auto 0px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
        }
    }
    .shengri_img {
        text-align: center;
        padding: 3px 0px 0px;
        img {
            width: 60px;
        }
    }
    .qingdian_img {
        height: 62px;
        text-align: center;
        img {
            height: 100%;
            width: 66px;
        }
    }
    .jieri_img {
        height: 62px;
        text-align: center;
        img {
            height: 100%;
            width: 56px;
        }
    }
    .shangping_img {
        width: 82px;
        height: 62px;
        margin: 0px auto 0px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
    }
    .footer_1 {
        color: rgba(255, 255, 255, 1);
        font-size: 10px;
        margin: 4px 0px 2px;
        text-align: center;
        white-space: nowrap;
        overflow: auto;
    }
}
</style>
