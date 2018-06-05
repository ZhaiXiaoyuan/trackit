<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
                <el-breadcrumb-item>任务</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!id">新建任务</el-breadcrumb-item>
                <el-breadcrumb-item v-if="id">编辑任务</el-breadcrumb-item>
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
                                <el-input v-model="customerNo" :maxlength="32" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item class="input-item" label="客户参考：">
                                <el-input v-model="customerNote" :maxlength="512" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item class="input-item" label="预计完成时间：">
                                <el-date-picker type="date" placeholder="选择日期" v-model="completeDate"></el-date-picker>
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
                                       <img :src="item.filepath" @click="viewPicModal({imgUrl:item.filepath})">
                                       <i class="icon el-icon-delete del-btn" @click="delPic(index)"></i>
                                       <div class="input-wrap">
                                           <input type="text" v-model="item.label" maxlength="20" placeholder="请输入标签">
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
                            <el-form-item class="row-input-item" label="客户要求栏：">
                                <el-input v-model="custRequire" :maxlength="1024"></el-input>
                            </el-form-item>
                            <el-form-item label="任务是否紧急：">
                                <el-radio-group v-model="isEmergency" size="medium">
                                    <el-radio :value="1" :label="1">是</el-radio>
                                    <el-radio :value="0" :label="0">否</el-radio>
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
                            <li v-for="(item,index) in labelList" :class="{'active':item.active}" @click="selectLabel(index)">{{item.label}}</li>
                            <li class="add-btn" @click="dialogFormVisible=true">
                                <svg class="icon blue-icon" aria-hidden="true">
                                    <use xlink:href="#icon-tianjia"></use>
                                </svg>
                            </li>
                        </ul>
                        <ul class="label-list sub-list" v-if="subList&&subList.length>0">
                            <li v-for="(item,index) in subList" :class="{'active':item.active}" @click="selectSubLabel(index)">{{item.label}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                <el-button type="primary" @click="save()" v-if="!id">确认发布</el-button>
                <el-button type="primary" @click="update()" v-if="id">确认发布</el-button>
                <el-button type="" @click="$router.go(-1)">取消发布</el-button>
            </el-row>
        </div>
        <el-dialog title="新建信息标签" class="add-label-dialog" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" >
            <div style="text-align: center">
                <el-input v-model="newLabel" placeholder="请输入信息描述" :maxlength="50" style="width: 100%;"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addLabel()">确定</el-button>
            </div>
        </el-dialog>
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
        margin: 5px 0px;
        &+.input-item{
            margin-left: 15px;
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
            &.active{
                background: #48b4ff;
                color: #fff;
                border: 1px solid #48b4ff;
            }
        }
        .add-btn{
            border: none;
            padding: 0px;
            .icon{
                font-size: 34px;
            }
        }
    }
    .sub-list{
        margin-top: 20px;
        border: 1px solid #e5e5e5;
        padding: 20px;
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                id:null,
                dialogFormVisible: false,

                curDateStrArr:Vue.formatDate(new Date(),'yyyy.MM.dd').split('.'),

                labelList:[
                  /*  {
                        label:'样品货号',
                        value:'',
                        active:false,
                    },*/
                ],
                subList:[],
                newLabel:null,
                inputValue:null,


                uploading:false,
                picList:[
                  /*  {"filepath":"http://120.79.17.251:8000/zfiles/Pic2018052101004353020.jpg","filename":"Pic2018052101004353020.jpg",label:'标题'}*/
                    ],
                customerNo:null,
                customerNote:null,
                completeDate:null,
                taskType:'Buliao',
                isEmergency:1,
                custRequire:null,

                task:null,
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
                        let data=JSON.parse(resp.message)
                        this.picList.push(data);
                        console.log('this.picList:',this.picList);
                    }else{
                        Vue.operationFeedback({type:'warn',text:'上传失败'});
                    }
                });
            },
            delPic:function (index) {
                this.picList.splice(index,1);
            },
            selectLabel:function (index) {
                let item=this.labelList[index];
                item.active=!item.active;
                if(item.children&&item.children.length>0){
                    if(item.active){
                        this.subList=item.children;
                    }else{
                        this.subList=[];
                        item.children.forEach((item,i)=>{
                            item.active=false;
                        })
                    }
                }
            },
            selectSubLabel:function (index) {
                let item=this.subList[index];
                item.active=!item.active;
            },
            addLabel:function () {
                let str=this.newLabel;
                this.labelList.push({
                    label:str,
                    value:'',
                    active:true,
                });
                this.newLabel=null;
                this.dialogFormVisible=false;
            },
            save:function () {
                if(!this.customerNo){
                    Vue.operationFeedback({type:'warn',text:'请输入客户编号'});
                    return;
                }
                if(!this.customerNote){
                    Vue.operationFeedback({type:'warn',text:'请输入客户参考'});
                    return;
                }
                if(!this.completeDate){
                    Vue.operationFeedback({type:'warn',text:'选择预计完成时间'});
                    return;
                }
                if(!this.taskType){
                    Vue.operationFeedback({type:'warn',text:'请选择任务种类'});
                    return;
                }
                if(this.picList.length==0){
                    Vue.operationFeedback({type:'warn',text:'请上传任务样品图片'});
                    return;
                }
                if(!this.custRequire){
                        Vue.operationFeedback({type:'warn',text:'请输入客户要求栏'});
                    return;
                }
                let selectedLabelStr='';
                let temArr=[];
                this.labelList.forEach((item,i)=>{
                    if(item.active){
                        if(item.children&&item.children.length>0){
                            item.children.forEach((child,index)=>{
                                if(item.active){
                                    temArr.push(child.id+':'+child.label);
                                }
                            });
                        }else{
                            temArr.push(item.id+':'+item.label);
                        }
                    }
                });
                selectedLabelStr=temArr.join(',');
                if(!selectedLabelStr||selectedLabelStr==''){
                    Vue.operationFeedback({type:'warn',text:'请勾选需要供应商提供的相关信息'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    custno:this.customerNo,
                    custbasis:this.customerNote,
                    plantime:Vue.formatDate(this.completeDate,'yyyy-MM-dd'),
                    resource:this.taskType,
                    custrequire:this.custRequire,
                    urgent:this.isEmergency,
                    proattrs:selectedLabelStr,
                }
                for(let i=0;i<this.picList.length;i++){
                    let item=this.picList[i];
                  /*  if(!item.label){
                        Vue.operationFeedback({type:'warn',text:'请填写所有样品图片的标签'});
                        return;
                    }*/
                    if(i==0){
                        params.custpropicone=item.filename;
                        params.custpropiconetag=item.label?item.label:null;
                    }if(i==1){
                        params.custpropictwo=item.filename;
                        params.custpropictwotag=item.label?item.label:null;
                    }if(i==2){
                        params.custpropicthree=item.filename;
                        params.custpropicthreetag=item.label?item.label:null;
                    }if(i==3){
                        params.custpropicfour=item.filename;
                        params.custpropicfourtag=item.label?item.label:null;
                    }if(i==4){
                        params.custpropicfive=item.filename;
                        params.custpropicfivetag=item.label?item.label:null;
                    }if(i==5){
                        params.custpropicsix=item.filename;
                        params.custpropicsixtag=item.label?item.label:null;
                    }if(i==6){
                        params.custpropicseven=item.filename;
                        params.custpropicseventag=item.label?item.label:null;
                    }if(i==7){
                        params.custpropiceight=item.filename;
                        params.custpropiceighttag=item.label?item.label:null;
                    }if(i==8){
                        params.custpropicnine=item.filename;
                        params.custpropicninetag=item.label?item.label:null;
                    }if(i==9){
                        params.custpropicten=item.filename;
                        params.custpropicninetag=item.label?item.label:null;
                    }
                }

                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.addTask(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'保存成功'});
                        this.$router.push({name:'task'});
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });

            },

            getCustomerTaskDetail:function () {
                let params={
                    ...Vue.sessionInfo(),
                    id:this.id,
                }
                Vue.api.getCustomerTaskDetail(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.task=JSON.parse(resp.message);
                        console.log('this.task:',this.task);
                        this.task.status=parseInt(this.task.status);

                        //
                        this.customerNo=this.task.custno;
                        this.customerNote=this.task.custbasis;
                        this.completeDate=Vue.formatDate(this.task.plantime,'yyyy-MM-dd');
                        this.taskType=this.task.resource;
                        this.isEmergency=this.task.urgent;
                        this.custRequire=this.task.custrequire;
                        let proattrs=JSON.parse(this.task.proattrs);
                        for(let i=0;i<proattrs.length;i++){
                            let attr=proattrs[i];
                            for(let j=0;j<this.labelList.length;j++){
                                let label=this.labelList[j];
                                if(attr.attrName==label.label){
                                    label.active=true;
                                    break;
                                }else if(j==this.labelList.length-1){
                                    this.labelList.push({
                                        label:attr.attrName,
                                        value:'',
                                        active:true,
                                    })
                                }
                            }
                        }

                        if(this.task.custpropicone){
                            this.picList.push({
                                filepath:this.task.custpropiconeUrl,
                                label:this.task.custpropiconetag,
                                filename:this.task.custpropicone
                            })
                        }
                        if(this.task.custpropictwo){
                            this.picList.push({
                                filepath:this.task.custpropictwoUrl,
                                label:this.task.custpropictwotag,
                                filename:this.task.custpropictwo
                            })
                        }
                        if(this.task.custpropicthree){
                            this.picList.push({
                                filepath:this.task.custpropicthreeUrl,
                                label:this.task.custpropicthreetag,
                                filename:this.task.custpropicthree
                            })
                        }
                        if(this.task.custpropicfour){
                            this.picList.push({
                                filepath:this.task.custpropicfourUrl,
                                label:this.task.custpropicfourtag,
                                filename:this.task.custpropicfour
                            })
                        }
                        if(this.task.custpropicfive){
                            this.picList.push({
                                filepath:this.task.custpropicfiveUrl,
                                label:this.task.custpropicfivetag,
                                filename:this.task.custpropicfive
                            })
                        }
                        if(this.task.custpropicsix){
                            this.picList.push({
                                filepath:this.task.custpropicsixUrl,
                                label:this.task.custpropicsixtag,
                                filename:this.task.custpropicsix
                            })
                        }
                        if(this.task.custpropicseven){
                            this.picList.push({
                                filepath:this.task.custpropicsevenUrl,
                                label:this.task.custpropicseventag,
                                filename:this.task.custpropicseven
                            })
                        }
                        if(this.task.custpropiceight){
                            this.picList.push({
                                filepath:this.task.custpropiceightUrl,
                                label:this.task.custpropiceighttag,
                                filename:this.task.custpropiceight
                            })
                        }
                        if(this.task.custpropicnine){
                            this.picList.push({
                                filepath:this.task.custpropicnineUrl,
                                label:this.task.custpropicninetag,
                                filename:this.task.custpropicnine
                            })
                        }
                        if(this.task.custpropicten){
                            this.picList.push({
                                filepath:this.task.custpropictenUrl,
                                label:this.task.custpropictentag,
                                filename:this.task.custpropicten
                            })
                        }
                    }else{

                    }
                });
            },

            update:function () {
                if(!this.customerNo){
                    Vue.operationFeedback({type:'warn',text:'请输入客户编号'});
                    return;
                }
                if(!this.customerNote){
                    Vue.operationFeedback({type:'warn',text:'请输入客户参考'});
                    return;
                }
                if(!this.completeDate){
                    Vue.operationFeedback({type:'warn',text:'选择预计完成时间'});
                    return;
                }
                if(!this.taskType){
                    Vue.operationFeedback({type:'warn',text:'请选择任务种类'});
                    return;
                }
                if(this.picList.length==0){
                    Vue.operationFeedback({type:'warn',text:'请上传任务样品图片'});
                    return;
                }
                if(!this.custRequire){
                    Vue.operationFeedback({type:'warn',text:'请输入客户要求栏'});
                    return;
                }
                let selectedLabelStr='';
                this.labelList.forEach((item,i)=>{
                    if(item.active){
                        selectedLabelStr+=(i>0?',':'')+(i+1)+':'+item.label;
                    }
                })
                if(!selectedLabelStr||selectedLabelStr==''){
                    Vue.operationFeedback({type:'warn',text:'请勾选需要供应商提供的相关信息'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    id:this.id,
                    custno:this.customerNo,
                    custbasis:this.customerNote,
                    plantime:Vue.formatDate(this.completeDate,'yyyy-MM-dd'),
                    resource:this.taskType,
                    custrequire:this.custRequire,
                    urgent:this.isEmergency,
                    proattrs:selectedLabelStr,
                }
                this.picList.forEach((item,i)=>{
                    if(i==0){
                        params.custpropicone=item.filename;
                        params.custpropiconetag=item.label?item.label:null;
                    }if(i==1){
                        params.custpropictwo=item.filename;
                        params.custpropictwotag=item.label?item.label:null;
                    }if(i==2){
                        params.custpropicthree=item.filename;
                        params.custpropicthreetag=item.label?item.label:null;
                    }if(i==3){
                        params.custpropicfour=item.filename;
                        params.custpropicfourtag=item.label?item.label:null;
                    }if(i==4){
                        params.custpropicfive=item.filename;
                        params.custpropicfivetag=item.label?item.label:null;
                    }if(i==5){
                        params.custpropicsix=item.filename;
                        params.custpropicsixtag=item.label?item.label:null;
                    }if(i==6){
                        params.custpropicseven=item.filename;
                        params.custpropicseventag=item.label?item.label:null;
                    }if(i==7){
                        params.custpropiceight=item.filename;
                        params.custpropiceighttag=item.label?item.label:null;
                    }if(i==8){
                        params.custpropicnine=item.filename;
                        params.custpropicninetag=item.label?item.label:null;
                    }if(i==9){
                        params.custpropicten=item.filename;
                        params.custpropicninetag=item.label?item.label:null;
                    }
                })
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.updateTask(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'保存成功'});
                        this.$router.push({name:'taskDetail',params:{id:this.id}});
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });

            },
            getProattrs:function () {
                let params={
                    ...Vue.sessionInfo(),
                }
                Vue.api.getProattrs(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        data.forEach((item,i)=>{
                            let temItem={
                                id:item.id,
                                label:item.name,
                                value:item.code,
                                active:false,
                            }
                            if(item.children&&item.children.length>0){
                                temItem.children=[];
                                item.children.forEach((child,index)=>{
                                    temItem.children.push({
                                        id:child.id,
                                        label:child.name,
                                        value:child.code,
                                        active:false,
                                    });
                                });
                            }
                            this.labelList.push(temItem);
                        })
                    }else{

                    }
                });
            }
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            this.account=Vue.getAccountInfo();
            this.getProattrs();
            /**/
            if(this.id){
                this.getCustomerTaskDetail();
            }
        },
    }
</script>
