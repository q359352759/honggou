<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{id ? '编辑奖赏' : '添加奖赏'}}</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <ul class="展示专享" @click="选择专享()">
                <li v-if="专享">
                    <img v-if="专享.comImg.split(',').length>0" :src="专享.comImg.split(',')[0]" alt="">
                </li>
                <li v-if="专享">
                    <div>{{专享.comName}}</div>
                    <div>新人专享价：{{Math.round((专享.comSellingPrice-专享.deduction)*100)/100}}元</div>
                    <div>普通购买价：{{Math.round((专享.comSellingPrice-专享.comDeduction)*100)/100 }}元</div>
                </li>
            </ul>

            <ul class="奖赏规则">
                <li>
                    <div>
                        <span>首单奖赏：</span>
                        <input type="text" @blur="失去焦点('firstrewardamount')" v-model="奖赏.firstrewardamount">
                        <span class="单位">元</span>
                    </div>
                    <div>说明：顾客以专享价格购买时，奖赏给推广者的金额。</div>
                </li>
                <li>
                    <div>
                        <span>普通奖赏：</span>
                        <input type="text" @blur="失去焦点('generalrewardamount')" v-model="奖赏.generalrewardamount">
                        <span class="单位">元</span>
                    </div>
                    <div>说明：顾客以普通价格购买时，奖赏给推广者的金额。</div>
                </li>
                <li>
                    <div>
                        <span>{{id ? "剩余奖赏" : '奖赏次数'}}：</span>
                        <input type="text" @blur="失去焦点('surplusrewardnum')" v-model="奖赏.surplusrewardnum">
                        <span class="单位">次</span>
                    </div>
                </li>
                <li>
                    <div>
                        <span>到期时间：</span>
                        <input @click="选择时间()" type="text" v-model="奖赏.expirationtime" readonly >
                        <span class="单位"></span>
                    </div>
                </li>
            </ul>

            <btn @click.native="添加()" :styles="{'margin':'37px 0px 37px 0px'}"/>
                
        </div>

        <div class="选择专享" v-show="显示选择框">
            <div class="mask" @click="显示选择框=false"></div>
            <ul class="mui-table-view">
                <li @click="选择(item)" :class="{'已添加':item.已使用}" class="mui-table-view-cell" v-for="(item, index) in 新专享列表" :key="index">
                    <span>{{item.comName}}</span>
                    <span v-show="item.已使用">(已添加)</span>
                    <i v-show="!item.已使用" class="icon iconfont" :class="{'icon-choose':!item.当前选中,'icon-xuanze2':item.当前选中}"></i>
                </li>
                <!-- <li class="mui-table-view-cell">
                    <span>回锅肉</span>
                    <i class="icon iconfont icon-xuanze2"></i>
                </li>
                <li class="已添加 mui-table-view-cell">
                    <span>火爆腰花</span>
                    <span>(已添加)</span>
                </li> -->
            </ul>
        </div>

    </div>
</template>

<script>
import { api_添加奖赏 , api_修改奖赏 , api_根据id查询奖赏 , api_查询奖赏列表 } from "@/api/奖赏接口.js";
import { api_查询专享列表 } from "@/api/专享接口.js";
import { openloading , 当前时间格式化 , getDateStr} from "@/assets/js/currency.js";
import btn from '@/components/button.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
    name:"",
    components:{
        btn
    },
    data() {
        return {
            id:"",
            专享:"",
            显示选择框:false,
            专享列表:[],
            奖赏列表:[],
            原始商品id:"",
            奖赏:{
                id:"",
                shopid:"",
                commodityid:"",
                firstrewardamount:"",       //首单奖赏金额
                generalrewardamount:"",     //普通奖赏金额
                surplusrewardnum:"",        //剩余奖赏个数
                havarewardnum:0,           //已奖赏个数
                expirationtime:""           //到期时间
            },

        }
    },
    computed: {
        ...mapGetters({
            myshop: "get_myshop", 
        }),
        新专享列表(){
            var list=this.专享列表;
            list.forEach(item => {
                this.奖赏列表.forEach(item_1=>{
                    item.当前选中=item.comId==this.奖赏.commodityid
                    if(item.comId==item_1.commodityid && this.原始商品id!=item_1.commodityid){
                        item.已使用=true
                    }
                })
            });
            return list
        }
    },
    methods: {
        ...mapActions({
            获取店铺: "getMyshop",
        }),
        失去焦点(key){
            try {
                this.奖赏[key]=this.奖赏[key].replace(/ /g,'')
            } catch (error) {}
            
            var number_test = /^[0-9]+.?[0-9]*$/; //可带小数
            var zhengshu_test = /^[1-9]+[0-9]*]*$/; //整数
            if(key=='firstrewardamount'){
                var 转换后 = parseFloat(this.奖赏[key]);
                this.奖赏[key]=number_test.test(转换后) ? 转换后.toFixed(2) : ""
            }else if(key=='generalrewardamount'){
                var 转换后 = parseFloat(this.奖赏[key]);
                this.奖赏[key]=number_test.test(转换后) ? 转换后.toFixed(2) : ""
            }else if(key=='surplusrewardnum'){
                var 转换后 = parseInt(this.奖赏[key]);
                this.奖赏[key]=number_test.test(转换后) ? 转换后 : ""
            }
        },
        选择(item){
            if(!item.已使用){
                this.专享=item;
                this.奖赏.commodityid=item.comId;
                this.显示选择框=false;
            }
        },
        选择专享(){
            if(this.专享列表.length==0){
                mui.confirm("你还没有添加新人专享商品!", "提示", ["<span style='color: rgba(166, 166, 166, 1);'>取消</span>", "去添加"], value => {
                    if (value.index == 1) {
                        this.$router.push('/addMarketingVip');
                    }
                });
                return
            }
            this.显示选择框=true;
        },
        选择时间(){
            var val=''
            if(this.奖赏.expirationtime){
                val=this.奖赏.expirationtime
            }else{
                val=getDateStr(1)
            }
            var options={'type':'date',"value":val};
            var picker = new mui.DtPicker(options);
                picker.show((rs)=>{
                    console.log(rs);
                    this.奖赏.expirationtime=rs.value
                    picker.dispose();
                    picker = null;
                })
        },
        添加(){
            if(!this.专享){
                mui.toast("请选择专享商品", { duration: 2000, type: "div" });
                return
            }
            var 专享销售价=Math.round((this.专享.comSellingPrice-this.专享.deduction)*100)/100;
            var 普通抵扣后价格=Math.round( (this.专享.comSellingPrice-this.专享.comDeduction)*100 )/100;
            if(!this.奖赏.firstrewardamount){
                mui.toast("请输入首单奖金", { duration: 2000, type: "div" });
                return
            }else if(this.奖赏.firstrewardamount<0 || this.奖赏.firstrewardamount>专享销售价/2){
                mui.toast("首单奖赏需在0-"+专享销售价/2+'之间', { duration: 2000, type: "div" });
                return                
            }else if(!this.奖赏.generalrewardamount){
                mui.toast("请输入普通奖金", { duration: 2000, type: "div" });
                return
            }else if(this.奖赏.generalrewardamount<0 || this.奖赏.generalrewardamount>普通抵扣后价格/2){
                mui.toast("普通奖赏需在0-"+普通抵扣后价格/2+'之间', { duration: 2000, type: "div" });
                return 
            }else 
            if(!this.奖赏.surplusrewardnum || this.奖赏.surplusrewardnum<0){
                mui.toast("奖赏个数有误", { duration: 2000, type: "div" });
                return
            }else 
            if(!this.奖赏.expirationtime){
                mui.toast("请选择到期时间", { duration: 2000, type: "div" });
                return
            }else if(this.奖赏.expirationtime<当前时间格式化('yyyy-MM-dd')){
                mui.toast("到期时间有误", { duration: 2000, type: "div" });
                return
            }
                this.奖赏.shopid=this.myshop.shopid;
                this.奖赏.commodityid=this.专享.comId;
            openloading(true);
            if(!this.奖赏.id){
                api_添加奖赏(this.奖赏).then(x=>{
                    if(x.data.code==200){
                        mui.toast("添加成功", { duration: 2000, type: "div" });
                        history.back();
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false)
                }).catch(err=>{
                    mui.toast("系统错误，稍后再试", { duration: 2000, type: "div" });
                })
            }else{
                api_修改奖赏(this.奖赏).then(x=>{
                    if(x.data.code==200){
                        mui.toast("修改成功", { duration: 2000, type: "div" });
                        history.back();
                    }else{
                        mui.alert(x.data.msg ? x.data.msg : x.data.message, "提示", "我知道了", function () { }, "div");
                    }
                    openloading(false)
                }).catch(err=>{
                    mui.toast("系统错误，稍后再试", { duration: 2000, type: "div" });
                })
            }
        },
        查询奖赏(){
            return new Promise((resolve, reject) => {
                if(!this.id){
                    resolve()
                }else{
                    api_根据id查询奖赏(this.id).then(x=>{
                        if(x.data.code==200){
                            this.奖赏=x.data.data
                            this.原始商品id=x.data.data.commodityid;
                        }
                        resolve()
                    }).catch(err=>{
                        reject()
                    })
                }
            });
        },
        async 初始化(){
            openloading(true);
            if(!this.myshop || !this.myshop.shopid){
                await this.获取店铺();
            }
            var 查询专享={
                    start:0,
                    length:1000,
                    shopid:this.myshop.shopid,
                    type:0
                }
            var 查询奖赏列表_query={
                    start:0,
                    length:1000,
                    shopid:this.myshop.shopid,
                }
            Promise.all([
                api_查询专享列表(查询专享),
                api_查询奖赏列表(查询奖赏列表_query),
                this.查询奖赏(),
            ]).then(x=>{
                console.log(x);
                this.专享列表=x[0].data.code==200 ? x[0].data.data.data : [];
                this.奖赏列表=x[1].data.code==200 ? x[1].data.data.data : [];
                if(this.奖赏.commodityid){
                    this.专享=this.专享列表.find(item=>item.comId==this.奖赏.commodityid);
                }
                openloading(false)
            }).catch(err=>{
                openloading(false)
            })
        }
    },
    mounted() {
        this.id=this.$route.query.id;
        this.初始化();
        
    },
}
</script>

<style lang="scss" scoped>
.展示专享{
    margin: 7px 0px 0px 0px;
    background: #ffffff;
    padding: 4px 8px;
    display: flex;
    position: relative;
    min-height: 68px;
    >li:nth-child(1){
        width: 80px;
        height: 60px;
        margin: 0px 12px 0px 0px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    >li:nth-child(2){
        color: rgba(80, 80, 80, 1);
    	font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
.展示专享:empty::after{
    content: "请选择新人专享商品";
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    margin: auto;
    color: rgba(80, 80, 80, 1);
	font-size: 14px;
    height:24px;
    line-height: 24px;
    text-align: center;
}
.奖赏规则{
    background: #ffffff;
    margin: 5px 0px 0px;
    >li{
        border-bottom: 1px solid #f6f6f6;
        >div:nth-child(1){
            height: 44px;
            display: flex;
            align-items: center;
            color: rgba(80, 80, 80, 1);
            font-size: 14px;
            white-space: nowrap;
            padding: 0px 0px 0px 13px;
            input{
                height: 30px;
                padding: 0px 5px;
                margin: 0px;
                font-size: inherit;
                color: inherit;
                background-color: rgba(246, 246, 246, 1);
                border: none;
                text-align: center;
            }
            .单位{
                width: 44px;
                flex-shrink: 0;
                padding: 0px 0px 0px 12px;
            }
        }
        >div:nth-child(2){
            padding: 0px 0px 7px 13px;
            color: rgba(166, 166, 166, 1);
        	font-size: 12px;
        }
    }
}


.选择专享{
    position: fixed;
    width: 100%;
    height: 100%;
    color: rgba(80, 80, 80, 1);
    font-size: 14px;
    .mask{
        height: 100%;    
        background: rgba(0,0,0,0.4);
    }
    >ul{
        position: absolute;
        left: 0px;
        bottom: 0px;
        max-height: 60%;
        overflow: auto;
        width: 100%;
        li{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .icon{
            font-size: 22px;
            height: 22px;
            line-height: 22px;
        }
        .icon-xuanze2{
            color: rgba(0, 122, 255, 1);
        }
        .已添加{
            color: rgba(166, 166, 166, 1);
        }
    }
}
</style>
