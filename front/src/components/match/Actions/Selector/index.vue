<template lang="pug">
main
    p#none-matches(v-if="show.emptyMatches") {{$t('not.found.matches')}}
    template(v-if="show.selector")
        p.row.head
            span(
            v-for="button in sort.buttons",
            :key="button.type",
            :title="$t(button.title)+'. '+$t('click.for.sort')",
            :class="button.type",
            @click="sortMatches(button)"
            ) {{$t(button.name)}}
        
        p.row(
        v-for="(match, index) in matchesFromSelectedLeagues",
        :key="match.key",
        )
            span.date {{match.dateTmpl}}
            span.teams {{match.home}} &mdash; {{match.guest}}
            app-match-selector-item(
            v-for="(coefficients, type) in match.coefficients",
            :key="type+match.key",
            :type="type",
            :coefficients="coefficients",
            :matchKey="match.key",
            )

</template>

<script>
import _ from "lodash";
import {mapGetters} from "vuex";
import AppMatchSelectorItem from "./Item";
export default {
    name: "app-match-selector",
    components: {
        AppMatchSelectorItem,
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
        }
    },
    computed: {
        ...mapGetters({
            "matches": "match/matches",
        }),
        show() {
            return {
                emptyMatches: this.emptySelectedMatches,
                selector: !this.emptySelectedMatches,
            };
        },
        matchesFromSelectedLeagues() {
            let matches = this.matches;

            if(["1", "0", "2"].includes(this.sort.type)) {
                let bestBookieCoefficient = match => _.maxBy(match.coefficients[this.sort.type], "coefficient").coefficient;
                matches = _.sortBy(matches, match => +bestBookieCoefficient(match));
            }
            if(this.sort.type === "Date") matches = _.sortBy(matches, "date");
            if(this.sort.type === "Teams") matches = _.sortBy(matches, "home");

            if(this.sort.direction > 0) matches = matches.reverse();

            return matches;
        },
        emptySelectedMatches() {
            return this.matchesFromSelectedLeagues.length == 0;
        }
    },
    methods: {
        sortMatches(button) {
            this.sort.type = button.name;
            this.sort.direction = button.direction;
            button.direction = -button.direction;
        },
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
            flex: 1 0 calc((50% - 62px) / 4);
            text-align: center;
            padding: 10px 3px;
            margin: 0 2px;
            cursor: pointer;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            
            &.date {margin-left: 4px; background: #ffb3b3; cursor: default}
            &.teams {flex-basis: 50%; background: #e6e6e6; cursor: default}
            &.h {order: 1}
            &.d {order: 2}
            &.g {order: 3; margin-right: 4px;}
        }
        
    }
}

</style>