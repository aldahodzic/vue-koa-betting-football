import cookies from "@/plugins/cookies";
import axios from "@/plugins/axios";

export const state = {
    user: {
        auth: false,
        logout: false
    },
};

export const getters = {

    user(state) {
        let authToken = cookies.get("auth");
        let auth = !!authToken && authToken !== "guest";
        if(state.user.logout) auth = false;
        return {...state.user, auth};
    },

};

export const mutations = {

    setUserAuthStatus(state, status) {
        state.user.auth = status;
    },

    setUserLogout(state, value) {
        state.user.logout = value;
    },

};

export const actions = {

    async userAuthAction({commit}, {url, userData}) {
        let {data, status} = await axios.post(`/auth/${url}`, userData);
        if(!status) alert(data);
        commit("setUserAuthStatus", status);
        commit("setUserLogout", false);
    },

    async userLogout({commit}) {
        let {data, status} = await axios.delete("/auth/logout");
        if(!status) alert(data);
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