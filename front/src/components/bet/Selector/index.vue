<template lang="pug">
div#bet-selector
    p.selector
        span {{$t('Sort')}}
            select#sort(@change="changeSelector('sort', $event.target.value)", :value="selector.sort")
                option(value="createdAt") {{$t('Date')}}
                option(value="rate") {{$t('Rate')}}
                option(value="totalCoefficient") {{$t('Coefficient')}}
                option(value="outcomeSum", v-if="show.sumResultOption") {{$t('sum.result')}}
    p.buttons
        span#arrows(@click="changeSelector('direction')", :title="$t('change.direction')") ⇅
    p.selector
        span {{$t('Filter')}}
            select#filter(@change="changeSelector('filter', $event.target.value)", :value="selector.filter")
                option(value="all") {{$t('All')}}
                option(value="win") {{$t('Wins')}}
                option(value="waiting") {{$t('Waiting')}}
                option(value="lose") {{$t('Loses')}}
    p.buttons#toogle-info-visibility
        span(@click="changeBetSlipInfoVisibility(false)"): img(src="@/assets/images/icons/hide.svg", :title="$t('hide.info.betSlips')")
        span(@click="changeBetSlipInfoVisibility(true)"): img(src="@/assets/images/icons/show.svg", :title="$t('show.info.betSlips')")

</template>

<script>
import {mapGetters, mapActions} from "vuex";
export default {
    name: "app-bet-selector",
    computed: {
        ...mapGetters({
            selector: "bet/selector",
        }),
        show() {
            return {
                sumResultOption: this.selector.filter != "all",
            }
        },
    },
    methods: {
        ...mapActions({
            _changeSelector: "bet/changeSelector",
        }),
        changeSelector(field, value) {
            if(field == "direction") value = -this.selector.direction;
            this._changeSelector({field, value});
        },
        changeBetSlipInfoVisibility(visibility) {
            this.$root.$emit("changeBetSlipInfoVisibility", visibility);
        },
    },
}
</script>

<style lang="less" scoped>
.justify {
    justify-content: space-around;
    justify-content: space-evenly;
}

#bet-selector {
    display: flex;
    .justify;
    align-items: center;
    background: white;
    margin: 10px 0;
    padding: 5px 0;
    
    p {
        margin: 0;
        display: flex;
        align-items: center;
    
        &.buttons > span {
            padding: 5px 10px 2px 10px;
            margin: 0 3px;
            cursor: pointer;
            font-size: 20px;
        }
        
        span {
            background: #595959;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            padding: 5px 20px;
        }
        
        select {
            font-size: 14px;
            padding: 2px 6px;
            margin-left: 6px;
            -webkit-appearance: none;
            -moz-appearance: none;
            text-align: center;
            cursor: pointer;
        }
        
    }
}

</style>
