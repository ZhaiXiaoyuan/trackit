<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
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
                            <el-table-column label="任务状态"  align="center">
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
                                            <input type="text" v-model="item.label" maxlength="20" readonly>
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
                <!--客户-->
                <div class="block" v-if="account.user_type=='Customer'">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">报价方案</span>
                    </div>
                    <div class="block-bd">
                        <el-form ref="form" :label-width="formLabelWidth" label-position="left">
                            <el-form-item class="row-input-item">
                                <el-select v-model="curSupplierName" @change="whenSupplierChange" placeholder="请选择供应商">
                                    <el-option
                                        v-for="(item,index) in allPlanList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                                <el-select v-model="selectedPlanName" @change="whenPlanChange" placeholder="请选择方案">
                                    <el-option
                                        v-for="item in curSupplier.planList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                                <span class="cm-link-btn" style="margin-left: 10px;" @click="getUserInfo()">查看供应商信息</span>
                                <el-button type="primary" style="margin-left: 20px;" @click="addPricePlan()">添加该方案</el-button>
                            </el-form-item>
                            <el-form-item label="样品图片：">
                                <ul class="cm-simple-list" style="float: left;">
                                    <li v-for="(item,index) in sampleList">
                                        <div class="img-wrap" v-if="item.filepath">
                                            <img :src="item.filepath">
                                        </div>
                                        <div class="info-list">
                                            <div v-for="(attr) in item.attrList" style="text-align: center;">
                                                <span class="label" v-if="index==0">{{attr.attrName}}：</span>
                                                <span>{{attr.attrValue}}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="跟单反馈栏：">
                                <span v-if="selectedPlan">{{selectedPlan.feedback}}</span>
                            </el-form-item>
                        </el-form>
                        <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="account.user_type=='Customer'&&task.status!=4&&task.status!=6">
                            <el-button type="primary"  @click="$router.push({ name: 'newOrder', params: {taskNo:task.taskno}})">发起关联订单</el-button>
                            <el-button type="primary" @click="complete()">确认完成任务</el-button>
                            <el-button type="primary" @click="$router.push({ name: 'newTask', params: {id:task.id}})">编辑任务</el-button>
                            <el-button type="danger" @click="cancelTaskDialogFlag=true">取消任务</el-button>
                        </el-row>
                        <p style="text-align: center;font-size: 20px;color: #409EFF;" v-if="task.status==4">任务已完成</p>
                        <p style="text-align: center;font-size: 20px;color: #F56C6C;" v-if="task.status==6">任务已取消</p>
                    </div>
                </div>
                <!--供应商-->
                <div class="block" v-if="account.user_type=='Supplier'">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">报价方案</span>
                    </div>
                    <!--展示-->
                    <div class="block-bd" v-if="!toAddPlan">
                        <el-form ref="form" :label-width="formLabelWidth" label-position="left">
                            <el-form-item class="row-input-item">
                                <el-select v-model="curPlanLabel" @change="supplierSelectPlan" placeholder="请选择方案">
                                    <el-option
                                        v-for="(item,index) in planList"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="样品图片：">
                                <ul class="cm-simple-list" style="float: left;">
                                    <li v-for="(item,index) in sampleList">
                                        <div class="img-wrap" v-if="item.filepath">
                                            <img :src="item.filepath">
                                        </div>
                                        <div class="info-list">
                                            <div v-for="(attr) in item.attrList" style="text-align: center;">
                                                <span class="label" v-if="index==0">{{attr.attrName}}：</span>
                                                <span>{{attr.attrValue}}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="跟单反馈栏：">
                                <span>{{curPlan.feedback}}</span>
                            </el-form-item>
                        </el-form>
                        <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                            <el-button type="primary" @click="toAddPlan=true">我要报价</el-button>
                        </el-row>
                    </div>
                    <!--新增-->
                    <div class="block-bd" v-if="toAddPlan">
                        <el-form ref="form" :label-width="formLabelWidth" label-position="left">
                            <el-form-item label="样品图片：">
                                <ul class="cm-simple-list" style="float: left;">
                                    <li v-for="(item,index) in newSampleList">
                                        <div class="img-wrap" v-if="item.filepath">
                                            <img :src="item.filepath">
                                          <!--  <i class="icon el-icon-delete del-btn" @click="delPic(index)"></i>-->
                                        </div>
                                        <div class="cm-pic-uploader" v-loading="uploading" v-if="!item.filepath">
                                            <input  type="file" id="file-input" accept="image/*" @change="selectFile(index)">
                                            <div class="wrapper">
                                                <i class="icon add-icon el-icon-circle-plus"></i>
                                            </div>
                                        </div>
                                        <div class="info-list">
                                            <div v-for="(attr) in item.attrList">
                                                <span class="label" v-if="index==0">{{attr.attrName}}：</span>
                                                <input v-model="attr.attrValue" maxlength="50" type="text">
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="跟单反馈栏：">
                                <textarea class="cm-textarea" maxlength="1024" v-model="feedbackText" cols="30" rows="10"></textarea>
                            </el-form-item>
                        </el-form>
                        <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                            <el-button type="primary" @click="addPlan()">确认报价</el-button>
                            <el-button type="danger" style="width: 80px;text-align: center;" @click="toAddPlan=false">取消</el-button>
                        </el-row>
                    </div>
                </div>
            </div>


            <!--查看供应商信息-->
            <el-dialog class="view-user-dialog" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" >
                <div class="dialog-content">
                    <p class="title">供应商信息</p>
                    <div style="text-align: center;margin-top: 20px;margin-bottom: 10px;">
                        <img class="avatar" :src="curSupplier.user_avatar?urSupplier.user_avatar:defaultAvatar" alt="">
                    </div>
                    <div class="info-row">
                        <span class="field">名称：</span>
                        <div class="value">{{curSupplier.user_name}}</div>
                    </div>
                    <div class="info-row">
                        <span class="field">联系方式：</span>
                        <div class="value">{{curSupplier.user_phone}}</div>
                    </div>
                    <div class="info-row">
                        <span class="field">供应商简介：</span>
                        <div class="value">{{curSupplier.remark}}</div>
                    </div>
                    <div style="margin-top: 40px;">
                        <el-button type="primary" @click="dialogFormVisible=false">关闭</el-button>
                    </div>
                </div>
                <!--<div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addLabel()">确定</el-button>
                </div>-->
            </el-dialog>

            <!--取消任务弹窗-->
            <el-dialog class="cm-dialog cancel-task-dialog" title="取消任务" :visible.sync="cancelTaskDialogFlag" v-if="cancelTaskDialogFlag" >
                <div class="dialog-content">
                   <div class="panel">
                       <div class="panel-hd">
                           <p>请您勾选取消任务的原因：</p>
                       </div>
                       <div class="panel-bd">
                          <ul class="label-list">
                              <li v-for="(item,index) in labelList" :class="{'active':item.selected}" @click="selectLabel(item)">{{item.label}}</li>
                              <li :class="{'active':otherReasonFlag}" @click="otherReasonFlag=true;">其他</li>
                          </ul>
                       </div>
                   </div>
                    <div class="panel other-reason-panel" :class="{'active':otherReasonFlag}">
                        <div class="panel-hd">
                            <p>其他原因：</p>
                        </div>
                        <div class="panel-bd">
                            <textarea v-model="otherReason" maxlength="1024"  cols="30" rows="10"></textarea>
                        </div>
                    </div>
                </div>
                <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                    <el-button type="" @click="cancelTaskDialogFlag=false">取消</el-button>
                    <el-button type="primary" style="margin-left: 40px;" @click="cancel()">确认</el-button>
                </el-row>
            </el-dialog>
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
        padding: 15px;
        border: 1px solid #e5e5e5;
        li{
            float: left;
            height: 34px;
            line-height: 34px;
            font-size: 14px;
            color: #666;
            padding: 0px 20px;
            margin: 5px 10px;
            border: 1px solid #e5e5e5;
            min-width: 140px;
            cursor: pointer;
            text-align: center;
            &.active{
                border: 1px solid #409EFF;
                color: #409EFF;
            }
        }
    }
    .view-user-dialog{
        .dialog-content{
            padding: 10px 20px;
            text-align: center;
            .title{
                font-size: 20px;
                color: #666;
            }
            .avatar{
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
            .info-row{
                padding: 5px 0px;
                display: flex;
                .field{
                    flex: 1;
                    text-align: right;
                }
                .value{
                    padding-left: 10px;
                    flex: 3.5;
                    text-align: left;
                    word-break: break-all;
                }

            }
        }
    }
  .cancel-task-dialog{
      .panel{
          padding: 0px 40px;
          .panel-hd{
              padding-bottom: 10px;
          }
          &+.panel{
              margin-top: 20px;
          }
      }
      textarea{
          padding: 10px;
          width: 100%;
          height: 100px;
          border: 1px solid #e5e5e5;
          resize: none;
      }
      .other-reason-panel{
          height: 0px;
          overflow: hidden;
          transition: height 0.3s;
          &.active{
              height: 141px;
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
                defaultAvatar:require('../../images/common/default-avatar.png'),


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
                allPlanList:[],
                curSupplier:{},
                curSupplierName:null,
                selectedPlan:null,
                selectedPlanName:null,

                supplierList:[],
                curPlan:{},
                curPlanLabel:null,
                planList:[],
                toAddPlan:false,
                sampleList:[],
                uploading:false,
                proattrs:[],
                newSampleList:[],
                feedbackText:'',

                cancelTaskDialogFlag:false,
                labelList:[
                    {
                        label:'不接近客人要的',
                        selected:false,
                    },
                    {
                        label:'价格太高',
                        selected:false,
                    },
                    {
                        label:'打版时间太长',
                        selected:false,
                    },
                    {
                        label:'打版费用太高',
                        selected:false,
                    },
                    {
                        label:'大货起订量太大',
                        selected:false,
                    },
                    {
                        label:'大货货期太长',
                        selected:false,
                    },
                    {
                        label:'客人要其他选择',
                        selected:false,
                    },
                ],
                otherReasonFlag:false,
                otherReason:null,
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
                        this.task.status=parseInt(this.task.status);
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
                    }else{

                    }
                });
            },
            getSupplierList:function () {
                Vue.api.getSupplierList({...Vue.sessionInfo(),taskid:this.id}).then((resp)=>{
                    if(resp.status=='success'){
                        this.supplierList=JSON.parse(resp.message);
                        console.log('this.supplierList:',this.supplierList);
                        if(this.supplierList.length>0){
                            this.curSupplier=this.supplierList[0];
                        }
                    }
                });
            },
            whenSupplierChange:function (data) {
                console.log('data:',data);
            },
            whenPlanChange:function (name) {
                this.curSupplier.planList.forEach((item,i)=>{
                    if(name==item.name){
                        this.selectedPlan=item;
                        console.log('this.selectedPlan:',this.selectedPlan);
                        this.getPlan(this.selectedPlan.id);
                    }
                })
            },
            getAllPlanList:function () {
                let params={
                    ...Vue.sessionInfo(),
                    taskid:this.id
                }
                Vue.api.getAllPlanList(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        for(let pro in data) {
                            let proStrArr=pro.split('_');
                            let supplier={
                                id:proStrArr[0],
                                name:proStrArr[1],
                                planList:[],
                            };
                            this.allPlanList.push(supplier);
                            for(let key in data[pro]) {
                                supplier.planList.push({
                                    id:key,
                                    name:data[pro][key]
                                });
                            }
                        }
                        if(this.allPlanList.length>0){
                            this.curSupplier=this.allPlanList[0];
                            console.log('this.curSupplier:',this.curSupplier);
                            this.curSupplierName=this.curSupplier.name;
                            this.selectedPlan=this.curSupplier.planList[0];
                            this.selectedPlanName=this.selectedPlan.name;
                            this.getPlan(this.selectedPlan.id);
                        }
                    }
                });
            },
            setCurSupplier:function (name) {
                this.allPlanList.forEach((item,i)=>{
                    if(name==item.name){
                        this.curSupplier=item;
                    }
                })
            },
            /**/
            attrFormat:function (picName,proattrs) {
                let temArr=[];
                proattrs.forEach((item,i)=>{
                    if(picName==item.image){
                        temArr.push(item);
                    }
                });
                return temArr;
            },
            getPlan:function (id) {
                let params={
                    ...Vue.sessionInfo(),
                    quotaid:id
                }
                Vue.api.getPlan(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        if(this.account.user_type=='Customer'){
                           Object.assign(this.selectedPlan,data);
                        }
                        let proattrs=JSON.parse(data.proattrs);
                        this.sampleList=[];
                        if(data.samplepicone){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicone,
                                filename:data.samplepicone,
                                attrList:this.attrFormat(data.samplepicone,proattrs),
                            });
                        }
                        if(data.samplepictwo){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepictwo,
                                filename:data.samplepictwo,
                                attrList:this.attrFormat(data.samplepictwo,proattrs),
                            });
                        }
                        if(data.samplepicthree){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicthree,
                                filename:data.samplepicthree,
                                attrList:this.attrFormat(data.samplepicthree,proattrs),
                            });
                        }
                        if(data.samplepicfour){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicfour,
                                filename:data.samplepicfour,
                                attrList:this.attrFormat(data.samplepicfour,proattrs),
                            });
                        }
                        if(data.samplepicfive){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicfive,
                                filename:data.samplepicfive,
                                attrList:this.attrFormat(data.samplepicfive,proattrs),
                            });
                        }
                        if(data.samplepicsix){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicsix,
                                filename:data.samplepicsix,
                                attrList:this.attrFormat(data.samplepicsix,proattrs),
                            });
                        }
                        if(data.samplepicseven){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicseven,
                                filename:data.samplepicseven,
                                attrList:this.attrFormat(data.samplepicseven,proattrs),
                            });
                        }
                        if(data.samplepiceight){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepiceight,
                                filename:data.samplepiceight,
                                attrList:this.attrFormat(data.samplepiceight,proattrs),
                            });
                        }
                        if(data.samplepicnine){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicnine,
                                filename:data.samplepicnine,
                                attrList:this.attrFormat(data.samplepicnine,proattrs),
                            });
                        }
                        if(data.samplepicten){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicten,
                                filename:data.samplepicten,
                                attrList:this.attrFormat(data.samplepicten,proattrs),
                            });
                        }
                    }
                });
            },
            /**/
            getSupplierTaskDetail:function () {
                let params={
                    ...Vue.sessionInfo(),
                    id:this.id,
                }
                Vue.api.getSupplierTaskDetail(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.task=JSON.parse(resp.message);
                        this.task.status=parseInt(this.task.status);
                        this.proattrs=this.task.proattrs;
                        this.newSampleList=[{
                            filepath:'',
                            filename:'',
                            attrList:JSON.parse(this.proattrs),
                        }];
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
                    }else{

                    }
                });
            },
            getSupplierPlanList:function () {
                let params={
                    ...Vue.sessionInfo(),
                    taskid:this.id
                }
                Vue.api.getPlanList(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.planList=JSON.parse(resp.message);
                        this.planList.forEach((item,i)=>{
                            item.label='方案'+(i+1);
                            //
                        });
                        if(this.planList.length>0){
                            this.curPlan=this.planList[0];
                            this.curPlanLabel=this.curPlan.label;
                            this.getPlan(this.curPlan.id);
                        }
                    }
                });
            },
            supplierSelectPlan:function (label) {
                this.planList.forEach((item,i)=>{
                    if(item.label==label){
                        this.curPlan=item;
                        this.curPlanLabel=this.curPlan.label;
                    }
                });
                this.getPlan(this.curPlan.id);
            },

            selectFile:function (index) {
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
                        let data=JSON.parse(resp.message);
                        let item=this.newSampleList[index];
                        item.filepath=data.filepath;
                        item.filename=data.filename;
                        item.attrList.forEach((attr,i)=>{
                            attr.image=item.filename;
                        });
                        this.newSampleList.push({
                            filepath:'',
                            filename:'',
                            attrList:JSON.parse(this.proattrs),
                        })

                        console.log('item:',item);
                    }else{
                        Vue.operationFeedback({type:'warn',text:'上传失败'});
                    }
                });
            },
            addPlan:function () {
                if(!this.feedbackText){
                    Vue.operationFeedback({type:'warn',text:'请输入跟单反馈栏'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    taskid:this.id,
                    feedback:this.feedbackText,
                };
                let proattrs=[];
                let count=0;
                this.newSampleList.forEach((item,i)=>{
                    if(item.filename){
                        count++;
                        proattrs.push(...item.attrList);
                        if(i==0){
                            params.samplepicone=item.filename;
                        }else if(i==1){
                            params.samplepictwo=item.filename;
                        }if(i==2){
                            params.samplepicthree=item.filename;
                        }if(i==3){
                            params.samplepicfour=item.filename;
                        }if(i==4){
                            params.samplepicfive=item.filename;
                        }if(i==5){
                            params.samplepicsix=item.filename;
                        }if(i==6){
                            params.samplepicseven=item.filename;
                        }if(i==7){
                            params.samplepiceight=item.filename;
                        }if(i==8){
                            params.samplepicnine=item.filename;
                        }if(i==9){
                            params.samplepicten=item.filename;
                        }
                    }
                });
                if(count==0){
                    Vue.operationFeedback({type:'warn',text:'请至少上传一张样品图片，并填写完整相关信息'});
                    return;
                }
                params.proattrs=JSON.stringify(proattrs);
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.addPlan(params).then((resp)=>{
                    if(resp.status=='success'){
                        if(resp.status=='success'){
                            fb.setOptions({type:"complete",text:'保存成功'});
                            this.toAddPlan=false;
                            this.getSupplierPlanList();
                        }else{
                            fb.setOptions({type:"warn",text:resp.message});
                        }
                    }
                });
            },
            addPricePlan:function () {
                if(!this.selectedPlan){
                    Vue.operationFeedback({type:'warn',text:'请先选择方案'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    quotaid:this.selectedPlan.id,
                }
                let fb=Vue.operationFeedback({text:'添加中...'});
                Vue.api.addPricePlan(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'添加成功'});
                    }else{
                        fb.setOptions({type:"complete",text:resp.message});
                    }
                });
            },
            getUserInfo:function () {
                if(!this.curSupplier||!this.curSupplier.id){
                    Vue.operationFeedback({type:'warn',text:'请先选择供应商'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                   /* unumber:this.curSupplier.id,*/
                      uid:this.curSupplier.id
                }
                Vue.api.getUserInfo(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        Object.assign(this.curSupplier,data);
                        this.phone=data.user_phone;
                        this.userName=data.user_name;
                        this.email=data.email;
                        this.avatar=data.user_avatar;
                        this.dialogFormVisible=true;
                        console.log('this.curSupplier:',this.curSupplier);
                    }else{

                    }
                });
            },
            selectLabel:function (item) {
                item.selected=!item.selected;
            },
            cancel:function () {
                let reason='';
                this.labelList.forEach((item,i)=>{
                    if(item.selected){
                        reason+=(i>0?',':'')+item.label;
                    }
                });
                if(!reason&&!this.otherReason){
                    Vue.operationFeedback({type:'warn',text:'请勾选取消任务的原因'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    taskid:this.id,
                    cannelreason:reason,
                    elseReason:this.otherReason
                }
                let fb=Vue.operationFeedback({text:'取消中...'});
                Vue.api.cancelTask(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'取消成功'});
                        this.task.status=6;
                        this.cancelTaskDialogFlag=false;
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });
            },
            complete:function () {
                let params={
                    ...Vue.sessionInfo(),
                    taskid:this.id
                }
                let fb=Vue.operationFeedback({text:'设置中...'});
                Vue.api.complete(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'设置成功'});
                        this.task.status=4;
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
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
             /*   this.getSupplierList();*/
                this.getAllPlanList();
            }else if(this.account.user_type=='Supplier'){
                this.getSupplierTaskDetail();
                this.getSupplierPlanList();
            }
        },
    }
</script>
