import Vue from 'vue';
import App from './App.vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import {router} from "./router";
import {i18n} from "./i18n/";

new Vue({
    el: '#app',
    router,
    i18n,
    render: h => h(App)
});
