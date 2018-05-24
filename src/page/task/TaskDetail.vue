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
                    <el-row class="block-hd" type="flex" align="middle">
                        <el-col :span="12">
                            <span class="title">任务信息</span>
                            <i class="icon emergency-icon" v-if="task.urgent"></i>
                        </el-col>
                        <el-col :span="12" style="text-align: right;">
                            <el-button>导出</el-button>
                        </el-col>
                    </el-row>
                    <div class="block-bd">
                        <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                            <el-table-column prop="taskno" label="任务单号" align="center"></el-table-column>
                            <el-table-column prop="custno" label="客户编号"  align="center"></el-table-column>
                            <el-table-column prop="custbasis" label="客户参考"  align="center"></el-table-column>
                            <el-table-column prop="plantime" label="物料完成时间"  align="center"></el-table-column>
                            <el-table-column prop="resourceLabel" label="任务种类"  align="center"></el-table-column>
                            <el-table-column prop="createtime" label="下单时间" align="center"></el-table-column>
                            <el-table-column label="任务状态" width="200"  align="center">
                                <template slot-scope="scope">
                                    {{scope.row.status|taskStatus}}
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
                        <el-form ref="form" :label-width="formLabelWidth" label-position="left">
                            <el-form-item label="客户提供的图片：">
                                <ul class="cm-pic-list" style="float: left;">
                                    <li v-for="(item,index) in picList">
                                        <img :src="item.filepath">
                                        <div class="input-wrap">
                                            <input type="text" v-model="item.label" maxlength="20" readonly placeholder="请输入标签">
                                        </div>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="客户要栏：">
                                <span>{{task.custrequire}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="block" v-if="account.user_type=='Customer'">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">报价方案</span>
                    </div>
                    <div class="block-bd">
                      
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
      padding: 20px 0px 20px 0px;
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
        margin-top: 15px;
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

                formLabelWidth: '125px',
                customerNo:null,
                customerNote:null,
                completeDate:null,
                taskType:null,
                isEmergency:false,


                id:null,
                account:{},
                task:{},
                entryList:[],
                picList:[],

            }
        },
        created(){

        },
        computed: {

        },
        methods: {
            getCustomerTaskDetail:function () {
                let params={
                    ...Vue.sessionInfo(),
                    id:this.id,
                }
                Vue.api.getCustomerTaskDetail(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.task=JSON.parse(resp.message);
                        console.log('this.task:',this.task);
                        this.entryList.push(this.task);
                        if(this.task.custpropicone){
                            this.picList.push({
                                filepath:this.task.custpropiconeUrl,
                                label:this.task.custpropiconetag
                            })
                        }
                        if(this.task.custpropictwo){
                            this.picList.push({
                                filepath:this.task.custpropictwoUrl,
                                label:this.task.custpropictwotag
                            })
                        }
                        if(this.task.custpropicthree){
                            this.picList.push({
                                filepath:this.task.custpropicthreeUrl,
                                label:this.task.custpropicthreetag
                            })
                        }
                        if(this.task.custpropicfour){
                            this.picList.push({
                                filepath:this.task.custpropicfourUrl,
                                label:this.task.custpropicfourtag
                            })
                        }
                        if(this.task.custpropicfive){
                            this.picList.push({
                                filepath:this.task.custpropicfiveUrl,
                                label:this.task.custpropicfivetag
                            })
                        }
                        if(this.task.custpropicsix){
                            this.picList.push({
                                filepath:this.task.custpropicsixUrl,
                                label:this.task.custpropicsixtag
                            })
                        }
                        if(this.task.custpropicseven){
                            this.picList.push({
                                filepath:this.task.custpropicsevenUrl,
                                label:this.task.custpropicseventag
                            })
                        }
                        if(this.task.custpropiceight){
                            this.picList.push({
                                filepath:this.task.custpropiceightUrl,
                                label:this.task.custpropiceighttag
                            })
                        }
                        if(this.task.custpropicnine){
                            this.picList.push({
                                filepath:this.task.custpropicnineUrl,
                                label:this.task.custpropicninetag
                            })
                        }
                        if(this.task.custpropicten){
                            this.picList.push({
                                filepath:this.task.custpropictenUrl,
                                label:this.task.custpropictentag
                            })
                        }
                        console.log('this.picList:',this.picList);
                    }else{

                    }
                });
            }
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            this.account=Vue.getAccountInfo();
            /**/
            if(this.account.user_type=='Customer'){
                this.getCustomerTaskDetail();
            }else if(this.account.role_code=='Supplyer'){

            }
        },
    }
</script>
