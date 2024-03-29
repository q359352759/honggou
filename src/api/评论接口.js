import axios from './axios.js';
import qs from "qs";

// var 评价对象={
        //     id:"",          //自增id
        //     ordersid:this_1.订单详情.id,    //订单id
        //     commodityid: 新商品列表[i].commodityid, //商品id
        //     shopid: 新商品列表[i].shopid,      //商家id
        //     userid: this_1.userInfo.username,      //用户id
        //     remarkid: '',    //回复评价id
        //     remark: remark ,      //评价内容
        //     remarkimg:"",   //评价图片
        //     remarkimgList:remarkimgList, //评论图片
        //     somegreattimes:'',  //点赞次数
        //     score:score,       //打分
        //     commenttype:0, //类型  0 评价 1 追评 2 商家回复
        //     anonymous:1,   //匿名()默认1不匿
        //     hidden:1,      //隐藏 默认1不隐藏
        //     shopreplytype:0,   //商家回复状态默认0未回复 1已回复 2不回复
        //     checktype:0,   //查阅状态 默认为查阅0 已1 隐藏2
        //     clerksid:"",    //店员id
        //     lastcomment:"", //最后评论时间
        //     isfollowcomment:"", //是否有新的追评
        //     lastcommenta:"",    //最后追评/回复时间
        //     isfollowcommenta:'',    //是否有新的追评/回复
        // };

const api_添加评论=(评论列表)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/addShopCommodityComment',评论列表).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        }) 
    });
}

const api_修改评论=(obj)=>{
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/updateShopCommodityComment',obj).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_根据id查询评论=(id)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopCommodityCommentById',{params:{'id':id}}).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err)
        })
    });
}

const api_查询评论列表=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findShopCommodityCommentAll',{params:query}).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_查询评论点赞=(query)=>{
    return new Promise((resolve, reject) => {
        axios.get('/api-s/shops/findCommentDianzanAll',{params:query}).then(x=>{
            resolve(x);
        }).catch(err=>{
            reject(err);
        })
    });
}

const api_添加评论点赞=(id,username)=>{
    var obj={
        id:id,
        userid:username
    }
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/CommodityCommentDianzan/'+id,qs.stringify(obj)).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err);
        })    
    });
}
const api_取消评论点赞=(评论id,点赞id)=>{
    var obj={
        id:评论id,
        dianzanid:点赞id
    }
    return new Promise((resolve, reject) => {
        axios.post('/api-s/shops/CommodityCommentQuxiaozan/'+评论id, qs.stringify(obj)).then(x=>{
            resolve(x)
        }).catch(err=>{
            reject(err)
        })
    });
}



export{
    api_添加评论,
    api_修改评论,
    api_根据id查询评论,
    api_查询评论列表,
    api_查询评论点赞,
    api_添加评论点赞,
    api_取消评论点赞,
}