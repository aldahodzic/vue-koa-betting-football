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
            span.teams [{{match.league}}] {{match.home}} &mdash; {{match.guest}}
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
                        title: "phrases.winHome_Draw",
                        name: "10",
                        direction: 1,
                        type: "hd"
                    },
                    {
                        title: "Draw",
                        name: "0",
                        direction: 1,
                        type: "d"
                    },
                    {
                        title: "phrases.winGuest_Draw",
                        name: "02",
                        direction: 1,
                        type: "dg"
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
            
            if(["1", "10", "0", "02", "2"].includes(this.sort.type)) {
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
    created() {
        for(let i = 0; i < 10; i++) {
            
            let match = {
                home: _.capitalize(Math.random().toString(27).replace(/\d/g, "").slice(2, 10)),
                guest: _.capitalize(Math.random().toString(27).replace(/\d/g, "").slice(2, 10)),
                league: this.leaguesForCreated[_.random(this.leaguesForCreated.length-1)],
                date: moment().add(_.random(5), "days").format("DD.MM")
            };
    
            match.coefficients = {};
            
            _.each(["1", "0", "2"], type => {
                let all = [];
                _.each(["bet1", "bet2", "bet3"], bet => all.push({
                    name: bet,
                    coefficient: _.random(5, true).toFixed(2)
                }));
    
                match.coefficients[type] = all;
            });
            
            this.matches.push(match);
            
            /*
            * Match schema
            * {
            *   league: League
            *   date: DD.MM HH.mm
            *   home: Team
            *   guest: Team
            *   coefficients: {
            *       [coefficientType(1|0|2)]: [
            *           {
            *               name: Bookmaker.name,
            *               coefficient: Bookmaker.coefficient
            *           },
            *           ...
            *       ]
            *   }
            * }
            * */
            
        }
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
            &.hd {background: #ace600;}
            &.d {background: #ffcc00;}
            &.dg {background: #66b3ff;}
            &.g {background: #0066ff;}
        }
        
        span {
            flex: 1 0 calc((60% - 32px) / 6);
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
