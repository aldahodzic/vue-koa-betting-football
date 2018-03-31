<template lang="pug">
    span(
    :class="classes",
    :title="bestBookie.name",
    @click="makeBet"
    ) {{bestBookie.coefficient}}
</template>

<script>
import _ from "lodash";
import {mapActions} from "vuex";
export default {
    props: {
        type: String,
        coefficients: Array,
        matchKey: String
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
        bestBookie() {
            let bestBookie = _.maxBy(this.coefficients, "coefficient");
            bestBookie.coefficient = parseFloat(bestBookie.coefficient).toFixed(2);
            return bestBookie;
        },
    },
    methods: {
        ...mapActions(["changeCurrentBetSlip"]),
        makeBet() {
            
            this.changeCurrentBetSlip({
                key: this.matchKey,
                bookie: this.bestBookie,
                type: this.type,
                callback: this.changeStatus,
            });
        },
        changeStatus(permission) {
            if(permission) this.classes.selected = !this.classes.selected;
            else console.log("denied");
        }
    }
}
</script>

<style lang="less" scoped>
span {font-weight: bold}
.h {background: #00ff00;}
.d {background: #ffff00;}
.g {background: #3399ff;}
.selected {background: black; color: white}
</style>
