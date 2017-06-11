<template>
    <div id="loginPage">
        <div class="loginContent">
                <x-input title="账户" :value.sync="account" type="text"></x-input>
                <x-input title="旧密码" :value.sync="oldPwd" type="password"></x-input>

        </div>
        <div class="loginContent">
                <x-input title="新密码" :value.sync="newPwd" type="password"></x-input>
                <x-input title="确认密码" :value.sync="againPwd" :equal-with="newPwd" type="password"></x-input>
        </div>
        <div class="loginFooter">
            <x-button type="primary" @click="resetEvent">修改</x-button>
            <x-button @click="cancel">取消</x-button>
        </div>
        <toast :show.sync="isShow" type="text">{{toastTxt}}</toast>
    </div>
</template>
<style lang="less">
    .reset{margin:0;border: none;}
</style>
<script>
    import  {getUserPwd,setUserPwd} from "vuex/actions"
    import xInput from "vux/src/components/x-input"
    import xButton from  "vux/src/components/x-button"
    import group from "vux/src/components/group"
    import toast from  "vux/src/components/toast"
    export default{
        vuex:{
            getters:{
                _isShow : (state)=>state.resetPwd.isShowToast,
                toastTxt : (state)=>state.resetPwd.toastTxt,
                errno : (state)=>state.resetPwd.stateNo
            },
            actions:{
                setUserPwd,
                getUserPwd
            }
        },
        data(){
            return{
                account : "",
                oldPwd : "",
                newPwd : "",
                againPwd : ""
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
            resetEvent(){
                if(this.newPwd != this.againPwd){
                    return;
                }
                this.setUserPwd(this.account,this.oldPwd,this.newPwd);
            },
            cancel(){
                window.location.hash = "login";
            }
        },
        events:{
            "hide"(){
                this.getUserPwd({isShowToast:false})
                if(this.errno == "00"){
                    window.location.hash = "login";
                }
            }
        },
        computed:{
            isShow(){
                return this._isShow;
            }
        },
        components:{
            xInput,
            xButton,
            group,
            toast
        }
    }
</script>