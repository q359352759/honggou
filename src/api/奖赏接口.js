import axios from './axios.js';
import qs from "qs";

const api_添加奖赏=(obj)=>{
    return axios.post('/api-s/shops/addShopAwardCommodity',obj)
}

const api_修改奖赏=(obj)=>{
    return axios.post('/api-s/shops/updateShopAwardCommodity',obj)
}

const api_删除奖赏=(id)=>{
    return axios.get('/api-s/shops/deleteShopAwardCommodityById/'+id)
}


const api_根据id查询奖赏=(id)=>{
    return axios.get('/api-s/shops/findShopAwardCommodityById/'+id)
}

const api_查询奖赏列表=(query)=>{
    return axios.get('/api-s/shops/findShopAwardCommodityAll',{params:query})
}

const api_查询代理奖赏收益=(agentid)=>{
    return axios.get('/api-s/shops/findAgentAwardProfitByAgentid?agentid='+agentid);
}

const api_查询奖赏记录=(query)=>{
    return axios.get('/api-s/shops/findShopCommodityAwardAll',{params:query})
}

const api_查询奖赏历史记录=(query)=>{
    return axios.get('/api-s/shops/findShopAwardCommodityHistoryAll',{params:query})
}
export{
    api_添加奖赏,
    api_修改奖赏,
    api_删除奖赏,
    api_根据id查询奖赏,
    api_查询奖赏列表,
    api_查询代理奖赏收益,
    api_查询奖赏记录,
    api_查询奖赏历史记录
}