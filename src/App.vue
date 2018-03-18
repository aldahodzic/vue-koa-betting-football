<template lang="pug">
div#app
    app-header
    app-menu
</template>

<script>
import AppHeader from "./components/Header.vue";
import AppMenu from "./components/Menu.vue";
export default {
    name: 'app',
    components: {
        AppHeader,
        AppMenu
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
    width: 75%;
    max-width: 1000px;
    margin: 0 auto;
    
    @media screen and (max-width: 600px) {
        width: 95%;
        max-width: 100%;
    }
}
</style>
