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
        commit("setUserLogout", false);
        callback({data, status});
    },
    async userLogout({commit}, callback) {
        let {data, status} = await Vue.axios.delete("/auth/logout");
        if(!status) alert(data);
        commit("setUserAuthStatus", false);
        commit("setUserLogout", true);
        callback();
    },
    deleteBet({commit}, data) {
        commit("deleteBet", data);
        commit("deleteBetSlip", {index: data.indexOfBetSlip});
    },
    deleteBetSlip({commit}, data) {
        commit("deleteBetSlip", data);
    },


    async confirmBetSlip({commit, getters}, index) {
        let betSlip = getters.bets.waiting[index];
        let {data, status} = await Vue.axios.post("/bets/confirm", betSlip);
        if(!status) return alert(data);
        commit("deleteBetSlip", {index, force: true});
        commit("setResultsUpdatedStatus", false);
    },
    async getResults({commit, getters}, {force, created, callback}) {
        let _callback = callback || function() {};
        if(!force && getters.trigger_resultsUpdated) return _callback();
        commit("clearResults");
        let {data} = await Vue.axios.get(`/bets/results/${created}`);
        commit("pushToResults", data);
        commit("setResultsUpdatedStatus", true);
        _callback();
    },
}
