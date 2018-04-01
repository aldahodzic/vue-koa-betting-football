<template lang="pug">
div#actions
    div#buttons
        span(@click="startLoadingMatches") {{textAction}}
        span(v-if="matches.length!=0") select
    div#loading(v-if="loading=='processing'") {{$t('loading.matches')}}
    app-matches-selector(v-if="loading=='end'")
</template>

<script>
import AppMatchesSelector from "./MatchesSelector.vue";
import {mapGetters, mapActions} from "vuex";
export default {
    components: {AppMatchesSelector},
    data() {
        return {
            loading: "wait",
        }
    },
    computed: {
        ...mapGetters(["matches", "selectedLeagues", "leagues"]),
        textAction() {
            let action = this.matches.length === 0 ? "load" : "update";
            let count = this.selectedLeagues.length === this.leagues.length ? "all leagues" : "selected leagues";
            return `${action} ${count}`;
        }
    },
    methods: {
        ...mapActions([
            "loadMatches"
        ]),
        startLoadingMatches() {
            this.loading = "processing";
            this.loadMatches(() => this.loading = "end");
        }
    },
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
#actions {
    
    #loading {
        color: blue;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        margin: 10px 0;
        padding: 5px 0;
        background: white;
    }
    
    #buttons {
        display: flex;
        flex-flow: row nowrap;
        background: white;
        .justify;
    
        span {
            padding: 3px 35px;
            margin: 4px 0;
            background: lightskyblue;
            font-size: 16px;
            cursor: pointer;
        }
    }
    
}
</style>
