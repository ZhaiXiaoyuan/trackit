<script src="../../../build/webpack.base.conf.js"></script>
<template>
    <div class="page-content new-task">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
                <el-breadcrumb-item>订单</el-breadcrumb-item>
                <el-breadcrumb-item>新建订单</el-breadcrumb-item>
                <el-breadcrumb-item>分配订单</el-breadcrumb-item>
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
                            <el-table-column prop="orderno" label="订单号" align="center"></el-table-column>
                            <el-table-column prop="custno" label="客户编号"  align="center"></el-table-column>
                            <el-table-column prop="custbasis" label="客户参考"  align="center"></el-table-column>
                            <el-table-column prop="plantime" label="物料完成时间"  align="center"></el-table-column>
                            <el-table-column prop="createtime" label="下单时间" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="block">
                    <div class="block-hd">
                        <el-input placeholder="请输入供应商首字母进行查询" v-model="letterKey" class="input-with-select">
                            <el-button slot="append" icon="el-icon-search" @click="listFilter()"></el-button>
                        </el-input>
                    </div>
                    <div class="block-bd">
                        <el-radio-group v-model="selectedId">
                            <div class="item-list">
                                <div class="list-hd" style="padding: 10px 0px;color: #666;font-size: 20px;">
                                   关联供应商列表
                                </div>
                                <ul class="list-bd" style="padding-left: 20px;">
                                    <li v-for="(supplier,index) in tqsList">
                                        <el-radio :label="supplier.value">{{supplier.label}}</el-radio>
                                    </li>
                                </ul>
                            </div>
                            <div class="item-list" v-for="(item,index) in filterList">
                                <div class="list-hd" style="padding: 10px 0px;color: #409EFF;font-size: 20px;">
                                    {{item.letter}}
                                </div>
                                <ul class="list-bd" style="padding-left: 20px;">
                                    <li v-for="(supplier,subIndex) in item.data">
                                        <el-radio :label="supplier.value">{{supplier.label}}</el-radio>
                                    </li>
                                </ul>
                            </div>
                        </el-radio-group>
                    </div>
                </div>
                <el-row style="text-align: center;margin-top: 30px;padding-bottom: 20px;">
                    <el-button type="primary" style="width: 92px;" @click="allocateOrder()">分配</el-button>
                    <el-button type="primary" @click="$router.go(-1)">返回上一步</el-button>
                </el-row>
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
    .item-list{
        li{
            &+li{
                margin-top: 10px;
            }
        }
    }
</style>
<script>
    import Vue from 'vue'

    export default {
        data() {
            return {


                formLabelWidth: '125px',


                letterKey:null,
                id:null,
                account:{},
                order:null,
                entryList:[],
                supplierList:[],
                sortList:[],
                filterList:[],
                selectedId:null,
                tqsList:[],
            }
        },
        created(){

        },
        computed: {

        },
        methods: {
            getOrder:function () {
                let params={
                    ...Vue.tools.sessionInfo(),
                    ordezid:this.id,
                }
                Vue.api.getOrder(params).then((resp)=>{
                    if(resp.status=='success'){
                        this.order=JSON.parse(resp.message);
                       /* console.log('this.order:',this.order);*/
                        this.entryList.push(this.order);
                    }
                })
            },
            getOrderCandidateSuppliers:function () {
                let params={
                    ...Vue.tools.sessionInfo(),
                    orderid:this.id,
                }
                Vue.api.getOrderCandidateSuppliers(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.supplierList=data.alls;
                        this.tqsList=data.tqs;
                        let nameList=[];
                        this.supplierList.forEach((item,i)=>{
                            nameList.push(item.label);
                        });
                        this.sortList=this.pySegSort(nameList);
                        this.listFilter();
                    }
                })
            },
            findItem:function (name) {
                return this.supplierList.find(function(x) {return x.label == name;});
            },
            pySegSort:function(arr,empty) {
                let that=this;
                if(!String.prototype.localeCompare)
                    return null;

                var letters = "*abcdefghjklmnopqrstwxyz".split('');
                var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');

                var segs = [];
                var curr;
                $.each(letters, function(i){
                    curr = {letter: this.toUpperCase(), data:[]};
                    $.each(arr, function() {
                        if((!zh[i-1] || zh[i-1].localeCompare(this,"zh") <= 0) && this.localeCompare(zh[i],"zh") == -1) {
                            curr.data.push(that.findItem(this));
                        }
                    });
                    if(empty || curr.data.length) {
                        segs.push(curr);
                        curr.data.sort(function(a,b){
                            return a['label'].localeCompare(b['label'],"zh");
                        });
                    }
                });
                return segs;
            },
            allocateOrder:function () {
                if(!this.selectedId){
                    Vue.operationFeedback({type:'warn',text:'请先选择供应商'});
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    supplierid:this.selectedId,
                    orderid:this.id
                }
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.allocateOrder(params).then((resp)=>{
                    if(resp.status=='success'){
                        fb.setOptions({type:"complete",text:'操作成功'});
                         this.$router.push({name:'orderDetail',params:{id:this.id}});
                    }else{
                        fb.setOptions({type:"warn",text:resp.message});
                    }
                });
            },
            listFilter: function () {
                var keyword=this.letterKey?this.letterKey.toUpperCase():null;
                this.filterList=this.sortList.filter((item)=>{
                    if(this.letterKey){
                        return item.letter==keyword;
                    }else{
                        return item;
                    }
                });
            },
            pySort:function(arr,empty){
                var $this = this;
                if(!String.prototype.localeCompare)
                    return null;
                var letters = "ABCDEFGHJKLMNOPQRSTWXYZ".split('');
                var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
                var arrList = [];
                for(var m =0;m<arr.length;m++){
                    arrList.push(arr[m]);
                }
                var result = [];
                var curr;
                for(var i=0;i<letters.length;i++){
                    curr = {letter: letters[i], data:[]};
                    if(i!=26){
                        for(var j =0;j<arrList.length;j++){
                            var initial = arrList[j].charAt(0);//截取第一个字符
                            if(arrList[j].charAt(0)==letters[i]||arrList[j].charAt(0)==letters[i].toLowerCase()){   //首字符是英文的
                                curr.data.push(arrList[j]);
                            }else if(zh[i]!='*'&&$this.isChinese(initial)){      //判断是否是无汉字,是否是中文
                                if(initial.localeCompare(zh[i]) >= 0 &&(!zh[i+1]||initial.localeCompare(zh[i+1]) <0)) {   //判断中文字符在哪一个类别
                                    curr.data.push(arrList[j]);
                                }
                            }
                        }
                    }else{
                        for(var k =0;k<arrList.length;k++){
                            var ini = arrList[k].charAt(0);           //截取第一个字符
                            if(!$this.isChar(ini)&&!$this.isChinese(ini)){
                                curr.data.push(arrList[k]);
                            }
                        }
                    }
                    if(empty || curr.data.length) {
                        result.push(curr);
                        //curr.data.sort(function(a,b){
                        //    return b.localeCompare(a);       //排序,英文排序,汉字排在英文后面
                        //});
                    }
                }
                return result;
            },
            isChinese:function(temp){
                var re=/[^\u4E00-\u9FA5]/;
                if (re.test(temp)){return false;}
                return true ;
            },
            isChar:function(char){
                var reg = /[A-Za-z]/;
                if (!reg.test(char)){return false ;}
                return true ;
            }
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            this.account=Vue.getAccountInfo();
            /**/
            this.getOrder();
            this.getOrderCandidateSuppliers();

           /* console.log('ddddd:',this.pySort('希望这篇文章可以帮助到需要排序的亲'.split('')));*/

        },
    }
</script>
