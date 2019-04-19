import axios from "@/api/axios.js";
import qs from "qs";

const api_添加扫码奖赏记录=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addScanAwardRecord',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        }) 
    });
}

export{
    api_添加扫码奖赏记录
}