<template lang="pug">
div#actions
    div#buttons(v-if="loading!='processing'")
        span#load-matches(@click="loadMatches") {{$t(textAction)}}
        span#change-mode(v-if="showInfo", @click="toggleSelectorItemMode") {{$t(buttonInfoText)}}
        span#confirm-current-bet-slip(v-if="!currentBetsEmpty", @click="sendToWaitingBets") {{$t('confirm.betSlip')}}
    div#loading(v-if="loading=='processing'") {{$t('loading.matches')}}...
    app-match-selector(v-if="showSelector")
</template>

<script>
import AppMatchSelector from "./Selector";
import {mapGetters, mapActions} from "vuex";
export default {
    name: "AppMatchActions",
    components: {
        AppMatchSelector,
    },
    data() {
        return {
            loading: "wait",
            buttonInfoText: "show.info.bets"
        }
    },
    computed: {
        ...mapGetters({
            matches: "match/matches",
            selectedLeagues: "league/selectedLeagues",
            leagues: "league/leagueList",
            bets: "bet/bets",
        }),
        currentBetsEmpty() {
            return this.bets.current.length == 0;
        },
        textAction() {
            let action = this.matches.length == 0 ? "load" : "update";
            let count = this.selectedLeagues.length == this.leagues.length ? "leagues_all" : "leagues_selected";
            return `phrases.${action}.${count}`;
        },
        showInfo() {
            return this.currentBetsEmpty && this.matches.length != 0;
        },
        showSelector() {
            return this.loading == "end" || this.loading == "wait" || this.matches.length != 0;
        },
    },
    methods: {
        ...mapActions({
            _loadMatches: "match/loadMatches",
            _toggleSelectorItemMode: "match/toggleSelectorItemMode",
            _pushToWaiting: "bet/pushToWaiting",
        }),
        async loadMatches() {
            this.loading = "processing";
            await this._loadMatches();
            this.loading = "end";
        },
        async toggleSelectorItemMode() {
            this.buttonInfoText = this.buttonInfoText === "show.info.bets" ? "hide.info.bets" : "show.info.bets";
            await this._toggleSelectorItemMode();
        },
        async sendToWaitingBets() {
            await this._pushToWaiting();
        },
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
            padding: 3px 25px;
            margin: 4px 0;
            background: lightskyblue;
            font-size: 16px;
            cursor: pointer;
        }
    }
    
}
</style>