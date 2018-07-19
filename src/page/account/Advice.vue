<template>
    <div class="cm-page-content-min center">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackkit</el-breadcrumb-item>
                <el-breadcrumb-item class="active">个人中心</el-breadcrumb-item>
                <el-breadcrumb-item class="active">意见反馈</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="from">
                <textarea v-model="advice"  cols="30" rows="10" maxlength="2048" placeholder="请写下您对Trackkit的意见反馈，我们将第一时间回复！"></textarea>
                <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                    <el-button type="primary"  @click="save()">提交</el-button>
                    <el-button type="" @click="$router.go(-1)">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .from{
        padding: 50px 0px;
        width: 500px;
        margin: 0px auto;
        textarea{
            width: 100%;
            resize: none;
            border: 1px solid #e5e5e5;
            padding: 10px;
            height: 250px;
        }
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                account:{},
                advice:null,
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            save:function () {
                if(!this.advice){
                    Vue.operationFeedback({type:'warn',text:'请输入您的意见反馈'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    content:this.advice
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.addAdvice(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'保存成功'});
                        this.advice=null;
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });
            }
        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();

        },
    }
</script>
