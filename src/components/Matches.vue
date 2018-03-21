<template lang="pug">
div
    app-matches-menu(
    :leaguesForCreated="leagues",
    @new-select-leagues="selectedLeagues=$event"
    )
    app-matches-selector(
    :leaguesForCreated="leagues",
    :leagues="selectedLeagues"
    )
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
                "Champions league",
                "Europa league",
                "England",
                "Italy",
                "Germany",
                "Spain",
                "France"
            ],
            selectedLeagues: false
        }
    }
}
</script>

<style lang="less">

</style>
