<template lang="pug">
menu
    li(
    v-for="league in leagues",
    @click="selectLeague(league)",
    :class="league.selected"
    ) {{league.name}}
</template>

<script>
import _ from "lodash";
export default {
    name: "app-menu",
    props: {
        leaguesForCreated: Array
    },
    data() {
        return {
            leagues: []
        }
    },
    created() {
        _.each(this.leaguesForCreated, league => {
            this.leagues.push({
                name: league,
                selected: ""
            });
        });
    },
    methods: {
        selectLeague(league) {
            league.selected = league.selected === "" ? "selected" : "";
            
            let selectedLeagues = _.filter(this.leagues, "selected");
            
            let leagues = [];
            if(selectedLeagues.length > 0) _.each(selectedLeagues, league => leagues.push(league.name));
            else leagues = this.leaguesForCreated;
            
            this.$emit("new-select-leagues", leagues);
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
        background: #33ff33;
        flex: 1 1 auto;
        text-align: center;
        font-size: 17px;
        cursor: pointer;
        
        &:first-of-type {margin-left: 4px}
        &:last-of-type {margin-right: 4px}
        
        &.selected {background: #009933; color: white;}
    }
}
</style>
