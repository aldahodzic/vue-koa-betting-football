<template lang="pug">
div#bets-waiting
    app-bets-block(
    v-for="(bets, index) in waitingBets",
    :key="index",
    :bets="bets",
    :mode="'waiting'"
    )
</template>

<script>
import {mapGetters} from "vuex";
import appBetsBlock from "./BetsBlock.vue";
export default {
    name: "app-bets-waiting",
    components: {
        appBetsBlock
    },
    computed: {
        ...mapGetters(["waitingBets"])
    },
}
</script>

<style lang="less">
#bets-waiting {
    background: white;
    padding: 1px 5px;

}
</style>
