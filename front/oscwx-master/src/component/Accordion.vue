<template>
    <div class="acc">
        <div class="acc_head" @click="showHide">
            <slot name="left">默认内容</slot>
            <span class="right icon"  dir="{{this.show?'1':'2'}}">{{this.show?'↓':'↑'}}</span>
        </div>
        <div class="acc_body" v-show="show" transition="acc">
            <slot name="body">默认内容</slot>
        </div>
    </div>
</template>
<style lang="less">
    .acc_head{
        height: 40px;
        background:#f8f8f8;
        border-bottom: 1px solid #d8d8d8;
        overflow: hidden;
        font-size: 12px;
    }

    .acc_head .right{float: right; width: 20px; height: 20px; margin-top: 10px; font-weight: 700;}
    .acc_body{background:#EAEAEA;border-bottom: 1px solid #d8d8d8;}
    /* 必需 */
    .acc-transition {
        transition: all .3s ease;
        padding: 10px;
        overflow: hidden;
    }
    /* .expand-enter 定义进入的开始状态 */
    /* .expand-leave 定义离开的结束状态 */
    .acc-transition{padding: 3px 3px 10px 3px;}
    .acc-leave,.acc-enter {
        height: 0;
        padding: 0 10px;
        opacity: 0;
    }
</style>
<script>
    export default{
        props:["show"],
        methods:{
            showHide(event){
                var obj = $(event.target).children('.icon');
                var dir = obj.attr('dir');
                if(dir == "1"){
                    obj.html("↑");
                    obj.attr('dir',"2");
                }else{
                    obj.html("↓");
                    obj.attr('dir',"1");
                }
                this.show = !this.show;
            }
        }
    }
</script>