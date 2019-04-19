import axios from './axios.js';
import qs from "qs";

const api_添加订单=(obj)=>{
    return axios.post('/api-s/shops/createOrders',obj);
}

const api_查询订单列表=(query)=>{
    return axios.get("/api-s/shops/findAllShopOrders", { params:query })
}

const api_查询待评价订单=(query)=>{
    return axios.get('/api-s/shops/orders/findNoRemarkOrder',{params:query})
}

const api_根据id查询订单=(id)=>{
    return axios.get("/api-s/shops/findShopOrdersById/" + id)
}

const api_微信内订单支付=(obj)=>{
    return axios.post("/api-s/shops/shoppingCopy",qs.stringify(obj))
}
const api_订单支付宝回调=(obj)=>{
    return axios.post('/api-s/shops/zhifubao/shopping',qs.stringify(obj))
}

const api_取消订单=(obj)=>{
    return axios.post("/api-s/shops/updateShopOrders", obj)
}

const api_商家确认取货=(id,shopid)=>{
    return axios.get('/api-s/shops/orders/confirmTheGoods?id='+id+'&shopid='+shopid)
}


export{
    api_添加订单,
    api_查询待评价订单,
    api_根据id查询订单,
    api_微信内订单支付,
    api_查询订单列表,
    api_取消订单,
    api_订单支付宝回调,
    api_商家确认取货
}
