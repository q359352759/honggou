import axios from "@/api/axios.js";
import qs from "qs";

const api_获取收款账号=(username)=>{
    return new Promise((resolve, reject) => {
        axios.get("/api-u/users/findAccount?userid=" + username).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err)
        });
    });
}

export{
    api_获取收款账号
}