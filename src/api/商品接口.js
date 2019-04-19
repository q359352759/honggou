import axios from './axios.js';
import qs from "qs";

const api_获取商品列表=(query)=>{
    return axios.get('/api-s/shops/commodity/findAll',{params:query}) 
}

const api_根据id查询商品=(id)=>{
    return axios.get("/api-s/shops/commodity/findById/" + id)
}

const api_添加商品=(obj)=>{
    return axios.post("/api-s/shops/commodity/add", obj)
}

const api_修改商品=(商品列表)=>{
    return new Promise((resolve, reject) => {
        var loginDate = JSON.parse(localStorage.loginDate);
        axios({
            url: "/api-s/shops/commodity/update",
            method: "post",
            headers: {
                Authorization: "Bearer " + loginDate.access_token
            },
            data: 商品列表
        }).then(x => {
            resolve(x);
        }).catch(err => {
            reject(err);
        });
    });
}

const api_删除商品=(id)=>{
    return axios.get("/api-s/shops/commodity/" +id)
}

const api_添加商品分组=(obj)=>{
    return axios.post('/api-s/shops/addCommodityGroup',obj)
}

const api_修改商品分组=(list)=>{
    return axios.post('/api-s/shops/updateCommodityGroup',list)
}

const api_删除商品分组=(id)=>{
    return axios.get('/api-s/shops/deleteCommodityGroupById',{params:{'id':id}})
}
const api_查询商品分组列表=(query)=>{
    return axios.get('/api-s/shops/findCommodityGroupAll',{params:query})
}

export{
    api_获取商品列表,
    api_根据id查询商品,
    api_添加商品,
    api_修改商品,
    api_删除商品,
    api_添加商品分组,
    api_修改商品分组,
    api_删除商品分组,
    api_查询商品分组列表
}