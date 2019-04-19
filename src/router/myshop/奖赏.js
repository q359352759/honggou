
const 推广奖赏 =() =>import("@/views/myshop/奖赏/推广奖赏.vue");
const 添加悬赏 =() =>import("@/views/myshop/奖赏/添加悬赏.vue");
const 历史奖赏记录 =() =>import("@/views/myshop/奖赏/历史奖赏记录.vue");
const 奖赏规则 =() =>import("@/views/myshop/奖赏/奖赏规则.vue");

const list=[
    {
        path: "/myshop/js/tgjs",
        name: "",
        component: 推广奖赏
    },
    {
        path: "/myshop/js/tjjs",
        name: "",
        component: 添加悬赏
    },
    {
        path:"/myshop/js/jslsjl",
        name:"",
        component:历史奖赏记录
    },{
        path:"/myshop/js/jsgz",
        name:"",
        component:奖赏规则
    }
]
export default list;