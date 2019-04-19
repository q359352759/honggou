

import { api_根据shopid查询店铺 , api_查询店铺评分 , api_查询店铺服务类型 , api_查询店铺公告 , api_店铺简介} from "@/api/店铺接口.js";
import { api_查询两点距离 } from "@/api/查询距离.js";
import { api_查询评论列表 , api_查询评论点赞 } from "@/api/评论接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { api_通过clerksid查询员工 } from "@/api/店员接口.js";
import { api_查询红包列表 , api_查询卡包 , api_获取用户平台红包} from "@/api/红包接口.js";
import { api_获取商品列表 , api_查询商品分组列表 } from "@/api/商品接口.js";
import { api_根据商品id查询专享 , api_用户是否享受新人专享 , api_用户是否享受生日专享 } from "@/api/专享接口.js";
import { api_获取实名信息 } from "@/api/实名信息接口.js";
import { api_添加收藏 , api_删除收藏 , api_查询收藏 } from "@/api/收藏接口.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import { openloading , bd_decrypt , 当前时间格式化 } from "@/assets/js/currency.js";
import { api_根据shopid查询预定 } from "@/api/预定接口.js";


// import { 百度转标转WGS84 , bd09togcj02} from "@/assets/js/地图坐标转换.js";
import { 跳转地图 } from "@/assets/js/跳转地图.js";
import router from "@/router";
import $ from 'jquery'
const 店铺评分={
    "one":0,
    "two":0,
    "three":0,
    "four":0,
    "five":0,
    "scoreAvg":5.0
}
const 评论={
    page_index:0,
    list:[],
    total:0,
    loading:true,
    query:{
        start:0,
        length:10,
        shopid:''
    }
}
const 选购列表导航=[
    "领取红包",
    "特惠专享",
    '老顾客专享'
]
export default {
    namespaced: true,
    state: {
        shopid:'',
        userInfo:"",
        店铺信息:{},
        当前位置:{},
        店铺距离:"",
        店铺评分:{
            "one":0,
            "two":0,
            "three":0,
            "four":0,
            "five":0,
            "scoreAvg":5.0
        },
        所有服务类型:[],
        店铺公告:{},
        评论:{
            page_index:0,
            list:[],
            total:0,
            loading:true,
            query:{
                start:0,
                length:10,
                shopid:''
            }
        },
        简介:{},
        新人红包:"",
        显示大图:false,
        大图_index:0,
        选购列表导航:[
            "领取红包",
            "特惠专享",
            '老顾客专享'
        ],
        所有红包:[],
        所有商品:[],
        左侧栏定位:'滚动锚点0',
        商品分组:[],
        未分组商品:[],
        查询完成数量:0,
        显示购物车按钮:false,
        显示购物车详情:false,
        购买商品列表:[],
        用户红包:[],
        用户平台红包:"",
        用户实名信息:"",
        收藏信息:"",

        分享者id:"",
        是否分享过来:false,
        分享红包id:"",
        是否显示分享红包:false,
        分享红包:{},
        店铺预定:"",
        最佳抵扣规则:0,
        是否手动选择类型:false
    },
    getters: {
        全部信息(state){
            return state;
        },
        评论(state){
            return state.评论;
        },
        店铺评分(state){
            return state.店铺评分
        },
        店铺信息(state){
            return state.店铺信息;
        },
        环境图片(state){
            var list=[];
            if(state.店铺信息.shopid){
                list.push(state.店铺信息.signboard);
                var 环境图片=state.店铺信息.environmentalImg.split(',');
                list=[...list,...环境图片]
            }
            return list
        },
        当前位置(state){
            return state.当前位置
        },
        当前店铺服务类型(state){
            if (state.所有服务类型 && state.店铺信息.serviceType) {
                var serviceType = state.店铺信息.serviceType.split(",");
                var 所有服务类型 = state.所有服务类型;
                var list = [];
                for (var i = 0; i < 所有服务类型.length; i++) {
                    for (var j = 0; j < serviceType.length; j++) {
                        if (所有服务类型[i].id == serviceType[j]) {
                            list.push(所有服务类型[i]);
                        }
                    }
                }
                return list;
            } else {
                return [];
            }
        },
        //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
        所有红包(state){
            return state.所有红包
        },
        新人红包(state){
            var obj=state.所有红包.find(x=>x.type===0);
            return obj ? obj : ''
        },
        商品红包(state){
            var list=state.所有红包.filter(x=>x.type==1);
            return list
        },
        节日红包(state){
            var obj=state.所有红包.find(x=>x.type==2);
            return obj ? obj : ''
        },
        签到红包(state){
            var obj=state.所有红包.find(x=>x.type==3);
            return obj ? obj : ''
        },
        庆典红包(state){
            var obj=state.所有红包.find(x=>x.type==4);
            return obj ? obj : ''
        },
        生日红包(state){
            var obj=state.所有红包.find(x=>x.type==5);
            return obj ? obj : '';
        },
        新人专享商品(state){
            return state.所有商品.filter(x=>(x.EXID && x.EXTYPE==0))
        },
        生日专享商品(state){
            return state.所有商品.filter(x=>(x.EXID && x.EXTYPE==1))
        },
        老顾客专享(state){
            return state.所有商品.filter(x=>(!x.EXID && x.商品红包))
        },
        //过滤掉哟红包和专享商品
        新未分组商品(state){
            return state.未分组商品.filter(x=>(!x.EXID && !x.商品红包))
        },
        带抵扣购买商品(state){
            var list=JSON.parse(JSON.stringify(state.购买商品列表));
            var 所有红包=JSON.parse(JSON.stringify(state.所有红包));
                list.sort(function(a,b){
                    return a.id-b.id;    // 先序排列 
                })
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var 商品index=0;     //购买数量
            var 正在计算的商品id='';
            //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            var 用户所有红包 = JSON.parse(JSON.stringify(state.用户红包));

            var 用户新人红包 = state.用户红包.find(x=>x.type==0);
            var 新人红包金额 = (用户新人红包 && 用户新人红包.amount) ? 用户新人红包.amount : 0;

            var 用户节日红包 = state.用户红包.find(x=>x.type==2 && 当前时间>x.startTime && 当前时间<x.endTime);
            var 节日红包金额 = 用户节日红包 ? 用户节日红包.redAmount : 0;
            
            // var 用户签到红包 = state.用户红包.find(x=>x.type==3);
            // var 签到红包金额 = 用户新人红包 ? 用户新人红包.amount : 0;
            
            var 用户庆典红包 = state.用户红包.find(x=>x.type==4 && 当前时间>x.startTime && 当前时间<x.endTime);
            var 庆典红包金额 = 用户庆典红包 ? 用户庆典红包.redAmount : 0;

            var 用户生日红包 = state.用户红包.find(x=>x.type==5 && 当前时间>x.startTime && 当前时间<x.endTime);
            var 生日红包金额 = 用户生日红包 ? 用户生日红包.redAmount : 0;

            var 平台红包金额=state.用户平台红包 ? state.用户平台红包.amount : 0;
            list.forEach(item=>{
                item.使用红包=[];
                if(item.id==正在计算的商品id){
                    商品index++;
                }else{
                    商品index=1
                    正在计算的商品id=item.id;
                }
                var 专享最大数量=(item.专享商品 && item.专享商品.maxNumber) ? item.专享商品.maxNumber : 4;
                var 商品可抵扣=0
                if(item.可享受新人专享 && 商品index<=专享最大数量 && item.专享商品){
                    item.使用新人专享=true;
                    商品可抵扣=item.专享商品.deduction;
                }else if(item.可享受生日专享  && 商品index<=专享最大数量 && item.专享商品){
                    item.使用生日专享 = true;
                    商品可抵扣=item.专享商品.deduction;
                }else{
                    商品可抵扣=item.deduction;
                }
                var 商品红包=用户所有红包.find(x=>x.redCommodityId==item.id && !x.已使用);
                if(商品红包){
                    let 红包1 = Object.assign({},商品红包);
                        红包1.实际抵扣 = 红包1.redAmount<商品可抵扣 ? 红包1.redAmount : 商品可抵扣;
                    item.使用红包.push(红包1);
                    商品红包.已使用=true;
                }else{
                    if(state.最佳抵扣规则==0 && (新人红包金额>0 || 平台红包金额>0)){
                        if(商品可抵扣<=新人红包金额){
                            let 红包1 = Object.assign({},用户新人红包);
                                红包1.实际抵扣 = 商品可抵扣;
                            item.使用红包.push(红包1);
                            console.log(红包1.实际抵扣)
                            新人红包金额 = Math.round((新人红包金额 - 商品可抵扣)*100)/100 

                        }else{
                            var 剩余可抵扣=商品可抵扣
                            if(新人红包金额>0){
                                let 红包1 = Object.assign({},用户新人红包);
                                红包1.实际抵扣 = 新人红包金额;
                                剩余可抵扣 = 商品可抵扣-新人红包金额;
                                新人红包金额 = Math.round((新人红包金额 - 商品可抵扣)*100)/100
                                item.使用红包.push(红包1);
                            }
                            if(平台红包金额>0){
                                let 红包2 = Object.assign({},state.用户平台红包);
                                    红包2.实际抵扣 = 剩余可抵扣>平台红包金额 ? 平台红包金额 : 剩余可抵扣;
                                    console.log(红包2.实际抵扣)
                                item.使用红包.push(红包2);
                                平台红包金额= Math.round((平台红包金额-剩余可抵扣)*100)/100 ;
                            }
                        }
                    }else if(state.最佳抵扣规则==1 && 节日红包金额>0){
                        let 红包1 = Object.assign({},用户节日红包);
                            红包1.实际抵扣 = 节日红包金额 < 商品可抵扣 ? 节日红包金额 : 商品可抵扣;
                            节日红包金额 = Math.round((节日红包金额 - 商品可抵扣)*100)/100
                        item.使用红包.push(红包1);
                    }else if(state.最佳抵扣规则==2 && 庆典红包金额>0){
                        let 红包1 = Object.assign({},用户庆典红包);
                            红包1.实际抵扣 = 庆典红包金额 < 商品可抵扣 ? 庆典红包金额 : 商品可抵扣;
                            庆典红包金额 = Math.round((庆典红包金额 - 商品可抵扣)*100)/100
                        item.使用红包.push(红包1);
                    }else if(state.最佳抵扣规则==3 && 生日红包金额>0){
                        let 红包1 = Object.assign({},用户生日红包);
                            红包1.实际抵扣 = 生日红包金额 < 商品可抵扣 ? 生日红包金额 : 商品可抵扣;
                            生日红包金额 = Math.round((生日红包金额 - 商品可抵扣)*100)/100
                        item.使用红包.push(红包1);
                    }
                }
            })
            return list
        },
        红包可抵扣(state){
            var list=JSON.parse(JSON.stringify(state.购买商品列表));
                list.sort(function(a,b){
                    return a.id-b.id;    // 先序排列 
                })
            var 当前时间=当前时间格式化('yyyy-MM-dd hh:mm')
            var 商品index=0;     //购买数量
            var 正在计算的商品id='';
            //0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            var 用户所有红包 = JSON.parse(JSON.stringify(state.用户红包));

            var 用户新人红包 = state.用户红包.find(x=>x.type==0);
            var 新人红包金额 = (用户新人红包 && 用户新人红包.amount) ? 用户新人红包.amount : 0;

            var 用户节日红包 = state.用户红包.find(x=>x.type==2 && 当前时间>x.startTime && 当前时间<x.endTime);
            var 节日红包金额 = 用户节日红包 ? 用户节日红包.redAmount : 0;
            
            // var 用户签到红包 = state.用户红包.find(x=>x.type==3);
            // var 签到红包金额 = 用户新人红包 ? 用户新人红包.amount : 0;
            
            var 用户庆典红包 = state.用户红包.find(x=>x.type==4 && 当前时间>x.startTime && 当前时间<x.endTime);
            var 庆典红包金额 = 用户庆典红包 ? 用户庆典红包.redAmount : 0;

            var 用户生日红包 = state.用户红包.find(x=>x.type==5 && 当前时间>x.startTime && 当前时间<x.endTime);
            var 生日红包金额 = 用户生日红包 ? 用户生日红包.redAmount : 0;
            var 平台红包金额=state.用户平台红包 ? state.用户平台红包.amount : 0;

            var 除商品红包剩余可抵扣=0
            list.forEach(item=>{
                var 商品红包=用户所有红包.find(x=>x.redCommodityId==item.id && !x.已使用);
                if(商品红包){
                    商品红包.已使用=true;
                }else{
                    if(item.id==正在计算的商品id){
                        商品index++;
                    }else{
                        商品index=1
                        正在计算的商品id=item.id;
                    }
                    var 专享最大数量=(item.专享商品 && item.专享商品.maxNumber) ? item.专享商品.maxNumber : 4;
                    if(item.可享受新人专享 && 商品index<=专享最大数量 && item.专享商品){
                        item.使用新人专享=true
                        除商品红包剩余可抵扣=Math.round((除商品红包剩余可抵扣+item.专享商品.deduction)*100)/100
                    }else if(item.可享受生日专享  && 商品index<=专享最大数量 && item.专享商品){
                        item.使用生日专享 = true;
                        除商品红包剩余可抵扣=Math.round((除商品红包剩余可抵扣+item.专享商品.deduction)*100)/100
                    }else{
                        除商品红包剩余可抵扣=Math.round((除商品红包剩余可抵扣+item.deduction)*100)/100
                    }
                }
            })
            var 新人红包可抵扣= 新人红包金额 > 除商品红包剩余可抵扣 ? 除商品红包剩余可抵扣 : 新人红包金额
            var 除新人剩余可抵扣 = Math.round((除商品红包剩余可抵扣-新人红包可抵扣)*100)/100 ;
                除新人剩余可抵扣 = 除新人剩余可抵扣 > 0 ? 除新人剩余可抵扣 : 0;
            var 平台红包可抵扣=平台红包金额 > 除新人剩余可抵扣 ? 除新人剩余可抵扣 : 平台红包金额;
            var 新人加平台总和=Math.round((新人红包可抵扣+平台红包可抵扣)*100)/100
            var obj={
                    除商品红包剩余可抵扣:除商品红包剩余可抵扣,
                    新人红包可抵扣:新人红包可抵扣,
                    平台红包可抵扣:平台红包可抵扣,
                    新人加平台总和:新人加平台总和,
                    节日红包可抵扣:节日红包金额 > 除商品红包剩余可抵扣 ? 除商品红包剩余可抵扣 : 节日红包金额,
                    庆典红包可抵扣:庆典红包金额 > 除商品红包剩余可抵扣 ? 除商品红包剩余可抵扣 : 庆典红包金额,
                    生日红包可抵扣:生日红包金额 > 除商品红包剩余可抵扣 ? 除商品红包剩余可抵扣 : 生日红包金额,
                }
                
            var list=[obj.新人加平台总和 , obj.节日红包可抵扣 , obj.庆典红包可抵扣 , obj.生日红包可抵扣];
            
            if(!state.是否手动选择类型){
                var 最大值=0;
                var index=0
                for(let i=0;i<list.length;i++){
                    if(list[i]>最大值){
                        最大值=list[i];
                        index=i
                    }
                }
                state.最佳抵扣规则=index
            }
            return obj
        }

    },
    mutations: {
        
    },
    actions: {
        设置显示大图({state},[type,index]){
            state.显示大图=type;
            state.大图_index=index;
        },
        async 初始化({state , dispatch , rootGetters},shopid){
            var 当前位置= rootGetters['当前位置'];
                if(!当前位置 || 当前位置.x=='' || 当前位置.y==''){
                    await dispatch('获取位置/获取位置', {}, {root: true});
                    当前位置= rootGetters['当前位置'];
                }
            return new Promise((resolve, reject) => {
                try {
                    state.userInfo=JSON.parse(localStorage.userInfo);                
                } catch (error) {}
                if(state.shopid!=shopid){
                    state.购买商品列表=[];
                }
    
                state.shopid=shopid;
                state.店铺信息={};
                state.店铺公告={};
                state.店铺评分=Object.assign({},店铺评分);
                state.评论=Object.assign({},评论);
                state.简介={};
                state.新人红包=""
                state.显示大图=false;
                state.选购列表导航=JSON.parse(JSON.stringify(选购列表导航))
                state.所有红包=[];
                state.所有商品=[]
                state.左侧栏定位='滚动锚点0';
                state.商品分组=[];
                state.未分组商品=[];
                state.查询完成数量=0;
                state.显示购物车按钮=false;
                state.显示购物车详情=false;
                state.用户实名信息="";
                state.收藏信息="";
                state.是否显示分享红包=false;
                state.分享者id="";
                state.是否分享过来=false;
                state.分享红包id="";
                state.分享红包={};
                state.店铺预定='';
                state.当前位置=当前位置;
                state.最佳抵扣规则=0
                state.是否手动选择类型=false
                
                
                
                if(state.userInfo){
                    api_获取实名信息(state.userInfo.username).then(x=>{
                        state.用户实名信息=(x.data.code==200 && x.data.data) ? x.data.data : "";
                    })
                }
                dispatch('查询评价');
                Promise.all([
                    dispatch('获取用户红包'),
                    dispatch('获取数据')
                ]).then(x=>{
                    resolve()
                }).catch(err=>{
                    resolve()
                })
            });
        },
        获取数据({dispatch,state,rootGetters}){
            return new Promise((resolve, reject) => {
                openloading(true);
                var 查询红包_query={
                        start:0,
                        length:1000,
                        shopid:state.shopid,
                        // type:0,
                        ccc:1,
                    }
                var 查询商品_query={
                    start:0,
                    length:1000,
                    shopid:state.shopid,
                    state:1,
                    order:"sort",
                    orderType:"ASC"
                }
                var 查询商品分组_query={
                    start:0,
                    length:1000,
                    shopid:state.shopid
                }
                var 查询未分组商品={
                    start:0,
                    length:1000,
                    shopid:state.shopid,
                    state:1,
                    order:"sort",
                    orderType:"ASC",
                    isnull:'随便传'    //这个随便传一个
                }
                Promise.all([
                    api_根据shopid查询店铺(state.shopid),
                    api_查询店铺评分(state.shopid),
                    api_查询店铺服务类型(),
                    api_查询店铺公告(state.shopid),
                    api_店铺简介(state.shopid),
                    api_查询红包列表(查询红包_query),
                    api_获取商品列表(查询商品_query),
                    api_查询商品分组列表(查询商品分组_query),
                    api_获取商品列表(查询未分组商品),
                    api_根据shopid查询预定(state.shopid)
                ]).then(x=>{
                    state.店铺信息=x[0].data.code==200 ? x[0].data.data : {}
                    state.店铺评分=(x[1].data.code==200 && x[1].data.data.length>0) ? x[1].data.data[0] : {};
                    state.所有服务类型=x[2].data.code==200 ? x[2].data.data.data : [];
                    state.店铺公告=x[3].data.code==200 ? x[3].data.data : {};
                    if(x[4].data.code==200 && x[4].data.data){
                        var 简介=x[4].data.data;
                            简介.remark_1=简介.remark.replace(/contenteditable/g,'a')
                        state.简介 = 简介
                        // var str = state.简介.remark;
                        // var str='<div data-v-845c3686="" contenteditable="true" class="content_1" style="font-size: 24px; color: rgb(0, 0, 255);">sdfsdfsdf</div>';
                        // var div = $(str);
                        // state.简介.remark_1 = div.html();
                    }
                    //红包
                    if(x[5].data.code==200){
                        state.所有红包=x[5].data.data.data
                    }
                    //商品
                    var 所有商品=x[6].data.code==200 ? x[6].data.data.data : [];
                        所有商品.forEach(item=>{
                            item.可享受新人专享=false;
                            item.可享受生日专享=false;
                            item.商品红包="";
                            item.专享商品="";
                            let 查询红包_query={
                                start:0,
                                length:1000,
                                // shopid:state.shopid,
                                // type:0,
                                ccc:1,
                                commodityId:item.id
                            }
                            api_查询红包列表(查询红包_query).then(r=>{
                                if(r.data.code==200 && r.data.data.data.length>0){
                                    item.商品红包=r.data.data.data[0];
                                }
                            })
                            if(item.EXID){
                                api_根据商品id查询专享(item.id).then(r=>{
                                    item.专享商品=(r.data.code==200 && r.data.data.length>0) ? r.data.data[0] : ""
                                })
                            }
                            if(state.userInfo && item.EXID){
                                var query = {
                                    userid: state.userInfo.username,
                                    commodityid: item.id
                                };
                                if(item.EXTYPE==0){
                                    api_用户是否享受新人专享(query).then(r=>{
                                        item.可享受新人专享=r.data.code==200
                                    })
                                }
                                if(item.EXTYPE==1){
                                    api_用户是否享受生日专享(query).then(r=>{
                                        item.可享受生日专享=r.data.code==200;
                                    })
                                }
                            }
                        })
                    state.所有商品=所有商品
                    //商品分组
                    var 商品分组=x[7].data.code==200 ? x[7].data.data.data : [];
                        商品分组.forEach(item=>{
                            item.商品=state.所有商品.filter(k=>(!k.EXID && k.groupid==item.id))
                        })
                    state.商品分组=商品分组
                    var 未分组商品=x[8].data.code==200 ? x[8].data.data.data : [];
                        未分组商品.forEach(item=>{
                            item.商品红包="";
                            item.专享商品="";
                            let 查询红包_query={
                                start:0,
                                length:1000,
                                // shopid:state.shopid,
                                // type:0,
                                ccc:1,
                                commodityId:item.id
                            }
                            if(item.EXID){
                                api_根据商品id查询专享(item.id).then(r=>{
                                    item.专享商品=(r.data.code==200 && r.data.data.length>0) ? r.data.data[0] : ""
                                })
                            }
                            api_查询红包列表(查询红包_query).then(r=>{
                                if(r.data.code==200 && r.data.data.data.length>0){
                                    item.商品红包=r.data.data.data[0];
                                }
                            })
                        })
                    state.未分组商品=未分组商品;
                    
                    state.店铺预定=x[9].data.code==200 ? x[9].data.data : '';

                    dispatch('查询距离');
                    openloading(false);
                    resolve()
                }).catch(err=>{
                    openloading(false);
                    reject()
                })
            });
        },
        获取用户红包({state}){
            return new Promise((resolve, reject) => {
                if(!state.userInfo){
                    resolve()
                    return
                }
                var 用户卡包_query={
                        start: 0,   
                        length: 1000,
                        userid: state.userInfo.username,
                        shopid: state.shopid,
                        state: 0
                    }
                Promise.all([
                    api_查询卡包(用户卡包_query),
                    api_获取用户平台红包(state.userInfo.username)
                ]).then(x=>{
                    console.log(x);
                    state.用户红包=x[0].data.code==200 ? x[0].data.data.data : [];
                    state.用户平台红包=x[1].data.code==200 ? x[1].data.data : "";
                    resolve()
                }).catch(err=>{
                    reject()
                })
            });
        },
        查询店铺收藏({state}){
            new Promise((resolve, reject) => {
                if(!state.userInfo){
                    resolve()
                    return
                }
                var obj = {
                    start: 0,
                    length: 10,
                    userid: state.userInfo.username,
                    shopid: state.shopid
                };
                api_查询收藏(obj).then(x=>{
                    if(x.data.code==200 && x.data.data.data.length>0){
                        state.收藏信息= x.data.data.data[0];
                    }else{
                        state.收藏信息=""
                    }
                    resolve()
                }).catch(err=>{
                    reject()
                })
            });
        },
        async 添加和删除收藏({state,dispatch}){
            openloading(true);
            if(state.收藏信息){
                try {
                    await api_删除收藏([state.收藏信息.id]);
                    mui.toast("取消成功", { duration: 1000, type: "div" });
                } catch (error) {
                    mui.toast("系统错误，稍后再试", { duration: 1000, type: "div" });
                }
                await dispatch('查询店铺收藏');
                openloading(false)
            }else{
                if(!state.userInfo){
                    openloading(false)
                    mui.toast("请先登录才能收藏。", { duration: "long", type: "div" });
                    return
                }
                var obj = {
                    userid: state.userInfo.username,
                    type: "0", //收藏类型(0:店铺,1:商品)
                    name: "店铺", //收藏类型(店铺,商品)
                    shopid: state.shopid, //商店id
                    commodityid: "" //商品id
                };
                try {
                    await api_添加收藏(obj);
                    mui.toast("收藏成功。", { duration: 1000, type: "div" });
                } catch (error) {
                    mui.toast("系统错误，稍后再试", { duration: 1000, type: "div" });
                }
                await dispatch('查询店铺收藏');
                openloading(false)
            }
        },
        设置显示分享的红包({state}){
            if(state.是否分享过来){
                localStorage.yaoqing=state.分享人id ? state.分享人id : state.店铺信息.userid;

                if(!state.分享红包id){
                    var 新人红包 = state.所有红包.find(x=>x.type==0);
                    var 用户新人红包=state.用户红包.find(x=>x.type==0);
                    if(新人红包 && !用户新人红包){
                        state.分享红包=新人红包
                        state.是否显示分享红包=true;
                    }
                }else{
                    var 分享红包=state.所有红包.find(x=>x.id==state.分享红包id);
                    var 用户红包=state.用户红包.filter(x=>x.redId==state.分享红包id);
                    if(分享红包){
                        if(分享红包.type==1){   //商品红包
                            if(用户红包.length>=2){
                                console.log("/commodity/CommodityDetails?id=" +分享红包.commodityId);
                                router.replace("/commodity/CommodityDetails?id=" +分享红包.commodityId)
                                // router.push("/commodity/CommodityDetails?id=" +分享红包.commodityId);
                            }else{
                                state.分享红包=分享红包;
                                state.是否显示分享红包=true;
                            }
                        }else{
                            state.分享红包=分享红包;
                            state.是否显示分享红包=true;
                        }
                    }
                }
            }
        },
        查询距离({state}){
            var query = {
                destinations:state.当前位置.y +"," + state.当前位置.x, //起点
                origins: state.店铺信息.y + "," + state.店铺信息.x    //终点
            };
            api_查询两点距离(query).then(x=>{
                if(x.data.message=="成功" && x.data.result.length>0){
                    var m=x.data.result[0].distance.value;
                    state.店铺距离=m<500 ? m+'m' : Math.round(m/1000*100)/100 + 'km';
                }
            }).catch(err=>{})
        },
        跳转地图({state}){
            跳转地图(state.当前位置 , state.店铺信息 , state.店铺信息.name , state.店铺信息.address)
            // if(ApplicationType=='app'){
            //     function 跳转地图(){
            //         if(AppType=='ios'){
            //             // 设置目标位置坐标点和其实位置坐标点
            //             var 起点=bd09togcj02(state.当前位置.x , state.当前位置.y);
            //             var 终点=bd09togcj02(state.店铺信息.x , state.店铺信息.y);
            //             var dst = new plus.maps.Point(起点[0] , 起点[1]);
            //             var src = new plus.maps.Point(终点[0] , 终点[1]);
 
            //             // 调用系统地图显示 
            //             plus.maps.openSysMap(src, state.店铺信息.name, dst);
            //         }else{
            //              // 设置目标位置坐标点和其实位置坐标点
            //             var 起点=百度转标转WGS84(state.当前位置.x , state.当前位置.y);
            //             var 终点=百度转标转WGS84(state.店铺信息.x , state.店铺信息.y);
            //             var dst = new plus.maps.Point(起点[0] , 起点[1]);
            //             var src = new plus.maps.Point(终点[0] , 终点[1]);
            //             // 调用系统地图显示 
            //             plus.maps.openSysMap(src, state.店铺信息.name, dst);
            //         }
            //     }
            //     if (window.plus) {
            //         跳转地图();
            //     } else {
            //         document.addEventListener('plusready', 跳转地图, false);
            //     }
            // }else{
            //     var ditu = bd_decrypt(state.店铺信息.x, state.店铺信息.y);
            //     wx.openLocation({
            //         latitude: ditu.lat, // 纬度，浮点数，范围为90 ~ -90
            //         longitude: ditu.lng, // 经度，浮点数，范围为180 ~ -180。
            //         name: state.店铺信息.name, // 位置名
            //         address: state.店铺信息.address, // 地址详情说明
            //         scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
            //         infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
            //     });
            // }
        },
        查询评价({state , dispatch }){
            state.评论.query.shopid=state.shopid;
            state.评论.query.start=state.评论.page_index*state.评论.query.length;
            state.评论.loading=true;
            api_查询评论列表(state.评论.query).then(x=>{
                if(x.data.code==200){
                    var list=x.data.data.data;
                    list.forEach(item => {
                        try {
                            item.remark=b64DecodeUnicode(item.remark)
                        } catch (error) {}
                        item.用户={};
                        //0表示没有登录或者查询错误 1 表示没有点赞 2表示已经点赞
                        item.是否点赞=0;
                        dispatch('通过username查询用户',item)
                        dispatch('查询点赞',item)
                        item.shopCommodityCommentList.forEach(item_1=>{
                            try {
                                item_1.remark=b64DecodeUnicode(item_1.remark)
                            } catch (error) {}
                            item_1.用户={}
                            item_1.店员={}
                            dispatch('通过username查询用户',item_1)
                            dispatch('员工基本信息',item_1)
                        })
                    });
                    state.评论.list=state.评论.list.concat(list);
                    state.评论.total=x.data.data.total
                }
                state.评论.loading=false;
            }).catch(err=>{
                state.评论.loading=false;
            })
        },
        评价下一页({state,dispatch}){
            if(!state.评论.loading && state.评论.list.length<state.评论.total){
                state.评论.page_index++;
                dispatch('查询评价')
            }
        },
        查询点赞({},item){
            var userInfo=''
            try {
                userInfo=JSON.parse(localStorage.userInfo);
            } catch (error) {}
            if(userInfo){
                var query={
                    start:0,
                    length:10,
                    commentid:item.id,
                    userid:userInfo.username
                }
                api_查询评论点赞(query).then(x=>{
                    if(x.data.code==200){
                        item.是否点赞=x.data.data.data.length==0 ? 1 : 2
                    }
                })
            }
        },
        //列表专用
        通过username查询用户({}, item) {
            if(!item.userid) return;
            api_通过username查询用户(item.userid).then(x=>{
                if(x.data.code==200){
                    item.用户=x.data.data;
                }
            }).catch(err=>{})
        },
        //列表专用
        员工基本信息({ state }, item) {
            if(!item.clerksid) return;
            api_通过clerksid查询员工(item.clerksid).then(x=>{
                if(x.data.code==200){
                    item.店员 = x.data.data;
                }
            }).catch(err=>{})
        },

    },
    modules: {}
};
