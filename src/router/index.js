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
                    path: '/',
                    name:'task',
                    component: resolve => require(['../page/task/Task.vue'], resolve)
                },
                {
                    path: '/newTask',
                    name:'newTask',
                    component: resolve => require(['../page/task/NewTask.vue'], resolve)
                },
                {
                    path: '/taskDetail/:id?',
                    name:'taskDetail',
                    component: resolve => require(['../page/task/TaskDetail.vue'], resolve)
                },
                {
                    path: '/order',
                    name:'order',
                    component: resolve => require(['../page/order/Order.vue'], resolve)
                },
                {
                    path: '/newOrder',
                    name:'newOrder',
                    component: resolve => require(['../page/order/NewOrder.vue'], resolve)
                },
                {
                    path: '/msg',
                    name:'msg',
                    component: resolve => require(['../page/message/Msg.vue'], resolve)
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
