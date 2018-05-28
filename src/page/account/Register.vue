<template>
    <div class="login-wrap register-wrap">
        <div class="ms-register form-block">
            <el-form  ref="ruleForm" label-width="85px" class="demo-ruleForm">
                <el-form-item label="用户名">
                    <el-input v-model="name" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" placeholder="请输入密码" v-model="pwd" @keyup.enter.native="login()"></el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input type="password" placeholder="请重复密码" v-model="rePwd" @keyup.enter.native="login()"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="region">
                    <el-select v-model="role" placeholder="请选择角色">
                        <el-option v-for="(item,index) in userTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组别">
                    <el-select v-model="group" placeholder="请选择组别">
                        <el-option v-for="(item,index) in groupList" :label="item.label" :value="item.code" :key="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input type="tel" placeholder="请输入手机号" v-model="phone" @keyup.enter.native="login()"></el-input>
                </el-form-item>
                <el-form-item label="图片验证码" class="code-form-item">
                    <el-input type="tel" placeholder="请输入图片验证码" v-model="verifyCode" @keyup.enter.native="login()"></el-input>
                    <identify style="position:absolute;top:0px;bottom: 0px;right: 0px;margin: auto;"></identify>
                </el-form-item>
                <el-form-item label="短信验证码" class="code-form-item">
                    <el-input type="tel" placeholder="请输入短信验证码" v-model="msgCode" @keyup.enter.native="login()"></el-input>
                    <gen-code :phone="phone" :identifyCode="verifyCode" :url="genCodeUrl" style="width: 110px;"></gen-code>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" size="large" @click="register()">注&nbsp;册</el-button>
                </div>
                <div class="cm-link-btn" style="padding-top:20px;text-align: center;" @click="$router.push({ name: 'login', params: {}})">已有账号？马上登录</div>
            </el-form>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" >
    .register-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width:100%;
        height:100%;
        background: url("../../images/login/login-bg.jpg") no-repeat center;
        background-size: cover;
        .ms-title{
            position: absolute;
            top:50%;
            width:100%;
            margin-top: -230px;
            text-align: center;
            font-size:30px;
            color: #fff;

        }
        .ms-register{
            width:500px;
            height: auto;
            padding:40px;
            border-radius: 5px;
            background: #fff;
            font-size: 16px;
        }
        .ms-register .el-input--small .el-input__inner{
            height:44px !important;
        }
        .login-btn{
            text-align: center;
        }
        .el-input{
            width: 100%;
        }
        .login-btn button{
            margin-top: 20px;
            width:280px;
            height:44px;
        }
        #identify-code input{
            width: 180px;
        }
    }
    .form-block{
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
</style>
<script>
    import Vue from 'vue'
    import md5 from 'js-md5'
    import Identify from '../../components/Identify'

    export default {
        components:{
            Identify
        },
        data: function(){
            return {
                userTypeList:[],
                groupList:[],
                imgCode:null,
                genCodeUrl:'/appuser/auth/mcode',

                name:null,
                role:null,
                group:null,
                phone:null,
                pwd:null,
                rePwd:null,
                verifyCode:null,
                msgCode:null,
            }
        },
        methods: {
            getRegisterInfo:function () {
                let params={
                    req_from:'mj-backend',
                    timestamp:Vue.genTimestamp()
                }
              Vue.api.getRegisterInfo(params).then((resp)=>{
                  if(resp.status=='success'){
                      let data=JSON.parse(resp.message);
                      this.userTypeList=data.usertypes;
                      this.groupList=data.groups;
                      this.imgCode=data.icode;
                  }else{

                  }
              });
            },
            register:function () {
                if(!this.name){
                    Vue.operationFeedback({type:'warn',text:'请输入用户名'});
                    return;
                }
                if(!this.pwd){
                    Vue.operationFeedback({type:'warn',text:'请输入密码'});
                    return;
                }
                if(!this.rePwd){
                    Vue.operationFeedback({type:'warn',text:'请重复密码'});
                    return;
                }
                if(this.rePwd!=this.pwd){
                    Vue.operationFeedback({type:'warn',text:'两次密码输入不一致'});
                    return;
                }
                if(!this.role){
                    Vue.operationFeedback({type:'warn',text:'请选择角色'});
                    return;
                }
                if(!this.group){
                    Vue.operationFeedback({type:'warn',text:'请选择组别'});
                    return;
                }
                if(!this.phone){
                    Vue.operationFeedback({type:'warn',text:'请输入手机号'});
                    return;
                }
                if(!regex.phone.test(this.phone)){
                    Vue.operationFeedback({type:'warn',text:regex.phoneAlert});
                    return;
                }
                if(!this.verifyCode){
                    Vue.operationFeedback({type:'warn',text:'请输入图片验证码'});
                    return;
                }
                if(!this.phone){
                    Vue.operationFeedback({type:'warn',text:'请输入短信验证码'});
                    return;
                }
                let params={
                    req_from:'mj-backend',
                    timestamp:Vue.genTimestamp(),
                    user_name:this.name,
                    user_phone:this.phone,
                    icode:this.verifyCode,
                    mcode:this.msgCode,

                    password:md5.hex(this.pwd),
                    repassword:md5.hex(this.rePwd),

                    usertype:this.role,
                    group_id:this.group,
                    platform:'backend',

                }
                let fb=Vue.operationFeedback({text:'注册中...'});
                Vue.api.register(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'注册成功'});
                        this.$router.push({name:'task'});
                    }else{
                        fb.setOptions({type:"complete",text:resp.message});
                    }
                });
            }
        },
        mounted () {
            /**/
            this.getRegisterInfo();
        },
    }
</script>
