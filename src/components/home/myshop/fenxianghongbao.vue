<template>
    <div class="Xinrenhongbao">
        <div class="cont_1" v-if="hongbao.type!=0">
            <div class="close" @click="guanbi()">
                <i class="icon iconfont icon-quxiao"></i>
            </div>
            <div class="cont_2" @click="lignqu()">
                <div class="banyuan"></div>
                <div class="title_1">
                    <!-- 0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包 -->
                    <span v-if="hongbao.type==0">店铺新人红包</span>
                    <span v-if="hongbao.type==1">{{shangping.name}}</span>
                    <span v-if="hongbao.type==2">节日红包</span>
                    <!-- <span v-if="hongbao.type==3">签到红包</span> -->
                    <span v-if="hongbao.type==4">庆典红包</span>
                    <!-- <span v-if="hongbao.type==5">生日红包</span> -->
                </div>
                <div class="lingqu">领取</div>
                <div class="money">
                    <span>{{hongbao.amount}}</span>
                    <span>元</span>
                </div>
                <div class="img_box">
                    <img v-if="hongbao.type!=1" :src="shop.signboard" alt="" srcset="">
                    <img v-if="shangping.img && shangping.img.split(',').length>0" :src="shangping.img.split(',')[0]" alt="">
                </div>
                <div class="text_1">
                    <div v-if="hongbao.type!=1">
                        <span v-if="hongbao.deductionType==1">每满{{hongbao.expire}}减{{hongbao.deduction}}元</span>
                        <span v-if="hongbao.deductionType==0">可省{{hongbao.percentage}}%</span>
                    </div>
                    <div v-if="hongbao.type==1">
                        <span>{{hongbao.startTime | filter_time}}-{{hongbao.endTime | filter_time}}</span>
                    </div>
                    <!-- <span v-if="hongbao.deductionType==0">可省{{hongbao.percentage}}%</span> -->
                    <!-- <span v-if="hongbao.deductionType==1">每满{{hongbao.expire}}减{{hongbao.deduction}}元</span> -->
                </div>
            </div>
        </div>
        
        <div class="新人红包弹框" v-if="hongbao.type==0">
            <div class="close" @click="guanbi()">
                <i class="icon iconfont icon-quxiao"></i>
            </div>
            <img class="背景图" src="image/fxxrhb.png" alt="" srcset="">
            <div class="红包金额">
                <span>{{hongbao.amount}}</span>
                <span>元</span>
            </div>
            <div class="红包抵扣规则">
                <span v-if="hongbao.deductionType==1">每满{{hongbao.expire}}减{{hongbao.deduction}}元</span>
                <span v-if="hongbao.deductionType==0">用红包买单省：{{hongbao.percentage}}%</span>
            </div>
            <div class="欢迎词">
                感谢客官光临!
                <br>
                店小二为你备下一个红包
                <br>
                还请笑纳
            </div>
            <div class="领取按钮" @click="lignqu()">
                领  取
            </div>
            <div class="说明">红购：一个专注省钱的同城电商平台</div>
        </div>

        <div class="未登录提示框" v-show="未登录提示框">
            <div class="遮罩" @click="未登录提示框=false"></div>
            <div class="内容">
                <div class="头部">提示</div>
                <div class="文本">
                    你还未注册或登录
                    <br>
                    请注册或登录后
                    <br>    
                    再扫码领取
                </div>
                <ul class="按钮组">
                    <li @click="去登录()">登录</li>
                    <li @click="去注册()">注册</li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
import { dateFtt, openloading } from "@/assets/js/currency.js";

import { mapActions } from "vuex";
export default {
    name: "",
    props: {
        //红包
        hongbao: {
            default: {}
        },
        //店铺
        shop: {
            default: {}
        },
        //红包Id 主要用于判断
        hongbaoid: {
            default: ""
        }
    },
    data() {
        return {
            userInfo: "",
            未登录提示框: false,
            shangping: {} //商品 用户商品红包
        };
    },
    filters: {
        filter_time(time) {
            if (!time) {
                return time;
            }
            return dateFtt(time, "yyyy.MM.dd");
        }
    },
    methods: {
        ...mapActions({
            get_shangping_2: "shangPing/get_shangping_2", //获取商品
            set_isfenxiang: "shop/set_isfenxiang",
            设置是否显示登录框:'设置是否显示登录框'
        }),
        //关闭
        guanbi() {
            console.log(123);
            this.$emit("setshow", false);
        },
        //获取商品
        get_shangping() {
            this.get_shangping_2(this.hongbao.commodityId).then(x => {
                this.shangping = x.data.code == 200 ? x.data.data : {};
            }).catch(err => { });
        },
        去注册() {
            // this.$router.push("/BeInvited");
        },
        去登录() {
            // this.$router.push("/login");
        },
        //领取红包
        lignqu() {
            if (!this.userInfo) {
                // this.未登录提示框 = true;
                this.设置是否显示登录框(true);
                return;
            } else {
                var obj = {
                    id: "",
                    userid: this.userInfo.username,
                    envelopeId: this.hongbao.id, //红包id
                    state: "0", //状态(使用等等)  0 刚领取
                    type: this.hongbao.type,
                    startTime: "", //生日使用有效期
                    endTime: ""
                };
                openloading(true);
                this.$axios.post("/api-s/shops/addUserCardPackge", obj).then(x => {
                    if (x.data.code == 200) {
                        mui.toast("恭喜您，领取成功。", { duration: 2000, type: "div" });
                        if (this.hongbao.type == 1) {
                            //跳转到红包
                            this.set_isfenxiang();
                            this.$router.push("/commodity/CommodityDetails?id=" + this.hongbao.commodityId);
                        }
                        this.$emit("setshow", false,true);
                    } else {
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false);
                }).catch(err => {
                    mui.toast("系统错误，稍后再试。", { duration: 2000, type: "div" });
                    openloading(false);
                });
            }
        }
    },
    mounted() {
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }
        console.log("收到的红包", this.hongbao);
        if (this.hongbao && this.hongbao.type == 1) {
            this.get_shangping();
        }
    },
    watch: {
        shop() {
            console.log("店铺信息发生改变");
            // this.thisShop
        },
        hongbao() {
            if (this.hongbao.type == 1) {
                this.get_shangping();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.Xinrenhongbao {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    .cont_1 {
        padding: 8px;
        background: #ffffff;
        border-radius: 5px;
        position: relative;
        .close {
            position: absolute;
            right: 0px;
            top: -50px;
            width: 36px;
            height: 36px;
            border-radius: 100%;
            background: #ffffff;
            line-height: 36px;
            text-align: center;
            color: rgba(153, 153, 153, 1);
        }
        .close::after {
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: -14px;
            width: 1px;
            height: 14px;
            content: "";
            margin: auto;
            background: #ffffff;
        }
    }
    .cont_2 {
        color: #ffffff;
        min-width: 140px;
        white-space: nowrap;
        border-radius: 5px;
        text-align: center;
        background: #f18a8a;
        position: relative;
        overflow: hidden;
        .banyuan {
            width: 200%;
            height: 200px;
            background: #f55e5e;
            position: absolute;
            top: -152px;
            left: -50%;
            border-radius: 100%;
        }
        .title_1 {
            font-size: 12px;
            position: relative;
            z-index: 1;
            padding: 4px 0px 4px;
        }
        .lingqu {
            position: relative;
            z-index: 1;
            width: 39px;
            height: 39px;
            border-radius: 100%;
            background: #fa6f26;
            margin: 0px auto 3px;
            line-height: 39px;
            font-size: 12px;
            box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.13);
        }
        .money {
            > span:nth-child(1) {
                font-size: 22px;
                font-weight: bold;
            }
            > span:nth-child(2) {
                font-size: 12px;
            }
        }
        .img_box {
            width: 82px;
            height: 62px;
            font-size: 0px;
            margin: 0px auto;
            img {
                width: 82px;
                height: 62px;
            }
        }
        .text_1 {
            font-size: 10px;
            padding: 3px 0px;
        }
    }
}

.新人红包弹框{
    width: 270px;
	height: 340px;
    position: relative;
    .close {
        position: absolute;
        right: 13px;
        top: -50px;
        width: 36px;
        height: 36px;
        border-radius: 100%;
        background: #ffffff;
        line-height: 36px;
        text-align: center;
        color: rgba(153, 153, 153, 1);
    }
    .close::after {
        position: absolute;
        left: 0px;
        right: 0px;
        bottom: -14px;
        width: 1px;
        height: 14px;
        content: "";
        margin: auto;
        background: #ffffff;
    }
    .背景图{
        width: 100%;
        height: 100%;
    }
    .红包金额{
        position: absolute;
        top: 26px;
        left: 0px;
        width: 100%;
        text-align: center;
        color: rgba(217, 57, 59, 1);
        font-size: 40px;
        span:nth-child(2){
            color: rgba(217, 57, 59, 1);
        	font-size: 20px;
        }
    }
    .红包抵扣规则{
        color: rgba(217, 57, 59, 1);
    	font-size: 10px;
        position: absolute;
        top: 72px;
        left: 0px;
        width: 100%;
        text-align: center;
    }
    .欢迎词{
        position: absolute;
        width: 100%;
        text-align: center;
        left: 0px;
        top: 170px;
        color: rgba(255, 255, 255, 1);
    	font-size: 14px;
        line-height: 150%;
    }
    .领取按钮{
        position: absolute;
        top: 260px;
        left: 0px;
        right: 0px;
        margin:auto;
        width: 123px;
    	height: 32px;
        color: rgba(217, 57, 59, 1);
        background-color: rgba(255, 255, 255, 1);
        border-radius: 16px;
        font-size: 14px;
        line-height: 32px;
        text-align: center;
    }
    .说明{
        position: absolute;
        left: 0px;
        bottom: 5px;
        width: 100%;
        text-align: center;
        color: rgba(255, 255, 255, 1);
    	font-size: 10px;
    }
}


.未登录提示框 {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .遮罩 {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
    }
    .内容 {
        position: relative;
        z-index: 1;
        width: 195px;
        background: rgba(255, 255, 255, 0.95);
        text-align: center;
        border-radius: 16px;
        .头部 {
            padding: 10px 0px 10px;
            font-weight: bold;
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        .文本 {
            color: rgba(80, 80, 80, 1);
        	font-size: 14px;
        }
        .按钮组 {
            font-size: 14px;
            display: flex;
            height: 44px;
            line-height: 44px;
            > li {
                width: 50%;
                color: rgba(0, 122, 255, 1);
            }
        }
    }
}
</style>
