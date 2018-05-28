<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
                <el-breadcrumb-item>订单</el-breadcrumb-item>
                <el-breadcrumb-item>订单详情</el-breadcrumb-item>
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
                            <span class="title">订单信息</span>
                            <i class="icon emergency-icon" v-if="order.urgent"></i>
                        </el-col>
                        <el-col :span="12" style="text-align: right;">
                            <el-button>导出</el-button>
                        </el-col>
                    </el-row>
                    <div class="block-bd">
                        <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                            <el-table-column prop="orderno" label="订单号" align="center"></el-table-column>
                            <el-table-column prop="custno" label="客户编号"  align="center"></el-table-column>
                            <el-table-column prop="custbasis" label="客户参考"  align="center"></el-table-column>
                            <el-table-column prop="plantime" label="物料完成时间"  align="center"></el-table-column>
                            <el-table-column prop="createtime" label="下单时间" align="center"></el-table-column>
                            <el-table-column label="任务状态" width="200"  align="center">
                                <template slot-scope="scope">
                                    {{scope.row.status|orderStatus}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="block" v-for="(form,index) in productList">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">产品详情{{index+1}}</span>
                    </div>
                    <div class="block-bd">
                        <el-form :label-width="formLabelWidth" label-position="left">
                            <el-row type="flex">
                                <el-form-item class="input-item" label="产品名称：">
                                    <el-input v-model="form.productname" readonly :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                                <el-form-item class="input-item" label="产品编号：" style="margin-left: 50px;">
                                    <el-input v-model="form.productcode" readonly :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row type="flex">
                                <el-form-item class="input-item" label="产品单价：">
                                    <el-input v-model="form.price" readonly :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                                <el-form-item class="input-item" label="产品数量：" style="margin-left: 50px;">
                                    <el-input v-model="form.amount" readonly :maxlength="512" placeholder=""></el-input>
                                </el-form-item>
                            </el-row>
                            <el-form-item class="row-input-item" label="产品总价：">
                                <span>{{form.price*form.amount?form.price*form.amount:0}}</span>
                            </el-form-item>

                            <el-form-item label="客户确认图片：">
                               <ul class="cm-pic-list" style="float: left;">
                                   <li v-for="(item,picIndex) in form.picList">
                                       <img :src="item.filepath">
                                       <div class="input-wrap">
                                           <input type="text" v-model="item.label" readonly maxlength="20">
                                       </div>
                                   </li>
                               </ul>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="产品描述：">
                                <el-input v-model="form.productdesc" readonly :maxlength="1024"></el-input>
                            </el-form-item>
                            <el-form-item class="row-input-item" label="客户要求栏：">
                                <el-input v-model="form.custrequire" readonly :maxlength="1024"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="block" v-for="(form,index) in productList">
                    <div class="block-hd">
                        <svg class="icon blue-icon" aria-hidden="true">
                            <use xlink:href="#icon-biaoge"></use>
                        </svg>
                        <span class="title">订单状态</span>
                    </div>
                    <div class="block-bd">
                        <ul class="status-list" v-if="order.status<10">
                            <li v-for="(item,index) in statusList" :class="{'complete':item.status<order.status,'active':item.status==order.status}">
                                <span class="line" v-if="index>0"></span>
                                <div class="item-content">
                                    <span class="index">{{index+1}}</span>
                                    <p class="title" :class="{'lg':index==0}">{{item.title}}</p>
                                    <p class="time">{{item.time}}</p>
                                </div>
                            </li>
                        </ul>
                        <p v-if="order.status==10" style="text-align: center;font-size: 20px;color: #F56C6C;">订单已取消</p>
                    </div>
                </div>
            </div>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="account.user_type=='Customer'">
                <el-button type="primary" style="width: 116px;" v-if="order.status==1" @click="$router.push({ name: 'allocateOrder', params: {id:id}})">分配订单</el-button>
                <el-button type="primary" v-if="order.status==8" @click="setStatus(9)">确认订单完成</el-button>
                <el-button type="danger" style="width: 116px;" v-if="order.status<9" @click="setStatus(10)">取消订单</el-button>
            </el-row>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="account.user_type=='Supplier'">
                <el-button type="primary" v-if="order.status==2" @click="setStatus(4)">确认接单</el-button>
                <el-button type="primary" v-if="order.status==4" @click="setStatus(5)">确认材料</el-button>
                <el-button type="primary" v-if="order.status==5" @click="setStatus(6)">确认大货样</el-button>
                <el-button type="primary" v-if="order.status==6" @click="setStatus(8)">出货</el-button>
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
    .status-list{
        margin-left: 5px;
        display: flex;
        justify-content: center;
        >li{
            display: flex;
            .line{
                position: relative;
                top:20px;
                display: inline-block;
                width: 28px;
                height: 2px;
                border: 2px dotted #ddd;
            }
            .item-content{
                text-align: center;
                font-size: 14px;
                color: #999;
                width: 100px;
                .index{
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #ddd;
                    color: #fff;
                    font-size: 20px;
                    text-align: center;
                    line-height: 40px;
                }
                .title{
                    padding: 10px 0px;
                    word-break: break-all;
                    position: relative;
                    text-align: center;
                    &.lg{
                        width: 180px;
                        position: relative;
                        left: -38px;
                    }
                }
            }
            &.complete{
                .line{
                    border-color: #409EFF;
                }
                .item-content{
                    color: #409EFF;
                    .index{
                        background: #409EFF;
                    }
                }
            }
            &.active{
                .line{
                    border-color: #F56C6C;
                }
                .item-content{
                    color: #F56C6C;
                    .index{
                        background: #F56C6C;
                    }
                }
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
                formLabelWidth:'120px',

                id:null,

                account:{},

                order:{},
                entryList:[],
                productList:[],
                statusList:[
                    {
                        title:'订单已分配，等待确认',
                        time:'',
                        status:2,
                    },
                 /*   {
                        title:'确认信息与风险',
                        time:'',
                        status:3,
                    },*/
                    {
                        title:'确认接单',
                        time:'',
                        status:4,
                    },
                    {
                        title:'确认材料',
                        time:'',
                        status:5,
                    },
                    {
                        title:'确认大货样',
                        time:'',
                        status:6,
                    },
                   /* {
                        title:'确认大货质量',
                        time:'',
                        status:7,
                    },*/
                    {
                        title:'出货',
                        time:'',
                        status:8,
                    },
                    {
                        title:'完成订单',
                        time:'',
                        status:9,
                    },
                ],
                statusLogs:[],
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
                    if(!form.productname){
                        Vue.operationFeedback({type:'warn',text:'请上传相关产品的产品名称'});
                        return;
                    }
                    if(!form.productcode){
                        Vue.operationFeedback({type:'warn',text:'请上传相关产品的产品编号'});
                        return;
                    }
                    if(!form.price){
                        Vue.operationFeedback({type:'warn',text:'请上传相关产品的产品单价'});
                        return;
                    }
                    if(!regex.float.test(form.price)){
                        Vue.operationFeedback({type:'warn',text:'相关产品的产品单价'+regex.floatAlert});
                        return;
                    }
                    if(!form.amount){
                        Vue.operationFeedback({type:'warn',text:'请上传相关产品的产品数量'});
                        return;
                    }
                    if(!regex.pInt.test(form.amount)){
                        Vue.operationFeedback({type:'warn',text:'相关产品的产品数量'+regex.pIntAlert});
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
                Vue.api.addOrder(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'保存成功'});
                       /* this.$router.push({name:'order'});*/
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });

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
                      this.order.status=parseInt(this.order.status);
                      this.entryList.push(this.order);
                      this.productList=this.order.products;
                      this.statusLogs=this.order.statusLogs;
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
                                  filename:product.custpictwo,
                                  label:product.custpictwotag
                              });
                          }
                          if(product.custpicthree){
                              product.picList.push({
                                  filename:product.custpicthree,
                                  label:product.custpicthreetag
                              });
                          }
                          if(product.custpicfour){
                              product.picList.push({
                                  filename:product.custpicfour,
                                  label:product.custpicfourtag
                              });
                          }
                          if(product.custpicfive){
                              product.picList.push({
                                  filename:product.custpicfive,
                                  label:product.custpicfivetag
                              });
                          }
                          if(product.custpicsix){
                              product.picList.push({
                                  filename:product.custpicsix,
                                  label:product.custpicsixtag
                              });
                          }
                          if(product.custpicseven){
                              product.picList.push({
                                  filename:product.custpicseven,
                                  label:product.custpicseventag
                              });
                          }
                          if(product.custpiceight){
                              product.picList.push({
                                  filename:product.custpiceight,
                                  label:product.custpiceighttag
                              });
                          }
                          if(product.custpicnine){
                              product.picList.push({
                                  filename:product.custpicnine,
                                  label:product.custpicninetag
                              });
                          }
                          if(product.custpicten){
                              product.picList.push({
                                  filename:product.custpicten,
                                  label:product.custpicninetag
                              });
                          }
                      })
                      this.statusList.forEach((item,i)=>{
                          let statusItem=this.findStatusItem(item.status);
                          item.time=statusItem?statusItem.date:'';
                      });
                  }
              });
            },
            setStatus:function (value) {
                let params={
                    ...Vue.sessionInfo(),
                    ordezid:this.id,
                    status:value
                }
                let fb=Vue.operationFeedback({text:'设置中...'});
                Vue.api.setOrderStatus(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'设置成功'});
                        this.order.status=value;
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
            this.getOrderDetail();
        },
    }
</script>
