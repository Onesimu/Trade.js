<template>
    <div>
        <div class="listTitle">
            <ul>
                <li class="col1">交易品种</li>
                <li class="col2">最新价</li>
                <li class="col3">开仓保证金</li>
            </ul>
        </div>
        <div class="listBd">
            <ul>
                <li v-for="item in allTradData"  v-link="{ name: 'tradInfo', params: { id: item.code,name:item.cn,cur:item.cur}}">
                    <p class="tradName">
                        <b>{{item.cn}}</b>
                        <span>{{item.code}}</span>
                    </p>
                    <p  :class="['tradPrice',{'tradPriceGreen':item.upDown < 0},{'tradPriceNo':item.newPrice=='none'}]">{{item.newPrice == "none" ? '--':item.newPrice}}</p>
                    <p class="openCashLabel">
                        {{ item.openCashFK > item.openCash ? parseFloat(item.openCashFK).toFixed(2) : parseFloat(item.openCash).toFixed(2)}}
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    export default{
        vuex:{
            getters:{
                allTradData : (state)=>state.hotContract,
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style lang="less">
    .listTitle{
        color: #AEAEAE; height: 40px; width: 100%;background: #f3f3f3; font-size: 14px;}
    .listTitle li{float: left;  line-height: 40px; text-align: center;height: 40px;}
    .listTitle li.col1{
        width:40%;
    }
    .listTitle li.col2{
        width:30%;
    }
    .listTitle li.col3{
        width:30%;
    }
    .listBd{padding-top: 5px; background:#fff;}
    .listBd li{
        border-bottom: 1px solid #ececec;
        height: 50px;
        overflow: hidden;
    }
    .listBd li a{text-decoration: none; display: block; width: 100%;height: 100%;}
    .listBd li p {
        width: 50%;
        height: 50px;
        float: left;
        text-align: center;
        color: #484848;
    }
    .listBd .tradName {margin-top: 5px; width: 40%;}
    .listBd .tradName b{display: block;}
    .listBd .tradName span{color: #aeaeae;}
    .listBd .tradPrice {
        font-size: 16px;
        font-weight: bold;
        line-height:50px;
        color:#ee3800;
        width: 30%;
    }
    .listBd .tradPriceGreen{color: #00c56b;}
    .listBd .tradPriceNo{color:#aeaeae;}
    .listBd .tradLabel{line-height: 50px;}
    .listBd .tradLabel b{
        height: 20px;
        margin: 15px auto 0;
        color: #aeaeae;
        padding: 3px 5px;
        border-radius: 3px;
        font-weight: normal;
        min-width: 30px;
    }
    .listBd .tradLabel b.red{background: #ee3800;color: #fff;}
    .listBd .tradLabel b.green{background: #00c56b;color: #fff;}
    .listBd .tradBzj{line-height: 50px; font-weight: 700; color: #ee3800; font-size:16px;}
    .listBd .openCashLabel{
        width:30%;
        font-size: 16px;
        font-weight: bold;
        line-height:50px;
        color:#ee3800;
    }
</style>
