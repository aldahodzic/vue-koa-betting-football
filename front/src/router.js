import Vue from 'vue';
import Router from 'vue-router';

import AppMatches from "@/views/Match.vue";
import AppAuthentication from "@/views/Authentication.vue";
import AppAbout from "@/views/About.vue";
import AppBets from "@/views/Bets.vue";

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {path: "", redirect: "/matches"},
        {path: "/matches", component: AppMatches},
        {path: "/auth", component: AppAuthentication},
        {path: "/about", component: AppAbout},
        {path: "/bets", component: AppBets},
        {path: "*", redirect: "/matches"}
    ]
});
