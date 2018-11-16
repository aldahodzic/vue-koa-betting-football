import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

let i18n = new VueI18n({
    locale: "",
    messages: {en: {}, ru: {}},
});

let language = localStorage.getItem("i18n::language") || "en";
setMessages(language);

export default i18n;
Vue.prototype.$setLanguage = setMessages;

function setI18nLanguage(language) {
    i18n.locale = language;
    document.querySelector("html").setAttribute("lang", language);
    localStorage.setItem("i18n::language", language);
}

function setMessages(language) {
    if (i18n.locale == language) return;

    let messages = localStorage.getItem(`i18n::messages[${language}]`);
    if(messages) {
        i18n.setLocaleMessage(language, JSON.parse(messages));
        setI18nLanguage(language);
        return;
    }

    import(`@/locales/${language}`).then(messages => {
        i18n.setLocaleMessage(language, messages.default);
        localStorage.setItem(`i18n::messages[${language}]`, JSON.stringify(messages.default));
        setI18nLanguage(language);
    });
}

