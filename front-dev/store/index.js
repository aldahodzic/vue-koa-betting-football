import Vuex from "vuex";

const store = new Vuex.Store({
    state: {
        leaguesList: [
            "ChampionsLeague",
            "EuropaLeague",
            "England",
            "Italy",
            "Germany",
            "Spain",
            "France"
        ],
        leagues: []
    },
    mutations: {
        createSelectableLeagues(state) {

        }
    }
});
