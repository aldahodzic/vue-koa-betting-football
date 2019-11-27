module.exports = {
    parsers: {
        williamhill: require("./bookmakers/williamhill"),
        parimatch: require("./bookmakers/parimatch"),
        leonbets: require("./bookmakers/leonbets"),
        sportingbet: require("./bookmakers/sportingbet"),
        marathonbet: require("./bookmakers/marathonbet"),
        betwinner: require("./bookmakers/betwinner"),
        coral: require("./bookmakers/coral"),
    },
    bookies: require("./bookmakerUrls"),
    results: require("./results"),
};
