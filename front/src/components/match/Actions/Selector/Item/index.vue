<template lang="pug">
span(
    :class="[classes, selectedClass]",
    :title="button.title",
    @click="makeBet",
    v-html="button.text"
)
</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions} from "vuex";
export default {
    name: "app-match-selector-item",
    props: {
        type: String,
        coefficients: Array,
        matchKey: String,
    },
    computed: {
        ...mapGetters({
            selectorItemMode: "match/selectorItemMode",
            bets: "bet/bets",
        }),
        classes() {
            return {
                h: this.type == "1",
                d: this.type == "0",
                g: this.type == "2",
            };
        },
        selected() {
            let item = this.bets.current.find(({key}) => key == this.matchKey);
            return item && item.type == this.type;
        },
        selectedClass() {
            return this.selected ? "selected" : "";
        },
        bestBookie() {
            let bestBookie = _.maxBy(this.coefficients, "coefficient");
            return {
                name: bestBookie.name,
                coefficient: bestBookie.coefficient,
                coefficientTmpl: bestBookie.coefficient.toFixed(2),
            };
        },
        infoBookies() {
            let coefficients = _.sortBy(this.coefficients, ({coefficient}) => -coefficient);
            coefficients = coefficients.map(({name, coefficient}) => `${name} ${coefficient.toFixed(2)}`);
            return coefficients.join(`<hr>`);
        },
        button() {
            if(this.selectorItemMode == "bet") return {
                title: this.bestBookie.name,
                text: this.bestBookie.coefficientTmpl,
            };
            else return {
                text: this.infoBookies,
            };
        },
    },
    methods: {
        ...mapActions({
            _changeCurrentBetSlip: "bet/changeCurrentBetSlip",
        }),
        async makeBet() {
            if(this.selectorItemMode != "bet") return;
            await this._changeCurrentBetSlip({
                key: this.matchKey,
                bookie: this.bestBookie,
                type: this.type,
            });
        },
    },
}
</script>

<style lang="less" scoped>
span {font-weight: bold;}
.h {background: #00ff00;}
.d {background: #ffff00;}
.g {background: #3399ff;}
.selected {background: black; color: white}
</style>
<style lang="less">
hr {
    margin: 6px 0;
    padding: 0;
    border: 0.5px solid #fff;
}
</style>