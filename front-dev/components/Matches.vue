<template lang="pug">
div
    app-matches-menu
    app-matches-actions
</template>

<script>
import AppMatchesMenu from "./MatchesMenu.vue";
import AppMatchesActions from "./MatchesActions.vue";
export default {
    components: {
        AppMatchesMenu,
        AppMatchesActions,
    },
}
</script>
