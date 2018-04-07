<template lang="pug">
div#bet-slip
    div#bet-types
        span(
        v-for="item in menu",
        @click="changeMenu(item)",
        :class="item.classes"
        ) {{item.title}}
        
    div.bets-type
        app-bet-slip(
        v-for="(bets, index) in betsType",
        :key="index",
        :bets="bets",
        :type="type",
        :index="index"
)

</template>

<script>
import _ from "lodash";
import {mapGetters} from "vuex";
import appBetSlip from "./BetsBetSlip.vue";
export default {
    name: "app-bets",
    components: {
        appBetSlip,
    },
    data() {
        return {
            type: "waiting",
            menu: [
                {
                    type: "waiting",
                    classes: "selected",
                    title: "Waiting to confirm"
                },
                {
                    type: "confirmed",
                    classes: "",
                    title: "Confirmed bets"
                },
                {
                    type: "results",
                    classes: "",
                    title: "Results"
                }
            ]
        }
    },
    computed: {
        ...mapGetters({
            _bets: "bets"
        }),
        betsType() {
            return this._bets[this.type];
        },
    },
    methods: {
        changeMenu(selectedItem) {
            _.each(this.menu, item => item.classes = item.type === selectedItem.type ? "selected" : "");
            this.type = selectedItem.type;
        },
    }
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
#bet-types {
    background: white;
    display: flex;
    margin: 10px 0;
    .justify;
    
    span {
        margin: 4px 2px;
        padding: 5px 10px;
        background: #33ff33;
        flex: 1 1 auto;
        text-align: center;
        font-size: 17px;
        cursor: pointer;
    
        &:first-of-type {margin-left: 4px}
        &:last-of-type {margin-right: 4px}
        &.selected {background: #009933; color: white;}
    }
}
.bets-type {
    background: white;
    padding: 1px 5px;
}
</style>
