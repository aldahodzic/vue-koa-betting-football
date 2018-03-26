<template lang="pug">
main
    p#none-matches(v-if="emptySelectedMatches") {{$t('not.found.matches')}}
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
import moment from "moment";
import AppSelectMatch from "./MatchesButtonSelect.vue";
export default {
    name: "app-content",
    components: {
        AppSelectMatch
    },
    props: {
        leaguesForCreated: Array,
        leagues: [Array, Boolean]
    },
    data() {
        return {
            matches: [],
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
            }
        }
    },
    computed: {
        matchesFromSelectedLeagues() {
            let matches;
            if(this.leagues === false) matches = this.matches;
            else matches = _.filter(this.matches, match => this.leagues.includes(match.league));
            
            if(["1", "0", "2"].includes(this.sort.type)) {
                matches = _.sortBy(matches, match => _.maxBy(match.coefficients[this.sort.type], "coefficient").coefficient);
            }
            if(this.sort.type === "Date") matches = _.sortBy(matches, match => moment(match.date, "DD.MM").valueOf());
            if(this.sort.type === "Teams") matches = _.sortBy(matches, "home");
            
            if(this.sort.direction > 0) matches = matches.reverse();
            
            return matches;
        },
        emptySelectedMatches() {
            return this.matchesFromSelectedLeagues.length < 1;
        }
    },
    methods: {
        sortMatches(button) {
            this.sort.type = button.name;
            this.sort.direction = button.direction;
            button.direction = -button.direction;
        }
    },
    async created() {
        let {data} = await this.$http.get("/matches");
        _.each(data, match => match.date = moment(match.date).format("DD.MM"));
        this.matches = data;
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
            flex: 1 0 calc((60% - 32px) / 4);
            text-align: center;
            padding: 10px 0;
            margin: 0 2px;
            cursor: pointer;
    
            &.date {margin-left: 4px; background: #ffb3b3; cursor: default}
            &.teams {flex-basis: 40%; background: #e6e6e6; cursor: default}
            &.h {order: 1}
            &.hd {order: 2}
            &.d {order: 3}
            &.dg {order: 4}
            &.g {order: 5; margin-right: 4px;}
        }
        
    }
}
</style>
