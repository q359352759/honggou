

export default {
    namespaced: true,
    state: {
        定位坐标:{
            x:0,
            y:0
        },
        主键按钮:[
            {name:'主页','id':1,'icon':'icon-zhuye'},
            {name:'我的',id:2,"icon":"icon-gerenzhongxin"},
            {name:'消息',id:3,"icon":"icon-message"},
            {name:'代理',id:4,"icon":"icon-hezuowoshou_fuzhi"},
            {name:'店铺',id:5,"icon":"icon-dianpu1"},
            {name:'订单',id:6,"icon":"icon-dingdan"},
            {name:'分类',id:7,"icon":"icon-fenlei"},
            {name:'收藏',id:8,"icon":"icon-shoucang2"},
            {name:'资产',id:9,"icon":"icon-zichan"},
            {name:'足迹',id:10,"icon":"icon-zuji"},
        ],
        新主键按钮:[
            {name:'主页','id':1,'icon':'icon-zhuye'},
            {name:'我的',id:2,"icon":"icon-gerenzhongxin"},
            {name:'消息',id:3,"icon":"icon-message"},
            {name:'店铺',id:5,"icon":"icon-dianpu1"},
            {name:'订单',id:6,"icon":"icon-dingdan"},
            {name:'分类',id:7,"icon":"icon-fenlei"},
            {name:'收藏',id:8,"icon":"icon-shoucang2"},
            {name:'资产',id:9,"icon":"icon-zichan"},
            {name:'足迹',id:10,"icon":"icon-zuji"},
            {name:'代理',id:4,"icon":"icon-hezuowoshou_fuzhi"},
        ],
        是否通过审核:false,
        是否显示提示:false,
        展开:false,
    },
    getters: {
        主键按钮(state){
            if(state.是否通过审核){
                return state.主键按钮
            }else{
                return state.新主键按钮
            }
        },
        定位坐标(state){
            return state.定位坐标
        },
        是否显示提示(state){
            return state.是否显示提示
        },
        展开(state){
            return state.展开
        }
    },
    mutations: {
        保存主键按钮(state,list){
            state.主键按钮=list;
        },
        保存坐标(state,obj){
            state.定位坐标=obj;
        },
        设置是否显示提示(state){
            var zhujiantishi=localStorage.zhujiantishi;
            if(zhujiantishi){
                state.是否显示提示=false;
            }else{
                state.是否显示提示=true;
                state.展开=true;
            }
        },
        隐藏提示(state){
            localStorage.zhujiantishi=1;
            state.是否显示提示=false;
        },
        设置是否展开(state,type){
            state.展开=type;
            if(!type){
                localStorage.zhujiantishi=1;
                state.是否显示提示=false;
            }
        }
    },
    actions: {
        主键初始化({state,rootGetters}){
            var 是否通过审核=rootGetters['版本信息/是否通过审核'];
            state.是否通过审核=是否通过审核
        },
        
    },
    modules: {}
};
