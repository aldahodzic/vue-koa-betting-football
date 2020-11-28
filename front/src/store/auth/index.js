import Cookies from "@/plugins/cookies";

import * as api from "@/api/user";

export const state = {
  user: {
    auth: false,
    logout: false,
  },
};

export const getters = {

  user (state) {
    const authToken = Cookies.get("auth");
    let auth = !!authToken && authToken !== "guest";
    if (state.user.logout) auth = false;
    return { ...state.user, auth };
  },

};

export const mutations = {

  setUserAuthStatus (state, status) {
    state.user.auth = status;
  },

  setUserLogout (state, value) {
    state.user.logout = value;
  },

};

export const actions = {

  async userAuthAction ({ commit }, { url, userData }) {
    let response;
    if (url === "authorization") response = await api.authorizeUser(userData);
    if (url === "registration") response = await api.registerUser(userData);

    const { data, status } = response;
    if (!status) alert(data);
    commit("setUserAuthStatus", status);
    commit("setUserLogout", false);
  },

  async userLogout ({ commit }) {
    const { data, status } = await api.logoutUser();
    if (!status) alert(data);
    commit("setUserAuthStatus", false);
    commit("setUserLogout", true);
  },

};

export const auth = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
