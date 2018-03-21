import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);

import AppMatches from "./components/Matches.vue";
import AppAuthentication from "./components/Authentication.vue";
import AppAbout from "./components/About.vue";

export const router = new VueRouter ({
    mode: "history",
    routes: [
        {path: "", component: AppMatches},
        {path: "/auth", component: AppAuthentication},
        {path: "/about", component: AppAbout},
        {path: "*", redirect: ""}
    ]
});