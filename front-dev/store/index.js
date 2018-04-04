import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import moment from "moment";

Vue.use(Vuex);

import vm from "../main";

export const store = new Vuex.Store({
    state: {
        leaguesList: ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"],
        selectableLeagues: [],
        matches: [],
        selectButtonMode: "bet", // [bet, info],
        bets: {
            current: [],
            waiting: [],
            confirmed: [],
            results: []
        },
        user: {
            auth: false
        },
        // triggers
        trigger_updateMatchButtonsSelectClass: false
    },
    getters: {
        leagues(state) {
            return state.selectableLeagues;
        },
        selectedLeagues(state, getters) {
            let leagues = getters.leagues.map(league => league.selectedClass === "selected" ? league.name : null);
            _.remove(leagues, leagues => leagues === null);
            return leagues.length === 0 ? state.leaguesList : leagues;
        },
        matches(state, getters) {
            return state.matches.filter(match => getters.selectedLeagues.includes(match.league));
        },
        currentBets(state) {
            return state.bets.current
        },
        selectButtonMode(state) {
            return state.selectButtonMode
        },
        waitingBets(state) {
            return state.bets.waiting
        },

        user(state) {
            let authToken = Vue.cookie.get("auth");
            let auth = !!authToken && authToken !== "guest";
            console.log(auth);
            return {...state.user, auth};
        },
        // triggers
        trigger_updateMatchButtonsSelectClass(state) {
            return state.trigger_updateMatchButtonsSelectClass
        },
    },
    mutations: {
        createSelectableLeagues(state) {
            // state.selectableLeagues = state.leaguesList.map(name => ({name, selectedClass: ""}));
            state.selectableLeagues = state.leaguesList.map(name => ({name, selectedClass: name === "ChampionsLeague" ? "selected" : ""}));
        },
        selectLeague(state, leagueName) {
            let league = state.selectableLeagues.find(league => league.name === leagueName);
            league.selectedClass = league.selectedClass !== "selected" ? "selected" : "";
        },
        cleanMatches(state, selectedLeagues) {
            _.remove(state.matches, match => selectedLeagues.includes(match.league));
            // after removing, matches are not reactive, splice doesn't work
            state.matches = [...state.matches];
        },
        pushMatches(state, data) {
            _.each(data, match => state.matches.push({
                ...match,
                dateNum: match.date,
                date: moment(match.date).format("DD.MM")
            }));
        },
        changeCurrentBetSlip(state, {key, bookie, type, callback}) {
            let {home, guest, dateNum, league} = state.matches.find(match => match.key === key);
            let selectedBet = state.bets.current.find(bet => bet.key === key);

            if(!selectedBet) {
                state.bets.current.push({home, guest, dateNum, league, bookie, key, type});
                return callback(true);
            }

            if(selectedBet.type === type) {
                let index = state.bets.current.findIndex(bet => bet.type === type && bet.key === key);
                state.bets.current.splice(index, 1);
                return callback(true);
            }

            callback(false);
        },
        changeSelectButtonMode(state) {
            state.selectButtonMode = state.selectButtonMode === "bet" ? "info" : "bet";
        },
        pushToWaiting(state) {
            state.bets.waiting.push(state.bets.current);
            state.bets.current = [];
        },
        updateMatchButtonsSelectClass(state) {
            state.trigger_updateMatchButtonsSelectClass = !state.trigger_updateMatchButtonsSelectClass;
        },
        setUserAuth(state, status) {
            state.user.auth = status;
        },
    },
    actions: {
        createSelectableLeagues({commit, state}) {
            if(state.selectableLeagues.length === 0) commit("createSelectableLeagues");
        },
        async loadMatches({commit, getters}, callback) {
            commit("cleanMatches", getters.selectedLeagues);
            let {data} = await Vue.axios.post(`/matches`, {leagues: getters.selectedLeagues});
            commit("pushMatches", data);
            callback();
        },
        selectLeague({commit}, leagueName) {
            commit("selectLeague", leagueName);
        },
        changeCurrentBetSlip({commit}, betData) {
            commit("changeCurrentBetSlip", betData)
        },
        changeSelectButtonMode({commit}) {
            commit("changeSelectButtonMode")
        },
        pushToWaiting({commit}) {
            commit("pushToWaiting");
            commit("updateMatchButtonsSelectClass");
        },
        async userSignIn({commit, getters}, {userData, callback}) {
            if(getters.user.auth) return false;
            let {data, status} = await Vue.axios.post("/auth/authorization", userData);
            commit("setUserAuth", status);
            callback({data, status});
        },
    }
});
