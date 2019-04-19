
import { api_根据id查询商品 } from "@/api/商品接口.js";
import { api_根据商品id查询专享 } from "@/api/专享接口.js";
import { api_查询红包列表 } from "@/api/红包接口.js";
const 商品={
    id: "",
    shopid: "",         //店铺Id
    name: "",           //商品名
    unit: "份",         //单位
    marketPrice: "",    //市场价
    sellingPrice: "",   //售价
    twtreid: 2,         //红包省钱方式 1 % 2具体金额
    deduction: "",      //省钱金额
    percentage: "",     //省钱比例
    commissionType: 2,  //分佣类型	1 % 2具体金额 用于显示
    commission: "",     //分佣金额
    commissionPercentage: "", //分佣比例 填写百分比
    img: "",            //照片
    arrImg: [],         //添加时候使用
    remark: "",         //描述
    sequence: "",       //序号
    createTime: "",
    updataTime: "",
    state: 1 ,          //0未下架 1位上架
    groupid:"",         //分组Id
    stock:0,            //库存
    isstock:0,          //是否开启库存
    sort:0              //排序
}
const 专享商品={
    shopid: "", //店铺id
    commodityId: "", //商品id
    type: 0, //0新人 1生日
    typeName: "", //
    deduction: "", //省钱金额
    percentage: "", //计算出来的百分比
    maxNumber: "",
}
export default {
	namespaced: true,
	state: {
        是否重新获取数据:true,
        商品id:"",
        选择图片类型:1,         //1商品图片 2表示介绍图片
		商品:{
            id: "",
            shopid: "",         //店铺Id
            name: "",           //商品名
            unit: "份",         //单位
            marketPrice: "",    //市场价
            sellingPrice: "",   //售价
            twtreid: 2,         //红包省钱方式 1 % 2具体金额
            deduction: "",      //省钱金额
            percentage: "",     //省钱比例
            commissionType: 2,  //分佣类型	1 % 2具体金额 用于显示
            commission: "",     //分佣金额
            commissionPercentage: "", //分佣比例 填写百分比
            img: "",        //照片
            arrImg: [],     //添加时候使用
            remark: "",     //描述
            sequence: "",   //序号
            createTime: "",
            updataTime: "",
            state: 1,           //0未下架 1位上架
            groupid:"",         //分组Id
            stock:0,
            isstock:0,          //是否开启库存
            sort:0,                  //排序
            isconsult:0         //是否查阅
        },
        专享商品: {
            shopid: "", //店铺id
            commodityId: "", //商品id
            type: 0, //0新人 1生日
            typeName: "", //
            deduction: "", //省钱金额
            percentage: "", //计算出来的百分比
            maxNumber: "",
        },
        是否专享:false,
        商品红包:"",
	},
	getters: {
        商品红包(state){
            return state.商品红包
        },
        是否专享(state){
            return state.是否专享;
        },
		商品(state){
            return state.商品
        },
        选择图片类型(state){
            return state.选择图片类型
        },
        专享商品(state){
            return state.专享商品
        },
        是否重新获取数据(state){
            return state.是否重新获取数据
        }
	},
	mutations: {
        设置图片选择类型(state,type){
            state.选择图片类型=type
        },
        选择专享抵扣类型(state,type){
            if (!state.是否专享) {
                state.是否专享 = true;
                state.专享商品.type = type
            } else {
                if (state.专享商品.type == type) {
                    state.是否专享 = false;
                } else {
                    state.专享商品.type = type
                }
            }
        }
    },
	actions: {
        设置选择的分组id({state},id){
            state.商品.groupid=id;
        },
		数据初始化({state , rootGetters ,rootState},id){
            return new Promise((resolve, reject) => {
                if(!state.是否重新获取数据){
                    resolve();
                    return
                }
                console.log('继续下一步')
                state.商品id=id;
                state.商品=Object.assign({},商品);
                state.专享商品=Object.assign({},专享商品);
                state.是否专享=false;
                //没有商品id
                if(!state.商品id){
                    resolve();
                    return
                }
                var 店铺=rootGetters['get_myshop']
                var 查询红包_qyery={
                        shopid: 店铺.shopid,
                        start: 0,
                        length: 100,
                        ccc: 1,
                        type: 1,
                        commodityId:state.商品id
                    }
                Promise.all([
                    api_根据id查询商品(state.商品id),
                    api_根据商品id查询专享(state.商品id),
                    api_查询红包列表(查询红包_qyery)
                ]).then(x=>{
                    if(x[0].data.code==200){
                        var 商品=x[0].data.data;
                            商品.arrImg=商品.img.split(',');
                            rootState.Select_picture.list = 商品.arrImg
                            // this.$store.state.Select_picture.list = this.商品.arrImg;
                            商品.stock=商品.stock ? 商品.stock : 0; 
                            商品.isstock=商品.isstock ? 商品.isstock : 0;
                        state.商品=商品;
                    }
                    if (x[1].data.code == 200) {
                        if (x[1].data.data.length > 0) {
                            state.专享商品 = x[1].data.data[0];
                            state.是否专享 = true;
                        }
                    }
                    if(x[2].data.code==200){
                        state.商品红包=x[2].data.data.data.length>0 ? x[2].data.data.data : '' 
                    }
                    resolve()
                }).catch(err=>{
                    reject()
                })
            });
        },
        设置是否重新获取数据({state},type){
            state.是否重新获取数据=type
        },
        
	},
	modules: {}
};
