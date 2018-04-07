import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

if (module.hot) {
    module.hot.accept([
        './getters',
        './actions',
        './mutations'
    ], () => {
        store.hotUpdate({
            getters: require('./getters').default,
            actions: require('./actions').default,
            mutations: require('./mutations').default
        })
    })
}
