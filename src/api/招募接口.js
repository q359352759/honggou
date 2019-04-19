import axios from "@/api/axios.js";
import qs from "qs";

const api_根据id查询分销=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRecruitmentById/'+id).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_店铺招募订单列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRecruitmentOrderAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_获取业务类型列表=()=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/businessOptionsTypeGetFindAll').then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询招募列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRecruitmentAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_获取自定义业务=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopBusinessOptionsAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_修改招募信息=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateShopRecruitment',obj).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

export{
    api_根据id查询分销,
    api_店铺招募订单列表,
    api_查询招募列表,
    api_获取业务类型列表,
    api_获取自定义业务,
    api_修改招募信息
}