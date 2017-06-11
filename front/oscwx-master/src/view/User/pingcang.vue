<template>
    <div>
        <group :title="myHold[index].tradName">
            <x-number id="pcNum" title="平仓手数" :min=1 :max="parseInt(myHold[index].holdNum)" :value="parseInt(myHold[index].holdNum)"></x-number>
        </group>
        <div class="pcoper">
            <x-button type="primary" @click="sure">确定平仓</x-button>
            <x-button type="default" @click="cancel">取消操作</x-button>
        </div>
        <alert :show.sync="pcState.isShow" :title="pcState.msg" button-text="确定" @on-hide="onHide">
            <div style="text-align:center;">
                <p>合约代码:{{pcState.code}}</p>
                <p>平仓数量:{{pcState.num}}</p>
                <p>成交价格:{{pcState.price}}</p>
                <p>手续费:{{pcState.poundage}}</p>
                <p>盈亏:{{pcState.winLoss}}</p>
            </div>
        </alert>
    </div>
</template>
<style lang="less">
    .pcoper{padding: 10px;}
</style>

<script>
    import {setHeadMsg,setPingCang} from "vuex/actions"
    import Group from "vux/src/components/group"
    import XNumber from "vux/src/components/x-number"
    import XButton from "vux/src/components/x-button"
    import Alert from "vux/src/components/alert"
    export default{
        vuex:{
            getters:{
                account : (state)=>state.userInfo.account,
                myHold : (state)=>state.myHold,
                pcState : (state)=>state.pcState,
                isLogin: (state)=>state.userInfo.isLogin,
            },
            actions: {
                setHeadMsg,
                setPingCang
            }
        },
        data(){
            return{
                index : 0
            }
        },
        components:{
            Group,
            XNumber,
            XButton,
            Alert
        },
        methods:{
            cancel(){
                window.location.hash="/myHold/"+this.index;
            },
            sure(){
                var myDate = new Date();
                var ymd = ""+myDate.getFullYear()+(myDate.getMonth()+1)+ myDate.getDate();
                var hms = ""+ myDate.getHours() + myDate.getMinutes() + myDate.getSeconds();
                var temp = this.myHold[this.index];
                var id = temp.id;
                var code = temp.tradName;
                var dir = 0-(parseInt(temp.direction));
                var num = $("#pcNum .vux-number-input").val();
                this.setPingCang({
                    account : this.account,
                    code : code,
                    dir : dir,
                    num : num,
                    ymd : ymd,
                    hms : hms,
                    id : id
                });
            },
            onHide(){
                var index = this.index;
                if(this.pcState.state == "00"){
                    index = 0;
                }
                window.location.hash="/myHold/"+index;
            }
        },
        route: {
            data(res){
                if (res.to.name=="pingcang") {
                    this.index = parseInt(res.to.params.index);
                }
            }
        }
    }
</script>