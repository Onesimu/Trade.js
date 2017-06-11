<template>
    <div id="loginPage">
        <div class="loginContent">
            <x-input title="账户" :value.sync="account" type="text"></x-input>
            <x-input title="密码" :value.sync="pwd" type="password"></x-input>
        </div>
        <div class="loginFooter">
            <x-button type="primary" :disabled="isClick" @click="login">登录</x-button>
            <x-button @click="reset">重设密码</x-button>
        </div>
        <toast :show.sync="isShow" type="text">{{toastTxt}}</toast>
    </div>
</template>
<style lang="less">
    .loginContent{
        margin-top: 10px;
        background: #fff;
        border-top:1px solid #ddd;
        border-bottom:1px solid #ddd;
    }
    .loginFooter{
        padding: 30px 20px;
    }
</style>
<script>
    import {LoginEvent,LoginState} from "vuex/actions"
    //vux
    import xInput from "vux/src/components/x-input"
    import xButton from  "vux/src/components/x-button"
    import toast from  "vux/src/components/toast"
    export default{
        vuex:{
            getters:{
                _isClick :(state)=>state.loginState.isDisabledLoginBtn,
                _isShow : (state)=>state.loginState.isShowToast,
                toastTxt : (state)=>state.loginState.toastTxt
            },
            actions:{
                LoginEvent,
                LoginState
            }
        },
        data(){
            return {
                account     : "",
                pwd         : ""
            }
        },
        ready(){
            if(window.localStorage.account){
                this.account = window.localStorage.account;
            }
            if(window.localStorage.pwd){
                this.pwd = window.localStorage.pwd;
            }
        },
        methods:{
            login(){
                if(this.account == "" || this.pwd == ""){
                    return;
                }
                this.LoginState({isDisabledLoginBtn:true});
                this.LoginEvent({
                    account:this.account,
                    pwd:this.pwd
                })
            },
            reset(){
                window.location.hash = "reset";
            }
        },
        events:{
            "hide"(){
                this.LoginState({isShowToast:false})
            }
        },
        computed:{
            isClick(){
                return this._isClick;
            },
            isShow(){
               return this._isShow;
            }
        },
        components:{
            xInput,
            xButton,
            toast
        }
    }
</script>