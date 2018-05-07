<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>账户系统</el-breadcrumb-item>
                <el-breadcrumb-item>门店管理</el-breadcrumb-item>
                <el-breadcrumb-item>门店详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="container-hd">
                <el-col :span="12">
                    <el-button type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-delete" v-if="shopDetail.accountState!='del'" @click="del()">删除</el-button>
                    <el-button type="primary" icon="el-icon-warning" v-if="shopDetail.accountState=='enable'" @click="disable()">禁用</el-button>
                    <el-button type="primary" icon="el-icon-view" v-if="shopDetail.accountState=='disable'" @click="enable()">恢复</el-button>
                    <el-button type="primary" icon="el-icon-edit" v-if="shopDetail.accountState=='enable'" @click="dialogFormVisible=true">编辑</el-button>
                </el-col>
            </el-row>
            <div class="container-bd">
                <el-row class="block">
                    <el-col :span="16">
                        <el-row class="info-row">
                            <el-col :span="12">门店编号：{{shopDetail.channelId}}</el-col>
                            <el-col :span="12">
                                状态:
                                <span v-if="shopDetail.accountState=='enable'">可用</span>
                                <span v-if="shopDetail.accountState=='disable'">禁止</span>
                                <span v-if="shopDetail.accountState=='del'">已删除</span>
                            </el-col>
                        </el-row>
                        <el-row class="info-row">公司：{{shopDetail.companyName}}</el-row>
                        <el-row class="info-row">社会信用代码：{{shopDetail.socialCreditCode}}</el-row>
                        <el-row class="info-row">电话：{{shopDetail.telephoneNums}}</el-row>
                        <el-row class="info-row">省份：{{shopDetail.province}}</el-row>
                        <el-row class="info-row">市区：{{shopDetail.city}}</el-row>
                        <el-row class="info-row">县：{{shopDetail.county}}</el-row>
                        <el-row class="info-row">详细地址：{{shopDetail.address}}</el-row>
                    </el-col>
                    <el-col :span="8">
                        <el-col :span="11" class="img-item">
                            <img class="img" :src="basicConfig.basicUrl+shopDetail.qRCodeId" alt="">
                            <el-row style="text-align: center">
                                二维码
                            </el-row>
                        </el-col>
                        <el-col :span="11" :offset="2"  class="img-item">
                            <img class="img" :src="basicConfig.basicUrl+shopDetail.companyPic" @click="viewPicModal({imgUrl:basicConfig.basicUrl+shopDetail.companyPic})" alt="">
<!--
                            <div class="img" :style="{background: 'url('+basicConfig.basicUrl+shopDetail.companyPic+') no-repeat center',backgroundSize: 'cover'}"></div>
-->
                            <el-row style="text-align: center">
                                <el-col :span="12">营业执照</el-col>
                                <el-col :span="12" class="cm-link-btn" style="text-align: right;position: relative">
                                    设置
                                    <input type="file" id="file-input" multiple @change="selectFile()">
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row class="block">
                    <el-row class="info-row">日时销售额 {{curDateStrArr.join('.')}}：{{shopDetail.daySale}}元</el-row>
                    <el-row class="info-row">月销售额 {{curDateStrArr[0]+'.'+curDateStrArr[1]}}：{{shopDetail.monthSale}}元</el-row>
                    <el-row class="info-row">年销售额 {{curDateStrArr[0]}}：{{shopDetail.yearSale}}元</el-row>
                </el-row>
                <el-row class="block">
                    <el-row class="info-row">
                        <el-col :span="8">门店账户：{{shopChannelsUser.name}}&nbsp;{{shopChannelsUser.phoneNums}}</el-col>
                        <el-col :span="15" :offset="1">返点比例：{{shopDetail.shopRebates}}% </el-col>
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="8">渠道账户：{{marketingChannelsUser.name}}&nbsp;{{marketingChannelsUser.phoneNums}}</el-col>
                        <el-col :span="15" :offset="1">返点比例：{{shopDetail.marketingRebates}}%</el-col>
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="8">店家账户：{{otherUser.name}}&nbsp;{{otherUser.phoneNums}}</el-col>
                        <el-col :span="15" :offset="1">返点比例：{{shopDetail.otherRebates}}% </el-col>
                    </el-row>
                </el-row>
            </div>
        </div>
        <el-dialog title="编辑" class="edit-dialog" :visible.sync="dialogFormVisible" width="40%">
            <el-row type="flex">
                <el-col :sm="24" :md="22" :lg="20">
                    <el-form :model="form">
                        <el-form-item label="公司名称" :label-width="formLabelWidth">
                            <el-input v-model="form.companyName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="企业信用码" :label-width="formLabelWidth">
                            <el-input v-model="form.socialCreditCode" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" :label-width="formLabelWidth">
                            <el-input v-model="form.telephoneNums" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="门店渠道返点" :label-width="formLabelWidth">
                            <el-input v-model="form.shopRebates" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="中介渠道返点" :label-width="formLabelWidth">
                            <el-input v-model="form.marketingRebates" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="其他渠道返点" :label-width="formLabelWidth">
                            <el-input v-model="form.otherRebates" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="地区" :label-width="formLabelWidth">
                            <v-distpicker class="cm-area-picker" :province="form.province" :city="form.city" :area="form.county"></v-distpicker>
                        </el-form-item>
                        <el-form-item label="详细地址" :label-width="formLabelWidth">
                            <el-input v-model="form.address" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                           :disabled="!form.companyName||form.companyName==''
                           ||!form.socialCreditCode||form.socialCreditCode==''
                           ||!form.telephoneNums||form.telephoneNums==''
                           ||!form.shopRebates||form.shopRebates==''
                           ||!form.marketingRebates||form.marketingRebates==''
                           ||!form.otherRebates||form.otherRebates==''
                           ||!form.province||form.province==''
                           ||!form.city||form.city==''
                           ||!form.county||form.county==''
                           ||!form.address||form.address==''"
                           @click="update()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .shop-detail{
        max-width: 1000px;
    }
   .block{
       padding: 10px;
       &+.block{
           border-top: 1px solid #E4E7ED;
       }
   }
    .info-row{
        font-size: 16px;
        color: #606266;
        &+.info-row{
            margin-top: 10px;
        }
    }
    .img-item{
        color: #606266;
        font-size: 14px;
        .img{
            width: 140px;
            height: 140px;
            margin-bottom: 5px;
        }
    }
    .edit-dialog{
        .el-dialog{
            width: 500px;
        }
    }
    #file-input{
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        top:0px;
        left: 0px;
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                dialogFormVisible: false,
                areaSelect: { province: '', city: '', area: '' },
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    id:null,
                },
                formLabelWidth: '120px',

                shopDetail:{},
                shopChannelsUser:{},
                marketingChannelsUser:{},
                otherUser:{},

                uploadFb:null,
                uploadedCount:0,

                curDateStrArr:Vue.formatDate(new Date(),'yyyy.MM.dd').split('.')
            }
        },
        created(){

        },
        computed: {

        },
        methods: {
            getShopDetail:function () {
                Vue.api.getShopDetail({...Vue.sessionInfo(),shopId:this.id}).then((resp)=>{
                    if(resp.respCode=='00'){
                    this.shopDetail=JSON.parse(resp.respMsg);
                    this.form=Object.assign({},this.shopDetail);
                    this.shopChannelsUser=JSON.parse(this.shopDetail.shopChannelsUser);
                    this.marketingChannelsUser=JSON.parse(this.shopDetail.marketingChannelsUser);
                    this.otherUser=JSON.parse(this.shopDetail.otherUser);
                    console.log('this.form:',this.form);
                }
            });
            },
            del:function () {
                this.$confirm('确定删除该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'删除中...'});
                    Vue.api.setShopState({timeStamp:Vue.sessionInfo().timeStamp,shopId:this.id,state:'del'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.shopDetail.accountState='del';
                            fb.setOptions({type:'complete',text:'删除成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            disable:function () {
                this.$confirm('确定禁用该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setShopState({timeStamp:Vue.sessionInfo().timeStamp,shopId:this.id,state:'disable'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.shopDetail.accountState='disable';
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            enable:function () {
                this.$confirm('确定恢复该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setShopState({timeStamp:Vue.sessionInfo().timeStamp,shopId:this.id,state:'enable'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.shopDetail.accountState='enable';
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            update:function () {
                let params={
                    ...Vue.sessionInfo(),
                    shopId:this.id,
                    ...this.form
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.updateShopInfo(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.getShopDetail();
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'保存成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                    }
                });
            },
            selectFile:function () {
                let that=this;
                this.files=document.getElementById('file-input').files;
                this.uploadFb=this.operationFeedback({text:'上传中，请耐心等待',mask:true});
                this.uploadedCount=0;
                let index=0;
                let uploadInterval=setInterval(()=>{
                    if(index==this.files.length){
                        clearInterval(uploadInterval);
                        return;
                    }
                    this.upload(this.files[index]);
                    index++;
                },1000);
            },
            upload:function (file) {
                let that=this;
                let sessionInfo=Vue.sessionInfo();
                var formData = new FormData();
                formData.append('timeStamp',sessionInfo.timeStamp);
                formData.append('shopId',this.id);
                formData.append("file", file);
                Vue.api.uploadShopPic(formData).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.getShopDetail();
                        that.uploadFb.setOptions({type:'complete',text:'上传成功'});
                    }else{

                    }
                });
            },
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            /**/
            this.getShopDetail();
            /**/
        },
    }
</script>
