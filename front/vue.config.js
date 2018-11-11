module.exports = {
    pluginOptions: {
        i18n: {
            locale: "en",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: false
        },
        moment: {
            locales: ["en"],
        }
    },

    devServer: {
        proxy: 'http://localhost:3000'
    },
};
