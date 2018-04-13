<template lang="pug">
div#bet-slip
    div#bet-types
        span(
        v-for="item in menu",
        @click="changeMenu(item)",
        :class="item.classes"
        ) {{item.title}}
    
    p#none-bets(v-if="betsType.length==0") You didn't made any bets.
    
    div#bets-actions(v-else)
        p
            span Sort
            select(@change="changeSort($event.target.value)")
                option(value="createdAt") Date
                option(value="rate") Rate
                option(value="totalSum") Result sum
                option(value="totalCoefficient") Coefficient
                
    
    div.bets-type(v-if="betsType.length>0")
        app-bet-slip(
        v-for="(betSlip, index) in betsType",
        :key="index",
        :bets="betSlip.bets",
        :type="type",
        :index="index",
        :id="betSlip._id",
        :createdAt="betSlip.createdAt",
        :rate="betSlip.rate",
        @new-rate="onNewRate"
        )
        
    p#get-previous(
    v-if="type=='results'"
    ) Get previous bets


</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions} from "vuex";
import appBetSlip from "./BetsBetSlip.vue";
export default {
    name: "app-bets",
    components: {
        appBetSlip,
    },
    data() {
        return {
            type: "waiting",
            sort: "createdAt",
            direction: -1,
            sortSelected: false,
            menu: [
                {
                    type: "waiting",
                    classes: "selected",
                    title: "Waiting to confirm"
                },
                {
                    type: "results",
                    classes: "",
                    title: "Results"
                },
                {
                    type: "check",
                    classes: "",
                    title: "⌕",
                    tagTitle: "Check all bets"
                }
            ]
        }
    },
    computed: {
        ...mapGetters({
            _bets: "bets",
            _trigger_updateConfirmedBets: "trigger_updateConfirmedBets"
        }),
        betsType() {
            if(!this.sortSelected) return this._bets[this.type];
    
            let bets = this._bets[this.type];
            let arr = this.$children.map(({id, [this.sort]: sortParam}) => ({id, sortParam}));
            
            let sortFunction;
            if(this.sort === "createdAt") sortFunction = bet => new Date(bet["sortParam"]).getTime() * this.direction;
            else sortFunction = bet => Number(bet["sortParam"]);

            arr = _.sortBy(arr, sortFunction);

            let newBets = [];
            for(let i in arr) newBets.push(bets.find(bet => arr[i].id === bet._id));
            
            return newBets;
        },
    },
    methods: {
        ...mapActions({
            _getConfirmedBets: "getConfirmedBets",
            _getResults: "getResults"
        }),
        changeMenu(selectedItem) {
            if(selectedItem.type === "check") return this._getResults(true);
            _.each(this.menu, item => item.classes = item.type === selectedItem.type ? "selected" : "");
            this.clearSort();
            this.type = selectedItem.type;
        },
        onNewRate({value, index}) {
            this.betsType[index].rate = value;
        },
        changeSort(val) {
            this.sortSelected = true;
            this.sort = val;
        },
        clearSort() {
            this.sortSelected = false;
        },
    },
    created() {
        this._getResults();
    },
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}
#bet-types {
    background: white;
    display: flex;
    margin: 10px 0;
    .justify;
    
    span {
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
        &:nth-child(3) {
            margin-left: -2px;
            background: blue;
            flex-basis: 40px;
            padding: 0;
            flex-grow: 0;
            font-size: 25px;
            color: white;
            font-weight: bold;
            transform: rotateY(180deg);
        }
    }
}
.bets-type {
    background: white;
    padding: 1px 5px;
}

#bets-actions {
    display: flex;
}

#none-bets {
    padding: 5px 0;
    text-align: center;
    color: white;
    margin: 10px auto;
    background: red;
}
#get-previous {
    padding: 5px 0;
    text-align: center;
    color: white;
    margin: 10px auto;
    background: darkorange;
    width: 60%;
}
</style>
