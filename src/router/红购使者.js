
const 申请成为使者 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/红购使者/申请成为使者.vue"));
    });
};
const 红购使者 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/红购使者/红购使者.vue"));
    });
};
const 红购推广 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/红购使者/红购推广.vue"));
    });
};
const 推广赚钱 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/红购使者/推广赚钱.vue"));
    });
};
const 赚钱秘籍 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/红购使者/赚钱秘籍.vue"));
    });
};

const 悬赏记录 = resolve => {
    require.ensure([], () => {
        resolve(require("@/views/红购使者/悬赏记录.vue"));
    });
};

//commodity       开头
const list = [
    {
        path: "/shizhe/shenqing",
        name: "",
        component: 申请成为使者
    },
    {
        path: "/shizhe/honggoushizhe",
        name: "",
        component: 红购使者
    },
    {
        path: "/shizhe/tuiguang",
        name: "",
        component: 红购推广,
        meta: {
            无需登录: true
        }
    },
    {
        path: "/shizhe/tuiguangzhuanqian",
        name: "",
        component: 推广赚钱
    },
    {
        path: "/shizhe/zhuanqianmiji",
        name: "",
        component: 赚钱秘籍
    },
    {
        path: "/shizhe/xxjj",
        name: "",
        component: 悬赏记录
    }
];

export default list;
