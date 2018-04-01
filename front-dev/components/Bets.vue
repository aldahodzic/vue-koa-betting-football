<template lang="pug">
div#bet-slip
    div#bet-types
        span(@click="type='waiting'") Waiting to confirm
        span(@click="type='confirmed'") Confirmed bets
        span(@click="type='results'") Results
    app-bets-waiting(v-if="type=='waiting'")
    app-bets-confirmed(v-if="type=='confirmed'")
    app-bets-results(v-if="type=='results'")
</template>

<script>
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
            type: "waiting"
        }
    }
}
</script>

<style lang="less">
#bet-types {
    background: white;
    
    
}
</style>
