<template>
    <div id="Agent">
        <header class="mui-bar mui-bar-nav">
            <a @tap="返回上一页()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">代理人</h1>
            <span v-if="isareaManager && 当前登录用户.username==userid" @tap="$router.push('/RegionalAgent')" class="quyu">区域管理</span>
            <span v-if="!isareaManager && 当前登录用户.username==userid" @tap="$router.push('/RegionalAgencyAgreement')" class="quyu">区域代理</span>
        </header>

        <div class="mui-content mui-fullscreen" @scroll="content_scroll($event)">
            <div class="box_1">
                <div class="img_box" @click="$router.push('/SetUp')">
                    <img v-if="!userInfo.headImgUrl" src="@/assets/image/WechatIMG311.png" alt="" srcset="">
                    <img v-if="userInfo.headImgUrl" :src="userInfo.headImgUrl" alt="" srcset="">
                </div>
                <div class="text">
                    <div>
                        <span>{{agentUser.realName}}</span>
                        <span @click="erweima()"><i class="icon iconfont icon-31erweima"></i></span>
                    </div>
                    <div>
                        {{areaList[0] ? areaList[0].name : ''}}{{areaList[1] ? '/'+areaList[1].name : ''}}{{areaList[2] ? '/'+areaList[2].name : ''}}
                    </div>
                </div>
                <!-- <div class="market" @click="$router.push('/AgentDistribution')">
                    <div>
                        <i class="icon iconfont icon-fenxiaoguanli1"></i>
                    </div>
                    <span>分销管理</span>
                </div> -->
                <div class="market" @click="$router.push('/agent/tghb?userid='+userid)">
                    <div>
                        <i class="icon iconfont icon-haibaoshengcheng"></i>
                    </div>
                    <span>推广海报</span>
                </div>
                <div @click="$router.push('/yewushichang')" class="market">
                    <div>
                        <i class="icon iconfont icon-fod-business"></i>
                    </div>
                    <span>业务市场</span>
                </div>
            </div>

            <ul class="box_2">
                <li :class="{'active':查看类型==1}" @click="设置查看类型(1)">
                    <div class="img_box">
                        <i class="icon iconfont icon-tuandui"></i>
                    </div>
                    <div class="title">团队补贴</div>
                    <div class="money">{{agentUser.subsidiesall ? agentUser.subsidiesall : 0}}</div>
                </li>
                <li :class="{'active':查看类型==2}" @click="设置查看类型(2)">
                    <div class="img_box">
                        <i class="icon iconfont icon-zhifubaozhanneidaeshoufukuan"></i>
                    </div>
                    <div class="title">赏金</div>
                    <div class="money">￥{{奖赏所有数据.奖赏收益.balance}}</div>
                </li>
                <li :class="{'active':查看类型==3}" @click="设置查看类型(3)">
                    <div class="img_box">
                        <i class="icon iconfont icon-yongjin1"></i>
                    </div>
                    <div class="title">分佣</div>
                    <div class="money">￥0</div>
                </li>
                <li :class="{'active':查看类型==4}" @click="设置查看类型(4)">
                    <div class="img_box">
                        <i class="icon iconfont icon-fenrun"></i>
                    </div>
                    <div class="title">分润</div>
                    <div class="money">￥{{(代理人分润资产 && 代理人分润资产.balance) ? 代理人分润资产.balance : 0}}</div>
                </li>
                <li :class="{'active':查看类型==5}" @click="设置查看类型(5)">
                    <div class="img_box">
                        <i class="icon iconfont icon-ketixianjine"></i>
                    </div>
                    <div class="title">可提现</div>
                    <div class="money">￥{{总可提现}}</div>
                </li>
            </ul>

            <div class="content" ref="content">
                <!-- 补贴 -->
                <div class="box_3 团队补贴" v-show="查看类型==1">
                    <ul class="title" :class="{'active':fixed}">
                        <li>姓名</li>
                        <li>日期</li>
                        <li>直补</li>
                        <!-- <li>+直补</li> -->
                        <li>间补</li>
                        <!-- <li>+间补</li> -->
                    </ul>
                    <ul class="list">
                        <li v-for="(x, index) in butie.list" :key="index">
                            <div>{{x.realName}}</div>
                            <div>{{x.updateTime | datatime('yyyy-MM-dd')}}</div>
                            <div>{{x.dtSubsidies}}</div>
                            <!-- <div>{{x.dtSubsidiesPlus}}</div> -->
                            <div>{{x.itSubsidies}}</div>
                            <!-- <div>{{x.itSubsidiesPlus}}</div> -->
                        </li>
                        <loading :loadingtype="butie.loading" :nodata="!butie.loading && butie.total==0" :end="!butie.loading && butie.list.length==butie.total && butie.total!=0" />
                    </ul>

                    <ul class="footer">
                        <li>直推：{{agentUser.directly}}人</li>
                        <li>间推：{{agentUser.indirect}}人</li>
                        <li>直补：{{agentUser.result1 ? agentUser.result1 : 0}}元</li>
                        <li>间补：{{agentUser.result2 ? agentUser.result2 : 0}}元</li>
                    </ul>
                </div>
                <!-- 赏金 -->
                <div v-show="查看类型==2">
                    <sj :fixed="fixed" :userid="userid"/>
                </div>
                
                <div v-show="查看类型==3">
                    <fy :fixed="fixed" :userInfo="userInfo"/>
                </div>

                <div class="店铺分润" v-show="查看类型==4">
                    <ShopBonus :fixed="fixed" />
                </div>

                <!-- 支付 -->
                <div class="box_6" v-show="查看类型==5">
                    <ul class="list">
                        <li>
                            <div>团队补贴</div>
                            <div>{{agentUser.sutotal}}</div>
                        </li>
                        <li>
                            <div>赏金</div>
                            <div>{{奖赏所有数据.奖赏收益.balance}}</div>
                        </li>
                        <li>
                            <div>分佣</div>
                            <div>0</div>
                        </li>
                        <li>
                            <div>分润</div>
                            <div>{{(代理人分润资产 && 代理人分润资产.balance) ? 代理人分润资产.balance : 0}}</div>
                        </li>
                        <!-- <li>
                            <div>补贴：{{agentUser.sutotal}}</div>
                            <div>累计：{{agentUser.subsidiesall}}</div>
                        </li>-->
                    </ul>
                    <ul class="Collect_Money" @click="Account()">
                        <li>
                            <span>收款账户：</span>
                            <span v-if="Account_obj.type==0">支付宝</span>
                            <span v-if="Account_obj.account && 实名信息 && 实名信息.name">(*{{实名信息.name.substring(1)}})</span>
                            <span>
                                {{Account_obj.account | 过滤账号}}
                            </span>
                            <!-- 收款账户：{{Account_obj.account}} -->
                        </li>
                        <li><i class="mui-icon mui-icon-arrowright"></i></li>
                    </ul>
                    <ul class="money">
                        <li>提现金额： </li>
                        <li>
                            <span>
                                <span>￥</span>
                                <input readonly type="text" :value="总可提现" />
                            </span>
                            <span>费率：4%</span>
                        </li>
                    </ul>
                    <div class="Agreement">
                        <div @click="radio_type_2 = !radio_type_2" class="radio_1" :class="{'active':radio_type_2}">
                            <i class="icon iconfont icon-xuanze"></i>
                        </div>
                        <span @click="radio_type_2 = !radio_type_2">我也阅读并同意</span>
                        <span @click="$router.push('/WithdrawalAgreement')">《提现服务协议》</span>
                        <span>
                            <span @click="$router.push('/EmbodyRecord?type=0')">
                                提现记录
                            </span>
                        </span>
                    </div>
                    <btn value="提交" @click.native="显示密码输入框()" />
                </div>
            </div>

            <div class="payment" v-show="payment">
                <div class="mask"></div>
                <div class="payment_1">
                    <div class="forget" @click="$router.push('/PaymentPassword')">忘记密码？</div>
                    <div class="close_1" @click="关闭密码输入框()"><i class="mui-icon mui-icon-closeempty"></i></div>
                    <div class="title">支付密码</div>
                    <div class="input_box">
                        <input type="password" ref="accoutpassword" id="accout_password" maxlength="6" :class="{'active':accout_password.length>=6}" v-model="accout_password" @input="passwad_change()" pattern="\d*">
                        <ul @click="$refs.accoutpassword.focus()">
                            <li>
                                <span v-show="accout_password.length>0"><i class="icon iconfont icon-xinghao"></i></span>
                            </li>
                            <li>
                                <span v-show="accout_password.length>1"><i class="icon iconfont icon-xinghao"></i></span>
                            </li>
                            <li>
                                <span v-show="accout_password.length>2"><i class="icon iconfont icon-xinghao"></i></span>
                            </li>
                            <li>
                                <span v-show="accout_password.length>3"><i class="icon iconfont icon-xinghao"></i></span>
                            </li>
                            <li>
                                <span v-show="accout_password.length>4"><i class="icon iconfont icon-xinghao"></i></span>
                            </li>
                            <li>
                                <span v-show="accout_password.length>5"><i class="icon iconfont icon-xinghao"></i></span>
                            </li>
                        </ul>
                        <div class="subsidy"></div>
                    </div>
                    <button @click="开始提现()" class="btn_2">确定</button>
                </div>
            </div>

            <form class="input_name" @submit.prevent="Submission()" :class="{'active':input_name_box}">
                <div class="mask" @click="关闭输入名字()"></div>
                <ul class="">
                    <li>该手机号对应多个账号，请输入真实姓名。</li>
                    <li>
                        <input type="text" v-model="name" required placeholder="请输入真实姓名">
                    </li>
                    <li>
                        <button type="submit">确定</button>
                    </li>
                </ul>
            </form>

        </div>

        <fxewm ref="fxewm" :分享地址="分享地址" :userInfo="userInfo" :分享显示名称="(userInfo && !实名信息) ? userInfo.nickname : 实名信息.name"/>

        <tixiantishi v-show="显示提现框" :ok="提现完成" :list="提现提示语" />
        
    </div>
</template>

<script>
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { api_根据userid查询代理人信息 } from "@/api/代理人接口.js";
import { api_获取代理商信息 } from "@/api/代理商接口.js";
import { api_获取收款账号 } from "@/api/收款账号.js";
import { api_代理人赏金体现 } from "@/api/提现接口.js";

import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";

import { WechatIMG311 } from '@/assets/image_base64/WechatIMG311.js'

import fxewm from '@/components/分享二维码/分享1.vue'

// import html2canvas from "html2canvas";
// import QRCode from "qrcodejs2";
import loading from "@/components/loading.vue";
import { dateFtt, openloading } from "@/assets/js/currency";
import { mapActions, mapGetters } from "vuex";
import btn from "@/components/button.vue";
// 店铺分润
import ShopBonus from '@/components/agent/ShopBonus.vue'
import sj from '@/components/agent/赏金.vue'
import fy from '@/components/agent/分佣.vue'

import tixiantishi from "./Agent/提现提示.vue";

export default {
    name: "Agent",
    components: {
        loading,
        sj,
        fy,
        ShopBonus,
        btn,
        tixiantishi,
        fxewm
    },
    data() {
        return {
            WechatIMG311: WechatIMG311,
            ApplicationType: ApplicationType,
            当前登录用户: "",
            userid: '',
            fixed: false, //判断是否定位到顶部
            list_1: [1, 2, 3, 4, 5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            // list_1:[1]
            radio_type_2: true,
            payment: false, //支付弹出框
            userInfo: "",
            agentUser: {}, //代理人信息
            areaList: [], //代理的地区
            butie: {
                //补贴对象
                page_index: 0,
                page_size: 15,
                list: [],
                total: 0,
                loading: false //加载中
            },
            Account_obj: {}, //支付账号
            accout_password: "",
            isareaManager: false,
            CanBePresented: true, //可以提现
            input_name_box: false,
            name: "",
            //====================
            qrcode: null,
            qrcode_show: false,
            erweima_base64: "",

            是否分享: false,
            头像base64: "",
            截图地址: "",

            分享地址: "",
            //===============
            提现完成: false,
            提现标识: "",
            提现提示语: [
                // type 0 不能提现 1 加载中 2 成功 3 失败 4 待审核
                { 名称: "团队补贴", 金额: 0, type: 0, 提示: "一元起提" },
                { 名称: "赏金", 金额: 0, type: 0, 提示: "一元起提" },
                { 名称: "分佣", 金额: 0, type: 0, 提示: "一元起提" },
                { 名称: "分润", 金额: 0, type: 0, 提示: "一元起提" }
            ]
        };
    },
    filters: {
        datatime(time, type) {
            return dateFtt(time, type);
        },
        过滤账号(账号) {
            try {
                return "***" + 账号.substring(账号.length - 4);
            } catch (error) {
                return 账号;
            }
        }
    },
    computed: {
        ...mapGetters({
            查看类型: "agent/查看类型",
            fenrun_shangjia: "agent/ShopBonus/get_list1",
            fenrun_huiyuan: "agent/ShopBonus/get_list2",
            fenrun_type: "agent/ShopBonus/get_type",
            代理人分润资产: "agent/ShopBonus/dailiren_fenrun_zichan", //代理人分润资产
            实名信息: "实名认证/实名信息",
            商家会员类型: "agent/ShopBonus/get_type",
            商家: "agent/ShopBonus/商家",
            会员: "agent/ShopBonus/会员",
            显示提现框: "agent/显示提现框",
            奖赏所有数据: 'agent/奖赏/奖赏所有数据'
        }),
        //提现金额
        总可提现() {
            var 总可提现 = 0;
            总可提现 += this.agentUser.sutotal ? this.agentUser.sutotal : 0;
            总可提现 += this.代理人分润资产 && this.代理人分润资产.balance ? this.代理人分润资产.balance : 0;
            总可提现 += this.奖赏所有数据.奖赏收益.balance ? this.奖赏所有数据.奖赏收益.balance : 0;
            总可提现 = Math.round(总可提现 * 10000) / 10000
            return 总可提现;
        }
    },
    methods: {
        ...mapActions({
            设置查看类型: "agent/设置查看类型",
            ShopBonus_init: "agent/ShopBonus/ShopBonus_init",
            get_fenrui: "agent/ShopBonus/get_list",
            fenrun_fenye: "agent/ShopBonus/xiayiye",
            dailiren_fenrun: "agent/ShopBonus/dailiren_fenrun",
            获取认证: "实名认证/获取认证",
            获取分润: "agent/分润/获取分润",
            获取商家分润列表: "agent/ShopBonus/获取商家分润列表",
            获取会员分润列表: "agent/ShopBonus/获取会员分润列表",
            商家下一页: "agent/ShopBonus/商家下一页",
            会员下一页: "agent/ShopBonus/会员下一页",
            设置显示提现框: "agent/设置显示提现框",
            分享图片: 'app/分享/分享图片',
            奖赏初始化: "agent/奖赏/奖赏初始化",
            查询奖赏下一页: "agent/奖赏/查询奖赏下一页"
        }),
        开始按下() {
            if (ApplicationType == 'app') {
                this.分享图片(this.截图地址)
            }
        },
        返回上一页() {
            if (this.$route.query.back) {
                history.back()
            } else {
                this.$router.push('/my')
            }
        },
        //生产二维码
        erweima() {
            this.$refs.fxewm.显示二维码()
        },
        关闭输入名字() {
            this.input_name_box = false;
        },
        //再次提交
        Submission() {
            this.开始提现();
        },
        平台补贴提现() {
            var amount=Math.floor(this.agentUser.sutotal*100)/100
            var obj = {
                    account: this.Account_obj.account, //到账账号
                    amount: amount, //金额
                    userid: this.userInfo.username,
                    payPassword: this.accout_password,
                    id: this.userInfo.id,
                    name: this.name,
                    identity: this.提现标识
            };
            return new Promise((resolve, reject) => {
                if (!obj.amount || obj.amount < 1) {
                    resolve(true);
                    return;
                }
                this.$axios.get("/api-u/users/alipay", { params: obj }).then(x => {
                    resolve(x);
                }).catch(err => {
                    resolve(false);
                });
            });
        },
        店铺分润提现() {
            var amount=this.代理人分润资产 && this.代理人分润资产.balance ? this.代理人分润资产.balance : 0;
                amount=Math.floor(amount*100)/100
            var obj = {
                agentid: this.userInfo.username,
                payPassword: this.accout_password,
                name: this.name,
                account: this.Account_obj.account, //到账账号
                type: 1, //1代理人 2 代理商
                amount:amount,
                identity: this.提现标识
            };
            return new Promise((resolve, reject) => {
                if (!obj.amount || obj.amount < 1) {
                    resolve(true);
                    return;
                }
                this.$axios.post("/api-s/shops/AgentsShareProfit", obj).then(x => {
                        resolve(x);
                    }).catch(err => {
                        resolve(false);
                    });
            });
        },
        代理人赏金体现(){
            var amount=this.奖赏所有数据.奖赏收益.balance ? this.奖赏所有数据.奖赏收益.balance : 0;
                amount=Math.floor(amount*100)/100;
            var obj={
                    agentid: this.userInfo.username,
                    payPassword: this.accout_password,
                    name: this.name,
                    account: this.Account_obj.account, //到账账号
                    type: 3,        //3是赏金
                    amount:amount,
                    identity: this.提现标识
                }
            return new Promise((resolve, reject) => {
                if (!obj.amount || obj.amount < 1) {
                    resolve(true);
                    return;
                }
                api_代理人赏金体现(obj).then(x=>{
                    resolve(x);
                }).catch(err=>{
                    resolve(false);
                })
            });
                
        },
        //提现
        开始提现() {
            var password_test = /^\d{6}$/; //6位数字验证
            if (!password_test.test(this.accout_password)) {
                mui.toast("支付密码为6位数字。", { duration: 2000, type: "div" });
                return;
            }
            this.提现标识 = this.生成提现唯一标识();
            this.payment = false;
            this.CanBePresented = false; //可以提现 或 提现中
            this.input_name_box = false; //名字输入框
            this.提现完成 = false;

            this.提现提示语 = [
                // type 0 不能提现 1 加载中 2 成功 3 失败 4 待审核
                {
                    名称: "团队补贴",
                    金额: this.agentUser.sutotal ? this.agentUser.sutotal : 0,
                    type: 0,
                    提示: "一元起提"
                },
                { 名称: "赏金", 金额: this.奖赏所有数据.奖赏收益.balance, type: 0, 提示: "一元起提" },
                { 名称: "分佣", 金额: 0, type: 0, 提示: "一元起提" },
                {
                    名称: "分润",
                    金额: this.代理人分润资产 && this.代理人分润资产.balance ? this.代理人分润资产.balance : 0,
                    type: 0,
                    提示: "一元起提"
                },
            ];
            if (!this.agentUser.sutotal || this.agentUser.sutotal < 1) {
                this.提现提示语[0].type = 0;
            } else {
                this.提现提示语[0].type = 1;
            }

            
            if (!this.代理人分润资产 || !this.代理人分润资产.balance || this.代理人分润资产.balance < 1) {
                this.提现提示语[3].type = 0;
            } else {
                this.提现提示语[3].type = 1;
            }

            if (!this.奖赏所有数据.奖赏收益.balance || this.奖赏所有数据.奖赏收益.balance < 1) {
                this.提现提示语[1].type = 0
            } else {
                this.提现提示语[1].type = 1
            }


            this.设置显示提现框(true);
            Promise.all([
                this.平台补贴提现(),
                this.店铺分润提现(),
                this.代理人赏金体现()
                ]).then(res => {
                console.log(res);
                var 是否需要输入名字 = false;
                var 提示语 = "";
                if (!res[0]) {
                    //团队补贴
                    this.提现提示语[0].type = 3;
                    this.提现提示语[0].提示 = "网络错误";
                } else if (this.提现提示语[0].type != 0) {
                    //无金额可提现就不需要操作了
                    if (res[0].data.code == 200) {
                        var str = res[0].data.msg;
                        if (str.indexOf("审核") == -1) {
                            this.提现提示语[0].type = 2;
                            this.提现提示语[0].提示 = "成功";
                        } else {
                            this.提现提示语[0].type = 4;
                            this.提现提示语[0].提示 = "等待审核";
                        }
                    } else if (res[0].data.code == "PAYEE_USER_INFO_ERROR" || res[0].data.code == "PAYEE_ACC_OCUPIED") {
                        是否需要输入名字 = true;
                    } else {
                        this.提现提示语[0].type = 3;
                        this.提现提示语[0].提示 = "失败";
                        if (res[0].data.code) {
                            提示语 = res[0].data.msg;
                        }
                    }
                }
                if (!res[1]) {
                    //代理人分润提现
                    this.提现提示语[3].type = 3;
                    this.提现提示语[3].提示 = "网络错误";
                } else if (this.提现提示语[3].type != 0) {
                    if (res[1].data.code == 200) {
                        var str = res[1].data.msg;
                        if (str.indexOf("审核") == -1) {
                            this.提现提示语[3].type = 2;
                            this.提现提示语[3].提示 = "成功";
                        } else {
                            this.提现提示语[3].type = 4;
                            this.提现提示语[3].提示 = "等待审核";
                        }
                    } else if (
                        res[1].data.code == "PAYEE_USER_INFO_ERROR" ||
                        res[1].data.code == "PAYEE_ACC_OCUPIED"
                    ) {
                        是否需要输入名字 = true;
                    } else {
                        this.提现提示语[3].type = 3;
                        this.提现提示语[3].提示 = "失败";
                        if (res[1].data.code) {
                            提示语 = res[1].data.msg;
                        }
                    }
                }

                if (!res[2]) {
                    //代理人分润提现
                    this.提现提示语[1].type = 3;
                    this.提现提示语[1].提示 = "网络错误";
                } else if (this.提现提示语[1].type != 0) {
                    if (res[2].data.code == 200) {
                        var str = res[2].data.msg;
                        if (str.indexOf("审核") == -1) {
                            this.提现提示语[1].type = 2;
                            this.提现提示语[1].提示 = "成功";
                        } else {
                            this.提现提示语[1].type = 4;
                            this.提现提示语[1].提示 = "等待审核";
                        }
                    } else if (res[2].data.code == "PAYEE_USER_INFO_ERROR" || res[2].data.code == "PAYEE_ACC_OCUPIED") {
                        是否需要输入名字 = true;
                    } else {
                        this.提现提示语[1].type = 3;
                        this.提现提示语[1].提示 = "失败";
                        if (res[2].data.code) {
                            提示语 = res[2].data.msg;
                        }
                    }
                }
                if (是否需要输入名字) {
                    this.设置显示提现框(false);
                    this.input_name_box = true;
                } else {
                    this.提现完成 = true;
                    if (提示语) {
                        mui.alert(提示语, "提示", "好的", function () { }, "div");
                    }
                    //获取代理商信息
                    this.areaManager();
                    this.奖赏初始化(this.agentUser);
                    //代理商分润资产
                    this.dailiren_fenrun();
                }
            });
            // window.scroll(0,0);
        },
        //支付密码
        passwad_change() {
            if (this.accout_password.length > 6) {
                this.accout_password = this.accout_password.substring(1);
            }
        },
        content_scroll(e) {
            // console.log(e.target.scrollTop,this.$refs.content.offsetTop);
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            this.fixed = e.target.scrollTop + 44 >= this.$refs.content.offsetTop;
            if (this.查看类型 == 1) {
                if (h + t >= sh - 10 && !this.奖赏所有数据.奖赏商品.loading && this.奖赏所有数据.奖赏商品.list.length < this.奖赏所有数据.奖赏商品.total) {
                    this.查询奖赏下一页();
                }
            } else if (this.查看类型 == 2) {
                if (h + t >= sh - 10 && !this.butie.loading && this.butie.list.length < this.butie.total) {
                    this.butie.page_index++;
                    //查看下级带来的收益
                    this.subsidies();
                }
            } else if (this.查看类型 == 3) {
            } else if (this.查看类型 == 4) {
                if (h + t >= sh - 10 && this.商家会员类型 == 0 && !this.商家.logging && this.商家.total > this.商家.list.length) {
                    this.商家下一页();
                } else if (h + t >= sh - 10 && this.商家会员类型 == 1 && !this.会员.logging && this.会员.total > this.会员.list.length) {
                    this.会员下一页();
                }
                // this.fenrun_fenye(this.fenrun_type)
            } else if (this.查看类型 == 5) {
            }
        },
        显示密码输入框(x) {
            // this.设置显示提现框(true);
            if (!this.radio_type_2) {
                mui.toast("请先同意协议。", { duration: 2000, type: "div" });
                return;
            } else if (!this.Account_obj.account) {
                mui.toast("请设置收款账号", { duration: 2000, type: "div" });
                return;
            } else if (this.总可提现 < 1) {
                mui.toast("一元起提", { duration: 2000, type: "div" });
                return;
            }
            // else if (!this.CanBePresented) {
            //     mui.toast("提现处理中，请稍等。", { duration: 2000, type: "div"});
            //     return;
            // }
            this.payment = true;
            this.accout_password = "";
            this.name = "";
            setTimeout(() => {
                this.$refs.accoutpassword.focus();
            }, 500);
        },
        关闭密码输入框() {
            this.payment = false;
        },
        Account() {
            if (this.当前登录用户.username == this.userid) {
                this.$router.push("/Account");
            } else {
                mui.toast("你不能修改账号", { duration: "long", type: "div" });
            }
        },
        //查看下级带来的收益
        subsidies() {
            return new Promise((resolve, reject) => {
                this.butie.loading = true;
                this.$axios.get("/api-u/agentUser/subsidies/forme?referrerPhone=" + this.userInfo.phone + "&start=" + this.butie.page_index * this.butie.page_size + "&length=" + this.butie.page_size).then(x => {
                    if (x.data.code == 200) {
                        this.butie.list = this.butie.list.concat(x.data.data.data);
                        this.butie.total = x.data.data.total;
                        this.butie.loading = false;
                    }
                    resolve()
                }).catch(err => {
                    resolve()
                })
            });
        },
        //获取支付宝账号
        findAccount() {
            return new Promise((resolve, reject) => {
                api_获取收款账号(this.userInfo.username).then(x => {
                    this.Account_obj = x.data.data != null ? x.data.data : {};
                    resolve()
                }).catch(err => {
                    resolve()
                })
            });
        },
        //获取代理人信息
        areaManager() {
            return new Promise((resolve, reject) => {
                api_根据userid查询代理人信息(this.userInfo.username).then(x => {
                    if (x.data.code != 200) {
                        this.$router.push("/agent/ApplicationNotes");
                    } else {
                        if (x.data.data.type == 1) {
                            this.agentUser = x.data.data;
                            this.areaList = this.$store.getters.filter_area(x.data.data.areaCode);
                        } else {
                            //红购使者
                            this.$router.push('/shizhe/honggoushizhe?userid=783D9600B30DF8B1E61B8CDB079A378A')
                        }
                    }
                    resolve()
                }).catch(err => {
                    this.$router.push("/agent/ApplicationNotes");
                    resolve()
                });
            });
        },
        获取测试() {
            console.log(this.agentUser.areaCode);
            this.获取分润([this.agentUser.areaCode]).then(x => {
                console.log(x);
            }).catch(err => {
                console.log(err);
            });
        },
        生成提现唯一标识() {
            // identity
            return this.userInfo.username + "_" + new Date().getTime();
        },
        获取代理商信息() {
            return new Promise((resolve, reject) => {
                api_获取代理商信息(this.userInfo.username).then(x => {
                    if (x.data.code == 200 && x.data.data) {
                        this.isareaManager = true;
                    }
                    resolve()
                }).catch(err => {
                    resolve()
                })
            });
        },
        async 初始化() {
            openloading(true)
            if (!this.userInfo) {
                var 用户返回值 = await api_通过username查询用户(this.userid);
                if (用户返回值.data.code == 200) {
                    var 用户信息 = 用户返回值.data.data;
                    try {
                        用户信息.nickname = b64DecodeUnicode(用户信息.nickname)
                    } catch (error) { }
                    this.userInfo = 用户信息;
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    return
                }
            }
            this.分享地址 = 'http://m.lxad.vip/test/dist/index.html' + "#/BeInvited?pid=" + this.userInfo.username;

            await this.areaManager()
            this.ShopBonus_init(this.userInfo);

            Promise.all([this.subsidies(), this.findAccount(), this.获取代理商信息()]).then(x => {
                openloading(false)
            }).catch(err => {
                openloading(false)
            })


            this.获取会员分润列表();
            this.获取商家分润列表();

            this.奖赏初始化(this.agentUser);
            //代理人分润资产
            this.dailiren_fenrun(this.userInfo);
            //获取实名认证信息
            this.获取认证(this.userInfo.username);
        }
    },
    mounted: function () {
        this.当前登录用户 = JSON.parse(localStorage.userInfo);
        if (this.$route.query.userid) {
            this.userid = this.$route.query.userid;
        } else {
            this.userid = this.当前登录用户.username
        }
        this.初始化();

        api_通过username查询用户(this.userid).then(x => {
            if (x.data.code == 200 && x.data.data) {
                var 用户信息 = x.data.data;
                try {
                    用户信息.nickname = b64DecodeUnicode(用户信息.nickname)
                } catch (error) { }
                this.userInfo = 用户信息;
            }
        }).catch(err => { })

    },
    activated() {
        // var userid = this.$route.query.userid;
        // if (this.userid && this.userid != userid) {
        //     this.当前登录用户 = JSON.parse(localStorage.userInfo);
        //     if (this.$route.query.userid) {
        //         this.userid = this.$route.query.userid;
        //     } else {
        //         this.userid = this.当前登录用户.username
        //     }
        //     this.初始化();
        //     console.log('再次进入这个页面需要更新数据');
        // }
        // api_通过username查询用户(this.userid).then(x=>{
        //     if (x.data.code == 200 && x.data.data) {
        //         var 用户信息 = x.data.data;
        //         try {
        //             用户信息.nickname = b64DecodeUnicode(用户信息.nickname)
        //         } catch (error) { }
        //         this.userInfo = 用户信息;
        //     }
        // }).catch(err=>{})

    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
#Agent .支付密码输入框 {
    ul {
        width: 243px;
        margin: 0px auto;
        display: flex;
        border-top: 1px solid #cccccc;
        border-right: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        > li {
            height: 39px;
            width: calc(100% / 6);
            border-left: 1px solid #cccccc;
        }
    }
}

#Agent {
    .mui-content {
        display: flex;
        flex-direction: column;
    }
    footer {
        position: fixed;
        width: 100%;
        bottom: 0px;
        left: 0px;
        background: $header_background;
    }
}

#Agent .quyu {
    float: right;
    color: #ffffff;
    line-height: 44px;
    font-size: 0.14rem;
    margin: 0px 5px 0px 0px;
    position: relative;
    z-index: 1;
}
#Agent .mui-bar {
    // background: rgba(39, 172, 110, 1);
    background: $header_background;
    a {
        color: #ffffff;
    }
}
#Agent .mui-title {
    color: #ffffff;
}

#Agent .box_1 {
    flex-shrink: 0;
    display: flex;
    padding: 0.15rem 0.18rem;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
    .img_box {
        width: 0.5rem;
        height: 0.5rem;
        margin: 0px 0.1rem 0px 0px;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 100%;
        }
    }
    .text {
        overflow: hidden;
        flex-grow: 1;
        > div:nth-child(1) {
            color: rgba(80, 80, 80, 1);
            font-size: 0.14rem;
            font-weight: bold;
            margin: 3px 0px;
            span {
                margin: 0px 5px 0px 0px;
            }
        }
        > div:nth-child(2) {
            color: rgba(128, 128, 128, 1);
            font-size: 0.12rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .market {
        flex-shrink: 0;
        text-align: center;
        // color: rgba(42, 130, 228, 1);
        // font-size: 14px;
        white-space: nowrap;
        flex-shrink: 0;
        margin: 0px 3px;
        span {
            font-size: 0.1rem;
            color: #808080;
        }
        i {
            color: #1894dc;
            font-size: 0.24rem;
        }
    }
}
#Agent .box_2 {
    flex-shrink: 0;
    display: flex;
    margin: 0.05rem 0px 0px;
    > li:nth-child(1) {
        border: none;
    }
    li.active::after {
        position: absolute;
        width: 60%;
        height: 2px;
        left: 20%;
        bottom: 0px;
        content: "";
        background: $header_background;
    }
    li {
        width: 25%;
        padding: 5px 0px 5px;
        background: #ffffff;
        text-align: center;
        position: relative;
        .img_box {
            width: 38px;
            height: 38px;
            margin: 0px auto 3px;
            background: $header_background;
            border-radius: 100%;
            color: #ffffff;
            line-height: 38px;
            font-size: 24px;
        }
    }
    .title {
        color: rgba(128, 128, 128, 1);
        font-size: 10px;
    }
    .money {
        color: rgba(227, 60, 100, 1);
        font-size: 10px;
    }
}

#Agent .box_3 {
    flex-grow: 1;
    // display: flex;
    // flex-direction: column;
    margin: 3px 0px 0px;
    padding: 0px 0px 44px;
    .title.active {
        position: fixed;
        width: 100%;
        left: 0px;
        top: 44px;
    }
    .title {
        display: flex;
        flex-shrink: 0;
        height: 30px;
        background: $header_background;
        align-items: center;
        font-weight: bold;
        color: #ffffff;
        li {
            min-height: 100%;
            width: 25%;
            flex-grow: 1;
            text-align: center;
            border-left: 1px solid #e2e1e1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 30px;
            font-size: 12px;
            line-height: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        > li:nth-child(1) {
            border: none;
        }
    }
    .list {
        overflow: auto;
        flex-grow: 1;
    }
    .list > li:nth-child(2n) {
        background: #ffffff;
    }
    .list > li:nth-child(2n-1) {
        background: rgba(242, 242, 242, 1);
    }
    .list > li {
        color: #5a5a5a;
        display: flex;
        height: 30px;
        align-items: center;
        div {
            min-height: 100%;
            flex-grow: 1;
            text-align: center;
            border-left: 1px solid #e2e1e1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            line-height: 30px;
            width: 25%;
        }
        > div:nth-child(1) {
            border: none;
        }
    }
    .footer {
        position: fixed;
        width: 100%;
        left: 0px;
        bottom: 0px;
        display: flex;
        height: 32px;
        color: rgba(255, 255, 255, 1);
        background-color: $header_background;
        font-size: 11px;
        text-align: center;
        line-height: 32px;
        flex-shrink: 0;
        li {
            width: 25%;
        }
    }
}

#Agent .box_6 {
    margin: 5px 0px 0px 0px;
    .list {
        background: #ffffff;
        padding: 8px 0px;
        display: flex;
        color: rgba(56, 56, 56, 1);
        font-size: 12px;
        text-align: center;
        li {
            position: relative;
            width: 25%;
            div:nth-child(1) {
                margin: 0px 0px 10px;
            }
        }
        li::after {
            position: absolute;
            width: 1px;
            height: 33px;
            background-color: rgba(229, 229, 229, 1);
            content: "";
            top: 0px;
            left: 0px;
            bottom: 0px;
            margin: auto;
        }
        li:nth-child(1)::after {
            display: none;
        }
    }
    .Collect_Money {
        margin: 5px 0px 0px 0px;
        display: flex;
        justify-content: space-between;
        background: #ffffff;
        line-height: 35px;
        padding: 0px 10px 0px 20px;
        color: rgba(56, 56, 56, 1);
        font-size: 12px;
        border-bottom: 1px solid rgba(229, 229, 229, 1);
        i {
            line-height: 35px;
        }
    }
    .money {
        padding: 5px 10px 5px 20px;
        background: #ffffff;
        color: rgba(80, 80, 80, 1);
        display: flex;
        align-items: center;
        > li:nth-child(1) {
            font-size: 12px;
            white-space: nowrap;
            flex-shrink: 0;
        }
        > li:nth-child(2) {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span:nth-child(1) {
                font-size: 27px;
                line-height: initial;
                display: flex;
                input {
                    padding: 0px;
                    margin: 0px;
                    border: none;
                    font-size: 27px;
                    // border-bottom: 1px solid #cccccc;
                }
            }
            > span:nth-child(2) {
                font-size: 12px;
                padding: 0px 0px 0px 10px;
                border-left: 1px solid #505050;
                height: 14px;
                line-height: 14px;
                white-space: nowrap;
                color: #505050;
                margin: 0px 0px 0px 20px;
            }
        }
    }
    .Agreement {
        display: flex;
        padding: 0px 20px;
        font-size: 12px;
        align-items: center;
        margin: 20px 0px;
        > span:nth-child(2) {
            margin: 0px 0px 0px 5px;
        }
        > span:nth-child(3) {
            /* color: rgba(58, 182, 237, 1) */
            color: rgba(42, 130, 228, 1);
        }
        > span:nth-child(4) {
            flex-grow: 1;
            text-align: right;
            color: rgba(42, 130, 228, 1);
        }
    }
    .btn_1 {
        width: 170px;
        height: 32px;
        display: block;
        margin: 0px auto;
        color: rgba(255, 255, 255, 1);
        background-color: $header_background;
        border: none;
        border-radius: 32px;
    }
}

#Agent .payment {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        background: rgba(0, 0, 0, 0.5);
    }
    .payment_1 {
        background: #ffffff;
        width: 298px;
        position: relative;
        z-index: 1;
        max-width: 100%;
        .forget {
            position: absolute;
            color: rgba(80, 80, 80, 1);
            font-size: 10px;
            top: 10px;
            left: 24px;
            z-index: 1;
        }
        .close_1 {
            position: absolute;
            top: 0px;
            right: 0px;
            color: rgba(153, 153, 153, 1);
            z-index: 1;
            i {
                font-size: 30px;
            }
        }
        .title {
            height: 42px;
            line-height: 42px;
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            text-align: center;
            position: relative;
            z-index: 0;
        }
        .input_box {
            width: 243px;
            height: 39px;
            margin: 0px auto;
            position: relative;
            input {
                position: fixed;
                left: -100%;
                padding: 0px;
                margin: 0px;
                height: 100%;
                letter-spacing: 34.5px;
                padding: 0px 0px 0px 17px;
                z-index: 1;
                border: none;
                background: none;
                width: 130%;
                opacity: 0;
            }
            > ul {
                z-index: 1;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
                border-right: 1px solid #cccccc;
                text-align: center;
                line-height: 37px;
                font-size: 12px;
                li {
                    border-left: 1px solid #cccccc;
                    border-top: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
                    width: calc(100% / 6);
                }
            }
            .subsidy {
                position: absolute;
                background: #ffffff;
                width: 26px;
                height: 100%;
                top: 0px;
                right: -26px;
                z-index: 2;
            }
        }
        .btn_2 {
            width: 123px;
            height: 26px;
            color: rgba(255, 255, 255, 1);
            background-color: $header_background;
            font-size: 14px;
            border-radius: 26px;
            border: none;
            margin: 16px auto;
            display: block;
            padding: 0px;
        }
    }
}

#Agent .input_name.active {
    display: flex;
}
#Agent .input_name {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    ul {
        background: #ffffff;
        position: relative;
        z-index: 1;
        width: 2.98rem;
        > li:nth-child(1) {
            padding: 0.13rem;
            color: rgba(80, 80, 80, 1);
            font-size: 0.12rem;
            text-align: center;
        }
        > li:nth-child(2) {
            padding: 0px 0.3rem;
            height: 0.36rem;
            input {
                text-align: center;
                background: rgba(166, 166, 166, 1);
                margin: 0px;
                padding: 0px;
                height: 100%;
                font-size: 0.14rem;
            }
        }
        > li:nth-child(3) {
            padding: 0.15rem;
            text-align: center;
            button {
                width: 1.23rem;
                height: 0.26rem;
                color: rgba(255, 255, 255, 1);
                background-color: rgba(54, 140, 89, 1);
                border-radius: 0.26rem;
                padding: 0px;
                border: none;
            }
        }
    }
}

#Agent .kaifazhong {
    margin: 0.8rem auto 0px;
    .imb_box {
        width: 0.8rem;
        margin: 0px 0px 17px 0px;
        img {
            width: 100%;
        }
    }
    .text {
        color: #505050;
        font-size: 0.14rem;
    }
}

.QRCode {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
    .mask {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
    }
    .content_1 {
        > img {
            width: 100%;
        }
        position: relative;
        z-index: 1;
        background: #ffffff;
        width: 270px;
        // padding: 17px 25px 15px 25px;
        .close_1 {
            width: 36px;
            height: 50px;
            position: absolute;
            top: -50px;
            right: 0px;
            > div:nth-child(1) {
                height: 36px;
                text-align: center;
                line-height: 36px;
                background: #ffffff;
                border-radius: 100%;
                position: relative;
                z-index: 1;
            }
            > div:nth-child(2) {
                position: absolute;
                width: 1px;
                height: 100%;
                background: #ffffff;
                top: 0px;
                right: 0px;
                left: 0px;
                margin: 0px auto;
            }
        }
    }
}

// 单选
#Agent .radio_1 {
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 16px;
    border-radius: 100%;
    border: 2px solid #cccccc;
    overflow: hidden;
    i {
        font-size: 8px;
        display: none;
    }
}
#Agent .radio_1.active {
    background: rgba(58, 182, 237, 1);
    border: 2px solid rgba(58, 182, 237, 1);
    color: #ffffff;
    i {
        display: inline-block;
    }
}
</style>