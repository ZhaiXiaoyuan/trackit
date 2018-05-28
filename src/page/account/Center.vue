<template>
    <div class="cm-page-content-min center">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
                <el-breadcrumb-item class="active">个人中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="block">
                <el-row class="block-hd" type="flex" align="middle">
                    <el-col :span="12">个人信息</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button type="primary" @click="$router.push({ name: 'userInfo', params: {}})">编辑</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="block">
                <el-row class="block-bd" type="flex" align="middle">
                    <el-col :span="3">联系电话：</el-col>
                    <el-col :span="21">020-86306631</el-col>
                </el-row>
            </div>
            <div class="block">
                <el-row class="block-bd" type="flex" align="middle">
                    <el-col :span="3">关于我们：</el-col>
                    <el-col :span="21">
                        <a :href="about" class="cm-link-btn">{{about}}</a>
                    </el-col>
                </el-row>
            </div>
            <div class="block">
                <el-row class="block-hd" type="flex" align="middle">
                    <el-col :span="12">意见反馈</el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button type="primary" @click="$router.push({ name: 'advice', params: {}})">反馈</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .block{
        padding: 10px 0px;
        &+.block{
            border-top: 1px solid #e5e5e5;
        }
    }
</style>
<script>
    import Vue from 'vue'
    let XLSX = require('xlsx');
    export default {
        data() {
            return {
                account:{},
                about:null,
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getAboutData:function () {
                let params={
                    ...Vue.sessionInfo()
                }
                Vue.api.getAboutData(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.about=resp.message;
                    }
                });
            }
        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();
            /**/
            this.getAboutData();

        },
    }
</script>
