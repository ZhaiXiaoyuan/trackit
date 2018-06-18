<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
                <el-breadcrumb-item>订单</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!id">新建订单</el-breadcrumb-item>
                <el-breadcrumb-item v-if="id">编辑订单</el-breadcrumb-item>
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
                            <!--<el-form-item class="input-item" label="任务种类：">
                                <el-select v-model="taskType" placeholder="请选择任务种类" style="width: 200px;">
                                    <el-option v-for="(item,index) in resourceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </el-form-item>-->
                            <el-form-item class="input-item" label="任务是否紧急：">
                                <el-radio-group v-model="isEmergency" size="medium">
                                    <el-radio :value="1" :label="1">是</el-radio>
                                    <el-radio :value="0" :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="block" v-for="(form,index) in productFormList">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">产品详情{{index+1}}</span>
                    </div>
                    <div class="block-bd">
                        <el-form :label-width="formLabelWidth" label-position="left">
                            <el-row type="flex">
                              <!--  <el-form-item class="input-item" label="产品名称：">
                                    <el-input v-model="form.productname" :maxlength="512" placeholder=""></el-input>
                                </el-form-item>-->
                                <el-form-item class="input-item" label="产品编号：">
                                    <el-input v-model="form.productcode" :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex">
                                <el-form-item class="input-item" label="产品单价：">
                                    <el-input v-model="form.price" :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                                <el-form-item class="input-item" label="产品数量：" style="margin-left: 50px;">
                                    <el-input v-model="form.amount" :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                            </el-row>
                            <el-form-item class="row-input-item" label="产品总价：">
                                <span>{{form.price*form.amount?(form.price*form.amount).toFixed(2):0}}</span>
                            </el-form-item>

                            <el-form-item label="客户确认图片：">
                               <ul class="cm-pic-list" style="float: left;">
                                   <li v-for="(item,picIndex) in form.picList">
                                       <img :src="item.filepath">
                                       <i class="icon el-icon-delete del-btn" style="color:#48b4ff" @click="delPic(index,picIndex)"></i>
                                       <div class="input-wrap">
                                           <input type="text" v-model="item.label" maxlength="20" placeholder="请输入标签">
                                       </div>
                                   </li>
                               </ul>
                               <div class="cm-pic-uploader" v-loading="uploading" style="margin: 5px;">
                                   <input  type="file" :id="'file-input-'+index" accept="image/*" @change="selectFile(index)">
                                   <div class="wrapper">
                                       <i class="icon add-icon el-icon-circle-plus"></i>
                                   </div>
                               </div>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="产品描述：">
                                <el-input v-model="form.productdesc"  type="textarea" class="cm-textarea-box"  :maxlength="1024"></el-input>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="客户要求栏：">
                                <el-input v-model="form.custrequire"  type="textarea" class="cm-textarea-box"  :maxlength="1024"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="text-align: center;padding: 10px 0px;">
                    <span class="add-product-btn cm-link-btn" style="text-decoration: underline;" @click="addProduct()">继续添加产品</span>
                </div>
                <div class="block" style="padding: 0px;">
                    <div class="block-bd">
                        <el-form :label-width="formLabelWidth" label-position="left">
                            <el-row type="flex">
                                <el-form-item class="input-item" label="关联的任务号：">
                                    <span class="cm-link-btn">{{taskNo}}</span>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </div>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="!id">
                <el-button type="primary" @click="save()">确认发布并分配</el-button>
                <el-button type="danger" style="width: 116px;" @click="$router.go(-1)">取消发布</el-button>
            </el-row>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="id">
                <el-button type="primary" style="width: 116px;" @click="save()">保存</el-button>
                <el-button type="danger" style="width: 116px;" @click="$router.go(-1)">取消</el-button>
            </el-row>

            <div class="right-handle-list" v-if="!id">
                <el-button class="handle-btn" type="primary" icon="el-icon-edit" circle @click="saveTem()"></el-button>
                <el-button class="handle-btn" type="" icon="el-icon-delete" circle @click="clearTem()"></el-button>
            </div>
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
        margin-top: 20px;
    }
    .input-item{
        margin-top: 5px;
        margin-bottom: 5px;
        &+.input-item{
            margin-right: 15px;
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
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                id:null,

                dialogFormVisible: false,
                formLabelWidth:'120px',

                curDateStrArr:Vue.formatDate(new Date(),'yyyy.MM.dd').split('.'),


                taskNo:null,
                uploading:false,
                customerNo:null,
                customerNote:null,
                completeDate:null,
                taskType:'Buliao',
                isEmergency:1,

                formObject:{
                 /*   "productname": null,//"产品名称",*/
                    "productcode":  null,//"产品编号",
                    "amount":  null,//"产品数量",
                    "price":  null,//"产品单价",
                    "productdesc":  null,//"产品描述",
                    "custrequire":  null,//"客户要求",
                    "picList":[
                        /*{"filepath":"http://120.79.17.251:8000/zfiles/Pic2018052101004353020.jpg","filename":"Pic2018052101004353020.jpg",label:'标题'}*/
                    ],
                },
                productFormList:[],

                productList:[],
            }
        },
        created(){

        },
        computed: {

        },
        methods: {
            selectFile:function (index) {
                let file=document.getElementById('file-input-'+index).files[0];
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
                        this.productFormList[index].picList.push(data);
                    }else{
                        Vue.operationFeedback({type:'warn',text:'上传失败'});
                    }
                });
            },
            delPic:function (index,picIndex) {
                this.productFormList[index].picList.splice(picIndex,1);
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

                /*if(this.picList.length==0){
                    Vue.operationFeedback({type:'warn',text:'请上传任务样品图片'});
                    return;
                }
                if(!this.custRequire){
                        Vue.operationFeedback({type:'warn',text:'请输入客户要求栏'});
                    return;
                }*/
                let params={
                    ...Vue.sessionInfo(),
                    taskno:this.taskNo,
                    custno:this.customerNo,
                    custbasis:this.customerNote,
                    plantime:Vue.formatDate(this.completeDate,'yyyy-MM-dd'),
                    resource:this.taskType,
                    urgent:this.isEmergency,
                }
                let proinfos=[];
                for(let i=0;i<this.productFormList.length;i++){
                    let form=this.productFormList[i];
                    if(form.picList.length==0){
                        Vue.operationFeedback({type:'warn',text:'请上传相关产品的客户确认图片'});
                        return;
                    }
                  /*  if(!form.productname){
                        Vue.operationFeedback({type:'warn',text:'请上传相关产品的产品名称'});
                        return;
                    }*/
                    if(!form.productcode){
                        Vue.operationFeedback({type:'warn',text:'请输入相关产品的产品编号'});
                        return;
                    }
                    if(!form.price){
                        Vue.operationFeedback({type:'warn',text:'请输入相关产品的产品单价'});
                        return;
                    }
                    if(!regex.float.test(form.price)){
                        Vue.operationFeedback({type:'warn',text:'相关产品的产品单价有误，'+regex.floatAlert});
                        return;
                    }
                    if(!form.amount){
                        Vue.operationFeedback({type:'warn',text:'请输入相关产品的产品数量'});
                        return;
                    }
                    if(!regex.pInt.test(form.amount)){
                        Vue.operationFeedback({type:'warn',text:'相关产品的产品数量有误，'+regex.pIntAlert});
                        return;
                    }
                    for(let j=0;j<form.picList.length;j++){
                        let item=form.picList[j];
                        if(j==0){
                            form.custpicone=item.filename;
                            form.custpiconetag=item.label?item.label:null;
                        }if(j==1){
                            form.custpictwo=item.filename;
                            form.custpictwotag=item.label?item.label:null;
                        }if(j==2){
                            form.custpicthree=item.filename;
                            form.custpicthreetag=item.label?item.label:null;
                        }if(j==3){
                            form.custpicfour=item.filename;
                            form.custpicfourtag=item.label?item.label:null;
                        }if(j==4){
                            form.custpicfive=item.filename;
                            form.custpicfivetag=item.label?item.label:null;
                        }if(j==5){
                            form.custpicsix=item.filename;
                            form.custpicsixtag=item.label?item.label:null;
                        }if(j==6){
                            form.custpicseven=item.filename;
                            form.custpicseventag=item.label?item.label:null;
                        }if(j==7){
                            form.custpiceight=item.filename;
                            form.custpiceighttag=item.label?item.label:null;
                        }if(j==8){
                            form.custpicnine=item.filename;
                            form.custpicninetag=item.label?item.label:null;
                        }if(j==9){
                            form.custpicten=item.filename;
                            form.custpicninetag=item.label?item.label:null;
                        }
                    }
                    proinfos.push(form);
                }
                params.proinfos=JSON.stringify(proinfos);
                let fb=Vue.operationFeedback({text:'保存中...'});
                if(!this.id){//新增
                    Vue.api.addOrder(params).then((resp)=>{
                        if(resp.status=='success'){
                            let data=JSON.parse(resp.message);
                            fb.setOptions({type:"complete",text:'保存成功'});
                            this.$router.push({name:'allocateOrder',params:{id:data.id}});
                        }else{
                            fb.setOptions({type:"warn",text:resp.message});
                        }
                    });
                }else{//编辑
                    params.id=this.id;
                    Vue.api.updateOrder(params).then((resp)=>{
                        if(resp.status=='success'){
                            fb.setOptions({type:"complete",text:'保存成功'});
                            this.$router.push({name:'orderDetail',params:{id:this.id}});
                        }else{
                            fb.setOptions({type:"warn",text:resp.message});
                        }
                    });
                }

            },
            addProduct:function () {
                this.productFormList.push(JSON.parse(JSON.stringify(this.formObject)));
            },

            findStatusItem:function (value) {
                return this.statusLogs.find(function(x) {return parseInt(x.status) == value;});
            },
            getOrderDetail:function () {
                let params={
                    ...Vue.sessionInfo(),
                    ordezid:this.id,
                }
                Vue.api.getOrderDetail(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.order=JSON.parse(resp.message);
                        console.log('this.order:',this.order);
                        this.order.status=parseInt(this.order.status);
                        this.taskNo=this.order.taskno&&this.order.taskno!='undefined'?this.order.taskno:null;
                        this.customerNo=this.order.custno;
                        this.customerNote=this.order.custbasis;
                        this.completeDate=this.order.plantime;
                        this.isEmergency=this.order.urgent;

                        this.productList=this.order.products;
                        this.productList.forEach((product,i)=>{
                            product.picList=[];
                            if(product.custpicone){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicone,
                                    filename:product.custpicone,
                                    label:product.custpiconetag
                                });
                            }
                            if(product.custpictwo){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpictwo,
                                    filename:product.custpictwo,
                                    label:product.custpictwotag
                                });
                            }
                            if(product.custpicthree){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicthree,
                                    filename:product.custpicthree,
                                    label:product.custpicthreetag
                                });
                            }
                            if(product.custpicfour){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicfour,
                                    filename:product.custpicfour,
                                    label:product.custpicfourtag
                                });
                            }
                            if(product.custpicfive){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicfive,
                                    filename:product.custpicfive,
                                    label:product.custpicfivetag
                                });
                            }
                            if(product.custpicsix){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicsix,
                                    filename:product.custpicsix,
                                    label:product.custpicsixtag
                                });
                            }
                            if(product.custpicseven){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicseven,
                                    filename:product.custpicseven,
                                    label:product.custpicseventag
                                });
                            }
                            if(product.custpiceight){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpiceight,
                                    filename:product.custpiceight,
                                    label:product.custpiceighttag
                                });
                            }
                            if(product.custpicnine){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicnine,
                                    filename:product.custpicnine,
                                    label:product.custpicninetag
                                });
                            }
                            if(product.custpicten){
                                product.picList.push({
                                    filepath:Vue.basicConfig.imgPrefix+product.custpicten,
                                    filename:product.custpicten,
                                    label:product.custpicninetag
                                });
                            }
                            this.productFormList.push(JSON.parse(JSON.stringify(product)));
                        })
                    }
                });
            },

            back:function () {
                if(!this.id&&this.customerNo){
                    this.$confirm('是否要保存草稿?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.saveTem();
                        this.$message({
                            type: 'success',
                            message: '草稿保存成功!'
                        });
                        this.$router.go(-1);
                    }).catch(() => {
                        this.$router.go(-1);
                    });
                }else{
                    this.$router.go(-1);
                }
            },
            saveTem:function () {
                let temOrder={
                    customerNo:this.customerNo,
                    customerNote:this.customerNote,
                    completeDate:this.completeDate,
                    isEmergency:this.isEmergency,
                    productFormList:this.productFormList,

                };
                localStorage.setItem('temOrder',JSON.stringify(temOrder));
                this.$message({
                    message: '草稿保存成功',
                    type: 'success'
                });
            },
            readTem:function () {
                let temOrder=localStorage.getItem('temOrder')?JSON.parse(localStorage.getItem('temOrder')):null;
                if(temOrder){
                    Object.assign(this,temOrder);
                }else{
                    this.customerNo=null;
                    this.customerNote=null;
                    this.completeDate=null;
                    this.isEmergency=1;
                    this.productFormList=[];
                    this.addProduct();
                }
            },
            clearTem:function () {
                localStorage.setItem('temOrder','');
                //
                this.readTem();
            },
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            if(this.id){
                this.getOrderDetail();
            }else{
                this.readTem();
            }
        },
    }
</script>
