<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackkit</el-breadcrumb-item>
                <el-breadcrumb-item class="active">任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="condition-panel">
                <el-row class="type-list">
                    <el-button-group style="margin-left: 30px;">
                       <!-- <el-button type="primary">全部</el-button>-->
                        <el-button type="" :class="{'el-button--primary':type=='do'}" @click="setType('do')">进行中</el-button>
                        <el-button type="" :class="{'el-button--primary':type=='4'}" @click="setType('4')">已完成</el-button>
                        <el-button type="" :class="{'el-button--primary':type=='6'}" @click="setType('6')">已取消</el-button>
                    </el-button-group>
                </el-row>
                <el-row class="condition-row" style="margin-top: 20px;" type="flex">
                    <div>
                        任务量：<span class="blue">{{pager.total}}单</span>
                    </div>
                    <span style="margin-left: 15px;">时间：</span>
                    <div>
                        <el-date-picker
                            class="cm-date-picker"
                            v-model="dateRage"
                            @change="dateRageChange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <span style="margin-left: 15px;">类型：</span>
                    <el-select v-model="resource" style="width: 95px;" @change="resourceChange()" placeholder="">
                        <el-option v-for="(item,index) in resourceList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                    <span style="margin-left: 15px;">关键字：</span>
                    <div>
                        <el-input placeholder="客户号/任务号/客户参考" style="width: 220px;" v-model="keyword" @keyup.enter.native="getList()">
                            <el-button slot="append" icon="el-icon-search" @click="getList()"></el-button>
                        </el-input>
                    </div>
                    <div style="text-align: right;margin-left: auto">
                        <el-button size="small" type="primary" v-if="account.user_type=='Customer'" @click="$router.push({name:'newTask'})">新建任务</el-button>
                        <el-button size="small" type="" @click="getAllList()">导出</el-button>
                        <a id="downlink"></a>
                    </div>
                </el-row>
                <el-row class="condition-row" style="margin-top: 10px;" type="flex" align="middle">
                    <el-radio-group v-model="range" @change="rangeChange" class="cm-radio-group" style="margin-right: 20px;position: relative;top:2px;" v-if="account.user_type=='Supplier'">
                        <el-radio label="All">全部</el-radio>
                        <el-radio label="Mine">我的</el-radio>
                    </el-radio-group>
                </el-row>
            </div>
            <div class="list-panel" v-loading="pager.loading">
                <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                    <el-table-column prop="taskno" label="任务单号" align="center"></el-table-column>
                    <el-table-column prop="custno"  width="100"  label="客户编号"  align="center"></el-table-column>
                    <el-table-column prop="custbasis" label="客户参考"  align="center"></el-table-column>
                    <el-table-column prop="plantime" width="100" label="预计完成时间"  align="center"></el-table-column>
                    <el-table-column prop="resourceLabel" label="任务种类"  align="center"></el-table-column>
                    <el-table-column label="下单时间" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.createtime">
                                {{scope.row.createtime|formatDate('yyyy-MM-dd hh:mm')}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="任务状态"  align="center">
                        <template slot-scope="scope">
                            {{scope.row.status|taskStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100"  align="center">
                        <template slot-scope="scope">
                            <router-link :to="'/taskDetail/'+scope.row.id" size="small">查看详情</router-link>
                            <i class="icon emergency-icon" v-if="scope.row.urgent"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="getList"
                        :current-page="pager.pageNumber"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pager.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pager.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .type-list{
        text-align: center;
        button{
            width: 120px;
        }
    }
    .condition-row{
        display: flex;
        align-items: center;
    }
    .list-panel{
        margin-top: 20px;
    }
    .emergency-icon{
        position: absolute;
        top:5px;
        right: 5px;
    }
</style>
<script>
    import Vue from 'vue'
    let XLSX = require('xlsx');
    export default {
        data() {
            return {
                account:{},
                listType:'first',
                type:'do',//进行中:do,4:已完成，6:已取消
                range:'All',
                dateRange:null,
                startDate:null,
                endDate:null,
                resource:null,
                keyword:null,
                dateRage:null,
                resourceList:[],
                pager:{
                    pageNumber:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                entryList:[{test:'1'}],

                downLoadFb:null,
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            uploadFile: function () { // 按钮导入
                this.imFile.click()
            },
            downloadFile: function (rs) { // 按钮导出
                let data = [{}]
                for (let k in rs[0]) {
                    data[0][k] = k
                }
                data = data.concat(rs)
                this.downloadExl(data, '菜单')
            },
            importFile: function () { // 导入excel
                this.fullscreenLoading = true
                let obj = this.imFile
                if (!obj.files) {
                    this.fullscreenLoading = false
                    return
                }
                var f = obj.files[0]
                var reader = new FileReader()
                let $t = this
                reader.onload = function (e) {
                    var data = e.target.result
                    if ($t.rABS) {
                        $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
                            type: 'base64'
                        })
                    } else {
                        $t.wb = XLSX.read(data, {
                            type: 'binary'
                        })
                    }
                    /*for(let i=0;i<$t.wb.SheetNames.length;i++){
                        let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[i]]);
                        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
                    }*/
                    let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[1]]);
                    $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
                }
                if (this.rABS) {
                    reader.readAsArrayBuffer(f)
                } else {
                    reader.readAsBinaryString(f)
                }
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
            dealFile: function (data) {   // 处理导入的数据
                console.log(data)
                this.imFile.value = ''
                this.fullscreenLoading = false
                if (data.length <= 0) {
                    this.errorDialog = true
                    this.errorMsg = '请导入正确信息'
                } else {
                    this.excelData = [];
                    data.forEach((item,key)=>{
                            if(parseInt(item['用户账户登记'])>=1&&item.__EMPTY){
                                this.excelData.push(
                                    {
                                        "bankAccount":item.__EMPTY_2,
                                        "idCard":item.__EMPTY_5,
                                        "bankName":item.__EMPTY,
                                        "phoneNums":item.__EMPTY_3,
                                        "name":item.__EMPTY_4,
                                        "subbranch":item.__EMPTY_1,
                                        "email":item.__EMPTY_6,
                                        "province":'**',
                                        "city":'**',
                                        "county":'**',
                                        "address":'**',
                                    }
                                )
                            }
                    })
                    let fb=Vue.operationFeedback({text:'导入中...'});
                    Vue.api.addUserBatch({...Vue.sessionInfo(),userData:JSON.stringify(this.excelData)}).then((resp)=>{
                        if(resp.respStatus=='success'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'导入成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'导入失败，'+resp.respMsg});
                        }
                    });

                }
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

            rangeChange:function (data) {
                console.log('data:',data);
                this.getList();
            },
            setType:function (value) {
                this.type=value;
                this.getList();
            },
            dateRageChange:function (data) {
                if(Vue.datedifference(data[0],data[1])+1>31){
                    this.dateRage=null;
                    Vue.operationFeedback({type:'warn',text:'最多支持筛选一个月'});
                    return;
                }else{
                    this.startDate=data?Vue.formatDate(data[0],'yyyy-MM-dd'):null;
                    this.endDate=data?Vue.formatDate(data[1],'yyyy-MM-dd'):null;
                    this.getList();
                }
            },
            getList:function (pageIndex) {
                this.pager.pageNumber=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    range:this.range,
                    status:this.type,
                    beginDate:this.startDate,
                    endDate:this.endDate,
                    resource:this.resource,
                    searchKey:this.keyword,
                    'pager.pageNumber':this.pager.pageNumber,
                    'pager.pageSize':this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getTaskList(params).then((resp)=>{
                    this.pager.loading=false;
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.entryList=data.result;
                        let pager=data.pager;
                        this.pager.total=pager.totalRecordCount;

                    }
                });
            },
            handleSizeChange:function (data) {
                this.pager.pageSize=data;
                this.getList();
            },
            getAllList:function (pageIndex) {
                let params={
                    ...Vue.sessionInfo(),
                    range:this.range,
                    status:this.type,
                    beginDate:this.startDate,
                    endDate:this.endDate,
                    resource:this.resource,
                    searchKey:this.keyword,
                    'pager.pageNumber':1,
                    'pager.pageSize':this.pager.total,
                }
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                Vue.api.getTaskList(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        let allList=data.result;
                        let jsonData=[
                            {
                                1:'序号',
                                2:'任务单号',
                                3:'客户编号',
                                4:'客户参考',
                                5:'预计完成时间',
                                6:'任务种类',
                                7:'下单时间',
                                8:'任务状态',
                            }
                        ];
                        allList.forEach((item,i)=>{
                            jsonData.push({
                                1:i+1,
                                2:item.taskno,
                                3:item.custno,
                                4:item.custbasis,
                                5:item.plantime,
                                6:item.resourceLabel,
                                7:item.createtime,
                                8:Vue.taskStatus(item.status),
                            });
                        });
                        this.downloadExl(jsonData,'任务导出表');
                    }else{
                        this.downLoadFb.setOptions({type:'warn',text:'导出失败，'+resp.respMsg});
                    }
                });
            },
            getBasicConfig:function () {
                let params={
                    req_from:'mj-backend',
                    timestamp:Vue.genTimestamp(),
                    types:'Resource'
                }
                Vue.api.basicConfig(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.resourceList=data.Resource;
                    }else{

                    }
                });
            },
            resourceChange:function () {
                this.getList();
            },


        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.outFile = document.getElementById('downlink');
            /**/
            this.getBasicConfig();
            this.getList();

        },
    }
</script>
