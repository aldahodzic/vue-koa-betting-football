"use strict";

import Vue from 'vue';
import axios from "axios";

let config = {
    baseURL: "/api/v1/",
    // timeout: 60 * 1000, // Timeout
    withCredentials: false, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    response => ({data: response.data, status: true}),
    error => Promise.resolve({data: error.response.data, status: false})
);

Plugin.install = function(Vue) {
    Vue.axios = _axios;
    window.$axios = _axios;
    Object.defineProperty(Vue.prototype, "$axios", {
        get() {
            return _axios;
        }
    });
};

Vue.use(Plugin);

export default Plugin;
