<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content" :class="{'content-collapse':collapse}">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>
<style>
    .content{
        padding: 30px;
        left: 230px;
    }
</style>
<script>
    import Vue from 'vue'
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import bus from '../common/bus';
    export default {
        data(){
            return {
                collapse: false
            }
        },
        components:{
            vHead, vSidebar
        },
        watch:{

        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
        },
        beforeRouteEnter (to, from, next) {
            Vue.getAccountInfo();
            next(vm =>{

            });
        },
    }
</script>
