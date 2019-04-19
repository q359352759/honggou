import axios from './axios.js';
import qs from "qs";

const api_商家添加预定=(obj)=>{
    return axios.post('/api-s/shops/addShopReservationSet',obj)
}

const api_商家修改预定=(obj)=>{
    return axios.post('/api-s/shops/updateShopReservationSet',obj)
}

const api_根据shopid查询预定=(shopid)=>{
    return axios.get('/api-s/shops/findShopReservationSetByShopid?shopid='+shopid)
}

const api_添加预订=(obj)=>{
    return axios.post('/api-s/shops/addShopOrderReservation',obj)
}

const api_查询预订订单记录=(query)=>{
    return axios.get('/api-s/shops/findShopOrderReservationAll',{params:query})
}

const api_微信支付定金=(obj)=>{
    return axios.post('/api-s/shops/pay/shopOrdersReservation', qs.stringify(obj) )
}

const api_支付宝支付定金=(obj)=>{
    return axios.post('/api-s/shops/zhifubao/shopOrdersReservation', qs.stringify(obj) )
}

const api_修改预定订单=(obj)=>{
    return axios.post('/api-s/shops/updateShopOrderReservation',obj)
}

const api_根据id查询预定订单=(id)=>{
    return axios.get(`/api-s/shops/findShopOrderReservationById/${id}`)
}

export{
    api_商家添加预定,
    api_商家修改预定,
    api_根据shopid查询预定,
    api_添加预订,
    api_查询预订订单记录,
    api_微信支付定金,
    api_支付宝支付定金,
    api_修改预定订单,
    api_根据id查询预定订单
}