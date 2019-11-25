module.exports = {
    parsers: {
        williamhill: require("./bookmakers/williamhill"),
        parimatch: require("./bookmakers/parimatch"),
        leonbets: require("./bookmakers/leonbets"),
        sportingbet: require("./bookmakers/sportingbet"),
    },
    bookies: require("./bookmakerUrls"),
    results: require("./results"),
};
