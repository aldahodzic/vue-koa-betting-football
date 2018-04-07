<template lang="pug">
div.bets-block
    div.info
        div.row(v-for="(bet, indexOfBet) in bets")
            span.close(@click="deleteBet(indexOfBet)") &#10006;
            span.date {{bet.date}}
            span.league {{$t(bet.league)}}
            span.teams {{bet.home}} &mdash; {{bet.guest}}
            span.type {{bet.type}}
            span.coefficient {{bet.bookie.coefficient}}
            span.score(v-if="show.score") 1 : 2
    div.actions(v-if="show.actions")
        p.remove(@click="deleteBetSlip") &#10006;
        p.input
            span Bet amount:
            input(type="number", v-model="rate")
            span * {{totalCoefficient}} = {{totalSum}}
        p.confirm(:class="disabled") &#10004;
</template>

<script>
import moment from "moment";
import {mapActions} from "vuex";
export default {
    name: "app-bet-slip",
    props: {
        bets: Array,
        type: String,
        index: Number
    },
    data() {
        return {
            rate: 0,
            show: {
                score: ["result"].includes(this.type),
                actions: ["waiting"].includes(this.type)
            }
        }
    },
    computed: {
        totalCoefficient() {
            return (this.bets.reduce((r, {bookie}) => r * Number(bookie.coefficient), 1)).toFixed(3);
        },
        totalSum() {
            return (Number(this.totalCoefficient) * Number(this.rate)).toFixed(2);
        },
        disabled() {
            return Number(this.rate) <= 0 ? "confirm-disabled" : "";
        }
    },
    methods: {
        ...mapActions({
            _deleteBet: "deleteBet",
            _deleteBetSlip: "deleteBetSlip",
        }),
        deleteBet(indexOfBet) {
            this._deleteBet({indexOfBet, indexOfBetSlip: this.index});
        },
        deleteBetSlip() {
            this._deleteBetSlip({index: this.index, force: true});
        },
    },
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
.bets-block {
    background: #ffff80;
    margin: 10px 0;
    
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
            &.confirm-disabled {background: grey; cursor: default;}
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
    
}
</style>
