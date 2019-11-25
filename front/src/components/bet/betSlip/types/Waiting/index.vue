<template lang="pug">
div.bet-slip
    div.info
        app-bet-slip-info(
        :bets="bets",
        :betSlipIndex="betSlipIndex",
        lineMode="waiting",
        )
    div.actions
        p.remove(@click="deleteBetSlip") ✖
        p.input
            span {{$t('rate.bet')}}:
            input(type="number", @input="newRate($event.target.value)", :value="rate")
            span * {{totalCoefficientTmpl}} = {{totalSumTmpl}}
        p.confirm(:class="disabledClass", @click="confirmBetSlip") ✔

</template>

<script>
import AppBetSlipInfo from "@/components/bet/betSlip/Info";
import { mapActions } from "vuex";
export default {
  name: "AppWaitingBetSlip",
  components: {
    AppBetSlipInfo,
  },
  props: {
    rate: Number,
    totalCoefficient: Number,
    totalSum: Number,
    bets: Array,
    betSlipIndex: Number,
  },
  computed: {
    totalCoefficientTmpl () {
      return this.totalCoefficient.toFixed(3);
    },
    totalSumTmpl () {
      return this.totalSum.toFixed(2);
    },
    disabled () {
      return this.rate <= 0;
    },
    disabledClass () {
      return this.disabled ? "confirm-disabled" : "";
    },
  },
  methods: {
    ...mapActions({
      _newRateOfBetSlip: "bet/newRateOfBetSlip",
      _deleteBetSlip: "bet/deleteBetSlip",
      _confirmBetSlip: "bet/confirmBetSlip",
    }),
    deleteBetSlip () {
      this._deleteBetSlip({
        index: this.betSlipIndex,
        force: true,
      });
    },
    newRate (value) {
      this._newRateOfBetSlip({
        betSlipIndex: this.betSlipIndex,
        rate: parseInt(value) || 0,
      });
    },
    confirmBetSlip () {
      if (!this.disabled) this._confirmBetSlip(this.betSlipIndex);
    },
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
    background: #ffff80;

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
