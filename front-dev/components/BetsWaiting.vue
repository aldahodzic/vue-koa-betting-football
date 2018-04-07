<template lang="pug">
div#bets-waiting
    app-bet-slip(
    v-for="(bets, index) in waitingBets",
    :key="index",
    :bets="bets",
    :mode="'waiting'",
    :index="index"
    )
</template>

<script>
import {mapGetters} from "vuex";
import appBetSlip from "./BetsBetSlip.vue";
export default {
    name: "app-bets-waiting",
    components: {
        appBetSlip
    },
    computed: {
        ...mapGetters({
            _bets: "bets"
        }),
        waitingBets() {
            return this._bets.waiting;
        },
    },
}
</script>

<style lang="less">
#bets-waiting {
    background: white;
    padding: 1px 5px;

}
</style>
