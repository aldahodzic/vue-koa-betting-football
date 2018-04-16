const _ = require("lodash");
const moment = require("moment");
const fixLeagueName = require("libs/parsers/fixLeagueName");
const fixTeamName = require("libs/parsers/fixTeamName");
const axios = require("axios");

module.exports = async date => {

    let todayDate = moment().format("YYYY-MM-DD");
    let seekingDate = moment(date).format("YYYY-MM-DD");
    let seekingDateField = moment(date).format("dddd-Do-MMMM");

    let url = `http://push.api.bbci.co.uk/p?t=morph://data/bbc-morph-football-scores-match-list-data/endDate/${seekingDate}/startDate/${seekingDate}/todayDate/${todayDate}/tournament/full-priority-order/version/2.4.0&c=1`;

    let response = await axios.get(url);
    let data = JSON.parse(response.data.moments[0].payload);

    let leagues = ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"];
    let matches = [];
    _.each(data.matchData, ({tournamentDatesWithEvents, tournamentMeta}) => {

        let league = fixLeagueName(tournamentMeta.tournamentSlug);
        if(!leagues.includes(league)) return;

        _.each(tournamentDatesWithEvents[seekingDateField], dayInfo => {
            _.each(dayInfo.events, matchInfo => {
                let home = fixTeamName(matchInfo.homeTeam.name.full);
                let guest = fixTeamName(matchInfo.awayTeam.name.full);

                let homeScore = matchInfo.homeTeam.scores.score;
                let guestScore = matchInfo.awayTeam.scores.score;

                let status = matchInfo.eventProgress.status;

                if(homeScore !== null && guestScore !== null && status === "RESULT") matches.push({
                    key: `${league}:${home}-${guest}`,
                    score: `${homeScore} : ${guestScore}`,
                });
            });
        });
    });

    return matches;

};
