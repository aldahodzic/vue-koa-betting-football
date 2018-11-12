import Vue from "vue";
import VueI18n from "vue-i18n";

import ru from "@/locales/ru";
import en from "@/locales/en";

Vue.use(VueI18n);

let locale = localStorage.getItem("language") || "en";

export default new VueI18n({
    locale,
    fallbackLocale: "en",
    messages: {ru, en},
});
