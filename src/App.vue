<template>
    <div id="app" v-cloak>
        <router-view></router-view>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
    @import "less/main";
    [v-cloak] { display: none }
</style>
<script>
    import Vue from 'vue'

    export default {
        components:{
        },
        data: function(){
            return {

            }
        },
        methods: {

        },
        mounted () {
            /*请求基本配置*/
            let params={
                req_from:'mj-backend',
                timestamp:Vue.genTimestamp(),
                types:'Resource,TaskCancelReason,TaskRedoReason '
            }
            Vue.api.basicConfig(params).then(()=>{

            });
        },
    }
</script>
