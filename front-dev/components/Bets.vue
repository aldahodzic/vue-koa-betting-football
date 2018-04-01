<template lang="pug">
div#bet-slip
    div#bet-types
        span(
        v-for="item in menu",
        @click="changeMenu(item)",
        :class="item.classes"
        ) {{item.title}}
    app-bets-waiting(v-if="type=='waiting'")
    app-bets-confirmed(v-if="type=='confirmed'")
    app-bets-results(v-if="type=='results'")
</template>

<script>
import _ from "lodash";
import appBetsWaiting from "./BetsWaiting.vue";
import appBetsConfirmed from "./BetsConfirmed.vue";
import appBetsResults from "./BetsResults.vue";
export default {
    name: "app-bet-slip",
    components: {
        appBetsWaiting,
        appBetsConfirmed,
        appBetsResults,
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
        classes() {
            return {
            
            }
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
</style>
