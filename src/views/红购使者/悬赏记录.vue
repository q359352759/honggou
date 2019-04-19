<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">奖赏记录</h1>
        </header>
        <div class="mui-content mui-fullscreen">
            <div class="头部">
                <ul class="列表">
                    <li class="header">
                        <div><div>会员</div></div>
                        <div><div>时间</div></div>
                        <div><div>商品</div></div>
                        <div><div>赏金</div></div>
                    </li>
                </ul>
            </div>            
            <div class="内容区" @scroll="scroll($event)">
                <ul class="列表">
                    <li v-for="(item, index) in 奖赏记录.list" :key="index">
                        <div><div>{{item.消费者 ? item.消费者.nickname : ''}}</div></div>
                        <div>
                            <div>{{item.createtime | 时间格式化('yyyy.MM.dd')}}</div>
                            <div>{{item.createtime | 时间格式化('hh:mm:ss')}}</div>
                        </div>
                        <div><div>{{item.商品 ? item.商品.name : ''}}</div></div>
                        <div><div>{{item.rewardamount}}</div></div>
                    </li>
                </ul>
                <loading :loadingtype="奖赏记录.loading" :nodata="!奖赏记录.loading && 奖赏记录.total==0" :end="!奖赏记录.loading && 奖赏记录.total!=0 && 奖赏记录.list.length>=奖赏记录.total" text="暂无悬赏"/>
            </div>
            
        </div>
    </div>
</template>

<script>
import { api_查询奖赏记录 } from "@/api/奖赏接口.js";
import { api_根据userid查询代理人信息 } from "@/api/代理人接口.js";
import { api_通过username查询用户 } from "@/api/用户接口.js";
import { api_根据id查询商品 } from "@/api/商品接口.js";

import { openloading , dateFtt} from "@/assets/js/currency.js";
import { b64DecodeUnicode } from "@/assets/js/base64jiema.js";
import loading from '@/components/loading.vue'
export default {
    name:"",
    data() {
        return {
            userid:"",
            代理人信息:"",
            奖赏记录:{
                query:{
                    start:0,
                    length:10,
                    agentid:""
                },
                total:0,
                page_index:0,
                list:[],
                loading:true
            }
        }
    },
    filters:{
        时间格式化(time,type){
            return dateFtt(time,type)
        }
    },
    components:{
        loading
    },
    methods: {
        scroll(e){
            var h = e.target.offsetHeight; //容器高度
            var sh = e.target.scrollHeight; //滚动条总高
            var t = e.target.scrollTop; //滚动条到顶部距离
            if (h + t >= sh - 10 && !this.奖赏记录.loading && this.奖赏记录.list.length < this.奖赏记录.total) {
                this.奖赏记录.page_index++;
                this.查询奖赏记录();
            }
        },
        获取代理人信息() {
            return new Promise((resolve, reject) => {
                api_根据userid查询代理人信息(this.userid).then(x => {
                    if (x.data.code == 200) {
                        this.代理人信息 = x.data.data;
                        resolve()
                    } else {
                        reject()                
                    }
                }).catch(err => {
                    resolve()
                });
            });
        },
        查询奖赏记录(){
            this.奖赏记录.loading=true;
            this.奖赏记录.query.start=this.奖赏记录.page_index*this.奖赏记录.query.length;
            this.奖赏记录.query.agentid=this.userid;
            api_查询奖赏记录(this.奖赏记录.query).then(x=>{
                if(x.data.code==200){
                    var list=x.data.data.data;
                    list.forEach(item => {
                        item.消费者="";
                        item.商品="";
                        api_通过username查询用户(item.userid).then(r=>{
                            if(r.data.code==200){
                                item.消费者=r.data.data;
                                try {
                                    item.消费者.nickname = b64DecodeUnicode(item.消费者.nickname)                                
                                } catch (error) {}
                            }
                        })
                        api_根据id查询商品(item.commodityid).then(r=>{
                            item.商品=r.data.code==200 ? r.data.data : '';
                        })
                    });
                    this.奖赏记录.list=[...this.奖赏记录.list,...list];
                    this.奖赏记录.total=x.data.data.total;
                }
                this.奖赏记录.loading=false
            }).catch(err=>{
                this.奖赏记录.loading=false
            })
        },
        async 初始化(){
            openloading(true)
            // await this.获取代理人信息();
            this.查询奖赏记录();
            openloading(false);
        }
    },
    mounted() {
        this.当前登录用户 = JSON.parse(localStorage.userInfo);
        if (this.$route.query.userid) {
            this.userid = this.$route.query.userid;
        } else {
            this.userid = this.当前登录用户.username
        }
        this.查询奖赏记录();
    },
}
</script>

<style lang="scss" scoped>

@import "@/assets/css/config.scss";
.mui-content{
    display: flex;
    flex-direction: column;
}
.头部{
    flex-shrink: 0;
}
.内容区{
    flex-grow: 1;
    overflow: auto;
}


.列表 {
    li {
        display: flex;
        min-height: 34px;
        text-align: center;
        font-size: 12px;
        > div {
            border-left: 1px solid #f6f6f6;
            width: calc(100% / 4);
            display: flex;
            flex-direction: column;
            justify-content: center;
            > div {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        > div:nth-child(1) {
            border-left: none;
        }
    }
    li:nth-child(2n-1) {
        background: #ffffff;
    }
    li.header {
        background: $header_background;
        color: #ffffff;
    }
    .蓝色字体 {
        color: #017aff;
    }
}
</style>
