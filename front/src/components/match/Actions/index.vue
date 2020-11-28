<template lang="pug">
div#actions
    div#buttons(v-if="show.loading.passive")
        span#load-matches(@click="loadMatches") {{$t(textAction)}}
        span#change-mode(v-if="show.info", @click="toggleSelectorItemMode") {{$t(buttonInfoText)}}
        span#confirm-current-bet-slip(v-if="show.confirm", @click="sendToWaitingBets") {{$t('confirm.betSlip')}}
    div#loading(v-if="show.loading.active") {{$t('loading.matches')}}...
    app-match-selector(v-if="show.selector")
</template>

<script>
import AppMatchSelector from "./Selector";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AppMatchActions",
  components: {
    AppMatchSelector,
  },
  data () {
    return {
      loading: "wait",
      buttonInfoText: "show.info.bets",
    };
  },
  computed: {
    ...mapGetters({
      matches: "match/matches",
      selectedLeagues: "league/selectedLeagues",
      leagues: "league/leagueList",
      bets: "bet/bets",
    }),
    show () {
      return {
        info: this.emptyCurrentBets && !this.emptyMatches,
        selector: this.loading === "end" || this.loading === "wait" || !this.emptyMatches,
        loading: {
          active: this.loading === "processing",
          passive: this.loading !== "processing",
        },
        confirm: !this.emptyCurrentBets,
      };
    },
    emptyCurrentBets () {
      return this.bets.current.length === 0;
    },
    emptyMatches () {
      return this.matches.length === 0;
    },
    textAction () {
      const action = this.emptyMatches ? "load" : "update";
      const count = this.selectedLeagues.length === this.leagues.length ? "leagues_all" : "leagues_selected";
      return `phrases.${action}.${count}`;
    },
  },
  methods: {
    ...mapActions({
      _loadMatches: "match/loadMatches",
      _toggleSelectorItemMode: "match/toggleSelectorItemMode",
      _pushToWaiting: "bet/pushToWaiting",
    }),
    async loadMatches () {
      this.loading = "processing";
      try {
        await this._loadMatches();
      }
      catch (e) {
        console.error(e);
      }
      this.loading = "end";
    },
    toggleSelectorItemMode () {
      this.buttonInfoText = this.buttonInfoText === "show.info.bets" ? "hide.info.bets" : "show.info.bets";
      this._toggleSelectorItemMode();
    },
    sendToWaitingBets () {
      this._pushToWaiting();
    },
  },
};
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
