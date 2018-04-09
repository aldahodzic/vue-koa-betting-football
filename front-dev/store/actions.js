import Vue from "vue";

export default {
    createSelectableLeagues({commit, getters}) {
        if(getters.leagues.length === 0) commit("createSelectableLeagues");
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
    async userAuthAction({commit}, {url, userData, callback}) {
        let {data, status} = await Vue.axios.post(`/auth/${url}`, userData);
        commit("setUserAuthStatus", status);
        callback({data, status});
    },
    deleteBet({commit}, data) {
        commit("deleteBet", data);
        commit("deleteBetSlip", {index: data.indexOfBetSlip});
    },
    deleteBetSlip({commit}, data) {
        commit("deleteBetSlip", data);
    },
    async confirmBetSlip({commit, getters}, index) {
        let bets = getters.bets.waiting[index];
        let {data, status} = await Vue.axios.post("/bets/confirm", bets);
        if(!status) return alert(data);
        commit("deleteBetSlip", {index, force: true});
        commit("pushToConfirmed", [data]);
    },
    async getConfirmedBets({commit}) {
        commit("clearConfirmedBets");
        let {data, status} = await Vue.axios.get("/bets/get/confirmed");
        commit("pushToConfirmed", data);
    },
}
