import axios from './axios.js';
import qs from "qs";

const api_代理人赏金体现=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/AgentAwardProfit',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

export{
    api_代理人赏金体现
}