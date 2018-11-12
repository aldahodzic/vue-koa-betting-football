<template lang="pug">
div#bet-slip
    
    app-bet-menu
    
    p#loading-bets(v-if="show.loading") {{$t('loading.bets')}}...
    
    app-bet-selector(v-if="show.selector")
    
    p#none-bets(v-if="show.noneBets") {{$t(emptyBetsText)}}
    div.selected-bets(v-if="show.bets")
        compnent(
        :is="betSlipComponent",
        v-for="(betSlip, index) in bets",
        :key="betSlip._id",
        :bets="betSlip.bets",
        :rate="betSlip.rate",
        :totalCoefficient="betSlip.totalCoefficient",
        :totalSum="betSlip.totalSum",
        :betSlipIndex="index",
        :createdDate="betSlip.createdDate",
        :outcome="betSlip.outcome",
        :outcomeSum="betSlip.outcomeSum",
        )
        
    p#get-previous(v-if="show.loadPrevious", @click="getAllBets") {{$t('load.bets.previous')}}

</template>

<script>
import {mapGetters, mapActions} from "vuex";
import appBetMenu from "@/components/bet/Menu";
import appBetSelector from "@/components/bet/Selector";
import appWaitingBetSlip from "@/components/bet/betSlip/types/Waiting";
import appResultBetSlip from "@/components/bet/betSlip/types/Result";
export default {
    name: "app-bet",
    components: {
        appWaitingBetSlip,
        appResultBetSlip,
        appBetSelector,
        appBetMenu,
    },
    computed: {
        ...mapGetters({
            user: "auth/user",
            waitingBets: "bet/waitingBets",
            resultBets: "bet/filteredAndSortedResultBets",
            selector: "bet/selector",
            load: "bet/load",
        }),
        show() {
            let resultMode = this.selector.type == "results" && this.load.ready;
            let waitingMode = this.selector.type == "waiting";

            return {
                noneBets: this.emptyBets && (waitingMode || resultMode),
                bets: !this.emptyBets && (waitingMode || resultMode),
                loadPrevious: resultMode && this.load.previous,
                loading: this.selector.type == "results" && this.load.status == "loading",
                selector: resultMode,
            };
        },
        betSlipComponent() {
            return this.selector.type == "waiting" ? "app-waiting-bet-slip" : "app-result-bet-slip";
        },
        bets() {
            return this.selector.type == "waiting" ? this.waitingBets : this.resultBets;
        },
        emptyBets() {
            return this.bets.length == 0;
        },
        emptyBetsText() {
            let resultBets = this.selector.type == "results" && this.selector.filter == "all";
            let waitingBets = this.selector.type == "waiting";
            
            if(this.emptyBets && (resultBets || waitingBets)) return "not.made.bets";
            else if(this.emptyBets) return `not.have.bets.${this.selector.filter}`;
        },
    },
    methods: {
        ...mapActions({
            _getResults: "bet/getResults",
            _changeSelector: "bet/changeSelector",
            _resetSelector: "bet/resetSelector",
            _changeLoad: "bet/changeLoad",
        }),
        getAllBets() {
            this._changeLoad({field: "previous", value: false});
            this._getResults({force: true, created: "all"});
        },
    },
    created() {
        if(this.user.auth) this._getResults({created: "last"});
        else this.$router.replace("matches");
    },
    beforeDestroy() {
        // must change selector type to waiting
        this._resetSelector();
    },
}
</script>

<style lang="less" scoped>
.selected-bets {
    background: white;
    padding: 1px 5px;
}
#none-bets {
    padding: 5px 0;
    text-align: center;
    color: white;
    margin: 10px auto;
    background: rgba(255, 0, 0, 0.73);
}
#get-previous {
    padding: 5px 0;
    text-align: center;
    color: white;
    margin: 10px auto;
    background: darkorange;
    width: 60%;
    cursor: pointer;
}
#loading-bets {
    color: blue;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
    margin: 10px 0;
    padding: 5px 0;
    background: white;
}
</style>
