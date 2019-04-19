import axios from './axios.js';
import qs from "qs";


const api_接口1=(obj)=>{
    return axios.post('../接口名称',obj)
}

const api_接口4=(obj)=>{
    return axios.post('../接口名称',qs.stringify(obj))
}

const api_接口2=(obj)=>{
    return axios.get('../接口名称',{params:obj})
}

const api_接口3=(obj)=>{
    return axios.get('../接口名称',obj)
}

var list=[
    {id:1,num:10},
    {id:2,num:10},
    {id:3,num:10}
]


api_接口1(list);




api_接口2({'num':10})

api_接口3({params:{num:10}})