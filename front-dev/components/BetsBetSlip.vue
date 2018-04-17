<template lang="pug">
div.bet-slip(v-if="show.filter", :class="betSlipClass")
    div.info(v-if="show.info")
        div.row(v-for="(bet, indexOfBet) in bets")
            span.close(v-if="show.deleteBet", @click="deleteBet(indexOfBet)") &#10006;
            span.date {{bet.date}}
            span.league {{$t(bet.league)}}
            span.teams {{bet.home}} &mdash; {{bet.guest}}
            span.type {{bet.type}}
            span.coefficient {{bet.bookie.coefficient}}
            span.score(v-if="bet.score", :class="betStatusClass(bet)") {{bet.score}}
    div.actions(v-if="show.actions")
        p.remove(@click="deleteBetSlip") &#10006;
        p.input
            span Bet amount:
            input(type="number", @input="newRate", :value="rate")
            span * {{totalCoefficient}} = {{totalSum}}
        p.confirm(:class="disabledClass", @click="confirmBetSlip") &#10004;
    div.result(v-if="show.result", @click="showInfo=!showInfo")
        p.date Date: <b>{{createdDate}}</b>
        p.rate Rate: <b>{{rate}}</b>
        p.coefficient Total coefficient: <b>{{totalCoefficient}}</b>
        p.sum {{betSlipResultText}}: <b>{{betSlipResultSum}}</b>
    
</template>

<script>
import moment from "moment";
import {mapActions} from "vuex";
export default {
    name: "app-bet-slip",
    props: {
        bets: Array,
        type: String,
        index: Number,
        rate: Number,
        id: String,
        createdAt: String,
        hideInfo: Boolean,
        showFiltered: String,
    },
    data() {
        return {
            showInfo: false,
        }
    },
    computed: {
        show() {
            return {
                actions: this.type === "waiting",
                deleteBet: this.type === "waiting",
                result: this.type === "results",
                info: this.showInfo || this.type === "waiting",
                filter: this.showFiltered === "all" || this.showFiltered === this.betSlipStatus
            }
        },
        totalCoefficient() {
            return (this.bets.reduce((r, {bookie}) => r * Number(bookie.coefficient), 1)).toFixed(3);
        },
        totalSum() {
            return (Number(this.totalCoefficient) * Number(this.rate)).toFixed(2);
        },
        disabled() {
            return Number(this.rate) <= 0;
        },
        disabledClass() {
            return this.disabled ? "confirm-disabled" : "";
        },
        betSlipClass() {
            return `bet-slip-${this.betSlipStatus}`;
        },
        betSlipStatus() {
            let matchResults = this.bets.map(this.betStatus);
            if(matchResults.some(bet => bet === "waiting")) return "waiting";
            if(matchResults.every(bet => bet === true)) return "win";
            else return "lose";
        },
        betSlipResultText() {
            switch(this.betSlipStatus) {
                case "waiting":  return "Potential win sum";
                case "win":  return "Profit";
                case "lose":  return "Lost sum";
            }
        },
        betSlipResultSum() {
            let sum;
            switch(this.betSlipStatus) {
                case "waiting":  sum = Number(this.totalSum); break;
                case "win":  sum = Number(this.totalSum) - this.rate; break;
                case "lose":  sum = this.rate; break;
            }
            return sum.toFixed(2);
        },
        createdDate() {
            return moment(this.createdAt).format("DD.MM HH:mm");
        },
    },
    methods: {
        ...mapActions({
            _deleteBet: "deleteBet",
            _deleteBetSlip: "deleteBetSlip",
            _confirmBetSlip: "confirmBetSlip",
        }),
        newRate(e) {
            this.$emit("new-rate", {
                index: this.index,
                value: Number(e.target.value) || 0
            });
        },
        deleteBet(indexOfBet) {
            this._deleteBet({indexOfBet, indexOfBetSlip: this.index});
        },
        deleteBetSlip() {
            this._deleteBetSlip({index: this.index, force: true});
        },
        confirmBetSlip() {
            if(!this.disabled) this._confirmBetSlip(this.index);
        },
        betStatus({type, score}) {
            if(!score || score === "none") return "waiting";
            let [home, guest] = score.split(" : ");
            let result;
            if(home > guest) result = "1";
            if(home === guest) result = "0";
            if(home < guest) result = "2";
            return result === type;
        },
        betStatusClass(bet) {
            let result = this.betStatus(bet);
            if(result === true) return "bet-match-won";
            if(result === false) return "bet-match-lose";
        },
    },
    watch: {
        hideInfo() {
            this.showInfo = false;
        }
    }
}
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
    
    p {margin: 8px 0;}
    
    .info {
        padding: 2px 0;
        
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
        .rate {flex-basis: 10%}
        .coefficient {flex-basis: 25%}
        .sum {flex-basis: 30%}
    }
    
}
</style>
