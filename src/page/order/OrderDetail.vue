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
                            <el-button @click="exportOrder">导出</el-button>
                            <a id="downlink"></a>
                        </el-col>
                    </el-row>
                    <div class="block-bd">
                        <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                            <el-table-column prop="orderno" label="订单号" align="center"></el-table-column>
                            <el-table-column prop="custno" label="客户编号"  align="center"></el-table-column>
                            <el-table-column prop="custbasis" label="客户参考"  align="center"></el-table-column>
                            <el-table-column prop="plantime" label="物料完成时间"  align="center"></el-table-column>
                            <el-table-column prop="createtime" label="下单时间" align="center"></el-table-column>
                            <el-table-column prop="suppliername" label="供应商名称" align="center"></el-table-column>
                            <el-table-column label="任务状态"  align="center">
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
                              <!--  <el-form-item class="input-item" label="产品名称：">
                                    <el-input v-model="form.productname" readonly :maxlength="512" placeholder=""></el-input>
                                </el-form-item>-->
                                <el-form-item class="input-item" label="产品编号：">
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
                                       <img :src="item.filepath" @click="viewPicModal({imgUrl:item.filepath})">
                                       <div class="input-wrap" v-if="item.label">
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
                <div class="block">
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
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="account.user_type=='Customer'&&order.status!=10">
                <el-button type="primary" style="width: 116px;" v-if="order.status==1" @click="$router.push({ name: 'allocateOrder', params: {id:id}})">分配订单</el-button>
                <el-button type="primary" v-if="order.status==8" @click="completeDialogFlag=true">确认订单完成</el-button>
                <el-button type="danger" style="width: 116px;" v-if="order.status<9" @click="setStatus(10)">取消订单</el-button>
            </el-row>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;" v-if="account.user_type=='Supplier'">
                <el-button type="primary" v-if="order.status==2" @click="setStatus(4)">确认接单</el-button>
                <el-button type="primary" v-if="order.status==4" @click="setStatus(5)">确认材料</el-button>
                <el-button type="primary" v-if="order.status==5" @click="setStatus(6)">确认大货样</el-button>
                <el-button type="primary" v-if="order.status==6" @click="setStatus(8)">出货</el-button>
            </el-row>
        </div>
        <!--完成订单弹窗-->
        <el-dialog class="cm-dialog complete-dialog" title="完成订单" :visible.sync="completeDialogFlag" v-if="completeDialogFlag" >
            <div class="dialog-content">
                <div class="panel">
                    <div class="panel-bd">
                        <!--<el-form-item label="质量：" >
                            <el-radio-group v-model="hasQualityProblem">
                                <el-radio value="0" label="0">没问题</el-radio>
                                <el-radio value="1" label="1">有问题</el-radio>
                            </el-radio-group>
                        </el-form-item>-->
                        <span>质量：</span>
                        <el-radio-group v-model="hasQualityProblem" size="medium">
                            <el-radio :value="0" :label="0">没问题</el-radio>
                            <el-radio :value="1" :label="1">有问题</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="panel other-reason-panel active" >
                    <div class="panel-hd">
                        <p>备注：</p>
                    </div>
                    <div class="panel-bd">
                        <textarea v-model="orderFeedback" maxlength="1024"  cols="30" rows="10"></textarea>
                    </div>
                </div>
            </div>
            <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                <el-button type="" style="width: 80px;" @click="completeDialogFlag=false">取消</el-button>
                <el-button type="primary" style="margin-left: 40px;" @click="complete()">确认完成</el-button>
            </el-row>
        </el-dialog>
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

  .complete-dialog{
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
                formLabelWidth:'120px',

                id:null,

                account:{},

                order:{},
                entryList:[],
                productList:[],
                statusList:[],
                statusLogs:[],

                completeDialogFlag:false,
                orderFeedback:null,
                hasQualityProblem:0,

                downLoadFb:null,

            }
        },
        created(){

        },
        computed: {

        },
        methods: {
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
            },
            complete:function () {
                let params={
                    ...Vue.sessionInfo(),
                    ordezid:this.id,
                    quality:this.hasQualityProblem,
                    finishRemark:this.orderFeedback
                }
                let fb=Vue.operationFeedback({text:'设置中...'});
                Vue.api.completeOrder(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'设置成功'});
                        this.completeDialogFlag=false;
                        this.order.status=9;
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
                console.info('keyMap', keyMap, json)
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
            exportOrder:function () {
                let jsonData=[
                    {
                        1:'序号',
                        2:'订单号',
                        3:'客户编号',
                        4:'客户参考',
                        5:'预计完成时间',
                        6:'下单时间',
                        7:'订单状态',
                    }
                ];
                jsonData.push({
                    1:1,
                    2:this.order.orderno,
                    3:this.order.custno,
                    4:this.order.custbasis,
                    5:this.order.plantime,
                    6:this.order.createtime,
                    7:Vue.orderStatus(this.order.status),
                });
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                this.downloadExl(jsonData,'订单导出表');
            }
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            this.account=Vue.getAccountInfo();
            /**/
            this.statusList=[
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
                    title:this.account.user_type=='Supplier'?'寄出材料':'确认接单',
                    time:'',
                    status:4,
                },
                {
                    title:this.account.user_type=='Supplier'?'寄出大货样':'确认材料',
                    time:'',
                    status:5,
                },
                {
                    title:this.account.user_type=='Supplier'?'检查大货样':'确认大货样',
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
            ]
            /**/
            this.outFile = document.getElementById('downlink');
            /**/
            this.getOrderDetail();
        },
    }
</script>
