/**
 * Created by Designer on 2017/12/21.
 */
import router from '../router'


export default {
  install: function (Vue, options) {


    Vue.http.options.emulateJSON = true;
    Vue.http.interceptors.push((request, next)  =>{

      next((response) => {
        //对于有作登录状态的接口你，未未登录时跳转到登录页
        if(response.status==401){
         /* router.push({name:''});*/
        }
        return response
      });

    });
    /*自定义ajax函数，自带的不好用*/
    Vue.http.ajax = async function (options) {
      if(options.method.toUpperCase() == 'GET'){
        let res = await Vue.http.get(options.url, {params: options.params});
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }else if(options.method.toUpperCase() == 'POST'){
        let res = await Vue.http.post(options.url, options.params);
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }
    }

    /**/
    //临时测试
    let basicUrl=false&&process.env.NODE_ENV=='development'?'/api':'http://120.79.17.251:8000/trackitapps';
    Vue.api={
        //登录
        login:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/appuser/auth/login',
                params: params
            });
        },
        //【新】企业用户注册页面数据请求【A+M】
        getRegisterInfo:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/appuser/auth/toreg',
                params: params
            });
        },
        //【新】企业用户账户注册【A+M】
        register:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/appuser/auth/reg',
                params: params
            });
        },
        //获取短信验证码
        genPhoneCode:function (params,url) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+url,
                params: params
            });
        },
        //【旧】分页查看任务列表【A+M】
        getTaskList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/getList',
                params: params
            });
        },
        //上传文件
        upload:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/base/svr/uppic',
                params: params
            });
        },
        //【旧】新增任务【A+M】
        addTask:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/add',
                params: params
            });
        },
        //【旧】任务详情 - 客户【A+M】
        getCustomerTaskDetail:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/get',
                params: params
            });
        },
        //【旧】符合任务的供应商列表【A+M】
        getSupplierList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/gettss',
                params: params
            });
        },
        //【新】供应商任务全部报价【A+M】
        getPlanList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/getqs',
                params: params
            });
        },
        //【旧】任务详情 - 供应商【A+M】
        getSupplierTaskDetail:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/getsim',
                params: params
            });
        },
        //获取报价列表
        getAllPlanList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/getqm',
                params: params
            });
        },
        //【新】供应商任务添加报价【A+M】
        addPlan:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/addq',
                params: params
            });
        },
        //【新】供应商任务单个报价【A+M】
        getPlan:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/task/biz/getq',
                params: params
            });
        },
        //【旧】消息通知列表【A+M】
        getMsgList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/base/info/qnots',
                params: params
            });
        },
        //【旧】客户订单列表【A+M】
        getOrderList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/ordez/biz/query',
                params: params
            });
        },
        //【旧】客户新增订单【A+M】
        addOrder:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/ordez/biz/add',
                params: params
            });
        },
        //【旧】客户订单详情【A+M】
        getOrder:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/ordez/biz/get',
                params: params
            });
        },
        //【旧】符合订单的供应商列表【A+M】
        getOrderCandidateSuppliers:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/ordez/biz/getoss',
                params: params
            });
        },
        //【旧】客户分配订单给供应商【A+M】
        allocateOrder:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'/ordez/biz/dissup',
                params: params
            });
        },


    }
  },

}
