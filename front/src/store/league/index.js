export const state = {
  leagueList: ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"],
  selectedLeagues: ["England"],
};

export const getters = {

  leagueList (state) {
    return state.leagueList;
  },

  selectedLeagues (state) {
    return state.selectedLeagues.length == 0 ? state.leagueList : state.selectedLeagues;
  },

};

export const mutations = {

  selectLeague (state, leagueName) {
    return alert("ONLY ENGLISH LEAGUE AVAILABLE NOW!");
    
    if (state.selectedLeagues.includes(leagueName)) {
      state.selectedLeagues = state.selectedLeagues.filter(league => league != leagueName);
    }
    else {
      state.selectedLeagues.push(leagueName);
    }
  },

};

export const actions = {

  selectLeague ({ commit }, leagueName) {
    commit("selectLeague", leagueName);
  },

};

export const league = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
