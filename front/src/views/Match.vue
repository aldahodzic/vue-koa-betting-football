<template lang="pug">
div
    app-match-menu
    app-match-actions
</template>

<script>
import AppMatchMenu from "@/components/match/Menu";
import AppMatchActions from "@/components/match/Actions";
export default {
  name: "AppMatch",
  components: {
    AppMatchMenu,
    AppMatchActions,
  },
};
</script>
