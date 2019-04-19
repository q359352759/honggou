import axios from "@/api/axios.js";
import qs from "qs";
const api_绑定推送=(obj)=>{
    console.log('绑定传递传输：'+JSON.stringify(obj));
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users/addUserCid',obj).then(x=>{
            console.log('绑定推送:'+JSON.stringify(x))
            resolve(x)
        }).catch(err=>{
            console.log('绑定推送错误:'+JSON.stringify(err));
            reject(err)
        })
    });
}

const api_退出推送=(userid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/cidNoUnlone?userid='+userid).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

export{
    api_绑定推送,
    api_退出推送
}