/**
 * Created by Administrator on 2016/9/28 0028.
 */

/**
 * vue所需要的filter都放在这里
 * 在js里面可以这样直接调用：Vue.filter('getLocalISOString')(new Date())
 * */
import Vue from 'vue'

/*格式化时间*/
Vue.filter('formatDate',function(date,fmt){
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
});
//任务状态
Vue.filter('taskStatus',function(str){
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
});
//订单状态
Vue.filter('orderStatus',function(str){
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
});
//
Vue.filter('percentFormat',function(str){
    if(!str){
        return;
    }
    let tem=parseFloat(str.split('%')[0]);
    return tem.toFixed(2)+'%';
});
