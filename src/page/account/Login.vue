<template>
    <div class="login-wrap">
        <div class="ms-title">
            <span v-if="pageName=='login'">夜彩平台超级管理员</span>
            <span v-if="pageName=='adminLogin'">夜彩平台<span v-if="accountType=='marketManager'">市场</span><span v-if="accountType=='accountantManager'">财务</span>管理员</span>
        </div>
        <div class="ms-login">
            <el-radio-group v-model="accountType" style="margin-bottom: 20px;" v-if="pageName=='adminLogin'">
                <el-radio label="marketManager">市场管理员</el-radio>
                <el-radio label="accountantManager">财务管理员</el-radio>
            </el-radio-group>
            <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm()"></el-input>
                </el-form-item>
                <el-form-item prop="identifyCode" id="identify-code" style="position:relative;">
                    <el-input type="password" placeholder="验证码" v-model="ruleForm.identifyCode" @keyup.enter.native="submitForm()" style="padding-right: 100px;"></el-input>
                    <identify style="position:absolute;top:0px;bottom: 0px;right: 0px;margin: auto;"></identify>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" size="large" @click="submitForm()">登&nbsp;录</el-button>
                </div>

            </el-form>
        </div>
    </div>
</template>

<style>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:230px;
        margin:-150px 0 0 -190px;
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
    .login-btn button{
        width:100%;
        height:44px;
    }
    #identify-code input{
        width: 180px;
    }
</style>
<script>
    import Vue from 'vue'
    import Identify from '../../components/Identify'

    export default {
        components:{
            Identify,
        },
        data: function(){
            return {
                pageName:null,
                accountType:'marketManager',//superManager:'超级管理员',marketManager:市场管理员账号,accountantManager:财务管理员账号
                ruleForm: {
                    username: '',
                    password: '',
                    identifyCode:''
                },
            }
        },
        methods: {
            submitForm() {
                let code=document.getElementsByClassName('code-value')[0].value;
                if(!this.ruleForm.username||this.ruleForm.username==''){
                    Vue.operationFeedback({type:'warn',text:'请输入账号'});
                    return;
                }
                if(!this.ruleForm.password||this.ruleForm.password==''){
                    Vue.operationFeedback({type:'warn',text:'请输入密码'});
                    return;
                }
                if(!this.ruleForm.identifyCode||this.ruleForm.identifyCode==''){
                    Vue.operationFeedback({type:'warn',text:'请输入验证码'});
                    return;
                }
                if(this.ruleForm.identifyCode!=code){
                    Vue.operationFeedback({type:'warn',text:'验证码错误'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'登录中...'});
                if(this.pageName=='login'){
                    Vue.api.superManagerLogin({...Vue.sessionInfo(),account:this.ruleForm.username,password:this.ruleForm.password}).then((resp)=>{
                        if(resp.respCode=='00'){
                            localStorage.setItem('loginPage','login');
                            this.$cookie.set('account',JSON.stringify({
                                type:'superManager',
                                account:this.ruleForm.username,
                            }),7);
                            this.$router.push({name:'shop',params:{}});
                            fb.setOptions({type:'complete',text:'登录成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'登录失败，'+resp.respMsg});
                        }
                    });
                }else if(this.pageName='adminLogin'){
                    if(this.accountType=='marketManager'){
                        Vue.api.marketManagerLogin({...Vue.sessionInfo(),account:this.ruleForm.username,password:this.ruleForm.password}).then((resp)=>{
                            if(resp.respCode=='00'){
                                localStorage.setItem('loginPage','adminLogin');
                                this.$cookie.set('account',JSON.stringify({
                                    type:this.accountType,
                                    account:this.ruleForm.username,
                                }),7);
                                this.$router.push({name:'benefitRank',params:{}});
                                fb.setOptions({type:'complete',text:'登录成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'登录失败，'+resp.respMsg});
                            }
                        });
                    }else if(this.accountType=='accountantManager'){
                        Vue.api.accountantManagerLogin({...Vue.sessionInfo(),account:this.ruleForm.username,password:this.ruleForm.password}).then((resp)=>{
                            if(resp.respCode=='00'){
                                localStorage.setItem('loginPage','adminLogin');
                                this.$cookie.set('account',JSON.stringify({
                                    type:this.accountType,
                                    account:this.ruleForm.username,
                                }),7);
                                this.$router.push({name:'rebatesRecord',params:{}});
                                fb.setOptions({type:'complete',text:'登录成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'登录失败，'+resp.respMsg});
                            }
                        });

                    }
                }
            },
            getCode:function (data) {
                console.log('data:',data);
            }
        },
        mounted () {
            this.pageName=this.$route.name;
        },
    }
</script>
