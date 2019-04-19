
const 配送列表 =() =>import("@/views/myshop/配送/配送列表.vue");
const 配送设置 =() =>import("@/views/myshop/配送/配送设置.vue");
const 配送员管理 =() =>import("@/views/myshop/配送/配送员管理.vue");
const 添加配送员 =() =>import("@/views/myshop/配送/添加配送员.vue");
const 商品配送 =() =>import("@/views/myshop/配送/商品配送.vue");
const 配送店铺 =() =>import("@/views/myshop/配送/配送店铺.vue");

const list=[
    {
        path: "/myshop/ps/pslb",
        name: "",
        component: 配送列表
    },{
        path:"/myshop/ps/pssz",
        name:"",
        component:配送设置
    },{
        path:"/myshop/ps/psygl",
        name:"",
        component:配送员管理
    },{
        path:"/myshop/ps/tjpsy",
        name:"",
        component:添加配送员
    },{
        path:"/myshop/ps/spps",
        name:"",
        component:商品配送
    },{
        path:"/myshop/ps/psdp",
        name:"",
        component:配送店铺
    }
]
export default list;