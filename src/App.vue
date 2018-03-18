<template lang="pug">
div#app
    app-header
    app-menu
    app-content
</template>

<script>
import AppHeader from "./components/Header.vue";
import AppMenu from "./components/Menu.vue";
import AppContent from "./components/Content.vue";
export default {
    name: 'app',
    components: {
        AppHeader,
        AppMenu,
        AppContent
    },
    data() {
        return {};
    }
};
</script>

<style lang="less">
body {
    background: #e7e7e7;
    margin: 0;
    padding: 0;
}
#app {
    width: 85%;
    max-width: 1200px;
    margin: 0 auto;
}
</style>
