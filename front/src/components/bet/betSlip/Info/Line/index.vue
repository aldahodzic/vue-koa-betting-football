<template lang="pug">
div.row
    span.close(v-if="show.waiting", @click="deleteBet") &#10006;
    span.date {{dateTmpl}}
    span.league {{$t(league)}}
    span.teams {{home}} &mdash; {{guest}}
    span.type {{type}}
    span.coefficient(:title="bookie.name") {{coefficientTmpl}}
    span.score(v-if="show.results", :class="betClass") {{scoreTmpl}}

</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AppBetSlipInfoLine",
  props: {
    lineMode: String,
    dateTmpl: String,
    league: String,
    home: String,
    guest: String,
    type: String,
    bookie: Object,
    betIndex: Number,
    betSlipIndex: Number,
    score: String,
    matchResult: String,
  },
  computed: {
    show () {
      return {
        waiting: this.lineMode == "waiting",
        results: this.lineMode == "result",
      };
    },
    coefficientTmpl () {
      return this.bookie.coefficient.toFixed(2);
    },
    scoreTmpl () {
      return this.matchResult ? this.score : "- : -";
    },
    betClass () {
      if (!this.matchResult) return "";
      return this.matchResult == this.type ? "bet-match-won" : "bet-match-lose";
    },
  },
  methods: {
    ...mapActions({
      _deleteBet: "bet/deleteBet",
    }),
    deleteBet () {
      this._deleteBet({
        indexOfBet: this.betIndex,
        indexOfBetSlip: this.betSlipIndex,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}

.row {
    display: flex;
    padding: 2px 0;
    .justify;

    span {
        background: royalblue;
        color: white;
        flex: 0 0 auto;
        margin: 0 2px;
        padding: 3px 0;
        display: flex;
        align-items: center;
        justify-content: center;

        &.close {flex-basis: 23px; background: inherit; color:red; font-weight: bold; cursor: pointer;}
        &.date {flex-basis: 8%}
        &.league {flex-basis: 20%}
        &.teams {flex-basis: 20%; flex-grow: 1}
        &.score {flex-basis: 7%}
        &.type {flex-basis: 5%}
        &.coefficient {flex-basis: 7%}

        &:first-of-type {margin-left: 4px}
        &:last-of-type {margin-right: 4px}

        &.bet-match-won {background: green}
        &.bet-match-lose {background: red}
    }
}
</style>
