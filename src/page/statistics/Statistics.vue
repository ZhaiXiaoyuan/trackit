<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackkit</el-breadcrumb-item>
                <el-breadcrumb-item class="active">统计报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="condition-panel">
                <el-row class="type-list">
                    <el-button-group style="margin-left: 30px;">
                        <el-button type="" :class="{'el-button--primary':type=='1'}" @click="setType('1')">工作量统计</el-button>
                        <el-button type="" :class="{'el-button--primary':type=='2'}" @click="setType('2')">供应商</el-button>
                    </el-button-group>
                </el-row>
                <el-row class="condition-row" style="margin-top: 20px;" type="flex">
                    <span>时间：</span>
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
                    <div style="text-align: right;margin-left: auto">
                    <!--    <el-button size="small" type="primary">查询</el-button>-->
                        <el-button @click="exportOrder">导出</el-button>
                        <a id="downlink"></a>
                    </div>
                </el-row>
            </div>
            <div class="list-panel" v-loading="pager.loading" v-if="type=='1'">
                <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                    <el-table-column prop="type" label="类别" align="center"></el-table-column>
                    <el-table-column prop="datec"  width="100"  label="筛选时间段/单"  align="center"></el-table-column>
                    <el-table-column label="交期达成率"  align="center">
                        <template slot-scope="scope">
                           <span v-if="scope.row.finishcr!='0.0%'"> {{scope.row.finishcr|percentFormat}}</span>
                            <span v-if="scope.row.finishcr=='0.0%'"> /</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="质量达成率"  align="center">
                        <template slot-scope="scope">
                           <span v-if="scope.row.qualitycr!='0.0%'">{{scope.row.qualitycr|percentFormat}}</span>
                            <span v-if="scope.row.qualitycr=='0.0%'">/</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="allc" label="累计/单"  align="center"></el-table-column>
                    <el-table-column label="操作"  align="center">
                        <template slot-scope="scope">
                            <div class="cm-link-btn" @click="toOrder()">查看明细</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="list-panel" v-loading="pager.loading" v-if="type=='2'">
                <el-table :data="supplierList" border style="width: 100%;" ref="multipleTable">
                    <el-table-column prop="name" label="供应商" align="center"></el-table-column>
                    <el-table-column prop="dateoc"  width="100"  label="筛选时间段/单"  align="center"></el-table-column>
                    <el-table-column label="交期达成率"  align="center">
                        <template slot-scope="scope">
                            {{scope.row.finishocr|percentFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="质量达成率"  align="center">
                        <template slot-scope="scope">
                            {{scope.row.qualityocr|percentFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="alloc" label="累计/单"  align="center"></el-table-column>
                    <el-table-column label="操作"  align="center">
                        <template slot-scope="scope">
                            <div class="cm-link-btn" @click="toOrder(scope.row.userId)">查看明细</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="condition-panel" style="margin-top: 20px;border-top: 1px solid #e5e5e5">
                <el-row class="condition-row" style="margin-top: 20px;" type="flex">
                    <span>月度订单对比：</span>
                    <el-date-picker
                        v-model="selectedYear"
                        @change="getMonthStatics"
                        type="year"
                        placeholder="选择年">
                    </el-date-picker>
                </el-row>
            </div>
            <div class="list-panel" v-loading="pager.loading">
                <el-table :data="monthEntryList" border style="width: 100%;" ref="multipleTable">
                    <el-table-column label="月度" align="center">
                        <template slot-scope="scope">
                            <span>{{parseInt(scope.row.propString1.split('-')[1])}}月</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="propInt1"  label="月度订单量"  align="center"></el-table-column>
                    <el-table-column prop="propString2" label="交易达成率"  align="center"></el-table-column>
                    <el-table-column prop="propString3" label="质量达成率"  align="center"></el-table-column>
                    <el-table-column label="操作"  align="center">
                        <template slot-scope="scope">
                            <div class="cm-link-btn" @click="toMonthOrder(scope.row.propString1)">查看明细</div>
                        </template>
                    </el-table-column>
                </el-table>
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
                type:'1',//1:工作量统计,2:供应商
                range:'All',
                curDate:new Date(),
                dateRange:null,
                startDate:null,
                endDate:null,
                keyword:null,
                dateRage:null,
                pager:{
                    pageNumber:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                entryList:[],

                downLoadFb:null,

                taskReport:null,
                orderReport:null,

                supplierList:[],
                downLoadFb:null,

                selectedYear:null,
                monthEntryList:[],
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
                if(this.type=='1'){
                    this.getList();
                }else if(this.type=='2'){
                    this.getSupplierReportList();
                }
            },
            setType:function (value) {
                this.type=value;
                if(this.type=='1'){
                    this.getList();
                }else if(this.type=='2'){
                    this.getSupplierReportList();
                }
            },
            dateRageChange:function (data) {
                this.startDate=Vue.formatDate(data[0],'yyyy-MM-dd');
                this.endDate=Vue.formatDate(data[1],'yyyy-MM-dd');
                this.getList();
            },
            getList:function () {
                let params={
                    ...Vue.sessionInfo(),
                    startdate:this.startDate,
                    enddate:this.endDate,
                }
                this.pager.loading=true;
                Vue.api.workStatistics(params).then((resp)=>{
                    this.pager.loading=false;
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.taskReport=data.taskReport;
                        Object.assign(this.taskReport,{
                            type:'任务报表',
                            qualityc:this.taskReport.qualitytc,
                            allc:this.taskReport.alltc,
                            qualitycr:this.taskReport.qualitytcr,
                            finishc:this.taskReport.finishtc,
                            finishcr:this.taskReport.finishtcr,
                            datec:this.taskReport.datetc,
                        })
                        this.orderReport=data.orderReport;
                        Object.assign(this.orderReport,{
                            type:'订单报表',
                            qualityc:this.orderReport.qualityoc,
                            allc:this.orderReport.alloc,
                            qualitycr:this.orderReport.qualityocr,
                            finishc:this.orderReport.finishoc,
                            finishcr:this.orderReport.finishocr,
                            datec:this.orderReport.dateoc,
                        })
                        this.entryList=[this.orderReport];
                    }
                });
            },
            getSupplierReportList:function () {
                let params={
                    ...Vue.sessionInfo(),
                    startdate:this.startDate,
                    enddate:this.endDate,
                }
                this.pager.loading=true;
                Vue.api.supplierStatistics(params).then((resp)=>{
                    this.pager.loading=false;
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.supplierList=[];
                        for(let key in data){
                            let valueObj=data[key];
                            this.supplierList.push({
                                userId:key.split('_')[0],
                                name:key.split('_')[1],
                                ...valueObj
                            })

                        }
                        console.log('test:',this.supplierList);
                    }
                });
            },
            exportOrder:function () {
                if(this.type=='1'){
                    let jsonData=[
                        {
                            1:'序号',
                            2:'类别',
                            3:'筛选时间段/单',
                            4:'交期达成率',
                            5:'质量达成率',
                            6:'累计/单',
                        }
                    ];
                    this.entryList.forEach((item,i)=>{
                        jsonData.push({
                            1:1,
                            2:item.type,
                            3:item.datec,
                            4:item.finishcr,
                            5:item.qualitycr,
                            6:item.allc,
                        });
                    })
                    this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                    this.downloadExl(jsonData,'工作量统计导出表');
                }else if(this.type=='2'){
                    let jsonData=[
                        {
                            1:'序号',
                            2:'供应商',
                            3:'筛选时间段/单',
                            4:'交期达成率',
                            5:'质量达成率',
                            6:'累计/单',
                        }
                    ];
                    this.supplierList.forEach((item,i)=>{
                        jsonData.push({
                            1:1,
                            2:item.name,
                            3:item.dateoc,
                            4:item.finishocr,
                            5:item.qualityocr,
                            6:item.alloc,
                        });
                    })
                    this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                    this.downloadExl(jsonData,'供应商统计导出表');
                }
            },

            getMonthStatics:function (data) {
                console.log('dddd:',this.selectedYear);
                let params={
                    ...Vue.sessionInfo(),
                    year:this.selectedYear.getFullYear()
                }
                Vue.api.getMonthStatics(params).then((resp)=>{
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.monthEntryList=data;
                        console.log(' this.monthEntryList:', this.monthEntryList);
                    }
                });
            },

            toOrder:function (supplierId) {
                if(supplierId){
                    this.$router.push({name:'order',params:{startDate:this.startDate,endDate:this.endDate,supplierId:supplierId,type:9}});
                }else{
                    this.$router.push({name:'order',params:{startDate:this.startDate,endDate:this.endDate,type:9}});
                }
            },
            toMonthOrder:function (dateStr) {
                var dateStrArr=dateStr.split('-');
                var dayCount = new Date(dateStrArr[0],dateStrArr[1], 0).getDate();
                this.$router.push({name:'order',params:{startDate:dateStr+'-01',endDate:dateStr+'-'+dayCount,type:9}});
            }
        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.outFile = document.getElementById('downlink');
            /**/
            this.startDate=Vue.formatDate(new Date().setDate(this.curDate.getDate()-(31+1)),'yyyy-MM-dd');
            this.endDate=Vue.formatDate(this.curDate,'yyyy-MM-dd');
            this.dateRage=[this.startDate,this.endDate];
            this.getList();

            /**/
            this.selectedYear=this.curDate;
            this.getMonthStatics();
        },
    }
</script>
