import axios from './axios.js';
import qs from "qs";

const api_通过username查询用户=(userid)=>{
    return axios.get("/api-u/users/findByUserid/" + userid)
}

const api_根据phone查询用户=(phone)=>{
    return axios.get('/api-u/users/findByPhone?phone='+phone)
}


export{
    api_通过username查询用户,
    api_根据phone查询用户
}