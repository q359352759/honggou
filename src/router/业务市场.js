const 业务市场 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/业务市场/业务市场.vue"));
    });
}; 

const 店铺分类 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/业务市场/店铺分类.vue"));
    });
};

const 全部类型 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/业务市场/全部类型.vue"));
    });
};
const 分销详情 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/业务市场/分销详情.vue"));
    });
};
const list=[
    {
        path: "/yewushichang",
        name: "",
        component: 业务市场
    },
    {
        path: "/yewushichang/dianpufenlei",
        name: "",
        component: 店铺分类
    },
    {
        path: "/yewushichang/quanbuleixin",
        name: "",
        component: 全部类型
    },
    {
        path: "/yewushichang/xiangqing",
        name: "",
        component: 分销详情
    },
]
export default list;
