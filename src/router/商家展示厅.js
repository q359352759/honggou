const 商家展示厅 = () => import("@/views/商家展示厅/商家展示厅2.vue");
const 确认支付 = () => import("@/views/商家展示厅/确认支付.vue");
const 输入金额买单 = () => import("@/views/商家展示厅/输入金额买单.vue");


const 商家点单 = () => import("@/views/商家点单/商家点单.vue");
const 商家点单确认支付 = () => import("@/views/商家点单/确认支付.vue");

const BusinessDetails = resolve => {require.ensure([], () => {resolve(require("@/views/商家展示厅/BusinessDetails.vue"));});};
const list=[
    {
        path: "/sjzst2",
        name: "",
        component: 商家展示厅,
        meta: {
            无需登录: true
        }
    },
    //保留原有路由方便旧二维码使用
    {
        path: "/BusinessDetails",
        name: "",
        // component: BusinessDetails,
        component: 商家展示厅,
        meta: {
            无需登录: true
        }
    },
    {
        path: "/sjzst2/qrzf",
        name: "",
        component: 确认支付,
    },
    {
        path: "/sjzst2/zzmd",
        name: "",
        component: 输入金额买单,
    },
    //商家点单
    {
        path:'/sjdd',
        name:"",
        component:商家点单,
        meta: {
            无需登录: true
        }
    },{
        path:'/sjdd/qrzf',
        name:"",
        component:商家点单确认支付
    }
]

export default list;