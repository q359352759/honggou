

const 奖赏商品={
        query:{
            start:0,
            length:20,
            areaCode:'',
        },
        list:[],
        total:0,
        page_index:0,
        loading:true
    }
const 奖赏收益={
    agentid:"",
    amount:0,   //总计奖赏
    amountWithdrawn:0,  //已提现金额 
    balance:0,  //余额
}
import { api_查询奖赏列表 , api_查询代理奖赏收益} from "@/api/奖赏接口.js";
import { api_根据id查询商品 } from "@/api/商品接口.js";
import { api_根据shopid查询店铺 } from "@/api/店铺接口.js";
import { api_根据商品id查询专享 } from "@/api/专享接口.js";
export default {
    namespaced: true,
    state: {
        奖赏商品:奖赏商品,
        代理商:'',
        奖赏收益:奖赏收益
    },
    getters: {
        奖赏所有数据(state){
            return state
        }
    },
    mutations: {},
    actions: {
        奖赏初始化({state,dispatch},代理商){
            console.log('赏金初始化')
            state.代理商=代理商;
            state.奖赏商品=JSON.parse(JSON.stringify(奖赏商品));
            state.奖赏收益=Object.assign({},奖赏收益);
            state.奖赏商品.query.areaCode=代理商.areaCode;
            dispatch('查询奖赏商品');
            dispatch('查询收益');
        },
        查询收益({state}){
            api_查询代理奖赏收益(state.代理商.userid).then(x=>{
                if(x.data.code==200 && x.data.data){
                    state.奖赏收益=x.data.data
                }
            }).catch(err=>{})
        },
        查询奖赏商品({state}){
            state.奖赏商品.loading=true;
            state.奖赏商品.query.start=state.奖赏商品.page_index*state.奖赏商品.query.length;
            api_查询奖赏列表(state.奖赏商品.query).then((x) => {
                if(x.data.code==200){
                    var list=x.data.data.data;
                        list.forEach(item => {
                            item.商品='';
                            item.店铺='';
                            item.专享="";
                            api_根据id查询商品(item.commodityid).then(r=>{
                                item.商品=r.data.code==200 ? r.data.data : '';
                            }).catch(err=>{})
                            api_根据shopid查询店铺(item.shopid).then(r=>{
                                item.店铺=r.data.code==200 ? r.data.data : '';
                            }).catch(err=>{})
                            api_根据商品id查询专享(item.commodityid).then(r=>{
                                item.专享=(r.data.code==200 && r.data.data.length>0) ? r.data.data[0] : ''
                            })
                        });
                    state.奖赏商品.list=list;
                    state.奖赏商品.total=x.data.data.total;
                }
                state.奖赏商品.loading=false
            }).catch((err) => {
                state.奖赏商品.loading=false
            });
        },
        查询奖赏下一页({state,dispatch}){
            if(!state.奖赏商品.loading && state.奖赏商品.list.length<state.奖赏商品.total){
                state.奖赏商品.page_index++;
                dispatch('查询奖赏商品')
            }
        }
    },
    modules: {}
};
