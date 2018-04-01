<template lang="pug">
div#bets-waiting
    h2 Bets waiting
    div(v-for="bet in waitingBets")
        pre {{bet}}
</template>

<script>
import {mapGetters} from "vuex";
export default {
    name: "app-bets-waiting",
    computed: {
        ...mapGetters(["waitingBets"])
    }
}
</script>

<style lang="less">
#bets-waiting {
    background: white;
    
    h2 {
        text-align: center;
        margin: 0;
    }
}
</style>
