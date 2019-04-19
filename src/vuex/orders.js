
import order from "@/vuex/orders/order.js"; //支付订单界面用
import orderList from "@/vuex/orders/orderList.js"; //我的订单 列表
import 订单搜索记录 from "@/vuex/orders/订单搜索记录.js"; //我的订单 列表
export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        order: order,
        orderList: orderList,
        订单搜索记录:订单搜索记录
    }
};
