<template>
    <div class="sidebar">
        <div class="user-info">
            <img :src="account.httpUser_avatar?account.httpUser_avatar:defaultAvatar">
            <p class="name">{{account.user_name}}</p>
        </div>
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#fff"
            text-color="#888" active-text-color="#48b4ff" unique-opened router>
            <template v-for="(item,index) in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <svg class="icon blue-icon" aria-hidden="true">
                                <use :xlink:href="item.icon"></use>
                            </svg>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item  v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :class="{'active':item.index.indexOf(pageName)>-1}" :key="item.index">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use :xlink:href="item.icon"></use>
                        </svg>
                        <span slot="title">{{ item.title }}</span>
                        <sup class="el-badge__content msg-count" v-if="item.showCount&&msgCount>0">{{msgCount}}</sup>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<style lang="less" rel="stylesheet/less" >
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        .user-info{
            padding: 40px 20px;
            text-align: center;
            img{
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
            .name{
                margin-top: 10px;
                font-size: 14px;
                color: #999;
            }
        }
        .icon{
            width: 20px;
            height: 20px;
            margin-right: 10px;
            vertical-align: middle;
        }
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 230px;
    }
    .sidebar > ul {
        border-top:1px solid #f0f0f8;
        height:100%;
        li{
            position: relative;
            height: 70px;
            line-height: 70px;
            border-bottom: 1px solid #f0f0f8;
            .msg-count{
                position: absolute;
                right: 10%;
                height: 18px;
                top:0px;
                bottom: 0px;
                margin: auto;
            }
            &:hover{
                background: #f8f8f9 !important;
            }
            &.active{
                background: #f8f8f9 !important;
                span{
                    color: #48b4ff !important;
                }
            }
        }
    }
</style>

<script>
    import Vue from 'vue'
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                itemsConfig:[
                    {
                        code:'01',
                        icon: '#icon-solid-time',
                        index: '/task',
                        title: '任务',
                    },
                    {
                        code:'02',
                        icon: '#icon-icondd2',
                        index: '/order',
                        title: '订单',
                    },
                    {
                        code:'03',
                        icon: '#icon-xitongtongzhi',
                        index: '/msg',
                        title: '通知',
                        showCount:true,
                    },
                    {
                        code:'04',
                        icon: '#icon-biaoge',
                        index: '/statistics',
                        title: '统计报表',
                    },
                    {
                        code:'05',
                        icon: '#icon-user',
                        index: '/center',
                        title: '个人中心',
                    },
                ],
                items: [],
                pageName:null,
                account:{},
                defaultAvatar:require('../../images/common/default-avatar.png'),

                msgCount:0,
            }
        },
        computed:{
            onRoutes(){
                this.pageName=this.$route.name;
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            getInfoCount:function () {
                let params={
                    ...Vue.sessionInfo(),
                    isread:0,
                }
                Vue.api.getInfoCount(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.msgCount=parseInt(resp.message);
                    }else{

                    }
                });
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });

            /*刷新用户信息*/
            bus.$on('refreshAccount', () => {
                this.account=Vue.getAccountInfo();
            });
            /*刷新用户信息*/
            bus.$on('refreshMsgCount', () => {
                this.account=this.account>0?this.account--:0;
            });
            //
            this.account=Vue.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.pageName=this.$route.name;
            console.log('this.pageName:',this.pageName);
            //
            this.items=this.itemsConfig;
            //
            this.getInfoCount();
        }
    }
</script>
