<template>
    <div class="header">
      <!--  <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>-->
        <div class="logo"><i class="text-logo-icon"></i></div>
        <div class="user-info">
            <img class="user-logo" :src="account.user_avatar?account.user_avatar:defaultAvatar">
            <span class="greet">欢迎登陆Trac*it  中午好！</span>
            <div class="cm-btn logout-btn" @click="logout()">
                退出登录
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tuichu"></use>
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                name: 'linxin',
                account:{},
                defaultAvatar:require('../../images/common/default-avatar.png'),
            }
        },
        computed:{

        },
        methods:{
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            logout:function () {
                Vue.cookie.set('account','');
                this.$router.push({name:'login'});
            }
        },
        created(){
            this.account=this.getAccountInfo();
        }
    }
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
        background: #48b4ff !important;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
    }
    .collapse-btn:hover{
        background: rgb(40,52,70);
    }
    .header .logo{
        margin-left: 40px;
        display: flex !important;
        align-items: center;
        float: left;
        width:250px;
        height: 100%;
        /* text-align: center; */
    }
    .user-info {
        display: flex;
        align-items: center;
        position: relative;
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
       /* position: absolute;
        left:0;
        top:15px;*/
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .greet{
        margin-left: 15px;
    }
    .logout-btn{
        margin-left: 50px;
        display: flex;
        align-items: center;
        .icon{
            margin-left: 2px;
            font-size: 24px;
        }
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
