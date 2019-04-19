import axios from './axios.js';
import qs from "qs";

const api_用户领取红包=(obj)=>{
    //也就是添加卡包
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addUserCardPackge',obj).then(x=>{
            resolve(x)
        }).catch(err=>{

        })
    });
}

const api_查询卡包=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get("/api-s/shops/findEffective", { params: query }).then(x => {
            resolve(x);
        }).catch(err => {
            resolve(err);
        });
    });
}

const api_查询红包列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/redenvelope/findAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });   
}

const api_获取用户平台红包=(userind)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/invitedsutotal/findByUserid/'+userind).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

export{
    api_用户领取红包,
    api_查询卡包,
    api_查询红包列表,
    api_获取用户平台红包
}