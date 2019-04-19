import axios from "./axios.js";
import qs from "qs";

const api_添加收藏=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addUserFavorite',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_删除收藏=(list)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/deleteUserFavorite',list).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_查询收藏=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findDataUserFavorite',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

export{
    api_添加收藏,
    api_删除收藏,
    api_查询收藏
}