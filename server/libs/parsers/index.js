module.exports = {
    parsers: {
        williamhill: require("./bookmakers/williamhill"),
        parimatch: require("./bookmakers/parimatch"),
        leonbets: require("./bookmakers/leonbets"),
    },
    bookies: require("./bookmakerUrls"),
    results: require("./results"),
};
