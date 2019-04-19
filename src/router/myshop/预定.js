
const 预定列表 =() =>import("@/views/myshop/预定/预定列表.vue");
const 预定设置 =() =>import("@/views/myshop/预定/预定设置.vue");

const list=[
    {
        path: "/myshop/yd/ydlb",
        name: "",
        component: 预定列表
    },{
        path:"/myshop/yd/ydsz",
        name:"",
        component:预定设置
    }
]
export default list;