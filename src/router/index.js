import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/task',
                    name:'task',
                    component: resolve => require(['../page/task/Task.vue'], resolve)
                },
                {
                    path: '/newTask/:id?',
                    name:'newTask',
                    component: resolve => require(['../page/task/NewTask.vue'], resolve)
                },
                {
                    path: '/taskDetail/:id?',
                    name:'taskDetail',
                    component: resolve => require(['../page/task/TaskDetail.vue'], resolve)
                },
                {
                    path: '/order/:startDate?/:endDate?/:supplierId?',
                    name:'order',
                    component: resolve => require(['../page/order/Order.vue'], resolve)
                },
                {
                    path: '/newOrder/:id?',
                    name:'newOrder',
                    component: resolve => require(['../page/order/NewOrder.vue'], resolve)
                },
                {
                    path: '/allocateOrder/:id',
                    name:'allocateOrder',
                    component: resolve => require(['../page/order/AllocateOrder.vue'], resolve)
                },
                {
                    path: '/orderDetail/:id',
                    name:'orderDetail',
                    component: resolve => require(['../page/order/OrderDetail.vue'], resolve)
                },
                {
                    path: '/msg',
                    name:'msg',
                    component: resolve => require(['../page/message/Msg.vue'], resolve)
                },
                {
                    path: '/center',
                    name:'center',
                    component: resolve => require(['../page/account/Center.vue'], resolve)
                },
                {
                    path: '/advice',
                    name:'advice',
                    component: resolve => require(['../page/account/Advice.vue'], resolve)
                },
                {
                    path: '/userInfo',
                    name:'userInfo',
                    component: resolve => require(['../page/account/UserInfo.vue'], resolve)
                },
                {
                    path: '/statistics',
                    name:'statistics',
                    component: resolve => require(['../page/statistics/Statistics.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            name:'login',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/register',
            name:'register',
            component: resolve => require(['../page/account/Register.vue'], resolve)
        },
    ]
})
