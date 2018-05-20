<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>任务</el-breadcrumb-item>
                <el-breadcrumb-item>任务详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="container-hd">
                <el-col :span="12">
                    <el-button type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
                </el-col>
            </el-row>
            <div class="container-bd">
                <div class="block">
                    <div class="block-bd">
                        <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                            <el-table-column prop="phoneNums" label="任务单号" align="center"></el-table-column>
                            <el-table-column prop="name" label="客户编号"  align="center"></el-table-column>
                            <el-table-column prop="idCard" label="客户参考"  align="center"></el-table-column>
                            <el-table-column prop="email" label="预计完成时间"  align="center"></el-table-column>
                            <el-table-column prop="bankName" label="任务种类"  align="center"></el-table-column>
                            <el-table-column prop="subbranch" label="下单时间" align="center"></el-table-column>
                            <el-table-column prop="bankAccount" label="任务状态" width="200"  align="center"></el-table-column>
                            <el-table-column label="操作"  align="center">
                                <template slot-scope="scope">
                                    <router-link :to="'/userDetail/'+scope.row.id" size="small">查看详情</router-link>
                                    <i class="icon emergency-icon" v-if="false"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="block">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">任务详情</span>
                    </div>
                    <div class="block-bd">
                        <el-form ref="form">
                            <el-form-item label="活动区域">
                                <el-select v-model="taskType" placeholder="任务种类">
                                    <el-option label="区域一" value="shanghai"></el-option>
                                    <el-option label="区域二" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="任务样品图片：">
                                <el-upload class="uploader"
                                           action="https://jsonplaceholder.typicode.com/posts/"
                                           list-type="picture-card"
                                           :on-preview="handlePictureCardPreview"
                                           :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-upload class="uploader"
                                           action="https://jsonplaceholder.typicode.com/posts/"
                                           list-type="picture-card"
                                           :on-preview="handlePictureCardPreview"
                                           :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-upload class="uploader"
                                           action="https://jsonplaceholder.typicode.com/posts/"
                                           list-type="picture-card"
                                           :on-preview="handlePictureCardPreview"
                                           :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="客户要栏：">
                                <el-input></el-input>
                            </el-form-item>
                            <el-form-item label="任务是否紧急：">
                                <el-radio-group v-model="isEmergency" size="medium">
                                    <el-radio label="是"></el-radio>
                                    <el-radio label="否"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="block">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-xuanzeyixuan"></use>
                        </svg>
                        <span class="title">请勾选需要供应商提供的相关信息，完成新建任务</span>
                    </div>
                    <div class="block-bd">
                        <ul class="label-list">
                            <li v-for="item in labelList">{{item.label}}</li>
                            <li class="add-btn">
                                <svg class="icon blue-icon" aria-hidden="true">
                                    <use xlink:href="#icon-tianjia"></use>
                                </svg>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <el-row style="text-align: center;margin-top: 40px;padding-bottom: 20px;">
                <el-button type="primary">确认发布</el-button>
                <el-button type="">取消发布</el-button>
            </el-row>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  .page-content{
      max-width: 1200px;
  }
  .block{
      padding: 10px 0px 10px 0px;
      &+.block{
          border-top: 1px solid #e5e5e5;
      }
  }
  .block-hd{
      .icon{
          width: 20px;
          height: 20px;
      }
      .title{
          padding-left: 10px;
          font-size: 18px;
          color: #666;
      }
  }
    .block-bd{
        margin-top: 20px;
    }
    .input-item{
        &+.input-item{
            margin-left: 20px;
        }
    }
    .uploader{
        float: left;
        margin: 5px;
    }
    .row-input-item{
        .el-input{
            width: 500px;
        }
    }
    .label-list{
        overflow: hidden;
        li{
            float: left;
            height: 34px;
            line-height: 34px;
            font-size: 14px;
            color: #666;
            padding: 0px 20px;
            margin: 5px 10px;
            border: 1px solid #e5e5e5;
            cursor: pointer;
        }
        .add-btn{
            border: none;
            padding: 0px;
            .icon{
                font-size: 34px;
            }
        }
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

                curDateStrArr:Vue.formatDate(new Date(),'yyyy.MM.dd').split('.'),

                labelList:[
                    {
                        label:'样品货号',
                        value:''
                    },{
                        label:'样品名称',
                        value:''
                    },{
                        label:'样品描述',
                        value:''
                    },{
                        label:'单重',
                        value:''
                    },{
                        label:'打样费用',
                        value:''
                    }
                ],
                inputValue:null,


                customerNo:null,
                customerNote:null,
                completeDate:null,
                taskType:null,
                isEmergency:false
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

            handlePictureCardPreview:function () {

            },
            handleRemove:function () {

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
