<template>
    <div class="login-wrap">
        <div class="ms-login form-block">
            <div class="block-hd">
                <i class="icon logo-icon"></i>
            </div>
            <el-form  ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="account" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="pwd" @keyup.enter.native="login()"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" size="large" @click="login()">登&nbsp;录</el-button>
                </div>

            </el-form>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" >
    .login-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width:100%;
        height:100%;
        background: url("../../images/login/login-bg.jpg") no-repeat center;
        background-size: cover;
        .ms-login{
            width:500px;
            height: 400px;
            padding:40px;
            border-radius: 5px;
            background: #fff;
            font-size: 16px;
        }
        .ms-login .el-input--small .el-input__inner{
            height:44px !important;
        }
        .login-btn{
            text-align: center;
        }
        .el-input{
            width: 100%;
        }
        .login-btn button{
            width:280px;
            height:44px;
        }
        #identify-code input{
            width: 180px;
        }
        .form-block{
            .block-hd{
                text-align: center;
            }
            .el-form{
                margin-top: 20px;
            }
            .el-form-item{
                display: flex;
                align-items: center;
                justify-content: center;
                .el-form-item__label{
                    line-height: 44px;
                }
                .el-form-item__content{
                    margin-left: 0px !important;
                    width: 280px;
                }
            }
            .code-form-item input{
                width: 150px;
            }
        }
    }
</style>
<script>
    import Vue from 'vue'
    import md5 from 'js-md5'

    export default {
        components:{

        },
        data: function(){
            return {
                account:null,
                pwd:null,
            }
        },
        methods: {
            login:function () {
                if(!this.account){
                    Vue.operationFeedback({type:'warn',text:'请输入账号'});
                    return;
                }
                if(!this.pwd){
                    Vue.operationFeedback({type:'warn',text:'请输入密码'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    user_login_name:this.account,
                    user_login_pwd:md5.hex(this.pwd)
                }
                let fb=Vue.operationFeedback({text:'登录中...'});
                Vue.api.login(params).then((resp)=>{
                    if(resp.status=='1'){
                        let data=resp.resultInfos;
                        let account={
                            ...data,
                            number:data.user_phone,
                            token:data.sessionid
                        }
                        this.$cookie.set('account',JSON.stringify(account),7);
                        fb.setOptions({type:"complete",text:'登录成功'});
                        this.$router.push({name:'task'});
                    }else{
                        fb.setOptions({type:"warn",text:resp.desc});
                    }
                });
            }
        },
        mounted () {

        },
    }
</script>
