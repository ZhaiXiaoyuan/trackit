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
                    <el-button type="primary" icon="el-icon-back" @click="back()">返回</el-button>
                </el-col>
            </el-row>
            <div class="container-bd">
                <div class="block">
                    <el-row class="block-hd" type="flex" align="middle">
                        <el-col :span="12">
                            <span class="title">任务信息</span>
                            <i class="icon emergency-icon" v-if="task.urgent"></i>
                            <span class="cm-link-btn" style="padding-left: 10px;font-size: 14px;" @click="getCustomerInfo()">客户信息</span>
                        </el-col>
                        <el-col :span="12" style="text-align: right;">
                            <el-button @click="exportTask">导出</el-button>
                            <a id="downlink"></a>
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
                                        <img :src="item.filepath" @click="viewPicModal({imgUrl:item.filepath})">
                                        <div class="input-wrap" v-if="item.label">
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
                                <el-select v-model="curSupplierIndex" @change="whenSupplierChange" placeholder="请选择供应商">
                                    <el-option
                                        v-for="(item,index) in allPlanList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="index">
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
                            <div v-loading="loadingPlan">
                                <el-form-item label="样品图片：">
                                    <ul class="cm-simple-list" style="float: left;width: 800px;">
                                        <li v-for="(item,index) in sampleList">
                                            <div class="img-wrap" v-if="item.filepath">
                                                <img :src="item.filepath" @click="viewPicModal({imgUrl:item.filepath})">
                                                <div class="input-wrap" v-if="item.label">
                                                    <input type="text" v-model="item.label" maxlength="20">
                                                </div>
                                            </div>

                                            <div class="info-list">
                                                <div v-for="(attr) in item.attrList" style="text-align: center;">
                                                    <span class="label" v-if="index==0||index==7">{{attr.attrName}}：</span>
                                                    <span>{{attr.attrValue}}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </el-form-item>
                                <el-form-item class="row-input-item" label="跟单反馈栏：">
                                    <span v-if="selectedPlan">{{selectedPlan.feedback}}</span>
                                </el-form-item>
                            </div>
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
                    <div class="block-bd" v-if="!toAddPlanFlag">
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
                                <el-button type="primary" style="margin-left: 20px;" @click="delPlan()">删除报价</el-button>
                            </el-form-item>
                            <el-form-item label="样品图片：">
                                <ul class="cm-simple-list" style="float: left;width: 800px;">
                                    <li v-for="(item,index) in sampleList">
                                        <div class="img-wrap" v-if="item.filepath">
                                            <img :src="item.filepath" @click="viewPicModal({imgUrl:item.filepath})">
                                            <div class="input-wrap" v-if="item.label">
                                                <input type="text" v-model="item.label" maxlength="20">
                                            </div>
                                        </div>
                                        <div class="info-list">
                                            <div v-for="(attr) in item.attrList" style="text-align: center;">
                                                <span class="label" v-if="index==0||index==7">{{attr.attrName}}：</span>
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
                            <el-button type="primary" @click="toAddPlan()">我要报价</el-button>
                        </el-row>
                    </div>
                    <!--新增-->
                    <div class="block-bd" v-if="toAddPlanFlag">
                        <el-form ref="form" :label-width="formLabelWidth" label-position="left">
                            <el-form-item label="样品图片：">
                                <ul class="cm-simple-list" style="float: left;width: 800px;">
                                    <li v-for="(item,index) in newSampleList" v-if="index<10">
                                        <div class="img-wrap" v-if="item.filepath">
                                            <img :src="item.filepath" @click="viewPicModal({imgUrl:item.filepath})">
                                            <i class="icon el-icon-delete del-btn" style="color: #48b4ff" @click="delSample(index)"></i>
                                            <div class="input-wrap">
                                                <input type="text" v-model="item.label" maxlength="20">
                                            </div>
                                        </div>
                                        <div class="cm-pic-uploader" v-loading="uploading" v-if="!item.filepath">
                                            <input  type="file" id="file-input" accept="image/*" @change="selectFile(index)">
                                            <div class="wrapper">
                                                <i class="icon add-icon el-icon-circle-plus"></i>
                                            </div>
                                        </div>
                                        <div class="info-list" :class="{'hidden':newSampleList.length>1&&!item.filepath}">
                                            <div v-for="(attr) in item.attrList">
                                                <span class="label" v-if="index==0||index==7">{{attr.attrName}}：</span>
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
                            <el-button type="danger" style="width: 80px;text-align: center;" @click="cancelAddPlan()">取消</el-button>
                        </el-row>
                        <div class="right-handle-list">
                            <el-button class="handle-btn" type="primary" icon="el-icon-edit" circle @click="saveTem()"></el-button>
                            <el-button class="handle-btn" type="" icon="el-icon-delete" circle @click="clearTem()"></el-button>
                        </div>
                    </div>
                </div>
            </div>


            <!--查看供应商信息-->
            <el-dialog class="view-user-dialog" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" >
                <div class="dialog-content">
                    <p class="title">{{userInfoType=='Customer'?'客户':'供应商'}}信息</p>
                    <div style="text-align: center;margin-top: 20px;margin-bottom: 10px;">
                        <img class="avatar" :src="curSupplier.httpUser_avatar?curSupplier.httpUser_avatar:defaultAvatar" alt="">
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
                        <span class="field">{{userInfoType=='Customer'?'客户':'供应商'}}简介：</span>
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
                            <textarea v-model="otherReason"  type="textarea" class="cm-textarea-box"  maxlength="1024"  cols="30" rows="10"></textarea>
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
    let XLSX = require('xlsx');

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
                curSupplierIndex:null,
                selectedPlan:null,
                selectedPlanName:null,
                loadingPlan:false,

                supplierList:[],
                curPlan:{},
                curPlanLabel:null,
                planList:[],
                toAddPlanFlag:false,
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
                downLoadFb:null,

                userInfoType:null,
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
            whenSupplierChange:function (index) {
                console.log('index:',index);
                this.curSupplier=this.allPlanList[index];
                this.selectedPlan=this.curSupplier.planList[0];
                this.selectedPlanName=this.selectedPlan.name;
                this.getPlan(this.selectedPlan.id);
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
                            this.curSupplierIndex=0;
                            this.curSupplier=this.allPlanList[this.curSupplierIndex];
                            console.log('this.curSupplier:',this.curSupplier);
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
                this.loadingPlan=true;
                Vue.api.getPlan(params).then((resp)=>{
                    this.loadingPlan=false;
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
                                label:data.samplepiconetag&&data.samplepiconetag!='undefined'?data.samplepiconetag:'',
                            });
                        }
                        if(data.samplepictwo){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepictwo,
                                filename:data.samplepictwo,
                                attrList:this.attrFormat(data.samplepictwo,proattrs),
                                label:data.samplepictwotag&&data.samplepictwotag!='undefined'?data.samplepictwotag:'',
                            });
                        }
                        if(data.samplepicthree){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicthree,
                                filename:data.samplepicthree,
                                attrList:this.attrFormat(data.samplepicthree,proattrs),
                                label:data.samplepicthreetag&&data.samplepicthreetag!='undefined'?data.samplepicthreetag:'',
                            });
                        }
                        if(data.samplepicfour){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicfour,
                                filename:data.samplepicfour,
                                attrList:this.attrFormat(data.samplepicfour,proattrs),
                                label:data.samplepicfourtag&&data.samplepicfourtag!='undefined'?data.samplepicfourtag:'',
                            });
                        }
                        if(data.samplepicfive){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicfive,
                                filename:data.samplepicfive,
                                attrList:this.attrFormat(data.samplepicfive,proattrs),
                                label:data.samplepicfivetag&&data.samplepicfivetag!='undefined'?data.samplepicfivetag:'',
                            });
                        }
                        if(data.samplepicsix){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicsix,
                                filename:data.samplepicsix,
                                attrList:this.attrFormat(data.samplepicsix,proattrs),
                                label:data.samplepicsixtag&&data.samplepicsixtag!='undefined'?data.samplepicsixtag:'',
                            });
                        }
                        if(data.samplepicseven){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicseven,
                                filename:data.samplepicseven,
                                attrList:this.attrFormat(data.samplepicseven,proattrs),
                                label:data.samplepicseventag&&data.samplepicseventag!='undefined'?data.samplepicseventag:'',
                            });
                        }
                        if(data.samplepiceight){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepiceight,
                                filename:data.samplepiceight,
                                attrList:this.attrFormat(data.samplepiceight,proattrs),
                                label:data.samplepiceighttag&&data.samplepiceighttag!='undefined'?data.samplepiceighttag:'',
                            });
                        }
                        if(data.samplepicnine){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicnine,
                                filename:data.samplepicnine,
                                attrList:this.attrFormat(data.samplepicnine,proattrs),
                                label:data.samplepicninetag&&data.samplepicninetag!='undefined'?data.samplepicninetag:'',
                            });
                        }
                        if(data.samplepicten){
                            this.sampleList.push({
                                filepath:Vue.basicConfig.imgPrefix+data.samplepicten,
                                filename:data.samplepicten,
                                attrList:this.attrFormat(data.samplepicten,proattrs),
                                label:data.samplepictentag&&data.samplepictentag!='undefined'?data.samplepictentag:'',
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
                     /*   console.log('this.task:',this.task);*/
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
                        let list=resp.message?JSON.parse(resp.message):[];
                        this.planList=[];
                        list.forEach((item,i)=>{
                            if(item.createrid==this.account.user_id+''){
                                let plan=JSON.parse(JSON.stringify(item));
                                plan.label='方案'+(this.planList.length+1);
                                this.planList.push(plan);
                            }
                            //
                        });
                        if(this.planList.length>0){
                            this.curPlan=this.planList[0];
                            this.curPlanLabel=this.curPlan.label;
                            this.getPlan(this.curPlan.id);
                        }else{
                            this.curPlan={};
                            this.curPlanLabel=null;
                            this.sampleList=[];
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
            delSample:function (index) {
                if(index==0){
                    this.newSampleList=[{
                        filepath:'',
                        filename:'',
                        attrList:JSON.parse(this.proattrs),
                    }];
                }else{
                    this.newSampleList.splice(index,1);
                }
            },
            toAddPlan:function () {
              this.toAddPlanFlag=true;
              this.readTem();
            },
            cancelAddPlan:function () {
                this.toAddPlanFlag=false;
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
                for(let i=0;i<this.newSampleList.length;i++){
                    let item=this.newSampleList[i];
                    if(item.filename){
                        for(let j=0;j<item.attrList.length;j++){
                            if(!item.attrList[j].attrValue){
                                Vue.operationFeedback({type:'warn',text:'请填写完整样品的相关信息'});
                                return;
                            }
                        }
                        count++;
                        proattrs.push(...item.attrList);
                        if(i==0){
                            params.samplepicone=item.filename;
                            params.samplepiconetag=item.label;
                        }else if(i==1){
                            params.samplepictwo=item.filename;
                            params.samplepictwotag=item.label;
                        }if(i==2){
                            params.samplepicthree=item.filename;
                            params.samplepicthreetag=item.label;
                        }if(i==3){
                            params.samplepicfour=item.filename;
                            params.samplepicfourtag=item.label;
                        }if(i==4){
                            params.samplepicfive=item.filename;
                            params.samplepicfivetag=item.label;
                        }if(i==5){
                            params.samplepicsix=item.filename;
                            params.samplepicsixtag=item.label;
                        }if(i==6){
                            params.samplepicseven=item.filename;
                            params.samplepicseventag=item.label;
                        }if(i==7){
                            params.samplepiceight=item.filename;
                            params.samplepiceighttag=item.label;
                        }if(i==8){
                            params.samplepicnine=item.filename;
                            params.samplepicninetag=item.label;
                        }if(i==9){
                            params.samplepicten=item.filename;
                            params.samplepictentag=item.label;
                        }
                    }
                }

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
                            this.newSampleList=[{
                                filepath:'',
                                filename:'',
                                attrList:JSON.parse(this.proattrs),
                            }];
                            this.feedbackText=null;
                            this.clearTem();
                            this.toAddPlanFlag=false;
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
            delPlan:function () {
              if(this.curPlan&&this.curPlan.id){
                  let params={
                      ...Vue.sessionInfo(),
                      quotaid:this.curPlan.id,
                  }
                  let fb=Vue.operationFeedback({text:'删除中...'});
                  Vue.api.delPlan(params).then((resp)=>{
                      if(resp.status=='success'){
                          if(resp.status=='success'){
                              this.getSupplierPlanList();
                              fb.setOptions({type:"complete",text:'删除成功'});
                          }else{
                              fb.setOptions({type:"warn",text:resp.message});
                          }
                      }
                  });
              }else{
                  Vue.operationFeedback({type:'warn',text:'请选择方案'});
                  return;
              }
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
            getCustomerInfo:function () {
                this.userInfoType='Customer';
                let params={
                    ...Vue.sessionInfo(),
                    uid:this.task.createrid
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
            },

            downloadFile: function (rs) { // 按钮导出
                let data = [{}]
                for (let k in rs[0]) {
                    data[0][k] = k
                }
                data = data.concat(rs)
                this.downloadExl(data, '菜单')
            },
            downloadExl: function (json, downName, type) {  // 导出到excel
                let keyMap = [] // 获取键
                for (let k in json[0]) {
                    keyMap.push(k)
                }
                /* console.info('keyMap', keyMap, json)*/
                let tmpdata = [] // 用来保存转换好的json
                json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                    v: v[k],
                    position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
                    tmpdata[v.position] = {
                        v: v.v
                    }
                })
                let outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
                let tmpWB = {
                    SheetNames: ['mySheet'], // 保存的表标题
                    Sheets: {
                        'mySheet': Object.assign({},
                            tmpdata, // 内容
                            {
                                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
                            })
                    }
                }
                let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
                    {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
                ))], {
                    type: ''
                })  // 创建二进制对象写入转换好的字节流
                var href = URL.createObjectURL(tmpDown)  // 创建对象超链接
                this.outFile.download = downName + '.xlsx'  // 下载名称
                this.outFile.href = href  // 绑定a标签
                this.outFile.click()  // 模拟点击实现下载
                this.downLoadFb.setOptions({type:'complete',text:'导出成功，请留意浏览器的下载文件'});
                setTimeout(function () {  // 延时释放
                    URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
                }, 100)
            },
            analyzeData: function (data) {  // 此处可以解析导入数据
                return data
            },
            s2ab: function (s) { // 字符串转字符流
                var buf = new ArrayBuffer(s.length)
                var view = new Uint8Array(buf)
                for (var i = 0; i !== s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF
                }
                return buf
            },
            getCharCol: function (n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
                let s = ''
                let m = 0
                while (n > 0) {
                    m = n % 26 + 1
                    s = String.fromCharCode(m + 64) + s
                    n = (n - m) / 26
                }
                return s
            },
            fixdata: function (data) {  // 文件流转BinaryString
                var o = ''
                var l = 0
                var w = 10240
                for (; l < data.byteLength / w; ++l) {
                    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                }
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
                return o
            },
            exportTask:function () {
                let jsonData=[
                    {
                        1:'序号',
                        2:'任务单号',
                        3:'客户编号',
                        4:'客户参考',
                        5:'物料完成时间',
                        6:'任务种类',
                        7:'下单时间',
                        8:'任务状态',
                    }
                ];
                jsonData.push({
                    1:1,
                    2:this.task.taskno,
                    3:this.task.custno,
                    4:this.task.custbasis,
                    5:this.task.plantime,
                    6:this.task.resourceLabel,
                    7:this.task.createtime,
                    8:Vue.taskStatus(this.task.status),
                });
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                this.downloadExl(jsonData,'任务导出表');
            },
            saveTem:function () {
                let temPlan={
                    newSampleList:this.newSampleList,
                    feedbackText:this.feedbackText,
                };
                localStorage.setItem('temPlan'+this.id,JSON.stringify(temPlan));
                this.$message({
                    message: '草稿保存成功',
                    type: 'success'
                });
            },
            readTem:function () {
                let temPlan=localStorage.getItem('temPlan'+this.id)?JSON.parse(localStorage.getItem('temPlan'+this.id)):null;
                console.log('temPlan:',temPlan);
                if(temPlan){
                    this.newSampleList=temPlan.newSampleList;
                    this.feedbackText=temPlan.feedbackText;
                }else{
                    this.newSampleList=[{
                        filepath:'',
                        filename:'',
                        attrList:JSON.parse(this.proattrs),
                    }];
                    this.feedbackText=null;
                }
            },
            clearTem:function () {
                localStorage.setItem('temPlan'+this.id,'');
                this.readTem();
            },
            back:function () {
                if(this.newSampleList&&this.newSampleList.length>0&&this.newSampleList[0].filepath){
                    this.saveTem();
                }
                this.$router.go(-1);
            },
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            this.account=Vue.getAccountInfo();
            /**/
            this.outFile = document.getElementById('downlink');
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
