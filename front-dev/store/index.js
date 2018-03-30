import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import moment from "moment";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        leaguesList: ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"],
        selectableLeagues: [],
        matches: []
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
        }
    },
    mutations: {
        createSelectableLeagues(state) {
            state.selectableLeagues = state.leaguesList.map(name => ({name, selectedClass: ""}));
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
        }
    },
    actions: {
        createSelectableLeagues({commit, state}) {
            if(state.selectableLeagues.length === 0) commit("createSelectableLeagues");
        },
        selectLeague({commit}, leagueName) {
            commit("selectLeague", leagueName);
        },
        async loadMatches({commit, getters}, callback) {
            commit("cleanMatches", getters.selectedLeagues);

            // POST not working due CORS
            // let {data} = await Vue.axios.post(`/matches`, {leagues: getters.selectedLeagues});
            let {data} = await Vue.axios.get(`/matches/${getters.selectedLeagues.join("|")}`);

            commit("pushMatches", data);

            callback();
        }
    }
});
