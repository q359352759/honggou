import axios from './axios.js';
import qs from "qs";

const api_获取验证码=(phone)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-n/notification-anon/codes?phone='+phone).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}


// username: 电话,
// password: 密码,
// phone: 电话,
// referrerid: 推荐人
// code:验证码
// key:验证码 key
const api_注册账号=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users-anon/register?phone='+obj.phone+"&key="+obj.key+"&code="+obj.code , obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

export{
    api_获取验证码,
    api_注册账号
}