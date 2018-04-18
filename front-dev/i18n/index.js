import Vue from 'vue';
import VueI18n from 'vue-i18n';

import ru from "./ru/";
import en from "./en/";

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: localStorage.getItem("language") || "en",
    fallbackLocale: "en",
    messages: {en, ru}
});
