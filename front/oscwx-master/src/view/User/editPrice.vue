<template>
    <div>
        <group :title="myHold[index].tradName">
            <cell title="最新价格" :value="newPrice"></cell>
            <x-number id="lossInput" title="触发止损" :width="120" :value.sync="lossPrice" :step="minUnit"></x-number>
            <x-number id="winInput" title="触发止盈" :width="120" :value.sync="winPrice" :step="minUnit"></x-number>
        </group>
        <div class="pcoper">
            <x-button type="primary" @click="sure">确定</x-button>
            <x-button type="default" @click="cancel">取消</x-button>
        </div>
        <alert :show.sync="errPrice" title="提示" button-text="确定">
            <div id="priceHint" style="text-align: center;"></div>
        </alert>
        <alert :show.sync="winLossState.isShow" title="提示" button-text="确定" @on-hide="onHide">
            <div style="text-align: center;">
                <p>{{winLossState.state=="00"?'操作成功':'操作失败'}}</p>
            </div>
        </alert>
    </div>
</template>
<style lang="less">

</style>

<script>
    import {setHeadMsg,setWinLoss} from "vuex/actions"
    import Group from "vux/src/components/group"
    import XButton from "vux/src/components/x-button"
    import XInput from "vux/src/components/x-input"
    import Alert from "vux/src/components/alert"
    import Cell from "vux/src/components/cell"
    import xNumber from "vux/src/components/x-number"
    export default{
        vuex: {
            getters:{
                account : (state)=>state.userInfo.account,
                myHold : (state)=>state.myHold,
                hotContract :(state)=>state.hotContract,
                winLossState:(state)=>state.winLossState,
                isLogin: (state)=>state.userInfo.isLogin,
            },
            actions: {
                setHeadMsg,
                setWinLoss
            }
        },
        data(){
            return{
                index: 0,
                errPrice : false,
                minUnit  : 0.5
            }
        },
        ready(){
            var key = this.myHold[this.index].tradName;
            if(this.hotContract[key].minUnit != 0){
                this.minUnit = this.hotContract[key].minUnit;
            }
        },
        methods:{
            cancel(){
                window.location.hash="/myHold/"+this.index;
            },
            sure(){
                if(this.price == ""){
                    return;
                }
                var dir = this.myHold[this.index].direction;
                var winPrice = $("#winInput .vux-number-input").val();
                var lossPrice = $("#lossInput .vux-number-input").val();
                if(dir == 1){
                    if( parseFloat(winPrice) != 0 && winPrice <= this.newPrice){
                        $("#priceHint").html("止盈价必须大于最新价");
                        this.errPrice = true;
                        return;
                    }else if(parseFloat(lossPrice) != 0 && lossPrice >= this.newPrice){
                        $("#priceHint").html("止损价必须小于最新价");
                        this.errPrice = true;
                        return;
                    }
                }else{
                    if(parseFloat(winPrice) != 0 && winPrice >= this.newPrice){
                        $("#priceHint").html("止盈价必须小于最新价");
                        this.errPrice = true;
                        return;
                    }else if(parseFloat(lossPrice) != 0 && lossPrice <= this.newPrice){
                        $("#priceHint").html("止损价必须大于最新价");
                        this.errPrice = true;
                        return;
                    }
                }
                if(winPrice == this.winPrice && lossPrice == this.lossPrice){
                    this.cancel();
                    return;
                }
                var myDate = new Date();
                var ymd = ""+myDate.getFullYear()+(myDate.getMonth()+1)+ myDate.getDate();
                var hms = ""+ myDate.getHours() + myDate.getMinutes() + myDate.getSeconds();
                var temp = this.myHold[this.index];
                var id = temp.id;
                var code = temp.tradName;
                this.setWinLoss({
                    account : this.account,
                    code    : code,
                    winPri  : winPrice,
                    lossPri : lossPrice,
                    ymd     : ymd,
                    hms     : hms,
                    id      : id,
                });
            },
            onHide(){
                this.cancel();
            }
        },
        computed:{
            newPrice(){
                var key = this.myHold[this.index].tradName;
                if(this.hotContract[key].newPrice == "none"){
                    return "--";
                }
                return this.hotContract[key].newPrice;
            },
            winTitle(){
                var dir = this.myHold[this.index].direction;
                var str = "";
                if(dir == 1){
                    str = "止盈价必须大于最新价";
                }else{
                    str = "止盈价必须小于最新价";
                }
                return str;
            },
            lossTitle(){
                var dir = this.myHold[this.index].direction;
                var str = "";
                if(dir == 1){
                    str = "止损价必须小于最新价";
                }else{
                    str = "止损价必须大于最新价";
                }
                return str;
            },
            winPrice(){
                var pri = this.myHold[this.index].highPrice;
                if(pri == "0"){
                    return 0.00;
                }
                return pri;
            },
            lossPrice(){
                var pri = this.myHold[this.index].lowPrice;
                if(pri == "0"){
                    return 0.00;
                }
                return pri;
            }
        },
        components:{
            Group,
            XButton,
            XInput,
            Alert,
            Cell,
            xNumber
        },
        route: {
            data(res){
                if (res.to.name=="editPrice") {
                    this.index = parseInt(res.to.params.index);
                }
            }
        }
    }
</script>