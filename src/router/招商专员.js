const 申请招商专员 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/招商专员/申请招商专员.vue"));
    });
};

const 招商管理系统 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/招商专员/招商管理系统.vue"));
    });
};

const 团队建设 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/招商专员/团队建设.vue"));
    });
};
const list=[
    {
        path: "/zhuanyuan/shenqing",
        name: "",
        component: 申请招商专员,
        meta:{
            无需登录: true,
        }
    },{
        path:"/zhuanyuan/guanli",
        name:"",
        component:招商管理系统
    },{
        path:"/zhuanyuan/tuanduiJianshe",
        name:"",
        component:团队建设
    }
]

export default list;
