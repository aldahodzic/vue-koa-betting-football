<template lang="pug">
menu
    li(v-for="league in leagues") {{league}}

</template>

<script>
export default {
    name: "app-menu",
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

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}

menu {
    margin: 10px 0;
    padding: 0;
    background: inherit;
    display: flex;
    list-style: none;
    .justify;
    
    li {
        margin: 0 1.5px;
        padding: 5px 10px;
        background: greenyellow;
        flex: 1 1 auto;
        text-align: center;
        font-size: 17px;
        
        &:first-of-type {margin-left: 0}
        &:last-of-type {margin-right: 0}
    }
}
</style>
