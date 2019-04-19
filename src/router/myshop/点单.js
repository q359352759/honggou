
const 点单管理 = resolve => { require.ensure([], () => { resolve(require("@/views/myshop/点单管理/点单管理.vue")); }); };
const 制作员 =() =>import("@/views/myshop/点单管理/制作员.vue");
const 添加制作员 =() =>import("@/views/myshop/点单管理/添加制作员.vue");
const 生成号牌 =() =>import("@/views/myshop/点单管理/生成号牌.vue");
const 点单制作 =() =>import("@/views/myshop/点单管理/点单制作.vue");
const 点单制作统计 =() =>import("@/views/myshop/点单管理/点单制作统计.vue");

const list=[
    {
        path: "/myshop/ddgl/ddgl",
        name: "",
        component: 点单管理
    },
    {
        path:"/myshop/ddgl/zzy",
        name:"",
        component:制作员
    },{
        path:'/myshop/ddgl/tjzzy',
        name:"",
        component:添加制作员
    },{
        path:'/myshop/ddgl/schp',
        name:"",
        component:生成号牌,
        meta: {
            不能返回上一页: true,
        }
    },{
        path:"/myshop/ddgl/ddzz",
        name:"",
        component:点单制作,
        meta: {
            可以下拉刷新: true,
        }
    },{
        path:"/myshop/ddgl/zztj",
        name:"",
        component:点单制作统计
    }
]
export default list;