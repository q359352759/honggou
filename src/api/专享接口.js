import axios from './axios.js';
import qs from "qs";

const api_查询专享列表=(query)=>{
    return axios.get("/api-s/shops/findAllExclusive",{params:query})
}

const api_添加专享=(obj)=>{
    return axios.post("/api-s/shops/addShopExclusive", obj)
}

const api_修改专享=(专享)=>{
    return axios.post("/api-s/shops/updateShopExclusive", 专享)
}

const api_删除专享=(id)=>{
    return axios.get("/api-s/shops/deleteShopExclusive/" + id)
}

const api_根据商品id查询专享=(商品id)=>{
    return axios.get("/api-s/shops/findExclusiveByCommodityId/" + 商品id)
}

const api_用户是否享受新人专享=(query)=>{
    return axios.get('/api-s/shops/counForNewUserExlusive',{params:query})
}

const api_用户是否享受生日专享=(query)=>{
    return axios.get('/api-s/shops/countForBrithdayExlusive',{params:query})
}

export{
    api_查询专享列表,
    api_添加专享,
    api_修改专享,
    api_删除专享,
    api_根据商品id查询专享,
    api_用户是否享受新人专享,
    api_用户是否享受生日专享
}