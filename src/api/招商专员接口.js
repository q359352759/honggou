import axios from "@/api/axios.js";
import qs from "qs";

const api_查询招商专员列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/findLeasingExecutiveAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_添加招商专员=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users/addLeasingExecutive',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_修改招商专员=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-u/users/updateLeasingExecutive',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_根据id查询招商专员=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/findLeasingExecutiveById/'+id).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_根据userid查询专员=(userid)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/findLeasingExecutiveByLeid?leid='+userid).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}


const api_专员团队列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/findLeasingExecutiveLowerLevel',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_团队统计=(leid)=>{
    return new Promise((resolve, reject) => {
        axios.get(`/api-u/users/findLeasingExecutiveTotal?leid=${leid}`).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_查询推荐代理商列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-u/users/findLeasingExecutivesAreamanagerAll',{params:query}).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}
export{
    api_查询招商专员列表,
    api_添加招商专员,
    api_修改招商专员,
    api_根据id查询招商专员,
    api_根据userid查询专员,
    api_专员团队列表,
    api_团队统计,
    api_查询推荐代理商列表
}
