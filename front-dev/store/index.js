import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import moment from "moment";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        leaguesList: ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"],
        selectableLeagues: [],
        matches: [],
        currentBets: [],
        selectButtonMode: "bet"
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
            return state.currentBets
        },
        selectButtonMode(state) {
            return state.selectButtonMode
        }
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
            let selectedBet = state.currentBets.find(bet => bet.key === key);

            if(!selectedBet) {
                state.currentBets.push({home, guest, dateNum, league, bookie, key, type});
                return callback(true);
            }

            if(selectedBet.type === type) {
                let index = state.currentBets.findIndex(bet => bet.type === type && bet.key === key);
                state.currentBets.splice(index, 1);
                return callback(true);
            }

            callback(false);
        },
        changeSelectButtonMode(state) {
            state.selectButtonMode = state.selectButtonMode === "bet" ? "info" : "bet";
        }
    },
    actions: {
        createSelectableLeagues({commit, state}) {
            if(state.selectableLeagues.length === 0) commit("createSelectableLeagues");
        },
        async loadMatches({commit, getters}, callback) {
            commit("cleanMatches", getters.selectedLeagues);
            // POST not working due CORS
            // let {data} = await Vue.axios.post(`/matches`, {leagues: getters.selectedLeagues});
            let {data} = await Vue.axios.get(`/matches/${getters.selectedLeagues.join("|")}`);
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

    }
});
