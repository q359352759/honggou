
import { api_查询卡包 } from "@/api/红包接口.js";

export default {
    namespaced: true,
    state: {
        count: 0
    },
    getters: {
        test1: state => () => {
            // this.$store.getters["hongbao/test1"]()  使用方法
            return "store测试2";
        },
        filter_hongbao: state => (list, CommodityId, type) => {
            //type  0新人店铺红包 1商品红包 2节日红包 3签到红包 4庆典红包 5生日红包
            var newlist = [];
            if (CommodityId) {
                newlist = list.filter(x => x.redCommodityId == CommodityId);
            } else if (type || type == 0) {
                newlist = list.filter(x => x.type == type);
            }
            return newlist;
        }
    },
    mutations: {
        //获取有效卡包信息
        findDataUserCardPackge(state, obj) {
            api_查询卡包(obj.query).then(x=>{
                obj.fc(x.data);
            }).catch(err=>{
                obj.fc(err);
            })
        }
    },
    actions: {

    },
    modules: {}
};

// store.commit( 'hongbao/...');
