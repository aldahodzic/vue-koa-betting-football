<template lang="pug">
div
    app-matches-menu(:leagues="leagues")
    app-matches-selector(:leagues="leagues")
</template>

<script>
import AppMatchesMenu from "./MatchesMenu.vue";
import AppMatchesSelector from "./MatchesSelector.vue";
export default {
    name: "",
    components: {
        AppMatchesMenu,
        AppMatchesSelector
    },
    data() {
        return {
            leagues: [
                "England",
                "Italy",
                "Germany",
                "Spain",
                "France"
            ]
        }
    }
}
</script>

<style lang="less">

</style>
