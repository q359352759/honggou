import axios from './axios.js';
import qs from "qs";

const api_登录=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/sys/login',qs.stringify(obj)).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        }) 
    });
}

const 根据access_token获取用户信息=(access_token)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/current?access_token='+access_token).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

export{
    api_登录,
    根据access_token获取用户信息
}
