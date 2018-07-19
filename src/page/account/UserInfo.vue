<template>
    <div class="cm-page-content-min center">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackkit</el-breadcrumb-item>
                <el-breadcrumb-item class="active">个人中心</el-breadcrumb-item>
                <el-breadcrumb-item class="active">个人信息编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="position: relative;">
            <div class="avatar">
                <div class="wrapper">
                    <img :src="avatar?avatar:defaultAvatar">
                    <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                    <p class="name">点击更换头像</p>
                </div>
            </div>
            <el-form class="edit-user-form" label-width="100px" style="width: 500px;margin: 0px auto;padding: 50px 0px;">
                <el-form-item label="手机号码：">
                    <el-input maxlength="100" v-model="phone" class="cm-disabled" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="用户名：" required>
                    <el-input maxlength="100" v-model="userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="通讯邮箱：" required>
                    <el-input maxlength="100" v-model="email" placeholder="请输入通讯邮箱"></el-input>
                </el-form-item>
                <el-form-item label="当前密码：">
                    <el-input type="password" maxlength="100" v-model="curPwd" placeholder="如需修改密码请在此输入当前密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码：">
                    <el-input type="password" maxlength="100" v-model="newPwd" placeholder="如需修改密码请在此输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码：">
                    <el-input maxlength="100" type="password" v-model="rePwd" placeholder="如需修改密码请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item label="个人说明：">
                    <el-input type="textarea" maxlength="2048" v-model="remark"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 40px;text-align: center;">
                    <el-button type="primary" @click="save()">保存</el-button>
                    <el-button style="margin-left: 20px;" @click="$router.go(-1)">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .avatar{
        position: absolute;
        top:10px;
        left: 40px;
        padding: 40px 20px;
        text-align: center;
        .wrapper{
            position: relative;
        }
        img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
        input{
            position: absolute;
            top:0px;
            left: 0px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
        }
        .name{
            margin-top: 10px;
            font-size: 14px;
            color: #999;
        }
    }
</style>
<script>
    import Vue from 'vue'
    import md5 from 'js-md5'
    import bus from '../../components/common/bus';

    export default {
        data() {
            return {
                account:{},
                phone:null,
                userName:null,
                email:null,
                curPwd:null,
                newPwd:null,
                rePwd:null,
                remark:null,
                avatar:null,
                defaultAvatar:require('../../images/common/default-avatar.png'),
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getUserInfo:function () {
                let params={
                    ...Vue.sessionInfo(),
                    unumber:this.account.user_phone,
                  /*  uid:this.account.user_uuid*/
                }
                Vue.api.getUserInfo(params).then((resp)=>{
                    if(resp.status=='success'){
                       let data=JSON.parse(resp.message);
                        this.phone=data.user_phone;
                        this.userName=data.user_name;
                        this.email=data.email;
                        this.avatar=data.httpUser_avatar;
                        this.remark=data.remark;
                        //
                    }else{

                    }
                });
            },
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                let formData = new FormData();
                let sessionInfo=Vue.sessionInfo();
                formData.append('req_from',sessionInfo.req_from);
                formData.append('timestamp',sessionInfo.timestamp);
                formData.append('number',sessionInfo.number);
                formData.append('signature',sessionInfo.signature);
                formData.append('hpic',file);
                this.uploading=true;
                let fb=Vue.operationFeedback({text:'上传中...'});
                Vue.api.updateAvatar(formData).then((resp)=>{
                    this.uploading=false;
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.avatar=data.filepath;

                        Object.assign(this.account,{
                            httpUser_avatar:data.filepath,
                            user_avatar:data.filename,
                        });
                        this.$cookie.set('account',JSON.stringify(this.account),7);
                        bus.$emit('refreshAccount');
                        fb.setOptions({type:"complete",text:'上传成功'});
                    }else{
                        fb.setOptions({type:"warn",text:'上传失败'});
                    }
                });
            },
            save:function () {
                if(!this.email){
                    Vue.operationFeedback({type:'warn',text:'请输入通讯邮箱'});
                    return;
                }
                if(!regex.mail.test(this.email)){
                    Vue.operationFeedback({type:'warn',text:regex.mailAlert});
                    return;
                }
                if(this.curPwd){
                    if(!this.newPwd){
                        Vue.operationFeedback({type:'warn',text:'请输入新密码'});
                        return;
                    }
                    if(!this.rePwd){
                        Vue.operationFeedback({type:'warn',text:'请确认新密码'});
                        return;
                    }
                    if(this.newPwd!=this.rePwd){
                        Vue.operationFeedback({type:'warn',text:'新密码和确认密码输入不相同'});
                        return;
                    }
                }

                let params={
                    ...Vue.sessionInfo(),
                    user_name:this.userName,
                    email:this.email,
                    remark:this.remark,
                }
                if(this.curPwd){
                    params.password=md5.hex(this.curPwd);
                    params.newpassword1=md5.hex(this.newPwd);
                    params.newpassword2=md5.hex(this.rePwd);
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.saveUserInfo(params).then((resp)=>{
                    if(resp.status=='success'){
                        Object.assign(this.account,{
                            user_name:this.userName,
                            email:this.email,
                            remark:this.remark,
                        });
                        this.$cookie.set('account',JSON.stringify(this.account),7);
                        bus.$emit('refreshAccount');

                        fb.setOptions({type:"complete",text:'保存成功'});
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });
            }
        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();
            if(this.account){
                this.phone=this.account.user_phone;
                this.userName=this.account.user_name;
            }
            this.getUserInfo();
            console.log('this.account:',this.account);

        },
    }
</script>
