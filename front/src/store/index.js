import Vue from "vue";
import Vuex from "vuex";

import {league} from "./league";
import {match} from "./match";
import {bet} from "./bet";
import {auth} from "./auth";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        league,
        match,
        bet,
        auth,
    }
});
