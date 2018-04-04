import Vue from 'vue';
import App from './App.vue';

import Axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, Axios);

import Cookie from "vue-cookie";
Vue.use(Cookie);

import {router} from "./router";
import {i18n} from "./i18n/";
import {store} from "./store/";

export default new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
});
