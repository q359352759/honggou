const 主键设置 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/设置/主键设置.vue"));
    });
};

const 收货地址 = () => import("@/views/设置/收货地址.vue");
const 添加收货地址 = () => import("@/views/设置/添加收货地址.vue");
const 配送收货地址 = () => import("@/views/设置/配送收货地址.vue");
const 添加配送地址 = () => import("@/views/设置/添加配送地址.vue");
const 配送地址地图 = () => import("@/views/设置/配送地址地图.vue");
const list = [
    {
        path: "/shezhi/zhujianshezhi",
        name: "",
        component: 主键设置
    },
    {
        path:'/shezhi/shdz',
        name:"",
        component:收货地址
    },{
        path:'/shezhi/tjdz',
        name:"",
        component:添加收货地址
    },{
        path:"/shezhi/psdz",
        name:"",
        component:配送收货地址
    },{
        path:"/shezhi/tjshdz",
        name:"",
        component:添加配送地址
    },{
        path:"/shezhi/psdzdt",
        name:"",
        component:配送地址地图
    }
];

export default list;
