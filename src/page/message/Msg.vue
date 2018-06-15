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
                <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" @cell-click="getMsgDetail">
                    <el-table-column prop="title" label="通知标题" align="center"></el-table-column>
                    <el-table-column prop="createtime" label="通知时间"  align="center"></el-table-column>
                    <el-table-column label="通知详情" align="center">
                        <template slot-scope="scope" class="detail">
<!--
                            <span v-if="scope.row.biztype=='Order'">您的订单号为<span class="cm-link-btn" @click="$router.push({ name: 'orderDetail', params: {id:scope.row.bizid}})" style="padding: 0px 5px;">{{scope.row.bizid}}</span></span>
-->
<!--
                            <span v-if="scope.row.biztype=='Task'">您的任务号为<span class="cm-link-btn" @click="$router.push({ name: 'taskDetail', params: {id:scope.row.bizid}})" style="padding: 0px 5px;">{{scope.row.bizid}}</span></span>
-->
                            <div class="cell-content">
                                <span v-html="scope.row.content"></span>
                                <sup class="el-badge__content is-dot" v-if="!scope.row.isread"></sup>
                            </div>
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
        <el-dialog
            title="消息详情"
            :visible.sync="detailDialog"
            width="40%">
            <div style="height: 350px;overflow-y: auto;">
                <div class="block" style="padding: 20px;">
                    <div class="block-hd" style="text-align: center;">
                        <span class="title" style="font-size: 20px;color: #333;">{{curMsg.title}}</span>
                        <div style="font-size: 14px;color: #999;padding-top: 10px;">
                            <span>{{curMsg.createrName}}</span><span style="padding-left: 5px;">{{curMsg.createtime}}</span>
                        </div>
                    </div>
                    <div class="block-bd" style="font-size: 16px;margin-top: 10px;color: #666;">
                        <div v-html="curMsg.content"></div>
                    </div>
                    <div class="block-ft">

                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailDialog = false">取 消</el-button>
                <el-button type="primary" @click="detailDialog = false">确 定</el-button>
            </div>
        </el-dialog>
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
    import bus from '../../components/common/bus';
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
                    },
                    {
                        label:'平台',
                        value:'Trackit ',
                    }
                ],
                curTypeIndex:0,
                pager:{
                    pageNumber:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                entryList:[],
                detailDialog:false,
                curMsg:{},
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getList:function (pageIndex) {
                this.pager.pageNumber=pageIndex?pageIndex:1;
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
            },
            clickRow:function (row, event, column) {
                if(row.biztype=='Order'){
                    this.$router.push({ name: 'orderDetail', params: {id:row.bizid}})
                }else if(row.biztype=='Task'){
                    this.$router.push({ name: 'taskDetail', params: {id:row.bizid}})
                }
            },
            getMsgDetail:function (row, column, cell, event) {
                if(cell.cellIndex==0){
                    if(row.biztype=='Order'){
                        this.$router.push({ name: 'orderDetail', params: {id:row.bizid}})
                    }else if(row.biztype=='Task'){
                        this.$router.push({ name: 'taskDetail', params: {id:row.bizid}})
                    }
                }
                if(cell.cellIndex==2){
                    let params={
                        ...Vue.sessionInfo(),
                        id:row.id,
                    }
                    Vue.api.getMsgDetail(params).then((resp)=>{
                        if(resp.status=='success'){
                            let data=JSON.parse(resp.message);
                            this.curMsg=data;
                            this.detailDialog=true;
                        }
                    });
                    bus.$emit('refreshMsgCount');
                    this.entryList.find((item)=>{
                        return item.id==row.id;
                    }).isread=1;
                }
            },

        },
        mounted () {
            //
            this.account=Vue.getAccountInfo();
            /**/
            this.getList();

        },
    }
</script>
