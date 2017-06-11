<template>
    <div>
        <group>
            <selector  title="划拨方向" :value.sync="defaultValue" :options="list" @on-change="selectChange"></selector>
            <cell title="可转资金" :value="money"></cell>
            <cell title="汇率" :value="rate"></cell>
            <x-input id="outPrice" title="划转资金" placeholder="不要超过可转资金" :value.sync = "outPrice" keyboard="tel" type="number" @on-change="change"></x-input>
            <x-input title="计价资金" :value.sync = "inPrice"  keyboard="tel" type="number" readonly></x-input>
        </group>
        <div class="pcoper">
            <x-button type="primary" @click="sure">确定</x-button>
            <x-button type="default" @click="cancel">取消</x-button>
        </div>
        <alert :show.sync="MoneyTrans.isShow" title="提示" button-text="确定" @on-hide="onHide">
            <div style="text-align: center;">
                <p>{{MoneyTrans.state=="00"?'操作成功':MoneyTrans.msg}}</p>
            </div>
        </alert>
    </div>
</template>
<style lang="less">

</style>
<script>
    import {setRate,getUserMoney,setMoneyTrans} from "vuex/actions"
    import Group from "vux/src/components/group"
    import XButton from "vux/src/components/x-button"
    import Cell from "vux/src/components/cell"
    import Selector from "vux/src/components/selector"
    import XInput from "vux/src/components/x-input"
    import Alert from "vux/src/components/alert"
    export default{
        vuex: {
            getters:{
                userMoney : (state)=>state.userMoney,
                account : (state)=>state.userInfo.account,
                moneyRate:(state)=>state.moneyRate,
                MoneyTrans : (state)=>state.MoneyTrans
            },
            actions: {
                setRate,
                getUserMoney,
                setMoneyTrans
            }
        },
        data(){
            return{
                defaultValue:"z_rmb",
                list:[
                    {key: 'z_rmb', value: '总账户→人民币账户'},
                    {key: 'z_gy', value: '总账户→港元账户'},
                    {key: 'z_usa', value: '总账户→美元账户'},
                    {key: 'z_eur', value: '总账户→欧元账户'},
                    {key: 'rmb_z', value: '人民币账户→总账户'},
                    {key: 'gy_z', value: '港元账户→总账户'},
                    {key: 'usa_z', value: '美元账户→总账户'},
                    {key: 'eur_z', value: '欧元账户→总账户'}
                ],
                outPrice:"",
                inPrice:"",//计价资金
            }
        },
        methods:{
            onHide(){
                this.cancel();
            },
            sure(){
                /*
                * “01”,总账户到人民币账户；
                * “10”人民币账户到总账户；
                * “02”总账户到港元账户；
                * “20”港元账户到总账户；
                * “03”总账户到美元账户；
                * “30”美元账户到总账户
                * */
                var dir = "01"; //总账户到人民币账户
                if(this.defaultValue == "z_gy"){
                    dir = "02";
                }
                if(this.defaultValue == "z_usa"){
                    dir = "03";
                }
                if(this.defaultValue == "z_eur"){
                    dir = "04";
                }
                if(this.defaultValue == "rmb_z"){
                    dir = "10";
                }
                if(this.defaultValue == "gy_z"){
                    dir = "20";
                }
                if(this.defaultValue == "usa_z"){
                    dir = "30";
                }
                if(this.defaultValue == "eur_z"){
                    dir = "40";
                }
                if(this.outPrice > this.money || this.outPrice == ""){
                    return;
                }
                this.setMoneyTrans({
                    account: this.account,
                    dir : dir,
                    price : this.outPrice,
                    isClick : true
                });
            },
            cancel(){
                window.location.hash="/user";
            },
            selectChange(){
                this.outPrice = "";
                this.inPrice = "";
            },
            change(val){
                if(val>this.money){
                    event.target.value="";
                    this.inPrice = "";
                    return;
                }
                /*
                *  人民币到美元：人民币/汇率（人民币到美元的汇率）
                   美元到人民币：美元 * 汇率（美元到人民币的汇率）
                   人民币到港币：人民币/汇率（人民币到港元的汇率）
                   港元到人民币：美元 * 汇率（港元到人民币的汇率）
                 *
                * */
                if(this.defaultValue == "z_rmb" || this.defaultValue == "rmb_z"){
                    this.inPrice = val.toString();
                }else if(this.defaultValue == "z_gy"){
                    this.inPrice = (val/this.moneyRate.z_gy).toFixed(2).toString();
                }else if(this.defaultValue == "z_usa"){
                    this.inPrice = (val/this.moneyRate.z_usa).toFixed(2).toString();
                }else if(this.defaultValue == "z_eur"){
                    this.inPrice = (val/this.moneyRate.z_eur).toFixed(2).toString();
                }else if(this.defaultValue == "gy_z"){
                    this.inPrice = (val*this.moneyRate.gy_z).toFixed(2).toString();
                }else if(this.defaultValue == "usa_z"){
                    this.inPrice = (val*this.moneyRate.usa_z).toFixed(2).toString();
                }else if(this.defaultValue == "eur_z"){
                    this.inPrice = (val*this.moneyRate.eur_z).toFixed(2).toString();
                }
            }
        },
        ready(){
            this.setRate(this.account,false);
            var _this = this;
            clearTimeout(window.getUserTime);
            window.getUserTime = window.setTimeout(function(){
                _this.getUserMoney(_this.account);
            },100);
        },
        components:{
            Group,
            XButton,
            Cell,
            Selector,
            XInput,
            Alert
        },
        computed:{
            money(){
                if(this.userMoney.length == 0){
                    return "获取中...";
                }
                var cur = "ALL";
                if(this.defaultValue == "rmb_z"){
                    cur = "CNY";
                }else if(this.defaultValue == "gy_z"){
                    cur = "HKD";
                }else if(this.defaultValue == "usa_z"){
                    cur = "USD";
                }else if(this.defaultValue == "eur_z"){
                    cur = "EUR";
                }
                for(var k in this.userMoney){
                    if(this.userMoney[k].cur == cur){
                        return this.userMoney[k].val;
                    }
                }
            },
            rate(){
                var str = "";
                if(this.defaultValue == "z_rmb"){
                    str = "1:1";
                }else if(this.defaultValue == "z_gy"){
                    str = this.moneyRate.z_gy+":1";
                }else if(this.defaultValue == "z_usa"){
                    str = this.moneyRate.z_usa+":1";
                }else if(this.defaultValue == "z_eur"){
                    str = this.moneyRate.z_eur+":1";
                }else if(this.defaultValue == "rmb_z"){
                    str = "1:1";
                }else if(this.defaultValue == "gy_z"){
                    str = "1:"+this.moneyRate.gy_z;
                }else if(this.defaultValue == "usa_z"){
                    str = "1:"+this.moneyRate.usa_z;
                }else if(this.defaultValue == "eur_z"){
                    str = "1:"+this.moneyRate.eur_z;
                }
                return str;
            }
        }
    }
</script>