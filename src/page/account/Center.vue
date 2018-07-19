<template>
    <div class="cm-page-content-min center">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackkit</el-breadcrumb-item>
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
                        <span class="cm-link-btn" @click="aboutDialogFlag=true">点击查看</span>
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
        <el-dialog class="cm-dialog about-dialog" title="关于我们" :visible.sync="aboutDialogFlag" v-if="aboutDialogFlag" >
            <div class="dialog-content">
                <iframe id="google_ads_frame2" name="google_ads_frame2" width="100%" height="620" frameborder="0" :src="about" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allowfullscreen="true"></iframe>
            </div>
            <el-row style="text-align: center;margin-top: 20px;">
                <el-button type="primary" @click="aboutDialogFlag=false">关闭</el-button>
            </el-row>
        </el-dialog>
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
    export default {
        data() {
            return {
                account:{},
                about:null,
                aboutDialogFlag:false
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
