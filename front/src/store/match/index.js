import _ from "lodash";

export const state = {
    matches: JSON.parse(localStorage.getItem("matches")) || [],
    selectorItemMode: "bet", // [bet, info],
};

export const getters = {
    matches(state, getters, rootState, rootGetters) {
        return state.matches.filter(match => rootGetters["league/selectedLeagues"].includes(match.league));
    },
    selectorItemMode(state) {
        return state.selectorItemMode;
    },
};

export const mutations = {
    toggleSelectorItemMode(state) {
        state.selectorItemMode = state.selectorItemMode === "bet" ? "info" : "bet";
    },
    cleanMatches(state, selectedLeagues) {
        state.matches = state.matches.filter(match => !selectedLeagues.includes(match.league));
    },
    pushMatches(state, matchData) {
        matchData.forEach(match => state.matches.push({
            ...match,
            dateTmpl: $moment(match.date).format("DD.MM"),
        }));

        localStorage.setItem("matches", JSON.stringify(state.matches));
    },
};

export const actions = {
    async loadMatches({commit, rootGetters}) {
        let selectedLeagues = rootGetters["league/selectedLeagues"];
        commit("cleanMatches", selectedLeagues);
        let {data} = await $axios.post(`/matches`, {leagues: selectedLeagues});
        commit("pushMatches", data);
    },
    async toggleSelectorItemMode({commit}) {
        commit("toggleSelectorItemMode");
    },
};

export const match = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};