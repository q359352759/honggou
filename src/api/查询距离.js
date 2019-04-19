import axios from './axios.js';
import qs from "qs";


const api_查询两点距离=(query)=>{
    // var query = {
//     destinations:y +"," + x, //起点
//     origins: y + "," + x    //终点
// };
    return new Promise((resolve, reject) => {
        axios.get("/api-u/baidu/routematrix",{params:query}).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

export{
    api_查询两点距离,
}