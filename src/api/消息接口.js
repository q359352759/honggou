import axios from "@/api/axios.js";
import qs from "qs";

const api_查询消息列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findMsgLoggingAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_修改消息=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateMsgLogging',obj).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

export{
    api_查询消息列表
}