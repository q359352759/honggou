
export default {
    namespaced: true,
    state: {
        店招图片:'',
        环境图片:[]
    },
    getters: {
        店招图片(state){
            return state.店招图片
        },
        环境图片(state){
            return state.环境图片
        }
    },
    mutations: {
        
    },
    actions: {
        设置店招图片({state},imagebase64){
            console.log('申请开店图片设置环境图片')
            state.店招图片=imagebase64
        },
        添加环境图片({state},imagebase64){
            console.log('申请开店图片添加环境图片')
            state.环境图片.push(imagebase64)
        },
        设置环境图片({state},list){
            state.环境图片=list
        },
        删除环境图片({state},index){
            console.log('申请开店图片删除环境图片')
            state.环境图片.splice(index,1)
        }
    },
    modules: {}
};
