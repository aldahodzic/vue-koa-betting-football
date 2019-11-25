<template lang="pug">
div
    app-bet-slip-info-line(
    v-for="(bet, index) in bets",
    :key="bet.key",
    :lineMode="lineMode",
    :dateTmpl="bet.dateTmpl",
    :league="bet.league",
    :home="bet.home",
    :guest="bet.guest",
    :type="bet.type",
    :bookie="bet.bookie",
    :betIndex="index",
    :betSlipIndex="betSlipIndex",
    :score="bet.score",
    :matchResult="bet.matchResult",
    )
</template>

<script>
import AppBetSlipInfoLine from "./Line";
export default {
  name: "AppBetSlipInfo",
  components: {
    AppBetSlipInfoLine,
  },
  props: {
    bets: Array,
    betSlipIndex: Number,
    lineMode: String,
  },
};
</script>
