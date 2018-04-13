<template lang="pug">
div#bet-slip
    div#bet-types
        span(
        v-for="item in menu",
        @click="changeMenu(item)",
        :class="item.classes"
        ) {{item.title}}
        
    p.p-info#get-previous(
    v-if="type=='results'"
    ) Get previous bets
    
    p.p-info#none-bets(v-if="betsType.length==0") You didn't made any bets.
    
    div.bets-type(v-if="betsType.length>0")
        app-bet-slip(
        v-for="(betSlip, index) in betsType",
        :key="index",
        :bets="betSlip.bets",
        :type="type",
        :index="index",
        :rate="betSlip.rate",
        @new-rate="onNewRate"
)

</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions} from "vuex";
import appBetSlip from "./BetsBetSlip.vue";
export default {
    name: "app-bets",
    components: {
        appBetSlip,
    },
    data() {
        return {
            type: "waiting",
            menu: [
                {
                    type: "waiting",
                    classes: "selected",
                    title: "Waiting to confirm"
                },
                {
                    type: "results",
                    classes: "",
                    title: "Results"
                },
                {
                    type: "check",
                    classes: "",
                    title: "⌕",
                    tagTitle: "Check all bets"
                }
            ]
        }
    },
    computed: {
        ...mapGetters({
            _bets: "bets",
            _trigger_updateConfirmedBets: "trigger_updateConfirmedBets"
        }),
        betsType() {
            return this._bets[this.type];
        },
    },
    methods: {
        ...mapActions({
            _getConfirmedBets: "getConfirmedBets",
            _getResults: "getResults"
        }),
        changeMenu(selectedItem) {
            if(selectedItem.type === "check") return this._getResults(true);
            _.each(this.menu, item => item.classes = item.type === selectedItem.type ? "selected" : "");
            this.type = selectedItem.type;
        },
        onNewRate({value, index}) {
            this.betsType[index].rate = value;
        },
    },
    created() {
        this._getResults();
    },
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
#bet-types {
    background: white;
    display: flex;
    margin: 10px 0;
    .justify;
    
    span {
        margin: 4px 2px;
        padding: 5px 10px;
        background: #33ff33;
        flex: 1 1 auto;
        text-align: center;
        font-size: 17px;
        cursor: pointer;
    
        &:first-of-type {margin-left: 4px}
        &:last-of-type {margin-right: 4px}
        &.selected {background: #009933; color: white;}
        &:nth-child(3) {
            margin-left: -2px;
            background: blue;
            flex-basis: 40px;
            padding: 0;
            flex-grow: 0;
            font-size: 25px;
            color: white;
            font-weight: bold;
            transform: rotateY(180deg);
        }
    }
}
.bets-type {
    background: white;
    padding: 1px 5px;
}
.p-info {
    background: darkorange;
    padding: 5px 0;
    text-align: center;
    width: 60%;
    color: white;
    margin: 10px auto;
    
    &#get-previous {
        background: darkorange;
        width: 60%;
    }
    &#none-bets {
        background: red;
        width: 100%;
    }
}
</style>
