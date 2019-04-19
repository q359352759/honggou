import axios from './axios.js';
import qs from "qs";

const api_通过clerksid查询员工=(clerksid)=>{
    return new Promise((resolve, reject) => {
        axios.get("/api-s/shops/findShopClerksByClerksid?clerksid=" + clerksid).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err)
        });
    });
}

export{
    api_通过clerksid查询员工
}