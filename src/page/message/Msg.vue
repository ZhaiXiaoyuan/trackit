<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="-">
                <el-breadcrumb-item>Trackit</el-breadcrumb-item>
                <el-breadcrumb-item class="active">通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="condition-panel">
                <el-row class="condition-row" style="margin-top: 20px;">
                    <span>消息通知类型：</span>
                    <el-col :span="6">
                        <el-select v-model="curTypeIndex" @change="selectTypeChange" placeholder="请选择类型">
                            <el-option
                                v-for="(item,index) in typeList"
                                :key="item.id"
                                :label="item.label"
                                :value="index">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <div class="list-panel" v-loading="pager.loading">
                <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                    <el-table-column prop="title" label="通知标题" align="center"></el-table-column>
                    <el-table-column prop="createtime" label="通知时间"  align="center"></el-table-column>
                    <el-table-column label="通知详情"  align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.biztype=='Order'">您的订单号为<span class="cm-link-btn" @click="$router.push({ name: 'orderDetail', params: {id:scope.row.bizid}})" style="padding: 0px 5px;">{{scope.row.bizid}}</span></span>
                            <span v-if="scope.row.biztype=='Task'">您的任务号为<span class="cm-link-btn" @click="$router.push({ name: 'taskDetail', params: {id:scope.row.bizid}})" style="padding: 0px 5px;">{{scope.row.bizid}}</span></span>
                            <span v-html="scope.row.content"></span>
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
                account:null,
                typeList:[
                    {
                        label:'任务',
                        value:'Task ',
                    },
                    {
                        label:'订单',
                        value:'Order ',
                    }
                ],
                curTypeIndex:0,
                pager:{
                    pageNumber:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                entryList:[{test:'1'}],
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    'pager.pageNumber':this.pager.pageNumber,
                    'pager.pageSize':this.pager.pageSize,
                    biztype:this.typeList[this.curTypeIndex].value
                }
                this.pager.loading=true;
                Vue.api.getMsgList(params).then((resp)=>{
                    this.pager.loading=false;
                    if(resp.status=='success'){
                        let data=JSON.parse(resp.message);
                        this.entryList=data.result;
                        let pager=data.pager;
                        this.pager.total=pager.totalRecordCount;
                        console.log('this.entryLis:',this.entryList);

                    }
                });
            },
            handleSizeChange:function (data) {
                this.pager.pageSize=data;
                this.getList();
            },
            selectTypeChange:function (data) {
                this.getList();
            }

        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();
            /**/
            this.getList();

        },
    }
</script>
