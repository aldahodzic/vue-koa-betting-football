<template lang="pug">
div#app
    app-header
</template>

<script>
import AppHeader from "./components/Header.vue";
export default {
    name: 'app',
    components: {
        AppHeader
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
    background: white;
    
    @media screen and (max-width: 600px) {
        width: 95%;
        max-width: 100%;
    }
}
</style>
