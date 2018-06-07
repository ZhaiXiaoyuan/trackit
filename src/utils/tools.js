/**
 * Created by Administrator on 2016/9/27 0027.
 */
/*一般的工具方法*/
import Vue from 'vue'
import router from '../router'
import md5 from 'js-md5'

export default {
    install: function (Vue, options) {
        //常用正则
        window.regex={
          illegal :new RegExp("((?=[\x21-\x7e]+)[^A-Za-z0-9])"),
          illegalAlert:'请勿输入非法字符',
          pNum:/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,//正数
          pNumAlert:'请输入大于0的数值，限制2位小数',
          pInt:/^[1-9]*[1-9][0-9]*$/,//正整数
          pIntAlert:'请输入大于0的整数',
          nNum:/^(0|[1-9][0-9]*)$/,//自然数
          nNumAlert:'请输入大于等于0的整数',
          chn:/^[\u4e00-\u9fa5]{0,}$/,
          chnAlert:'请输入纯中文字符串',

          float:/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
          floatAlert:'数值格式有误，请输入小数点前不多于8位、小数点后不多于2位的数值！',

          percent:/^((100(\.00|\.0)?)|((\d|[1-9]\d)(\.\d{1,2})?))$/,
          percentAlert:'百分数格式错误，请输入0~100间数值，可保留两位小数！',

          contact:/^(0\d{2,3}-?\d{7,8})|(1\d{10})$/,
          contactAlert:'请输入正确格式的手机号码或电话号码！',

          phone:/^1\d{10}$/,
          phoneAlert:'请输入正确格式的手机号！',

          mail:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
          mailAlert:'请输入正确格式的邮箱！',

          idCard:/^[a-zA-Z0-9]{1,20}$/,
          idCardAlert:'身份证号码格式错误！',

          shortCode:/^(?![0-9]+$)[0-9A-Za-z]{7,20}$/,
          shortCodeAlert:'域名格式有误，请输入7到20位字母或数字，不可为纯数字！'
        }
        //
      Vue.tools = {
          basicConfig:{
              basicUrl:process.env.NODE_ENV=='development'?'/api':'http://trackit.51plus.net/trackitapps',
              imgPrefix:'http://trackit.51plus.net/zfiles/'
          },
        /*生成请求时间戳*/
        genTimestamp:function () {
          return Math.ceil(new Date().getTime()/1000)
        },
          resourceTypeList:[
              {
                  label:'布料 ',
                  value:'Buliao'
              },
              {
                  label:'辅料 ',
                  value:'Fuliao'
              },
              {
                  label:'加工厂',
                  value:'Jiagong'
              },
          ],
        /**
         *
         * @param date
         * @param fmt
         * @returns {*}
         */
        formatDate:function(date,fmt){
          if(typeof date !=Date){
            date=new Date(date);
          }
          var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        },
        sessionInfo:function () {
          let timestamp=this.genTimestamp();
          let account=this.getAccountInfo();
          return{
              req_from:' mj-backend',
              timestamp:timestamp,
              number:account.number,
              signature:md5.hex('timestamp='+timestamp+'&number='+account.number+'&token='+account.token+'')
          }
        },
        /*获取事件当前元素*/
        getCurEle:function (e) {
          var targetEle=null;
          if(e.currentTarget){
            targetEle=e.currentTarget;
          }else if(event.srcElement){
            targetEle=e.srcElement;
          }
          return targetEle;
        },
        /*阻止事件冒泡*/
        stopPropagation:function(e){
          if(e){
            if(e.cancelBubble){
              e.cancelBubble = true;
            }
            else if(e.stopPropagation){
              e.stopPropagation();
            }
          }
        },
        throttle:function (fn, delay, atleast) {
              var timer = null;
              var previous = null;
              return function() {
                  var now = +new Date();

                  if (!previous) previous = now;
                  if (atleast && now - previous > atleast) {
                      fn();
                      // 重置上一次开始时间为本次结束时间
                      previous = now;
                      clearTimeout(timer);
                  } else {
                      clearTimeout(timer);
                      timer = setTimeout(function() {
                          fn();
                          previous = null;
                      }, delay);
                  }
              }
          },
        getAccountInfo:function () {
            let account=Vue.cookie.get('account');
            if(account){
                return JSON.parse(account);
            }else{
                console.log('router:',router);
                router.push({name:'login'});
                return{};
            }
        },
        indexFormat:function(str){
              let result='';
              switch (str){
                  case 1:
                      result='一';
                      break;
                  case 2:
                      result='二';
                      break;
                  case 3:
                      result='三';
                      break;
                  case 4:
                      result='四';
                      break;
                      break;
                  case 5:
                      result='五';
                      break;
                  case 6:
                      result='六';
                      break;
                  case 7:
                      result='七';
                      break;
                  case 8:
                      result='八';
                      break;
                  case 9:
                      result='九';
                      break;
                  case 10:
                      result='十';
                      break;
              }
              return result;
          },
        taskStatus:function(str){
            str+='';
            let result='';
            switch (str){
                case '1':
                    result='任务生成，待分配';
                    break;
                case '2':
                    result='任务已分配，等待完成';
                    break;
                case '3':
                    result='任务完成，等待确认';
                    break;
                case '4':
                    result='确认任务完成';
                    break;
                case '5':
                    result='重做任务';
                    break;
                case '6':
                    result='已取消';
                    break;
                case '7':
                    result='重做任务';
                    break;
            }
            return result;
        },
        orderStatus:function(str){
            str+='';
            let result='';
            switch (str){
                case '1':
                    result='订单生成，等待分配';
                    break;
                case '2':
                    result='订单已分配，等待确认';
                    break;
                case '3':
                    result='确认信息与风险';
                    break;
                case '4':
                    result='确认交期';
                    break;
                case '5':
                    result='确认材料';
                    break;
                case '6':
                    result='确认大货样';
                    break;
                case '7':
                    result='确认大货质量';
                    break;
                case '8':
                    result='出货';
                    break;
                case '9':
                    result='完成';
                    break;
                case '10':
                    result='取消';
                    break;
            }
            return result;
        },
        datedifference:function(sDate1, sDate2){    //sDate1和sDate2是2006-12-18格式
            var dateSpan,
                tempDate,
                iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        }
      }

      Object.assign(Vue, Vue.tools);
      Object.assign(Vue.prototype, Vue.tools);
    },
}
