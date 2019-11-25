<template lang="pug">
div.bet-slip(:class="betSlipClass")
    div.info(v-show="showInfo")
        app-bet-slip-info(
        :bets="bets",
        :betSlipIndex="betSlipIndex",
        lineMode="result"
        )
    div.result(@click="toggleShowInfo")
        p.date {{$t('Date')}}: <b>{{createdDate}}</b>
        p.rate {{$t('Rate')}}: <b>{{rate}}</b>
        p.coefficient {{$t('total.coefficient')}}: <b>{{totalCoefficientTmpl}}</b>
        p.sum {{$t(betSlipResultText)}}: <b>{{betSlipResultSum}}</b>

</template>

<script>
import AppBetSlipInfo from "@/components/bet/betSlip/Info";
export default {
  name: "AppResultBetSlip",
  components: {
    AppBetSlipInfo,
  },
  props: {
    rate: Number,
    totalCoefficient: Number,
    totalSum: Number,
    bets: Array,
    betSlipIndex: Number,
    createdDate: String,
    outcome: String,
    outcomeSum: Number,
  },
  data: () => ({
    showInfo: false,
  }),
  computed: {
    totalCoefficientTmpl () {
      return this.totalCoefficient.toFixed(3);
    },
    totalSumTmpl () {
      return this.totalSum.toFixed(2);
    },
    betSlipResultText () {
      switch (this.outcome) {
      case "waiting": return "sum.potential";
      case "win": return "Profit";
      case "lose": return "sum.lost";
      }
    },
    betSlipResultSum () {
      return this.outcomeSum.toFixed(2);
    },
    betSlipClass () {
      return `bet-slip-${this.outcome}`;
    },
  },
  methods: {
    toggleShowInfo () {
      this.showInfo = !this.showInfo;
    },
  },
  created () {
    this.$root.$on("changeBetSlipInfoVisibility", visibility => {
      this.showInfo = visibility;
    });
  },
};
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
.bet-slip {
    margin: 10px 0;

    &.bet-slip-win {background: lightgreen;}
    &.bet-slip-lose {background: lightcoral;}
    &.bet-slip-waiting {background: #ffff80;}

    .info {
        padding: 2px 0;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        font-size: 17px;

        p {
            margin: 5px 0 8px 0;
            padding: 7px 14px;

            &.remove, &.confirm {
                background: red;
                color: white;
                font-weight: bold;
                cursor: pointer;
                border-radius: 5px;
            }
            &.remove {background: red; margin-left: 30px;}
            &.confirm {background: green; margin-right: 30px;}
            &.confirm-disabled {background: grey; cursor: not-allowed;}
            &.input {
                input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {-webkit-appearance: none;}
                input {
                    font-size: 15px;
                    width: 70px;
                    text-align: center;
                    margin: 0 5px;
                    -moz-appearance: textfield;
                }
            }
        }
    }

    .result {
        display: flex;
        .justify;
        text-align: center;
        cursor: pointer;

        .date {flex-basis: 18%}
        .rate {flex-basis: 12%}
        .coefficient {flex-basis: 27%}
        .sum {flex-basis: 40%}
    }

}
</style>
