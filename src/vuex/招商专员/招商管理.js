
import { api_专员团队列表 , api_团队统计 , api_查询推荐代理商列表} from "@/api/招商专员接口.js";

const 招商团队={
    query:{
        start:0,
        length:15,
        leid:""
    },
    page_index:0,
    list:[],
    loading:true,
    total:0
}
const 招商团队统计={
    代理商人数:0,
    直推奖:0,
    总收益:0
}
const 推荐代理商={
    query:{
        start:0,
        length:15,
        leid:""
    },
    page_index:0,
    list:[],
    loading:true,
    total:0
}
export default {
    namespaced: true,
    state: {
        显示类型:0,
        是否定位:false,
        显示密码输入框:false,

        招商团队:{
            query:{
                start:0,
                length:15,
                leid:""
            },
            page_index:0,
            list:[],
            loading:true,
            total:0
        },
        招商团队统计:{
            代理商人数:0,
            直推奖:0,
            总收益:0
        },
        推荐代理商:{
            query:{
                start:0,
                length:15,
                leid:""
            },
            page_index:0,
            list:[],
            loading:true,
            total:0
        }
    },
    getters: {
        显示类型(state){
            return state.显示类型
        },
        是否定位(state){
            return state.是否定位
        },
        显示密码输入框(state){
            return state.显示密码输入框;
        },
        招商团队(state){
            return state.招商团队;
        },
        招商团队统计(state){
            return state.招商团队统计
        }
    },
    mutations: {
        
    },
    actions: {
        数据初始化({state,dispatch},username){
            state.招商团队=Object.assign({},招商团队);
            state.招商团队.query.leid=username;
            state.招商团队统计=Object.assign({},招商团队统计);
            state.推荐代理商=Object.assign({},推荐代理商);
            state.推荐代理商.query.leid=username;        
            Promise.all([
                dispatch('专员团队列表'),
                dispatch('团队统计',username),
                dispatch('查询推荐代理商列表')
            ]).then(x=>{
            }).catch(err=>{
                console.log(err);
            })
        },
        专员团队列表({state}){
            return new Promise((resolve, reject) => {
                api_专员团队列表(state.招商团队.query).then(x=>{
                    if(x.data.code==200){
                        var list=x.data.data;
                        state.招商团队.list=state.招商团队.list.concat(list);
                        if(list.length>0){
                            state.招商团队.total=list[0].total;
                        }
                    }
                    state.招商团队.loading=false;
                    resolve()
                }).catch(err=>{
                    state.招商团队.loading=false;
                    reject()
                })
            });
        },
        团队统计({state},username){
            return new Promise((resolve, reject) => {
                api_团队统计(username).then(x=>{
                    console.log('团队统计',x)
                    if(x.data.code==200){
                        state.招商团队统计=x.data.data;
                    }
                    resolve()
                }).catch(err=>{
                    reject(err)
                })
            });
        },
        查询推荐代理商列表({state}){
            return new Promise((resolve, reject) => {
                api_查询推荐代理商列表(state.推荐代理商.query).then(x=>{
                    console.log('查询推荐代理商',x)
                    resolve()
                }).catch(err=>{
                    reject();
                })
            });
        },
        //==================
        设置显示类型({state},type){
            state.显示类型=type;
        },
        设置定位({state},type){
            state.是否定位=type;
        },
        设置显示密码输入框({state},type){
            state.显示密码输入框=type;
        },
    },
    modules: {
        
    }
};
