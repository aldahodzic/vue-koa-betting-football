<template lang="pug">
main
    p.row.head
        span.date Date
        span.teams(title="Teams") Teams
        span.h(title="Home win") 1
        span.hd(title="Home win / Draw") 10
        span.d(title="Draw") 0
        span.dg(title="Draw / Guest win") 02
        span.g(title="Guest win") 2
    p.row(v-for="(match, index) in matches")
        span.date {{match.date}}
        span.teams {{match.home}} &mdash; {{match.guest}}
        app-button-select-match(
        v-for="(coefficients, type) in match.coefficients",
        :key="type",
        :type="type",
        :coefficients="coefficients"
        )
</template>

<script>
import _ from "lodash";
import moment from "moment";
import AppButtonSelectMatch from "./ButtonSelectMatch.vue";
export default {
    name: "app-content",
    components: {
        AppButtonSelectMatch
    },
    props: ["leagues"],
    data() {
        return {
            matches: []
        }
    },
    created() {
        for(let i = 0; i < 10; i++) {
            
            let match = {
                home: _.capitalize(Math.random().toString(27).replace(/\d/g, "").slice(2, 10)),
                guest: _.capitalize(Math.random().toString(27).replace(/\d/g, "").slice(2, 10)),
                league: this.leagues[_.random(this.leagues.length-1)],
                date: moment().format("DD.MM")
            };
    
            match.coefficients = {};
            
            _.each(["1", "10", "0", "02", "2"], type => {
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
            *   home: Team
            *   guest: Team
            *   coefficients: [{
            *       name: Bookmaker.name,
            *       coefficient: Bookmaker.coefficient
            *   }]
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
    
    .row {
        display: flex;
        flex-flow: row nowrap;
        margin: 5px 0;
        
        
        &.head span {
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
    
            &.date {margin-left: 4px; background: #ffb3b3}
            &.teams {flex-basis: 40%; background: #e6e6e6}
            &.h {order: 1}
            &.hd {order: 2}
            &.d {order: 3}
            &.dg {order: 4}
            &.g {order: 5; margin-right: 4px;}
        }
        
        
        
    }
}
</style>
