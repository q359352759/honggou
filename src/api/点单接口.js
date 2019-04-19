import axios from './axios.js';
import qs from "qs";

const api_添加制作员=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addShopProducer',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
};

//两个修改接口应用场景不一样
const api_修改制作员=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateShopProducer',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}
//两个修改接口应用场景不一样
const api_修改制作员状态=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateState',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_删除制作员=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/deleteShopProducerById/'+id).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_根据id查询制作员=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopProducerById/'+ix).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_查询制作员列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopProducerAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

//点单专用
const api_添加排号=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addShopRowNumber',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询排号=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRowNumberAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_根据id查询排号=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRowNumberById/'+id).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_修改排号=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateShopRowNumber',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_添加排号商品表=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addShopRowNumberCommodity',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}
const api_查询排号商品=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRowNumberCommodityAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_修改排号商品=(obj1)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateShopRowNumberCommodity',obj1).then(x=>{
            resolve(x)
        }).catch((err)=>{
            reject(err);
        })
    });
}

const api_修改排号商品状态=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/shops/updateShopRowNumberCommodityState',obj).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_根据id查询商品排号=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopRowNumberCommodityById/'+id).then(x=>{
            resolve(x)
        }).catch(er=>{
            reject(err)
        })
    });
}

export{
    api_添加制作员,
    api_修改制作员,
    api_修改制作员状态,
    api_删除制作员,
    api_根据id查询制作员,
    api_查询制作员列表,
    api_添加排号,
    api_修改排号,
    api_根据id查询排号,
    api_添加排号商品表,
    api_查询排号,
    api_查询排号商品,
    api_修改排号商品,
    api_修改排号商品状态,
    api_根据id查询商品排号
}