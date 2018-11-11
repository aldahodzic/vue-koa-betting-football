import _ from "lodash";

export const state = {
    bets: {
        current: [],
        waiting: [],
        results: []
    },
    trigger_resultsUpdated: false,
};

export const getters = {
    bets(state) {
        return state.bets;
    },
};

export const mutations = {
    changeCurrentBetSlip(state, {betData, matchData}) {
        
        let {key, bookie, type} = betData;
        let {home, guest, date, dateTmpl, league} = matchData;
        let selectedBet = state.bets.current.find(bet => bet.key === key);

        if(!selectedBet) {
            state.bets.current.push({home, guest, date, dateTmpl, league, bookie, key, type});
            return;
        }

        if(selectedBet.type === type) {
            let index = state.bets.current.findIndex(bet => bet.type == type && bet.key == key);
            state.bets.current.splice(index, 1);
        }
    },
    pushToWaiting(state) {
        state.bets.waiting.push({
            rate: 0,
            bets: state.bets.current
        });
        state.bets.current = [];
    },
    clearResults(state) {
        state.bets.results = [];
    },
    pushToResults(state, data) {
        state.bets.results = _.sortBy(data, bet => -1 * new Date(bet.createdAt).getTime());
    },
    setResultsUpdatedStatus(state, status) {
        state.trigger_resultsUpdated = status;
    },
    deleteBet(state, {indexOfBet, indexOfBetSlip}) {
        state.bets.waiting[indexOfBetSlip].bets.splice(indexOfBet, 1);
    },
    deleteBetSlip(state, {index, force}) {
        if(!force && state.bets.waiting[index].bets.length !== 0) return;
        state.bets.waiting.splice(index, 1);
    },
    setResultsUpdatedStatus(state, status) {
        state.trigger_resultsUpdated = status;
    },
};

export const actions = {
    changeCurrentBetSlip({commit, rootState}, betData) {
        commit("changeCurrentBetSlip", {
            betData,
            matchData: rootState.match.matches.find(match => match.key === betData.key),
        });
    },
    async pushToWaiting({commit}) {
        commit("pushToWaiting");
    },
    async getResults({commit, getters}, {force, created, callback}) {
        let _callback = callback || function() {};
        if(!force && getters.trigger_resultsUpdated) return _callback();
        commit("clearResults");
        let {data} = await $axios.get(`/bets/results/${created}`);
        commit("pushToResults", data);
        commit("setResultsUpdatedStatus", true);
        _callback();
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
        let {data, status} = await $axios.post("/bets/confirm", betSlip);
        if(!status) return alert(data);
        commit("deleteBetSlip", {index, force: true});
        commit("setResultsUpdatedStatus", false);
    },
};

export const bet = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};