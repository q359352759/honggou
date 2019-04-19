import axios from "./axios.js";
import qs from "qs";

const api_获取实名信息=(username)=>{
    return new Promise((resolve, reject) => {
        axios.get("/api-u/certification/findByUserid?userid=" + username).then(x => {
            resolve(x);
        }).catch(err => {
            reject(err);
        });
    });
}

export{
    api_获取实名信息
}