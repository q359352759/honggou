import { api_查询排号 , api_查询排号商品 } from "@/api/点单接口.js";
import { api_根据id查询商品 } from "@/api/商品接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";
import { api_查询红包列表 , api_查询卡包 , api_获取用户平台红包} from "@/api/红包接口.js";
import { api_根据商品id查询专享 , api_用户是否享受新人专享 , api_用户是否享受生日专享 } from "@/api/专享接口.js";

import { openloading , 当前时间格式化 } from "@/assets/js/currency.js";
export default {
    namespaced: true,
    state: {
        userInfo:"",
        shopid:"",
        用户排号:{
            查询成功:false,
            详情:""
        },
        用户排号商品:[],
        购买商品列表:[],
        店铺信息:"",
        用户红包:[],
        用户平台红包:"",
        
        最佳抵扣规则:0,
        是否手动选择类型:false
    },
    getters: {
        排号全部信息(state){
            return state
        },
        用户排号(state){
            return state.用户排号
        },
        
        带抵扣购买商品(state){
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
    mutations: {},
    actions: {
        async 排号初始化({state,dispatch}){
            
            openloading(true);
            state.购买商品列表=[];
            state.店铺信息=''
            state.用户红包=[];
            state.用户平台红包='';
            try {
                state.userInfo=JSON.parse(localStorage.userInfo);
            } catch (error) {
                state.用户排号={
                    查询成功:true,
                    详情:""
                }
                openloading(false);
                return
            }

            await dispatch('查询用户排号');
            state.shopid=state.用户排号.查询成功 ? state.用户排号.详情.shopid :"";
            dispatch('获取用户红包');
            if(state.用户排号.详情){
                api_根据shopid查询店铺(state.用户排号.详情.shopid).then(x=>{
                    state.店铺信息=x.data.code==200 ? x.data.data : '';
                })
            }
            
            
            var list= state.用户排号.详情 ? state.用户排号.详情.shopRowNumberCommodities : [];
            for (let i = 0; i < list.length; i++) {
                api_根据id查询商品(list[i].commodityid).then(x=>{
                    var 商品返回值=x
                    var 商品=商品返回值.data.code==200 ? 商品返回值.data.data : '';
                        商品.专享商品="";
                        商品.使用红包=[];
                        商品.可享受新人专享=false;
                        商品.可享受生日专享=false;
                        商品.商品红包='';
                        let 查询红包_query={
                            start:0,
                            length:1000,
                            // shopid:state.shopid,
                            // type:0,
                            ccc:1,
                            commodityId:商品.id
                        }
                        api_查询红包列表(查询红包_query).then(r=>{
                            商品.商品红包=(r.data.code==200 && r.data.data.data.length>0) ? r.data.data.data[0] :'';
                        })
                        if(商品.EXID){
                            api_根据商品id查询专享(商品.id).then(r=>{
                                商品.专享商品=(r.data.code==200 && r.data.data.length>0) ? r.data.data[0] : ""
                            })
                        }
                        if(state.userInfo && 商品.EXID){
                            var query = {
                                userid: state.userInfo.username,
                                commodityid: 商品.id
                            };
                            if(商品.EXTYPE==0){
                                api_用户是否享受新人专享(query).then(r=>{
                                    商品.可享受新人专享=r.data.code==200
                                })
                            }
                            if(商品.EXTYPE==1){
                                api_用户是否享受生日专享(query).then(r=>{
                                    商品.可享受生日专享=r.data.code==200;
                                })
                            }
                        }
                    list[i].商品=商品
                    for (let j = 0; j < list[i].num; j++) {
                        state.购买商品列表.push(商品)
                    }
                })
            }
            openloading(false)
        },
        查询用户排号({state}){
            return new Promise((resolve, reject) => {
                if(!state.userInfo){
                    state.用户排号={
                        查询成功:true,
                        详情:""
                    }
                    resolve()
                }else{
                    var query={
                        userid:state.userInfo.username,
                        start:0,
                        length:1000,
                        // stateb:""
                    }
                    api_查询排号(query).then(x=>{
                        if(x.data.code==200){
                            var list=x.data.data.data.length>0 ? x.data.data.data[0] : '';
                                list=list.ordersid ? "" : list;
                            if(list){
                                // list.shopRowNumberCommodities = list.shopRowNumberCommodities.filter(x=>x.state!=2);
                                list.shopRowNumberCommodities.forEach(item => {
                                    item.商品='';
                                    // api_根据id查询商品(item.commodityid).then(r=>{
                                    //     item.商品=r.data.code==200 ? r.data.data : '';
                                    // })
                                });
                            }
                            state.用户排号={
                                查询成功:true,
                                详情:list
                            }
                        }else{
                            state.用户排号={
                                查询成功:false,
                                详情:""
                            }
                        }
                        resolve()
                    }).catch(err=>{
                        state.用户排号={
                            查询成功:false,
                            详情:""
                        }
                        reject();
                    })
                }
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
    },
    modules: {
    }
};
