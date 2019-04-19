import axios from "./axios.js";
import qs from "qs";

const api_获取代理商信息=(userid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/areaManager/findme?userid='+userid).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_获取代理商列表=(query)=>{
    return new Promise(function (resolve, reject) {
        axios.get('/api-u/areaManager/findAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_代理商申请支付微信=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users/weixinpay/addAreaManagerPay',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}



export{
    api_获取代理商信息,
    api_获取代理商列表,
    api_代理商申请支付微信,
}