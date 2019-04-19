import axios from './axios';
import qs from "qs";

const api_申请代理人支付宝支付 = (obj) => {
    return new Promise((resolve, reject) => {
        // axios.post('/api-u/users/zhifubao/AgentPay',qs.stringify(obj)).then(x=>{
        axios.post('/api-u/users/zhifubao/AgentPay', obj).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err);
        })
    });
}

const api_红购使者申请代理人支付宝支付=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users/zhifubao/UnofficialAgenttobeAgentUser',obj).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_红购使者申请代理人微信支付=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users/weixinpay/UnofficialAgenttobeAgentUser',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询代理人列表 = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('/api-u/agentUser/find', { params: query }).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err)
        })
    });
}

const api_根据userid查询代理人信息 = (username) => {
    return new Promise((resolve, reject) => {
        axios.get("/api-u/agentUser/me?userid=" + username).then(x => {
            resolve(x);
        }).catch(err => {
            resolve(err);
        });
    });
}

const api_通过电话获取代理人 = (phone) => {
    return new Promise((resolve, reject) => {
        axios.get("/api-u/agentUser/selectOne?phone=" + phone).then(x => {
            resolve(x);
        }).catch(err => {
            reject(err);
        });
    });
}

const api_获取商家分润列表 = (query) => {
    return new Promise((resolve, reject) => {
        axios.get("/api-s/shops/sumForAgentProfit", { params: query }).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err);
        });
    });
}
const api_获取会员分润列表 = (query) => {
    return new Promise((resolve, reject) => {
        axios.get("/api-s/shops/userSumForAgentProfit", { params: query }).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err)
        });
    });
}

const api_查询代理人分润=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get("/api-s/shops/findAgentsShareProfitByUseridAndUserType", {params: query}).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err);
        });
    });
}

export {
    api_申请代理人支付宝支付,
    api_红购使者申请代理人支付宝支付,
    api_红购使者申请代理人微信支付,
    api_查询代理人列表,
    api_根据userid查询代理人信息,
    api_通过电话获取代理人,
    api_获取商家分润列表,
    api_获取会员分润列表,
    api_查询代理人分润
}