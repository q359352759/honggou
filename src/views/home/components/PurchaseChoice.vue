<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">选择商品</h1>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="scroll($event)">
            <ul class="box_1">
                <li v-for="(item, index) in shangping.list" :key="index">
                    <div class="img_box">
                        <img v-if="item.img.split(',').length>0" :src="item.img.split(',')[0]">
                    </div>
                    <div class="text">
                        <div class="title_1">{{item.name}}</div>
                        <div class="money">
                            <span>￥{{item.sellingPrice}}</span>
                            <s>{{item.marketPrice}}</s>
                        </div>
                        <div class="dikou">
                            <i class="icon iconfont icon-hongbao1"></i>
                            <span>可省：{{item.deduction}}元</span>
                        </div>
                    </div>
                    <div class="zhuanshu">
                        <img v-if="item.可享受新人专享" src="image/xingren1.png" alt="" srcset="">
                        <div v-if="item.可享受新人专享">
                            <i class="icon iconfont icon-shengji"></i>
                            <span>{{item.EXDEDUCTION}}元</span>
                        </div>
                        <img v-if="item.可享受生日专享" src="image/shengri1.png" alt="" srcset="">
                        <div v-if="item.可享受生日专享">
                            <i class="icon iconfont icon-shengji"></i>
                            <span>{{item.EXDEDUCTION}}元</span>
                        </div>
                    </div>
                    <div class="xuanzhe">
                        <span @click="jian(item)">-</span>
                        <!-- <input type="text" v-model.number="item.number"> -->
                        <input type="number" name="" id="" v-model.number="item.number">
                        <span @click="jia(item)">+</span>   
                    </div>
                </li>
            </ul>

            <ul class="box_2">
                <li>
                    <div>
                        <span @tap="change_commodity_box(true)">已选择：{{展开商品列表.length}}件</span>
                    </div>
                    <div class="mui-text-center money_1">￥{{未抵扣价格}}</div>
                    <div class="mui-text-right">
                        <span>实付：</span>
                        <span class="money_2">￥{{Math.ceil(Math.round((未抵扣价格-总优惠)*100))/100}}</span>
                    </div>
                </li>                
                <li>
                    <div @tap="change_commodity_box(true)">
                        <span>使用：{{红包使用数量}}个红包</span>
                        <i class="mui-icon mui-icon-forward"></i>
                    </div>
                    <div class="mui-text-center money_1">-￥{{总优惠}}</div>
                    <div class="mui-text-right">
                        <button @tap="queding()" class="btn_1">确定</button>
                        <!-- <button @click="显示取货类型=true" class="btn_1">确定</button> -->
                    </div>
                </li>
            </ul>
            <loading :loadingtype="shangping.loading" :end="!shangping.loading && shangping.list.length==shangping.total && shangping.total!=0" :nodata="!shangping.loading && shangping.total==0"/>
        </div>

        <!-- 选择的商品详情 -->
        <div class="box_3" v-show="commodity_box">
            <div class="content_1">
                <div @click="change_commodity_box(false)" class="close_1"><i class="icon iconfont icon-quxiao"></i></div>
                <div class="cont_1">
                    <div class="list" v-show="展示的数据.商品红包抵扣商品.length>0">
                        <ul v-for="(item, index) in 展示的数据.商品红包抵扣商品" :key="index">
                            <li>
                                <div>{{item.name}}</div>
                                <div class="mui-text-center"></div>
                                <div class="mui-text-right">商品红包x{{item.number}}</div>
                            </li>
                            <li>
                                <div>
                                    <span class="money_1">￥{{item.sellingPrice}}</span>
                                    <span>x{{item.number}}</span>
                                </div>
                                <div class="mui-text-center dikou">可省：{{item.kedikou}}元</div>
                                <div class="mui-text-right money_1">-{{item.dikou}}元</div>
                            </li>
                        </ul>
                    </div>
                    <div class="list" v-show="展示的数据.未使用商品红包商品.length>0">
                        <ul v-for="(item, index) in 展示的数据.未使用商品红包商品" :key="index">
                            <li>
                                <div>{{item.name}}</div>
                                <!-- <div class="mui-text-center">新人专享</div> -->
                                <!-- <div class="mui-text-right">商品红包x1</div> -->
                            </li>
                            <li>
                                <div>
                                    <span class="money_1">￥{{item.sellingPrice}}</span>
                                    <span>x{{item.number}}</span>
                                </div>
                                <div class="mui-text-center dikou">可省：{{item.kedikou}}元</div>
                                <div class="mui-text-right money_1">-{{item.dikou ? item.dikou : 0}}元</div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer_1">
                    <div class="select_1">
                        <div v-show="!是否有红包">无红包可省</div>
                        <div @click="change_select(true)" v-show="是否有红包">
                            <span v-show="dikou_type==1">店铺生日红包</span>
                            <span v-show="dikou_type==2">庆典红包</span>
                            <span v-show="dikou_type==3">签到红包</span>
                            <span v-show="dikou_type==4">店铺节日红包</span>
                            <span v-show="dikou_type==5">平台节日红包</span>
                            <span v-show="dikou_type==6">
                                <span v-show="dianpu_pingtai==1">店铺红包</span>
                                <span v-show="dianpu_pingtai!=1">
                                    <span v-if="xinren_hongbao.length>0 && invitedsutotal.sutotal && invitedsutotal.sutotal>0">店铺+平台红包</span>
                                    <span v-if="xinren_hongbao.length==0 && invitedsutotal.sutotal && invitedsutotal.sutotal>0">平台红包</span>
                                </span>                                
                            </span>
                            <i class="mui-icon mui-icon-arrowup"></i>
                        </div>
                        <ul v-show="select_show">
                            <li v-for="(item, index) in 除开商品红包" v-show="item.type!=0" v-if="item.type!=5 || (item.type==5 && shengri_hongbao.length>0)" :key="index" @click="change_select(false,item.type)">
                                <div>
                                    <span v-if="item.type==0">店铺新人红包</span>
                                    <span v-if="item.type==2">节日红包</span>
                                    <span v-if="item.type==3">签到红包</span>
                                    <span v-if="item.type==4">庆典红包</span>
                                    <span v-if="item.type==5">店铺生日红包</span>
                                </div>
                                <div>{{item.redAmount}}元</div>
                            </li>
                            <!-- 0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包 -->
                            <li @click="change_select(false,6)" >
                                <div>
                                    <!-- {{dianpu_pingtai==1 ? "店铺红包":"店铺+平台红包"}} -->
                                    <span v-show="dianpu_pingtai==1">店铺红包</span>
                                    <span v-show="dianpu_pingtai!=1">
                                        <span v-if="xinren_hongbao.length>0 && invitedsutotal.sutotal && invitedsutotal.sutotal>0">店铺+平台红包</span>
                                        <span v-if="xinren_hongbao.length==0 && invitedsutotal.sutotal && invitedsutotal.sutotal>0">平台红包</span>
                                    </span> 
                                </div>
                                <div v-if="dianpu_pingtai==1">{{invitedsutotal.sutotal}}元</div>
                                <div v-if="dianpu_pingtai==2">
                                    {{xinren_hongbao.length>0 ? xinren_hongbao[0].redAmount+invitedsutotal.sutotal : invitedsutotal.sutotal}}
                                    元
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="money">
                        总优惠：{{总优惠}}元
                    </div>
                </div>
            </div>
        </div>
        
        <div class="付款方式" v-show="显示取货类型">
            <ul class="mui-table-view 提取方式">
                <li class="mui-table-view-cell item" @click="提取类型=0">
                    <i class="icon iconfont" :class="{'icon-xuanze2':提取类型==0,'icon-choose':提取类型==1}"></i>
                    <span>当面付(（已拿到商品）)</span>
                </li>
                <li class="mui-table-view-cell item" @click="提取类型=1">
                    <i class="icon iconfont" :class="{'icon-xuanze2':提取类型==1,'icon-choose':提取类型==0}"></i>
                    <span>到店自取(（先付款，再到店铺拿货）)</span>
                </li>
            </ul>
            <div @click="queding()" class="支付按钮">支付</div>
        </div>
    
    </div>
</template>

<script>
import { api_根据商品id查询专享 } from "@/api/专享接口.js";
import loading from "@/components/loading.vue";
import { getDateStr } from "@/assets/js/currency.js";
import { mapActions } from "vuex";
export default {
    name: "",
    components: {
        loading
    },
    props: {
        shopid: {}
    },
    data() {
        return {
            显示取货类型:false,
            提取类型:0,
            userInfo: "",
            commodity_box: false, //选择的商品详情
            select_show: false, //选择红包
            shangping: {
                loading: true,
                page_index: 0,
                total: 0,
                list: [],
                query: {
                    start: 0,
                    length: 10,
                    shopid: "",
                    state: 1
                }
            },
            select_height: 0,
            hongbao: {
                list: []
            },
            invitedsutotal: {}, //平台红包信息

            shangpin_hongbao: [], //商品红包
            shengri_hongbao: [], //生日红包
            qingdian_hongbao: [], //庆典红包
            jieri_hongbao: [], //店铺节日红包
            xinren_hongbao: [], //店铺新人
            pingtai_hongbao: [], //平台红包
            dikou_type: 1,
            dianpu_pingtai: 1 //1表示店铺 2表示店铺+平台
            // 1、店铺生日红包
            // 2、店铺庆典红包
            // 3、店铺签到红包
            // 4、店铺节日红包
            // 5、平台节日红包
            // 6、店铺+平台红包
        };
    },
    computed: {
        是否有红包() {
            if (!this.invitedsutotal.sutotal && this.shangpin_hongbao.length == 0 && this.shengri_hongbao.length == 0 && this.qingdian_hongbao.length == 0 && this.jieri_hongbao.length == 0 && this.xinren_hongbao.length == 0) {
                return false;
            } else {
                return true;
            }
        },
        选择的商品() {
            return this.shangping.list.filter(x => x.number && x.number > 0);
        },
        展开商品列表() {
            var list = [];
            this.选择的商品.forEach(item => {
                var number = item.number;
                for (let i = 0; i < number; i++) {
                    var obj = Object.assign({}, item);
                    list.push(obj);
                }
            });
            return list;
        },
        未抵扣价格() {
            var n = 0;
            this.选择的商品.forEach(item => {
                n += item.number * item.sellingPrice;
            });
            return n;
        },
        除开商品红包() {
            return this.hongbao.list.filter(x => x.type != 1 && x.type != 0);
        },
        商品红包抵扣商品() {
            var list = [];
            this.hongbao.list.forEach(item => {
                item.shiyong = false;
            });
            this.展开商品列表.forEach(item => {
                this.hongbao.list.forEach(hongbao => {
                    if (item.id == hongbao.redCommodityId && !hongbao.shiyong && !item.shiyong) {
                        hongbao.shiyong = true;
                        item.shiyong = true;
                        item.hongbao = hongbao;
                        if (item.可享受生日专享 || item.可享受新人专享) {
                            item.dikou =item.EXDEDUCTION < hongbao.redAmount ? item.EXDEDUCTION : hongbao.redAmount;
                            item.exclusive = item.可享受新人专享 ? 1 : 2; //1新人 2生日
                        } else {
                            item.dikou = item.deduction < hongbao.redAmount ? item.deduction : hongbao.redAmount;
                        }
                        list.push(item);
                    }
                });
            });
            return list;
        },
        未使用商品红包商品() {
            //计算没有省钱的商品还能省钱多少
            var list = this.展开商品列表.filter(x => !x.shiyong);
            var kedikou = 0;
            list.forEach(item => {
                if ( (item.可享受生日专享 || item.可享受新人专享) && item.专享) {
                    kedikou += item.EXDEDUCTION;
                } else {
                    kedikou += item.deduction;
                }
            });

            //计算店铺+平台
            var dianpu = 0;
            var pingtai = this.invitedsutotal ? this.invitedsutotal.sutotal : 0;
            var dianpu_pingtai = 0;
            if (this.xinren_hongbao.length > 0) {
                dianpu = this.xinren_hongbao[0].amount;
            }
            if (dianpu > kedikou) {
                this.dianpu_pingtai = 1; //20
                dianpu_pingtai = dianpu;
            } else {
                this.dianpu_pingtai = 2;
                dianpu_pingtai = dianpu + pingtai; //71
            }

            var honghao_kedikou = 0;
            if (this.dikou_type == 1) {
                honghao_kedikou =  this.shengri_hongbao.length > 0 ? this.shengri_hongbao[0].redAmount  : 0;
            } else if (this.dikou_type == 2) {
                honghao_kedikou = this.qingdian_hongbao.length > 0 ? this.qingdian_hongbao[0].redAmount : 0;
            } else if (this.dikou_type == 4) {
                honghao_kedikou = this.jieri_hongbao.length > 0 ? this.jieri_hongbao[0].redAmount : 0;
            } else if (this.dikou_type == 6) {
                honghao_kedikou = dianpu_pingtai;
            }

            // console.log(this.dikou_type,honghao_kedikou)

            var 商品id='';
            var index=0
            list.forEach(item => {
                if(商品id!=item.id){
                    index=0
                }else{
                    index++
                }
                商品id=item.id;
                
                if (honghao_kedikou >= 0) {
                    if ( (item.可享受生日专享 || item.可享受新人专享 ) && item.专享 ) {
                        var 专享最大数量 = item.专享.maxNumber ? item.专享.maxNumber : 4;
                        if(index<专享最大数量){
                            var shiji_dikou = item.EXDEDUCTION > honghao_kedikou ? honghao_kedikou : item.EXDEDUCTION;
                        }else{
                            var shiji_dikou = item.deduction > honghao_kedikou ? honghao_kedikou : item.deduction;
                        }
                    } else {
                        var shiji_dikou = item.deduction > honghao_kedikou ? honghao_kedikou : item.deduction;
                    }
                    shiji_dikou = Math.round(shiji_dikou * 100) / 100;
                    item.dikou = shiji_dikou;
                    item.hongbao = this.dikou_type;
                    item.hongbao_list = [];
                    if (this.dikou_type == 1 && this.shengri_hongbao.length > 0) {
                    } else if (this.dikou_type == 2 && this.qingdian_hongbao.length > 1) {
                    } else if (this.dikou_type == 3) {
                    } else if (this.dikou_type == 4 && this.jieri_hongbao.length > 1) {
                    } else if (this.dikou_type == 6) {
                        if (dianpu >= shiji_dikou) {
                            //店铺省钱还有剩余
                            item.dianpu = Math.round(shiji_dikou * 100) / 100;
                        } else if (dianpu < shiji_dikou && dianpu > 0) {
                            //交叉省钱
                            item.dianpu = Math.fround(dianpu * 100) / 100;
                            var money = pingtai > shiji_dikou - dianpu ? shiji_dikou - dianpu : pingtai;
                            item.pingtai = Math.round(money * 100) / 100;
                            pingtai = pingtai - (shiji_dikou - dianpu);
                        } else if (pingtai > 0) {
                            var money = pingtai > shiji_dikou ? shiji_dikou : pingtai;
                            item.pingtai = Math.round(money * 100) / 100;
                            pingtai = pingtai - shiji_dikou;
                        }
                        dianpu = dianpu - shiji_dikou;
                        // 省钱 100
                        // 店铺剩余 30
                    }
                    honghao_kedikou = honghao_kedikou - shiji_dikou;
                }
            });

            return list;
        },
        展示的数据() {
            //商品省钱展示数据
            var list = [];
            this.商品红包抵扣商品.forEach(item => {
                var obj = list.find(x => x.id == item.id);
                if (obj) {
                    obj.number++;
                    obj.dikou = obj.dikou + item.dikou;
                    obj.kedikou = Math.round((obj.kedikou + item.deduction) * 100) / 100;
                } else {
                    item.kedikou = item.deduction;
                    item.number = 1;
                    var obj = Object.assign({}, item);
                    list.push(obj);
                }
            });
            //其他红包省钱展示数据
            var list_1 = [];
            this.未使用商品红包商品.forEach(item => {
                var obj = list_1.find(x => x.id == item.id);
                if (obj) {
                    obj.number++;
                    obj.dikou = Math.round((obj.dikou + (item.dikou ? item.dikou : 0)) * 100) / 100;
                    obj.kedikou = Math.round((obj.kedikou + item.deduction) * 100) / 100;
                } else {
                    item.kedikou = item.deduction;
                    item.number = 1;
                    var obj = Object.assign({}, item);
                    list_1.push(obj);
                }
            });
            var obj = {
                商品红包抵扣商品: list,
                // 商品红包抵扣商品:[],
                未使用商品红包商品: list_1
            };
            return obj;
        },
        总优惠() {
            var money = 0;
            this.商品红包抵扣商品.forEach(item => {
                money = money + item.dikou;
            });
            this.未使用商品红包商品.forEach(item => {
                money = money + (item.dikou ? item.dikou : 0);
            });
            money = money ? Math.floor(money.toFixed(2) * 100) / 100 : 0;

            return money;
        },
        //计算红包使用数量
        红包使用数量() {
            var number = 0;
            number = number + this.商品红包抵扣商品.length;
            if (this.总优惠 == 0) {
                return number;
            }
            if (this.dikou_type != 6) {
                number++;
            } else {
                if (
                    this.xinren_hongbao.length > 0 &&
                    (!this.invitedsutotal.sutotal || this.invitedsutotal.sutotal < 0)
                ) {
                    number = number + 1;
                } else if (
                    this.xinren_hongbao.length > 0 &&
                    this.invitedsutotal.sutotal &&
                    this.invitedsutotal.sutotal > 0
                ) {
                    number = number + (this.dianpu_pingtai == 1 ? 1 : 2);
                } else if (
                    this.xinren_hongbao.length == 0 &&
                    this.展开商品列表.length > 0 &&
                    this.invitedsutotal.sutotal &&
                    this.invitedsutotal.sutotal > 0
                ) {
                    number = number + (this.dianpu_pingtai == 1 ? 1 : 1);
                }
            }
            return number;
        }
    },
    methods: {
        ...mapActions({
            是否享受新人专享: "买单/是否享受新人专享",
            是否享受生日专享: "买单/是否享受生日专享",
            获取商品: "shangPing/获取商品"
        }),
        //点击红包详情
        change_select(x, type) {
            this.select_show = x;
            console.log(type);
            if (type == 0) {
                return "不会有等于0的";
            } else if (type == 1) {
                return "";
            } else if (type == 2) {
                this.dikou_type = 4;
            } else if (type == 3) {
                // this.dikou_type=
                return;
            } else if (type == 4) {
                this.dikou_type = 2;
            } else if (type == 5) {
                this.dikou_type = 1;
            } else if (type == 6) {
                this.dikou_type = 6;
            }
            console.log(this.dikou_type);
        },
        //显示商品详情
        change_commodity_box(x) {
            this.commodity_box = x;
        },
        //确定
        queding() {
            this.$emit("ChoiceChange", this.选择的商品);
            history.back();
        },
        //减去
        jia(item) {
            if (item.number) {
                this.$set(item, "number", item.number + 1);
            } else {
                this.$set(item, "number", 1);
            }
        },
        jian(item) {
            if (!item.number || item.number < 1) {
                return;
            } else {
                item.number--;
            }
        },
        //查询商品
        async get_shangping() {
            this.shangping.query.start =
                this.shangping.page_index * this.shangping.query.length;
            // await this.$store.commit('shangPing/get_shangping',this.shangping);
            await this.获取商品(this.shangping);
            console.log("获取商品", this.shangping.list);
            this.shangping.list.forEach(item => {
                this.专享='';
                if(item.EXID){
                    api_根据商品id查询专享(item.id).then(r=>{
                        console.log('获取专享',r);
                        item.专享=(r.data.code==200 && r.data.data.length>0) ? r.data.data[0] : ''
                    }).catch(err=>{})
                }
                this.$set(item, "可享受新人专享", false);
                this.$set(item, "可享受生日专享", false);
                if (item.EXTYPE == 0) {
                    var query = {
                        userid: this.userInfo.username,
                        commodityid: item.id
                    };
                    this.是否享受新人专享([item, query]);
                } else if (item.EXTYPE == 1) {
                    var query = {
                        userid: this.userInfo.username,
                        commodityid: item.id
                    };
                    this.是否享受生日专享([item, query]);
                }
            });
            // 0 新人 1 生日
        },
        //滚动条
        scroll(e) {
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高

            var t = e.target.scrollTop; //滚动条到顶部距离
            if (
                h + t >= sh - 10 &&
                !this.shangping.loading &&
                this.shangping.list.length < this.shangping.total
            ) {
                this.shangping.page_index++;
                this.get_shangping();
            }
        },
        //获取用户可省红包
        get_CardPackge() {
            // console.log(this.shopid)
            var findDataUserCardPackge_query = {
                query: {
                    //
                    start: 0,
                    length: 1000,
                    userid: this.userInfo.username,
                    shopid: this.shopid,
                    state: 0
                },
                fc: this.CardPackge_return
            };
            this.$store.commit(
                "hongbao/findDataUserCardPackge",
                findDataUserCardPackge_query
            );
        },
        //红包返回值
        CardPackge_return(x) {
            console.log("红包返回值", x);
            if (x.code && x.code == 200) {
                this.hongbao.list = x.data.data;
                var list = x.data.data;
                //判断是优先使用哪种红包
                //生日红包
                this.shengri_hongbao = this.hongbao.list.filter(
                    x =>
                        x.type == 5 &&
                        x.startTime <= getDateStr(0) &&
                        x.endTime >= getDateStr(0)
                );
                //庆典红包
                this.qingdian_hongbao = this.hongbao.list.filter(x => x.type == 4);
                //节日红包
                this.jieri_hongbao = this.hongbao.list.filter(x => x.type == 2);
                //店铺新人红包
                this.xinren_hongbao = this.hongbao.list.filter(
                    x => x.type == 0 && x.amount > 0
                );

                if (this.shengri_hongbao.length > 0) {
                    this.dikou_type = 1; //店铺生日红包
                } else if (this.qingdian_hongbao.length > 0) {
                    this.dikou_type = 2; //庆典红包
                } else if (this.jieri_hongbao.length > 0) {
                    this.dikou_type = 4; //节日红包
                } else {
                    this.dikou_type = 6; //店铺+平台红包
                }
                // 0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包

                // 1、店铺生日红包
                // 2、店铺庆典红包
                // 3、店铺签到红包
                // 4、店铺节日红包
                // 5、平台节日红包
                // 6、店铺新人+平台红包
            }
        },
        get_invitedsutotal() {
            this.$request(
                "/api-u/users/invitedsutotal/findByUserid/" + this.userInfo.username,
                "",
                "get"
            )
                .then(x => {
                    console.log("平台红包信息", x);
                    if (x.data.code == 200 && x.data.data && x.data.data != null) {
                        this.invitedsutotal = x.data.data;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    created() {
        // console.log('收到参数1',this.shopid);
    },
    mounted() {
        try {
            this.userInfo = JSON.parse(localStorage.userInfo);
        } catch (error) { }

        // console.log('收到参数',this.shopid)
        this.shangping.query.shopid = this.shopid;
        //获取商品
        this.get_shangping();
        //获取用户可使用红包
        this.get_CardPackge();
        //获取用户平台红包金额
        this.get_invitedsutotal();
    },
    watch: {
        shopid() {
            console.log("数据发生变化", this.shopid);
        },
        shangping: {
            deep: true,
            handler() {
                console.log("商品数据发生改变");
                var this_1 = this;
                var list = this.shangping.list;
                var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
                for (var i = 0; i < list.length; i++) {
                    if (!list[i].number) {
                        this_1.$set(list[i], "number", 0);
                    } else if (!zhengshu_test.test(list[i].number)) {
                        list[i].number = Math.floor(list[i].number);
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.付款方式{
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    z-index: 10;
    .提取方式{
        position: fixed;
        left: 0px;
        bottom: 44px;
        width: 100%;
        .mui-table-view-cell:after{
            left: 0px;
        }
        .item{
            display: flex;
            align-items: center;
        }
        i{
            font-size: 20px;
            margin: 0px 8px 0px 0px;
        }
        span{
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
        }
        .icon-xuanze2{
            color: rgba(44, 164, 236, 1);
        }
    }
    .支付按钮{
        background: $header_background;
        color: #ffffff;
        height: 44px;
        line-height: 44px;
        text-align: center;
        letter-spacing: 10px;
        padding-left: 10px;
        font-size: 14px;
    }
}
.mui-content {
    z-index: 9;
    padding-bottom: 90px;
}
.box_1 {
    padding: 5px;
    li {
        background: #ffffff;
        display: flex;
        margin: 0px 0px 5px 0px;
        padding: 5px;
        .img_box {
            flex-shrink: 0;
            width: 96px;
            height: 72px;
            margin: 0px 5px 0px 0px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .text {
            flex-grow: 1;
            .title_1 {
                color: rgba(80, 80, 80, 1);
                font-size: 14px;
            }
            .money {
                span {
                    color: rgba(212, 48, 48, 1);
                    font-size: 14px;
                    margin: 0px 5px 0px 0px;
                }
                s {
                    color: rgba(166, 166, 166, 1);
                    font-size: 10px;
                }
            }
            .dikou {
                display: flex;
                white-space: nowrap;
                margin: 14px 0px 0px;
                i {
                    color: #d43030;
                    font-size: 16px;
                    margin: 0px 3px 0px 0px;
                }
                span {
                    color: rgba(128, 128, 128, 1);
                    font-size: 12px;
                }
            }
        }
        .zhuanshu {
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            > img {
                width: 21px;
            }
            > div {
                color: #d43030;
                font-size: 10px;
            }
        }
        .xuanzhe {
            width: 83px;
            height: 25px;
            display: flex;
            background-color: rgba(229, 229, 229, 1);
            border-radius: 3px;
            border: 1px solid rgba(204, 204, 204, 1);
            span {
                width: 24px;
                text-align: center;
                flex-shrink: 0;
                line-height: 23px;
            }
            input {
                padding: 0px;
                margin: 0px;
                height: 100%;
                text-align: center;
                border-top: none;
                border-bottom: 0px;
                border-radius: 0px;
                background: none;
                font-size: 14px;
            }
        }
    }
}

.box_2 {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: #ffffff;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    > li {
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0px 10px;
        > div {
            width: calc(100% / 3);
        }
        > div:nth-child(1) {
            display: flex;
            align-items: center;
            i {
                color: #c0bcbc;
                font-size: 16px;
            }
        }
        .money_1 {
            color: rgba(212, 48, 48, 1);
        }
        .money_2 {
            color: rgba(212, 48, 48, 1);
            font-weight: bold;
        }
        .btn_1 {
            background: $header_background;
            width: 88px;
            height: 33px;
            padding: 0px;
            border: none;
            color: #ffffff;
        }
    }
    > li:nth-child(1) {
        border-bottom: 1px solid rgba(229, 229, 229, 1);
    }
}

.box_3 {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
    display: flex;
    align-items: center;
    padding: 50px 0.4rem 20px;
    // padding: 1.88rem 0.4rem 0.85rem;
    .content_1 {
        background: #ffffff;
        width: 100%;
        // background: rgba(246, 246, 246, 1);
        height: 396px;
        max-height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        .close_1 {
            position: absolute;
            right: 0px;
            top: -50px;
            width: 36px;
            height: 36px;
            background: #ffffff;
            border-radius: 100%;
            font-size: 15px;
            color: rgba(153, 153, 153, 1);
            line-height: 36px;
            text-align: center;
        }
        .close_1::after {
            position: absolute;
            bottom: -14px;
            left: 0px;
            right: 0px;
            height: 15px;
            width: 1px;
            content: "";
            background: #ffffff;
            margin: auto;
        }
    }
    .cont_1 {
        flex-grow: 1;
        overflow: auto;
        .list {
            // margin: 0px 0px 7px 0px;
            background: #ffffff;
            border-bottom: 7px solid rgba(246, 246, 246, 1);
        }
        .list:last-child {
            border: none;
        }
        ul {
            border-bottom: 1px solid rgba(246, 246, 246, 1);
            padding: 4px 9px;
            color: rgba(80, 80, 80, 1);
            font-size: 10px;
            li {
                display: flex;
                > div {
                    width: calc(100% / 3);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .money_1 {
                color: #d43030;
            }
            .dikou {
                color: #a6a6a6;
            }
        }
    }
    .footer_1 {
        flex-shrink: 0;
        height: 40px;
        background-color: rgba(246, 246, 246, 1);
        display: flex;
        justify-content: space-between;
        padding: 0px 15px 0px 0px;
        .select_1 {
            position: relative;
            color: rgba(80, 80, 80, 1);
            font-size: 12px;
            > div {
                padding: 0px 15px;
                display: flex;
                align-items: center;
                position: relative;
                height: 100%;
                i {
                    font-size: 14px;
                }
            }
            ul {
                position: absolute;
                bottom: 100%;
                left: 0px;
                min-width: 100%;
                white-space: nowrap;
                background-color: rgba(246, 246, 246, 1);
                text-align: center;
                border: 1px solid rgba(229, 229, 229, 1);
                border-bottom: none;
                li {
                    padding: 3px;
                    border-bottom: 1px solid rgba(229, 229, 229, 1);
                }
            }
        }
        .money {
            color: rgba(212, 48, 48, 1);
            font-size: 12px;
            line-height: 40px;
        }
    }
}
</style>
