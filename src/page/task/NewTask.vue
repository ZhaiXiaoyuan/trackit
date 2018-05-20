<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>任务</el-breadcrumb-item>
                <el-breadcrumb-item>新建任务</el-breadcrumb-item>
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
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-user"></use>
                        </svg>
                        <span class="title">客户信息</span>
                    </div>
                    <div class="block-bd">
                        <el-form :inline="true">
                            <el-form-item class="input-item" label="客户编号：">
                                <el-input v-model="customerNo" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item class="input-item" label="客户参考：">
                                <el-input v-model="customerNote" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item class="input-item" label="预计完成时间：">
                                <el-input v-model="completeDate" placeholder=""></el-input>
                            </el-form-item>
                        </el-form>
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
                            <el-form-item label="任务种类">
                                <el-select v-model="taskType" placeholder="请选择任务种类">
                                    <el-option v-for="(item,index) in resourceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="任务样品图片：">
                               <ul class="cm-pic-list" style="float: left;">
                                   <li v-for="(item,index) in picList">
                                       <img :src="basicConfig.imgPrefix+'zfiles/'+item">
                                       <i class="icon el-icon-delete del-btn"></i>
                                       <div class="input-wrap">
                                           <input type="text" maxlength="20" placeholder="请输入标签">
                                       </div>
                                   </li>
                               </ul>
                               <div class="cm-pic-uploader" v-loading="uploading" style="margin: 5px;">
                                   <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                                   <div class="wrapper">
                                       <i class="icon add-icon el-icon-circle-plus"></i>
                                   </div>
                               </div>
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


                uploading:false,
                picList:['Pic2018052012350045099.png'],
                uploadParams:null,
                customerNo:null,
                customerNote:null,
                completeDate:null,
                taskType:'Buliao',
                isEmergency:false
            }
        },
        created(){

        },
        computed: {

        },
        methods: {
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                let formData = new FormData();
                let sessionInfo=Vue.sessionInfo();
                formData.append('req_from',sessionInfo.req_from);
                formData.append('timestamp',sessionInfo.timestamp);
                formData.append('number',sessionInfo.number);
                formData.append('signature',sessionInfo.signature);
                formData.append('biztype','Task');
                formData.append('bizid',null);
                formData.append('fieldname',file.name);
                formData.append('file1',file);
                this.uploading=true;
                Vue.api.upload(formData).then((resp)=>{
                    this.uploading=false;
                    if(resp.status='success'){
                        this.picList.push(resp.message)
                    }else{
                        Vue.operationFeedback({type:'warn',text:'上传失败'});
                    }
                });
            },
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            /**/
        },
    }
</script>
