import Moment from "dayjs";

import * as api from "@/api/match";
import { config as generateConfig } from "@/api/generate";

export const state = {
  matches: JSON.parse(localStorage.getItem("matches")) || [],
  selectorItemMode: "bet", // [bet, info],
};

export const getters = {

  matches (state, getters, rootState, rootGetters) {
    return state.matches.filter(match => rootGetters["league/selectedLeagues"].includes(match.league));
  },

  selectorItemMode (state) {
    return state.selectorItemMode;
  },

};

export const mutations = {

  toggleSelectorItemMode (state) {
    state.selectorItemMode = state.selectorItemMode === "bet" ? "info" : "bet";
  },

  cleanMatches (state, selectedLeagues) {
    state.matches = state.matches.filter(match => !selectedLeagues.includes(match.league));
  },

  pushMatches (state, matchData) {
    matchData.forEach(match => state.matches.push({
      ...match,
      dateTmpl: Moment(match.date).format("DD.MM"),
    }));

    if (!generateConfig.isActivated) {
      localStorage.setItem("matches", JSON.stringify(state.matches));
    }
  },

};

export const actions = {

  async loadMatches ({ commit, rootGetters }) {
    const selectedLeagues = rootGetters["league/selectedLeagues"];
    commit("cleanMatches", selectedLeagues);
    const { data } = await api.downloadOrParseMatches(selectedLeagues);
    commit("pushMatches", data);
  },

  toggleSelectorItemMode ({ commit }) {
    commit("toggleSelectorItemMode");
  },

};

export const match = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
