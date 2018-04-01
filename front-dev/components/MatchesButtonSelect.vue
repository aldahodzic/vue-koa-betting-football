<template lang="pug">
    span(
    :class="classes",
    :title="button.title",
    @click="button.func",
    v-html="button.text"
    )
</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions} from "vuex";
export default {
    props: {
        type: String,
        coefficients: Array,
        matchKey: String,
    },
    data() {
        return {
            showModal: true,
            classes: {
                h: this.type === "1",
                d: this.type === "0",
                g: this.type === "2",
                selected: false,
            }
        }
    },
    computed: {
        ...mapGetters(["selectButtonMode", "trigger_updateMatchButtonsSelectClass"]),
        bestBookie() {
            let bestBookie = _.maxBy(this.coefficients, "coefficient");
            bestBookie.coefficient = parseFloat(bestBookie.coefficient).toFixed(2);
            return bestBookie;
        },
        infoBookies() {
            let coefficients = _.sortBy(this.coefficients, ({coefficient}) => -parseFloat(coefficient));
            return coefficients.reduce((str, {name, coefficient}) => str + `${name} ${parseFloat(coefficient).toFixed(2)}<hr>`, "");
        },
        button() {
            if(this.selectButtonMode === "bet") return {
                title: this.bestBookie.name,
                text: this.bestBookie.coefficient,
                func: this.makeBet
            };
            else return {
                text: this.infoBookies,
                func: () => ""
            }
        },
    },
    methods: {
        ...mapActions({
            _changeCurrentBetSlip: "changeCurrentBetSlip"
        }),
        makeBet() {
            this._changeCurrentBetSlip({
                key: this.matchKey,
                bookie: this.bestBookie,
                type: this.type,
                callback: this._changeStatus,
            });
        },
        _changeStatus(permission) {
            if(permission) this.classes.selected = !this.classes.selected;
            else console.log("denied");
        }
    },
    watch: {
        trigger_updateMatchButtonsSelectClass() {
            this.classes.selected = false;
        }
    }
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
    &:last-of-type {display: none;}
}
</style>
