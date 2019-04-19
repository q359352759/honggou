import axios from "@/api/axios.js";
import qs from "qs";


/**
 *  areaCode: "", //区域code
    realName: "", //真实姓名
    userid: "",
    phone: "",
    openid: ""  
*/
const api_申请红购使者 = (obj) => {
    return new Promise((resolve, reject) => {
        axios.post('/api-u/agentUser/addUnofficialAgent', obj).then(x => {
            resolve(x)
        }).catch(err => {
            reject(err)
        })
    });
}



export {
    api_申请红购使者
}