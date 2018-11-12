import Vue from 'vue';
import Router from 'vue-router';

import AppMatches from "@/views/Match.vue";
import AppAuthentication from "@/views/Authentication.vue";
import AppAbout from "@/views/About.vue";
import AppBet from "@/views/Bet.vue";

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {path: "", redirect: "/matches"},
        {path: "/matches", component: AppMatches},
        {path: "/auth", component: AppAuthentication},
        {path: "/about", component: AppAbout},
        {path: "/bets", component: AppBet},
        {path: "*", redirect: "/matches"}
    ]
});
