<template lang="pug">
menu
    li(v-for="league in leagues") {{league}}

</template>

<script>
export default {
    name: "app-menu",
    props: ["leagues"],
    data() {
        return {
        
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
    margin: 8px 0;
    padding: 0;
    background: white;
    display: flex;
    list-style: none;
    .justify;
    
    li {
        margin: 4px 2px;
        padding: 5px 10px;
        background: greenyellow;
        flex: 1 1 auto;
        text-align: center;
        font-size: 17px;
        
        &:first-of-type {margin-left: 4px}
        &:last-of-type {margin-right: 4px}
    }
}
</style>
