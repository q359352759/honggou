import axios from "./axios.js";
import qs from "qs";

const api_获取店铺类型=()=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/tree/findAll').then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_根据shopid查询店铺=(shopid)=>{
    return new Promise((resolve, reject) => {
        axios.get("/api-s/shops/findByShopid/" + shopid).then(x => {
            resolve(x);
        }).catch(err => {
            reject(err);
        });
    });
}

const api_查询店铺=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findAll',{params:query}).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}
const api_店铺修改列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/update/findAll',{params:query}).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_店铺添加人气=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post("/api-s/shops/addShopBasicsPopularity", qs.stringify(obj)).then(x => {
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_获取顾客列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopCustomerAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询店铺评分=(shopid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/commodityScoreAvg?shopid='+shopid).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询店铺服务类型=()=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/type/findAll?start=0&length=1000').then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_查询店铺公告=(shopid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/shopAnnouncement/'+shopid).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_店铺简介=(shopid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/synopsis/'+shopid).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_修改店铺=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.put('/api-s/shops/update',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_添加店铺修改表=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/update/add',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_修改店铺修改表数据=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/update/update',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询店铺修改表列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/update/findAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_根据userid查询修改表数据=(userid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/update/finByUserid/'+userid).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}


export {
    api_获取店铺类型,
    api_根据shopid查询店铺,
    api_查询店铺,
    api_店铺修改列表,
    api_店铺添加人气,
    api_获取顾客列表,
    api_查询店铺评分,
    api_查询店铺服务类型,
    api_查询店铺公告,
    api_店铺简介,
    api_修改店铺,
    api_添加店铺修改表,
    api_修改店铺修改表数据,
    api_查询店铺修改表列表,
    api_根据userid查询修改表数据
}