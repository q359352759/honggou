<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">购买商品</h1>
        </header>
        <div class="mui-content mui-fullscreen">

            <div class="内容区">
                <ul class="box_1">
                    <li class="img_box">
                        <img v-if="shangPing.img && shangPing.img.split(',').length>0" :src="shangPing.img.split(',')[0]" alt="" srcset="">
                    </li>
                    <li class="text_box">
                        <div class="name">{{shangPing.name}}</div>
                        <div class="text_1">
                            <span class="money">￥{{shangPing.sellingPrice}}</span>
                            <!-- <span>x1</span> -->
                            <!-- <div>
                                <jiajian :zongshu="number" :max="(shangPing.isstock ? shangPing.stock : 0)" @getNumber="setNumber" @ccMax="ccMax"/>
                            </div> -->
                            <div class="购买按钮">
                                <i @click="减去商品()" class="icon iconfont icon-jian-tianchong"></i>
                                <div>{{number}}</div>
                                <i @click="添加商品()" class="icon iconfont icon-jia-tianchong"></i>
                            </div>
                        </div>
                    </li>
                </ul>

                <ul class="box_2" @click="set_dikou_shouw()">
                    <li>需支付：</li>
                    <li class="money">￥{{新实际支付}}</li>
                    <li>
                        <span v-if="专享.可享受新人专享">首单特惠省：{{新抵扣详情.总抵扣金额}}元</span>
                        <span v-if="专享.可享受生日专享">生日专享省：{{新抵扣详情.总抵扣金额}}元</span>
                        <span v-if="!专享.可享受新人专享 && !专享.可享受生日专享">已优惠：{{新抵扣详情.总抵扣金额}}元</span>
                    </li>
                    <li><i class="mui-icon mui-icon-forward"></i></li>
                </ul>
            </div>
            
            <ul class="mui-table-view box_3" v-if="商品红包.length>0" v-show="dikou_shouw">
                <li class="mui-table-view-cell ">
					<!-- <a class="mui-navigate-right"> -->
                        <span>商品红包*{{商品红包可抵扣金额.number}}</span>
                        <span class="mui-pull-right money">-{{商品红包可抵扣金额.money}}元</span>
					<!-- </a> -->
				</li>
			</ul>

            <!-- 1、店铺生日红包
            2、店铺庆典红包
            3、店铺签到红包
            4、店铺节日红包
            5、平台节日红包
            6、店铺+平台红包 -->
            <ul class="mui-table-view box_4" v-show="dikou_shouw">
                <!-- 1、店铺生日红包 -->
                <li v-if="生日红包抵扣!=0" class="mui-table-view-cell item" @click="change_radio_2(1)">
                    <div class="radio_1" :class="{'active':dikou==1}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span class="text">生日红包</span>
                    <span class="money">-{{生日红包抵扣}}元</span>
				</li>
                <!-- 店铺庆典红包 -->
                <li v-if="庆典抵扣金额!=0" class="mui-table-view-cell item" @click="change_radio_2(2)">
                    <div class="radio_1" :class="{'active':dikou==2}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span class="text">庆典红包</span>
                    <span class="money">-{{庆典抵扣金额}}元</span>
				</li>
                <!-- 店铺节日红包 -->
                <li v-if="节日红包抵扣金额!=0" class="mui-table-view-cell item" @click="change_radio_2(4)">
                    <div class="radio_1" :class="{'active':dikou==4}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span class="text">节日红包</span>
                    <span class="money">-{{节日红包抵扣金额}}元</span>
				</li>
                <!-- 店铺+平台红包 -->
                <li  v-if="新人加平台抵扣金额.新人红包抵扣金额!=0 || 新人加平台抵扣金额.平台红包抵扣金额!=0" class="mui-table-view-cell item" @click="change_radio_2(6)">
                    <div class="radio_1" :class="{'active':dikou==6}">
                        <i class="icon iconfont icon-xuanze"></i>
                    </div>
                    <span class="text" v-if="新人加平台抵扣金额.新人红包抵扣金额!=0 && 新人加平台抵扣金额.平台红包抵扣金额!=0">店铺红包+平台红包</span>
                    <span class="text" v-if="新人加平台抵扣金额.新人红包抵扣金额!=0 && 新人加平台抵扣金额.平台红包抵扣金额==0">店铺红包</span>
                    <span class="text" v-if="新人加平台抵扣金额.新人红包抵扣金额==0 && 新人加平台抵扣金额.平台红包抵扣金额!=0">平台红包</span>
                    <span class="money">-{{新人加平台抵扣金额.zongshu}}元</span>
				</li>
			</ul>
            
           
            
            
            <zffs 默认类型="2" :支付总金额="新实际支付" :可预订="false" :可送货="false"/>

        </div>
    </div>
</template>

<script>

const zffs=()=>import('@/views/商家展示厅/商家展示厅2/付款方式选择.vue');
import { mapActions, mapState, mapGetters } from "vuex";
import jiajian from "@/components/jiajian";
import request from "@/api/request";
import { openloading, getDateStr } from "@/assets/js/currency.js";
export default {
    name: "",
    components: {
        jiajian,
        zffs
    },
    provide(){
        return{
            去支付:this.zhifu
        }
    },
    data() {
        return {
            提取类型:2,
            userInfo: "",
            dikou_shouw: false,
            get_index: 0,
            id: "",
            number: 1, //数量
            dikou: 1,       //省钱类型
            shangPing: {}, //商品信息
            hongbao: {
                loading: true,
                total: 0,
                list: []
            },
            商品红包: [],
            生日红包: [],
            节日红包: [],
            庆典红包: [],
            店铺红包: [],
            平台红包信息: {}, //平台红包信息
            专享: {
                可享受新人专享: false,
                可享受生日专享: false
            },
            专享商品: ""
            // 0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            // 店铺订单，红包省钱顺序
            // 1、店铺生日红包
            // 2、店铺庆典红包
            // 3、店铺签到红包
            // 4、店铺节日红包
            // 5、平台节日红包
            // 6、店铺+平台红包
        };
    },
    computed: {
        ...mapGetters({
            shop: "shop/shop"
        }),
        是否有红包可用() {
            if (this.商品红包.length == 0 && this.生日红包.length == 0 && this.节日红包.length == 0 && this.庆典红包.length == 0 && this.店铺红包.length == 0 && !this.平台红包信息.sutotal) {
                return false;
            } else {
                return true;
            }
        },
        新抵扣详情() {
            var obj = {
                总抵扣金额: 0,
                抵扣规则: [],
                未抵扣前: 0,
            }
            this.商品抵扣列表.forEach(item => {
                obj.未抵扣前 += item.sellingPrice
                item.抵扣红包.forEach(item_1 => {
                    obj.总抵扣金额 = Math.round((obj.总抵扣金额+item_1.抵扣金额)*100)/100;
                    var 是否存在 = obj.抵扣规则.filter(x => x == item_1.红包类型);
                    if (是否存在.length == 0) {
                        obj.抵扣规则.push(item_1.红包类型)
                    }
                })
            })
            return obj;
        },
        新实际支付() {
            return Math.round((this.新抵扣详情.未抵扣前 - this.新抵扣详情.总抵扣金额) * 100) / 100
        },
        商品抵扣列表() {
            var this_1 = this;
            var newlist = [];
            var 红包列表 = this.hongbao.list;
            var 购买数量 = this.number;
            var 新人红包金额 = this.店铺红包.length > 0 ? this.店铺红包[0].redAmount : 0;
            var 生日红包金额 = this.生日红包.length > 0 ? this.生日红包[0].redAmount : 0;
            var 庆典红包金额 = this.庆典红包.length > 0 ? this.庆典红包[0].redAmount : 0;
            var 节日红包金额 = this.节日红包.length > 0 ? this.节日红包[0].redAmount : 0;
            var 平台红包金额 = this.平台红包信息.sutotal;
            var 专享购买数量 = 0;
            if (this.专享.可享受新人专享) {
                var 专享购买数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
            }

            var 商品红包数量 = this.商品红包.length;
            for (let i = 0; i < 购买数量; i++) {
                var 单个商品 = Object.assign({}, this_1.shangPing);
                单个商品.抵扣红包 = [];
                单个商品.使用专享=""
                //有新人红包 优先使用新人红包
                var 商品可抵扣 = 0
                if (this.专享.可享受新人专享 && this_1.专享商品 && this_1.专享商品.type == 0 && 专享购买数量 > 0) {
                    商品可抵扣 = this_1.专享商品.deduction;
                    单个商品.使用专享=1
                } else if (this.专享.可享受生日专享 && this_1.专享商品 && this_1.专享商品.type == 1 && 专享购买数量 > 0) {
                    商品可抵扣 = this_1.专享商品.deduction;
                    单个商品.使用专享=2
                } else {
                    商品可抵扣 = 单个商品.deduction;
                }
                var 抵扣红包 = [];
                if (this.dikou == 1) {
                    var obj = {
                        抵扣金额: 商品可抵扣 > 生日红包金额 ? 生日红包金额 : 商品可抵扣,
                        使用红包: this.生日红包.length > 0 ? this.生日红包[0] : [],
                        红包类型: this.生日红包.length > 0 ? this.生日红包[0].type : ''
                    }
                    抵扣红包.push(obj)
                } else if (this.dikou == 2) {
                    var obj = {
                        抵扣金额: 商品可抵扣 > 庆典红包金额 ? 庆典红包金额 : 商品可抵扣,
                        使用红包: this.庆典红包.length > 0 ? this.庆典红包[0] : [],
                        红包类型: this.庆典红包.length > 0 ? this.庆典红包[0].type : ''
                    }
                    抵扣红包.push(obj)
                } else if (this.dikou == 6) {
                    //店铺新人红包 + 平台红包
                    if (新人红包金额 > 0) {
                        var obj = {
                            抵扣金额: 商品可抵扣 > 新人红包金额 ? 新人红包金额 : 商品可抵扣,
                            使用红包: this.店铺红包.length > 0 ? this.店铺红包[0] : [],
                            红包类型: this.店铺红包.length > 0 ? this.店铺红包[0].type : ''
                        }
                        新人红包金额 = 新人红包金额 - obj.抵扣金额;
                        商品可抵扣 = 商品可抵扣 - obj.抵扣金额;
                        专享购买数量--;
                        抵扣红包.push(obj)
                    }
                    if (商品可抵扣 > 0 && 平台红包金额 > 0) {
                        var obj = {
                            抵扣金额: 商品可抵扣 > 平台红包金额 ? 平台红包金额 : 商品可抵扣,
                            使用红包: this.平台红包信息,
                            红包类型: -1
                        }
                        专享购买数量--;
                        平台红包金额 = 平台红包金额 - obj.抵扣金额;
                        抵扣红包.push(obj)
                    }
                }
                单个商品.抵扣红包 = 抵扣红包;
                newlist.push(单个商品);
            }
            return newlist;
        },
        实际金额() {
            // var money=Math.floor(this.number*this.shangPing.sellingPrice*100)/100;
            if (!this.number || !this.shangPing.sellingPrice) {
                return 0;
            }
            var money = this.number * this.shangPing.sellingPrice;
            money = money - this.实际抵扣金额;
            money = Math.ceil(money.toFixed(2) * 100) / 100;
            return money;
        },
        实际抵扣金额() {
            // var money=Math.floor(this.number*this.shangPing.sellingPrice*100)/100;
            var dikou = 0;
            var money = this.商品红包可抵扣金额.money;
            if (this.dikou == 1) {
                dikou = money + this.生日红包抵扣;
            } else if (this.dikou == 2) {
                dikou = money + this.庆典抵扣金额;
            } else if (this.dikou == 3) {
            } else if (this.dikou == 4) {
                dikou = money + this.节日红包抵扣金额;
            } else if (this.dikou == 5) {
            } else if (this.dikou == 6) {
                dikou = money + this.新人加平台抵扣金额.zongshu;
            }
            dikou = Math.floor(dikou * 100) / 100;
            return dikou;
        },
        商品红包可抵扣金额() {
            //实际可省数量
            var shiji_shuliang = this.number < this.商品红包.length ? this.number : this.商品红包.length;
            //实际单个可省金额
            if (this.商品红包.length > 0) {
                var money = this.shangPing.deduction < this.商品红包[0].redAmount ? this.shangPing.deduction : this.商品红包[0].redAmount;
            } else {
                var money = 0;
            }
            var 实际抵扣金额 = 0;
            var obj = {
                number: shiji_shuliang,
                money: money * shiji_shuliang
            };
            return obj;
        },
        生日红包抵扣() {
            //不需要省钱 或者没有红包
            if (this.number - this.商品红包可抵扣金额.number == 0 || this.生日红包.length == 0) {
                return 0;
            }
            var 剩余可抵扣数量 = this.number - this.商品红包可抵扣金额.number;
            var 剩余可抵扣 = 0;
            // 计算剩余可省金额
            if ((this.专享.可享受新人专享 || this.专享.可享受生日专享) && this.专享商品) {
                var 专享最大数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
                if (剩余可抵扣数量 > 专享最大数量) {
                    剩余可抵扣 += 专享最大数量 * this.专享商品.deduction;
                    剩余可抵扣 += (剩余可抵扣数量 - 专享最大数量) * this.shangPing.deduction;
                } else {
                    剩余可抵扣 = 剩余可抵扣数量 * this.专享商品.deduction;
                }
            } else {
                剩余可抵扣 = 剩余可抵扣数量 * this.shangPing.deduction;
            }

            var dikou = 剩余可抵扣 < this.生日红包[0].redAmount ? 剩余可抵扣 : this.生日红包[0].redAmount;
            dikou = Math.round(dikou * 100) / 100;
            return dikou;
        },
        庆典抵扣金额() {
            //不需要省钱
            if (this.number - this.商品红包可抵扣金额.number == 0 || this.庆典红包.length == 0) {
                return 0;
            }
            var 剩余可抵扣数量 = this.number - this.商品红包可抵扣金额.number;
            var 剩余可抵扣 = 0;
            // 计算剩余可省金额
            if ((this.专享.可享受新人专享 || this.专享.可享受生日专享) && this.专享商品) {
                var 专享最大数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
                if (剩余可抵扣数量 > 专享最大数量) {
                    剩余可抵扣 += 专享最大数量 * this.专享商品.deduction;
                    剩余可抵扣 += (剩余可抵扣数量 - 专享最大数量) * this.shangPing.deduction;
                } else {
                    剩余可抵扣 = 剩余可抵扣数量 * this.专享商品.deduction;
                }
            } else {
                剩余可抵扣 = 剩余可抵扣数量 * this.shangPing.deduction;
            }
            var dikou = 剩余可抵扣 < this.庆典红包[0].redAmount ? 剩余可抵扣 : this.庆典红包[0].redAmount;
            dikou = Math.round(dikou * 100) / 100;
            return dikou;
        },
        节日红包抵扣金额() {
            if (this.number - this.商品红包可抵扣金额.number == 0 || this.节日红包.length == 0) {
                return 0;
            }
            var 剩余可抵扣数量 = this.number - this.商品红包可抵扣金额.number;
            var 剩余可抵扣 = 0
            if ((this.专享.可享受新人专享 || this.专享.可享受生日专享) && this.专享商品) {
                var 专享最大数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
                if (剩余可抵扣数量 > 专享最大数量) {
                    剩余可抵扣 += 专享最大数量 * this.专享商品.deduction;
                    剩余可抵扣 += (剩余可抵扣数量 - 专享最大数量) * this.shangPing.deduction;
                } else {
                    剩余可抵扣 = 剩余可抵扣数量 * this.专享商品.deduction;
                }
            } else {
                剩余可抵扣 = 剩余可抵扣数量 * this.shangPing.deduction;
            }
            var dikou = 剩余可抵扣 < this.节日红包[0].redAmount ? 剩余可抵扣 : this.节日红包[0].redAmount;
            dikou = Math.round(dikou * 100) / 100;
            return dikou;
        },
        新人红包抵扣金额() {
            //新人红包和平台   只管金额 不管百分比和满减
            if (this.number - this.商品红包可抵扣金额.number == 0 || this.店铺红包.length == 0) {
                return 0;
            }
            var 剩余可抵扣数量 = this.number - this.商品红包可抵扣金额.number;
            var 剩余可抵扣 = 0
            if ((this.专享.可享受新人专享 || this.专享.可享受生日专享) && this.专享商品) {
                var 专享最大数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
                if (剩余可抵扣数量 > 专享最大数量) {
                    剩余可抵扣 += 专享最大数量 * this.专享商品.deduction;
                    剩余可抵扣 += (剩余可抵扣数量 - 专享最大数量) * this.shangPing.deduction;
                } else {
                    剩余可抵扣 = 剩余可抵扣数量 * this.专享商品.deduction;
                }
            } else {
                剩余可抵扣 = 剩余可抵扣数量 * this.shangPing.deduction;
            }
            var dikou = 剩余可抵扣 < this.店铺红包[0].amount ? 剩余可抵扣 : this.店铺红包[0].amount;
            dikou = Math.round(dikou * 100) / 100;
            return dikou;
        },
        平台红包抵扣金额() {
            //不需要省钱
            if (this.number - this.商品红包可抵扣金额.number == 0 || !this.平台红包信息.sutotal) {
                return 0;
            }
            var 剩余可抵扣数量 = this.number - this.商品红包可抵扣金额.number;
            var 剩余可抵扣 = 0;
            if ((this.专享.可享受新人专享 || this.专享.可享受生日专享) && this.专享商品) {
                var 专享最大数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
                if (剩余可抵扣数量 > 专享最大数量) {
                    剩余可抵扣 += 专享最大数量 * this.专享商品.deduction;
                    剩余可抵扣 += (剩余可抵扣数量 - 专享最大数量) * this.shangPing.deduction;
                } else {
                    剩余可抵扣 = 剩余可抵扣数量 * this.专享商品.deduction;
                }
            } else {
                剩余可抵扣 = 剩余可抵扣数量 * this.shangPing.deduction;
            }
            var dikou = 剩余可抵扣 < this.平台红包信息.sutotal ? 剩余可抵扣 : this.平台红包信息.sutotal;
            dikou = Math.round(dikou * 100) / 100;
            return dikou;
        },
        //计算新人红包+平台红包
        新人加平台抵扣金额() {
            var obj = {
                新人红包抵扣金额: 0,
                平台红包抵扣金额: 0,
                zongshu: 0,
            };
            var 剩余可抵扣数量 = this.number - this.商品红包可抵扣金额.number;
            var 剩余最大可抵扣 = 0;
            if ((this.专享.可享受新人专享 || this.专享.可享受生日专享) && this.专享商品) {
                var 专享最大数量 = this.专享商品.maxNumber ? this.专享商品.maxNumber : 4;
                if (剩余可抵扣数量> 专享最大数量) {
                    剩余最大可抵扣 += 专享最大数量 * this.专享商品.deduction;
                    剩余最大可抵扣 += (剩余可抵扣数量 - 专享最大数量) * this.shangPing.deduction;
                } else {
                    剩余最大可抵扣 = 剩余可抵扣数量 * this.专享商品.deduction;
                }
            } else {
                剩余最大可抵扣 = 剩余可抵扣数量 * this.shangPing.deduction;
            }
            if (this.店铺红包.length > 0) {
                var 新人红包可抵扣 = 剩余最大可抵扣 > this.店铺红包[0].amount ? this.店铺红包[0].amount : 剩余最大可抵扣;
                obj.新人红包抵扣金额 = Math.round(新人红包可抵扣 * 100) / 100;
                剩余最大可抵扣 = 剩余最大可抵扣 - obj.新人红包抵扣金额
            }
            if (剩余最大可抵扣 > 0 && this.平台红包信息) {
                obj.平台红包抵扣金额 = 剩余最大可抵扣 > this.平台红包信息.sutotal ? this.平台红包信息.sutotal : 剩余最大可抵扣
            }
            obj.zongshu = obj.新人红包抵扣金额 + obj.平台红包抵扣金额;
            obj.zongshu = Math.round(obj.zongshu * 100) / 100

            return obj;
        }
    },
    methods: {
        ...mapActions({
            get_shop: "shop/get_shop", //根据店铺Id查询店铺
            是否享受新人专享: "买单/是否享受新人专享",
            是否享受生日专享: "买单/是否享受生日专享",
            商品查询专享: "shangPing/商品查询专享"
        }),
        选择提取类型(type){
            this.提取类型=type;
        },
        减去商品(){
            if(this.number>1){
                this.number--
            }
        },
        添加商品(){
            if(this.shangPing.isstock){
                if(this.shangPing.stock<=this.number){
                    mui.toast("库存不足,不能再添加了", { duration: 2000, type: "div" });
                }else{
                    this.number++
                }
            }else{
                this.number++
            }
        },
        //点开优惠详情
        set_dikou_shouw() {
            if (this.是否有红包可用) {
                this.dikou_shouw = true;
            } else {
                mui.toast("没有红包可抵扣。", { duration: "long", type: "div" });
            }
        },
        //支付
        zhifu(提取类型) {
            if (!this.number || this.number <= 0) {
                mui.toast("请选择商品购买数量", { duration: "long", type: "div" });
                return;
            }
            // var this_1 = this;
            // var submitCommodityList = [];
            // this.商品列表.forEach(item => {
            //     item.shopRedEnvelope = item.实际抵扣金额 && item.实际抵扣金额 != 0 ? item.hongbao : [];
            //     if (!item.实际抵扣金额 || item.实际抵扣金额 == 0) {
            //         item.exclusive = "";
            //     }
            //     var obj = {
            //         shopCommodity: item,
            //         deduction: item.实际抵扣金额 ? item.实际抵扣金额 : 0,
            //         actualPayment: item.实际抵扣金额 ? Math.ceil((item.sellingPrice - item.实际抵扣金额) * 100) / 100 : item.sellingPrice
            //     };
            //     submitCommodityList.push(obj);
            // });
            //===============
            var this_1 = this;
            var submitCommodityList = [];
            this.商品抵扣列表.forEach(item => {
                var shopRedEnvelope = [];
                var 实际抵扣金额=0;
                item.抵扣红包.forEach(item_1 => {
                    var 使用红包=Object.assign({},item_1.使用红包);
                        使用红包.paymentAmount=item_1.抵扣金额;
                    shopRedEnvelope.push(使用红包)
                    实际抵扣金额+=item_1.抵扣金额
                })
                item.shopRedEnvelope = shopRedEnvelope;
                item.exclusive=item.使用专享
                // if (item.shopRedEnvelope == 0) {
                //     item.exclusive = "";
                // }
                var obj = {
                    shopCommodity: item,
                    actualPayment : Math.round((item.sellingPrice-实际抵扣金额)*100)/100,        //实际抵扣
                    deduction: 实际抵扣金额         //实际支付
                };
                submitCommodityList.push(obj);
            })

            var 支付类型="";
            if(ApplicationType=='app'){
                if(AppType=="ios"){
                    支付类型="ios"
                }else{
                    支付类型="安卓"
                }
            }else{
                let agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == "micromessenger") {
                    支付类型="微信"
                }else{
                    支付类型="非微信浏览器";
                }
            }
            var sumit_obj = {
                identifying:支付类型,  //微信 安卓 ios  
                // typeOne:this.提取类型,     //设1为当面付,设2位到店取货
                typeOne:提取类型,     //设1为当面付,设2位到店取货
                orderType: 0,
                appUser: this.userInfo,
                shopBasics: this.shop,
                amount: this.新实际支付,
                submitCommodityList: submitCommodityList
            }


            //===============

            // let sumit_obj = {
            //     orderType: 0, //0表示购买商品 1表示输入金额
            //     appUser: this.userInfo, //用户
            //     shopBasics: this.shop, //店铺信息
            //     amount: this.实际金额, //金额
            //     submitCommodityList: submitCommodityList ////商品实体类
            // };

            openloading(true);
            this.$request("/api-s/shops/createOrders", sumit_obj, "post").then(x => {
                console.log("添加订单", x);
                if (x.data.code == 200) {
                    // this.$router.push({path:'/orders/order?ordreId='+x.data.data.id,push:{zhifu:2}});
                    this.$router.push({
                        name: "ordersOrder",
                        query: { ordreId: x.data.data.id },
                        params: { zhifu: 1 }
                    });
                } else {
                    mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                }
                openloading(false);
            }).catch(err => {
                console.log("添加订单错误", err);
                mui.toast("系统错误稍后再试。", { duration: "long", type: "div" });
                openloading(false);
            });
        },
        ccMax(){
            mui.toast("不能再添加了，剩余库存不足", { duration: 2000, type: "div" });
        },
        setNumber(value) {
            this.number = value;
        },
        //选择省钱方式
        change_radio_2(x) {
            this.dikou = x == this.dikou ? 0 : x;
        },
        //获取商品返回值
        get_shangPing(x) {
            console.log("获取商品", x);
            this.shangPing = x;
            //根据商品店铺Id查询店铺
            this.get_shop(this.shangPing.shopid);
        },

        //获取用户商品卡包信息
        get_CardPackge() {
            if (this.shangPing.shopid) {
                this.hongbao.loading = true;
                var findDataUserCardPackge_query = {
                    query: {
                        //
                        start: 0,
                        length: 1000,
                        userid: this.userInfo.username,
                        shopid: this.shangPing.shopid,
                        // type:1,
                        // commodityId:this.id,
                        // ccc:1,
                        state: 0
                    },
                    fc: this.CardPackge_return
                };
                this.$store.commit(
                    "hongbao/findDataUserCardPackge",
                    findDataUserCardPackge_query
                );
            } else {
                setTimeout(() => {
                    this.get_CardPackge();
                }, 500);
            }
        },
        CardPackge_return(x) {
            console.log("红包返回值", x);
            this.hongbao.loading = false;
            if (x.code && x.code == 200) {
                this.hongbao.list = x.data.data;
                // console.log(this.$store.getters["hongbao/filter_hongbao"](this.hongbao.list,this.id));
                this.商品红包 = this.$store.getters["hongbao/filter_hongbao"](
                    this.hongbao.list,
                    this.id,
                    1
                );
                // this.生日红包=this.$store.getters["hongbao/filter_hongbao"](this.hongbao.list,'',5);
                //生日红包
                this.生日红包 = this.hongbao.list.filter(x => x.type == 5 && x.startTime <= getDateStr(0) && x.endTime >= getDateStr(0));
                this.庆典红包 = this.$store.getters["hongbao/filter_hongbao"](this.hongbao.list, "", 4);
                this.节日红包 = this.$store.getters["hongbao/filter_hongbao"](this.hongbao.list, "", 2);
                // this.店铺红包=this.$store.getters["hongbao/filter_hongbao"](this.hongbao.list,'',0);
                this.店铺红包 = this.hongbao.list.filter(x => x.type == 0 && x.amount > 0);
                if (this.生日红包.length != 0) {
                    console.log(1);
                    this.dikou = 1;
                } else if (this.庆典红包.length != 0) {
                    this.dikou = 2;
                    console.log(2);
                } else if (this.节日红包.length != 0) {
                    this.dikou = 4;
                    console.log(4);
                } else {
                    this.dikou = 6;
                    console.log(6);
                }
            } else {
                mui.alert(x.msg ? x.msg : x.messag, "提示", "我知道了", function () { }, "div");
            }
        },
        //获取用户平台红包信息
        get_invitedsutotal() {
            this.$request("/api-u/users/invitedsutotal/findByUserid/" + this.userInfo.username, "", "get").then(x => {
                console.log("平台红包信息", x);
                if (x.data.code == 200 && x.data.data) {
                    this.平台红包信息 = x.data.data;
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    mounted() {
        var query = this.$route.query;
        this.id = query.id;
        var obj = {
            id: query.id,
            fc: this.get_shangPing
        };

        this.userInfo = JSON.parse(localStorage.userInfo);
        this.$store.commit("shangPing/get_shangping_1", obj);

        this.商品查询专享(this.id).then(x => {
            console.log("查询专享", x);
            if (x.data.code == 200 && x.data.data.length > 0) {
                this.专享商品 = x.data.data[0];
                // 0 新人 1 生日
                var 查询专享 = {
                    userid: this.userInfo.username,
                    commodityid: this.id
                };
                if (this.专享商品.type == 0) {
                    this.是否享受新人专享([this.专享, 查询专享]);
                } else if (this.专享商品.type == 1) {
                    this.是否享受生日专享([this.专享, 查询专享]);
                }
            }
        }).catch(err => { });
        // this.是否享受新人专享([this.专享,查询专享]);
        // this.是否享受生日专享([this.专享,查询专享]);

        this.get_index = 1;
        //获取用户卡包信息
        this.get_CardPackge();
        //获取用户平台红包金额
        this.get_invitedsutotal();
    },
    watch: {}
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.mui-content{
    display: flex;
    flex-direction: column;
    >*{
        flex-shrink: 0;
    }
    .内容区{
        flex-grow: 1;
        overflow: auto;
    }
}

.box_1 {
    display: flex;
    padding: 8px 10px;
    background: #ffffff;
    .img_box {
        width: 72px;
        height: 54px;
        margin: 0px 5px 0px 0px;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .text_box {
        display: flex;
        width: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            font-weight: bold;
        }
        .text_1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .money {
                color: rgba(212, 48, 48, 1);
                font-size: 19px;
                font-weight: bold;
            }
        }
    }
    .购买按钮{
        flex-shrink: 0;
        display: flex;
        align-items: center;
        .icon-jian-tianchong{
            font-size: 18px;
            height: 18px;
            color: #DBDBDB;
        }
        div{
            color: $header_background;
            font-size: 14px;
            min-width: 32px;
            padding: 0px 3px;
            text-align: center;
        }
        .icon-jia-tianchong{
            font-size: 18px;
            height: 18px;
            color: $header_background;
        }
    }
}

.box_2 {
    height: 44px;
    margin: 5px 0px 0px;
    padding: 0px 10px 0px 15px;
    background: #ffffff;
    display: flex;
    align-items: center;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .money {
        color: #d43030;
        font-size: 19px;
        flex-grow: 1;
        font-weight: bold;
    }
    i {
        color: rgba(80, 80, 80, 1);
        font-size: 21px;
    }
}

.box_3 {
    margin: 5px 0px 0px;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .money {
        color: #d43030;
    }
}

.zhifu {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: $header_background;
    color: #ffffff;
    letter-spacing: 10px;
    padding-left: 10px;
}
</style>
