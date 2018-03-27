<template lang="pug">
main
    p#loading-matches(v-if="loadingMatches") {{$t('loading.matches')}}
    p#none-matches(v-else-if="emptySelectedMatches") {{$t('not.found.matches')}}
    template(v-else)
        p.row.head
            span(
            v-for="button in sort.buttons",
            :key="button.type",
            :title="$t('click.for.sort', {title: $t(button.title)})",
            :class="button.type",
            @click="sortMatches(button)"
            ) {{$t(button.name)}}
        
        p.row(v-for="(match, index) in matchesFromSelectedLeagues")
            span.date {{match.date}}
            span.teams {{match.home}} &mdash; {{match.guest}}
            app-select-match(
            v-for="(coefficients, type, index) in match.coefficients",
            :key="type+index",
            :type="type",
            :coefficients="coefficients"
            )
</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions} from "vuex";
import AppSelectMatch from "./MatchesButtonSelect.vue";
export default {
    name: "app-content",
    components: {
        AppSelectMatch
    },
    data() {
        return {
            sort: {
                buttons: [
                    {
                        title: "Date",
                        name: "Date",
                        direction: -1,
                        type: "date"
                    },
                    {
                        title: "Teams",
                        name: "Teams",
                        direction: 1,
                        type: "teams"
                    },
                    {
                        title: "win.home",
                        name: "1",
                        direction: 1,
                        type: "h"
                    },
                    {
                        title: "Draw",
                        name: "0",
                        direction: 1,
                        type: "d"
                    },
                    {
                        title: "win.guest",
                        name: "2",
                        direction: 1,
                        type: "g"
                    },
                ],
                type: "Date",
                direction: -1
            },
            loadingMatches: true
        }
    },
    computed: {
        ...mapGetters([
            "leagues",
            "matches"
        ]),
        matchesFromSelectedLeagues() {
            let matches = this.matches;
            
            if(["1", "0", "2"].includes(this.sort.type)) {
                let bestBookieCoefficient = match => _.maxBy(match.coefficients[this.sort.type], "coefficient").coefficient;
                matches = _.sortBy(matches, match => +bestBookieCoefficient(match));
            }
            if(this.sort.type === "Date") matches = _.sortBy(matches, "dateNum");
            if(this.sort.type === "Teams") matches = _.sortBy(matches, "home");
            
            if(this.sort.direction > 0) matches = matches.reverse();
            
            return matches;
        },
        emptySelectedMatches() {
            return this.matchesFromSelectedLeagues.length < 1;
        }
    },
    methods: {
        ...mapActions([
            "loadMatches"
        ]),
        sortMatches(button) {
            this.sort.type = button.name;
            this.sort.direction = button.direction;
            button.direction = -button.direction;
        }
    },
    created() {
        this.loadMatches(() => this.loadingMatches = false);
    }
}
</script>

<style lang="less" scoped>
main {
    margin: 8px 0;
    padding: 1px 0;
    background: white;
    
    #none-matches {
        color: red;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        margin: 10px;
    }
    
    #loading-matches {
        color: blue;
        font-weight: bold;
        text-align: center;
        font-size: 20px;
        margin: 10px;
    }
    
    .row {
        display: flex;
        flex-flow: row nowrap;
        margin: 5px 0;
        
        &.head span {
            cursor: pointer !important;
            
            &.date {background:  #ff9999;}
            &.teams {background: #cccccc;}
            &.h {background: #009933;}
            &.d {background: #ffcc00;}
            &.g {background: #0066ff;}
        }
        
        span {
            flex: 1 0 calc((50% - 32px) / 4);
            text-align: center;
            padding: 10px 0;
            margin: 0 2px;
            cursor: pointer;
    
            &.date {margin-left: 4px; background: #ffb3b3; cursor: default}
            &.teams {flex-basis: 50%; background: #e6e6e6; cursor: default}
            &.h {order: 1}
            &.hd {order: 2}
            &.d {order: 3}
            &.dg {order: 4}
            &.g {order: 5; margin-right: 4px;}
        }
        
    }
}
</style>
