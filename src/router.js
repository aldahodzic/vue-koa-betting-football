import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);

import AppMatches from "./components/Matches.vue";
import AppAuthorization from "./components/Authorization.vue";

export const router = new VueRouter ({
    mode: "history",
    routes: [
        {path: "", component: AppMatches},
        {path: "/auth", component: AppAuthorization},
        {path: "*", redirect: ""}
    ]
});
