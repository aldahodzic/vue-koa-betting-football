<template lang="pug">
div#app
    app-header
    router-view
</template>

<script>
import AppHeader from "@/components/layout/Header";

export default {
    name: 'app',
    components: {
        AppHeader
    },
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
