<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item class="active">任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="condition-panel">
                <el-row class="type-list">
                    <el-button-group>
                        <el-button type="primary">全部</el-button>
                        <el-button type="">进行中</el-button>
                        <el-button type="">已完成</el-button>
                        <el-button type="">已取消</el-button>
                    </el-button-group>
                </el-row>
                <el-row class="condition-row" style="margin-top: 20px;">
                    <el-col :span="3">
                        订单量：<span class="blue">3单</span>
                    </el-col>
                    <el-col :span="9">
                        <span>时间:</span>
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <span>关键字：</span>
                    <el-col :span="5">
                        <el-input placeholder="请输入内容" v-model="keyword">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="5" style="text-align: right;">
                        <el-button size="small" type="primary">新建任务</el-button>
                        <el-button size="small" type="">导出</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="list-panel">
                <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                    <el-table-column prop="phoneNums" label="任务单号" align="center"></el-table-column>
                    <el-table-column prop="name" label="客户编号"  align="center"></el-table-column>
                    <el-table-column prop="idCard" label="客户参考"  align="center"></el-table-column>
                    <el-table-column prop="email" label="物料完成时间"  align="center"></el-table-column>
                    <el-table-column prop="bankName" label="任务种类"  align="center"></el-table-column>
                    <el-table-column prop="subbranch" label="下单时间" align="center"></el-table-column>
                    <el-table-column prop="bankAccount" label="任务状态" width="200"  align="center"></el-table-column>
                    <el-table-column label="操作"  align="center">
                        <template slot-scope="scope">
                            <router-link :to="'/userDetail/'+scope.row.id" size="small">查看详情</router-link>
                            <i class="icon emergency-icon" v-if="false"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400">
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
                listType:'first',
                dateRange:null,
                keyword:null,
                pager:{
                    pageNumber:1,
                    pageSize:20,
                    total:100,//临时测试
                },
                entryList:[{test:'1'}],
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
            getList:function () {

            },
            handleSizeChange:function () {

            },
            handleCurrentChange:function () {

            }

        },
        mounted () {
            this.imFile = document.getElementById('imFile');
            this.outFile = document.getElementById('downlink');
            /**/

        },
    }
</script>
