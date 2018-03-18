<template lang="pug">
main
    p.row.head
        span.teams(title="Teams") Teams
        span.h(title="Home win") 1
        span.hd(title="Home win / Draw") 10
        span.d(title="Draw") 0
        span.dg(title="Draw / Guest win") 02
        span.g(title="Guest win") 2
    p.row(v-for="(match, index) in matches")
        span.teams {{match.home}} - {{match.guest}}
        span: input.h(type="button", :value="best(index, '1').coefficient", :title="best(index, '1').name")
        span: input.hd(type="button", :value="best(index, '10').coefficient", :title="best(index, '1').name")
        span: input.d(type="button", :value="best(index, '0').coefficient", :title="best(index, '1').name")
        span: input.dg(type="button", :value="best(index, '02').coefficient", :title="best(index, '1').name")
        span: input.g(type="button", :value="best(index, '2').coefficient", :title="best(index, '1').name")
</template>

<script>
import _ from "lodash";
export default {
    name: "app-content",
    data() {
        return {
            matches: []
        }
    },
    methods: {
        best(index, type) {
            return _.maxBy(this.matches[index].coefficients[type], "coefficient");
        }
    },
    created() {
        for(let i = 0; i < 10; i++) {
            this.matches.push({
                home: _.capitalize(Math.random().toString(27).replace(/\d/g, "").slice(2, 10)),
                guest: _.capitalize(Math.random().toString(27).replace(/\d/g, "").slice(2, 10)),
                coefficients: {
                    "1": [
                        {
                            name: "bet1",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet2",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet3",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                    ],
                    "10": [
                        {
                            name: "bet1",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet2",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet3",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                    ],
                    "0": [
                        {
                            name: "bet1",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet2",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet3",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                    ],
                    "02": [
                        {
                            name: "bet1",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet2",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet3",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                    ],
                    "2": [
                        {
                            name: "bet1",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet2",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                        {
                            name: "bet3",
                            coefficient: _.random(5, true).toFixed(2)
                        },
                    ]
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
main {
    margin: 10px 0;
    background: white;
    
    .row {
        display: flex;
        flex-flow: row nowrap;
        margin: 10px 0;
        
        &.head span {
            cursor: pointer;
        }
        
        span {
            flex: 1 0 13%;
            text-align: center;
            padding: 5px 0;
            
    
            &.teams {
                flex-basis: 35%;
                background: lightblue;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            input {
                cursor: pointer;
                padding: 5px 15px;
            }
        }
        
    }
}
</style>
