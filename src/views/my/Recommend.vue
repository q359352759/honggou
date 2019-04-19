<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">
                推荐有奖
            </h1>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <div class="box_1">
                <img src="image/tuijian.png" alt="">
                <h1>邀请好友可获得20元购物红包！</h1>
                <h2 @click="邀请好友()">邀请好友</h2>
                <!-- <btn value="邀请好友" :styles="{'background':'none','color':'#ffffff','border':'1px solid #ffffff'}"/> -->
                <!-- <h2 @tap="yanqing1()">邀请好友2</h2> -->
            </div>

            <div ref="box_2"></div>
            <div class="box_2 flex" v-if="box_2_actvie">
                <ul class="title">
                    <li>已邀{{invitedrecord.total}}请人</li>
                    <li>获得{{(user_invited_sutotal && user_invited_sutotal.amount) ? user_invited_sutotal.amount : 0}}元红包</li>
                </ul>
                <ul class="list">
                    <li>
                        <div>好友</div>
                        <div>时间</div>
                        <div>红包</div>
                    </li>
                </ul>
            </div>

            <div class="box_2">
                <ul class="title">
                    <li>已邀请{{invitedrecord.total}}人</li>
                    <li>获得{{(user_invited_sutotal && user_invited_sutotal.amount) ? user_invited_sutotal.amount : 0}}元红包</li>
                </ul>
                <ul class="list">
                    <li>
                        <div>好友</div>
                        <div>时间</div>
                        <div>红包</div>
                    </li>
                    <li v-for="(item, index) in invitedrecord.list" :key="index">
                        <div>
                            <span v-if="item.用户">
                                {{item.用户.phone | fliter_phone}}
                            </span>
                        </div>
                        <div>
                            {{item.createtime | time_filter}}
                        </div>
                        <div>
                            {{item.amount}}
                        </div>
                    </li>
                </ul>
            </div>

            <loading :loadingtype="invitedrecord.loading" />
            <!-- <button @click="BeInvited()">被邀请界面</button> -->
        </div>

      
        <fxewm ref="fxewm" :分享地址="分享地址" :userInfo="userInfo" :分享显示名称="(userInfo && !实名信息) ? userInfo.nickname : 实名信息.name"/>

    </div>
</template>

<script>

import fxewm from '@/components/分享二维码/分享1.vue'

import { api_通过username查询用户 } from "@/api/用户接口.js";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { openloading } from "@/assets/js/currency.js";

import { WechatIMG311 } from '@/assets/image_base64/WechatIMG311.js'

import { dateFtt } from "@/assets/js/currency.js";
import loading from "@/components/loading.vue";
import btn from "@/components/button.vue";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "",
    components: {
        loading,
        btn,
        fxewm
    },
    data() {
        return {
            WechatIMG311: WechatIMG311,
            ApplicationType: ApplicationType,
            userInfo: "",
            index: 0,
            box_2_actvie: false,
            user_invited_sutotal: {},
            invitedrecord: {
                //记录列表
                loading: false,
                page_index: 0,
                list: [],
                total: 0,
                query: {
                    start: 0,
                    length: 10,
                    userid: "",
                    // type:1
                    // invitedId:"",   //被邀请者
                    // inviterId:'',   //邀请者
                }
            },
        };
    },
    computed: {
        ...mapGetters({
            实名信息: "实名认证/实名信息"
        }),
        分享地址(){
            var url=''
            if(this.userInfo){
                url = 'http://m.lxad.vip/test/dist/index.html' + "#/BeInvited?pid=" + this.userInfo.username;
            }
            return url;
        }
    },
    filters: {
        fliter_phone(phone) {
            if (!phone) return "";
            return phone.substring(0, 3) + "***" + phone.substring(phone.length - 3);
        },
        time_filter(time) {
            return dateFtt(time, "yyyy.MM.dd hh:mm");
        }
    },
    methods: {
        ...mapActions({
            获取认证: "实名认证/获取认证",
        }),
        //被邀请界面
        BeInvited() {
            this.$router.push("/BeInvited");
        },
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (this.$refs.box_2.offsetTop - 20 <= e.target.scrollTop) {
                this.box_2_actvie = true;
            } else {
                this.box_2_actvie = false;
            }
            if (h + t >= sh - 10) {
                if (!this.invitedrecord.loading && this.invitedrecord.total != this.invitedrecord.list.length) {
                    this.invitedrecord.page_index++;
                    this.get_invitedrecord();
                }
            }
        },
        邀请好友() {
            this.$refs.fxewm.显示二维码()
        },
        //用户邀请注册资产
        get_user_invited_sutotal() {
            this.$axios({
                method: "get",
                url:
                    "/api-u/users/invitedsutotal/findByUserid/" + this.userInfo.username
            })
                .then(x => {
                    console.log("获取", x);
                    if (x.data.code == 200) {
                        this.user_invited_sutotal = x.data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //用户平台(邀请注册)记录
        get_invitedrecord() {
            this.invitedrecord.query.start =
                this.invitedrecord.page_index * this.invitedrecord.query.length;
            this.invitedrecord.query.userid = this.userInfo.username;
            this.$axios({
                method: "get",
                url: "/api-u/users/invitedrecord/findAll",
                params: this.invitedrecord.query
            }).then(x => {
                console.log("用户平台(邀请注册)记录", x);
                if (x.data.code == 200) {
                    var list=x.data.data.data;
                    list.forEach(item => {
                        item.用户='';
                        api_通过username查询用户(item.invitedId).then(r=>{
                            item.用户=r.data.code==200 ? r.data.data :"";
                        }).catch(err1=>{})
                    });

                    this.invitedrecord.list = this.invitedrecord.list.concat(list);
                    this.invitedrecord.total = x.data.data.total;
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    beforeCreate() { },
    created: function () {
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }

        // console.log(this.$route.query)
        if (!this.userInfo) {
            var query = this.$route.query;
            if (query.pid) {
                this.$router.push("/BeInvited?pid=" +query.pid);
            } else {
                this.$router.push("/BeInvited");
            }
        }
        // console.group('------created创建完毕状态------');
    },
    beforeMount: function () {
        // console.group('------beforeMount挂载前状态------');
    },
    mounted() {
        if (this.userInfo) {
            //用户邀请注册资产
            this.get_user_invited_sutotal();
            //用户平台(邀请注册)记录
            this.get_invitedrecord();
            //获取实名认证信息
            this.获取认证(this.userInfo.username);
        }
    }
};
</script>

<style lang="scss" scoped>
.mui-bar,
.mui-bar-nav {
    box-shadow: none;
}
.mui-content {
    background: #cc1a3f;
}
.mui-bar {
    background: #cc1a3f;
}
.box_1 {
    text-align: center;
    color: #ffffff;
    img {
        width: 100%;
    }
    h1 {
        font-weight: 400;
        font-size: 0.14rem;
    }
    h2 {
        font-weight: 400;
        width: 140px;
        height: 30px;
        border: 1px solid #ffffff;
        border-radius: 30px;
        font-size: 0.14rem;
        line-height: 28px;
        margin: 0.2rem auto 0.16rem;
        letter-spacing: 3px;
        // box-shadow: inset 0px 0px 11px 2px #ffffff;
    }
}
.box_2.flex {
    position: fixed;
    width: 100%;
    left: 0px;
    top: 20px;
    background: #cc1a3f;
}
.box_2 {
    color: #ffffff;
    .title {
        padding: 0px 0.28rem;
        font-size: 0.14rem;
        display: flex;
        justify-content: space-between;
    }
    .list {
        margin: 5px 0px 0px;
        text-align: center;
        font-size: 0.12rem;
        border-top: 1px solid #ffffff;
        > li {
            display: flex;
            border-bottom: 1px solid #ffffff;
            > div {
                width: calc(100% / 3);
                height: 0.3rem;
                line-height: 0.3rem;
            }
            > div:nth-child(2),
            > div:nth-child(3) {
                border-left: 1px solid #ffffff;
            }
        }
    }
}

</style>
