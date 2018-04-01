<template lang="pug">
div#actions
    div#buttons(v-if="loading!='processing'")
        span(@click="loadMatches") {{$t(textAction)}}
        span(v-if="showInfo", @click="changeSelectButtonMode") {{$t(buttonInfoText)}}
        span(v-if="currentBets.length!=0", @click="sendToWaitingBets") {{$t('confirm.betSlip')}}
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
            buttonInfoText: "show.info"
        }
    },
    computed: {
        ...mapGetters(["matches", "selectedLeagues", "leagues", "currentBets"]),
        textAction() {
            let action = this.matches.length === 0 ? "load" : "update";
            let count = this.selectedLeagues.length === this.leagues.length ? "leagues_all" : "leagues_selected";
            return `phrases.${action}.${count}`;
        },
        showInfo() {
            return this.currentBets.length === 0 && this.matches.length !== 0;
        },
    },
    methods: {
        ...mapActions({
            _loadMatches: "loadMatches",
            _changeSelectButtonMode: "changeSelectButtonMode",
            _pushToWaiting: "pushToWaiting",
        }),
        loadMatches() {
            this.loading = "processing";
            this._loadMatches(() => this.loading = "end");
        },
        changeSelectButtonMode() {
            this.buttonInfoText = this.buttonInfoText === "show.info" ? "hide.info" : "show.info";
            this._changeSelectButtonMode();
        },
        sendToWaitingBets() {
            this._pushToWaiting();
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
