<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a @tap="返回上一页()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">{{标题}}</h1>
        </header>
        <div class="mui-content mui-fullscreen" @scroll="content_scroll($event)">
            <toubu />

            <xuanxiang />
            <div ref="定位锚点"></div>
            <zyk v-show="查看类型==0"/>

            <dianpufenrun v-show="查看类型==1"/>
            
            <huiyuanfenrun v-show="查看类型==2"/>
            <!-- 店铺悬赏 -->
            <dpxs :fixed="fixed" :userid="userid" v-show="查看类型==3"/>

            <ketixian v-show="查看类型==4"/>

            <mimashurukuang v-show="显示密码输入框" />

            <xingmingshuru v-show="显示姓名输入框"/>
        </div>

        <tixiantishi v-show="显示提现框" :ok="提现完成" :list="提现提示语" />

    </div>
</template>

<script>
const toubu = resolve => { require.ensure([], () => { resolve(require("./components/头部.vue")); }); };
const xuanxiang = resolve => { require.ensure([], () => { resolve(require("./components/中间选项.vue")); }); };

const zyk = resolve => { require.ensure([], () => { resolve(require("./components/赚外快.vue")); }); };
const dianpufenrun = resolve => { require.ensure([], () => { resolve(require("./components/店铺分润.vue")); }); };
const huiyuanfenrun = resolve => { require.ensure([], () => { resolve(require("./components/会员分润.vue")); }); };
// const dpxs = resolve => { require.ensure([], () => { resolve(require("./components/店铺悬赏.vue")); }); };
import dpxs from '@/components/agent/赏金.vue'
const ketixian = resolve => { require.ensure([], () => { resolve(require("./components/可提现.vue")); }); };
const mimashurukuang = resolve => { require.ensure([], () => { resolve(require("./components/密码输入框.vue")); }); };
const xingmingshuru = resolve => { require.ensure([], () => { resolve(require("./components/姓名输入框.vue")); }); };

import tixiantishi from "./components/提现提示.vue";

//这样就可以实现组件在异步加载的时候显示loading
import { mapGetters, mapActions } from "vuex";
export default {
    name: "",
    components: {
        toubu,
        xuanxiang,
        zyk,
        dianpufenrun,
        huiyuanfenrun,
        dpxs,
        ketixian,
        mimashurukuang,
        xingmingshuru,
        tixiantishi
    },
    data() {
        return {
            userid:"",
            标题:'红购使者',
            fixed:false,
        };
    },
    computed: {
        ...mapGetters({
            查看类型: "红购使者/红购使者/查看类型",
            显示密码输入框: "红购使者/红购使者/显示密码输入框",
            显示姓名输入框: "红购使者/红购使者/显示姓名输入框",
            提现完成: "红购使者/提现/提现完成",
            提现提示语: "红购使者/提现/提现提示语",
            显示提现框: "红购使者/提现/显示提现框",

            红购使者信息: "红购使者/红购使者/红购使者信息",
            
            奖赏所有数据:'agent/奖赏/奖赏所有数据'
        })
    },
    methods: {
        ...mapActions({
            查询用户信息:"红购使者/红购使者/查询用户信息",
            获取实名信息:"红购使者/红购使者/获取实名信息",
            获取账号: "红购使者/红购使者/获取账号",
            获取红购使者:"红购使者/红购使者/获取红购使者",
            数据初始化: "红购使者/红购使者/数据初始化",
            获取商家分润列表: "红购使者/红购使者/获取商家分润列表",
            获取会员分润列表: "红购使者/红购使者/获取会员分润列表",
            
            商家下一页: "红购使者/红购使者/商家下一页",
            会员下一页: "红购使者/红购使者/会员下一页",

            查询代理人分润: "红购使者/红购使者/查询代理人分润",
            
            奖赏初始化:"agent/奖赏/奖赏初始化",
            查询奖赏下一页:"agent/奖赏/查询奖赏下一页"
        }),
        返回上一页(){
            if(this.$route.query.type=="fanxian"){
                history.back()
            }else{
                this.$router.push('/my')
            }
        },
        content_scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            this.fixed = e.target.scrollTop + 44 >= this.$refs.定位锚点.offsetTop;
            if(this.查看类型==1){
                 if (h + t >= sh - 10 && !this.奖赏所有数据.奖赏商品.loading && this.奖赏所有数据.奖赏商品.list.length < this.奖赏所有数据.奖赏商品.total) {
                    this.查询奖赏下一页();
                }
            }else if(this.查看类型==2){

            }else if(this.查看类型==3){

            }else if(this.查看类型==4){

            }
        }
    },
    mounted() {
        if(this.$route.query.userid){
            this.userid=this.$route.query.userid;
            console.log('存在')
        }else{
            console.log('不纯在')
            try {
                var userInfo=JSON.parse(localStorage.userInfo);
                this.userid=userInfo.username
            } catch (error) {
                console.log(error)
            }
        }

        this.标题=this.$route.query.type=='fanxian' ? '红利返现' : "红购使者";

        this.数据初始化(this.userid);
        this.查询用户信息();
        this.获取实名信息();
        this.获取账号();
        this.获取红购使者().then(x=>{
            this.奖赏初始化(this.红购使者信息);
        }).catch(err=>{

        })
        this.获取商家分润列表();

        this.获取会员分润列表();

        this.查询代理人分润();

        var str = "等待审核";
        console.log(str.indexOf("审核1"));
    }
};
</script>

<style lang="scss" scoped>
</style>
