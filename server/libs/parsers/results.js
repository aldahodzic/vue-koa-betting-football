const _ = require("lodash");
const moment = require("moment");
const fixLeagueName = require("libs/parsers/utils/fixLeagueName");
const fixTeamName = require("libs/parsers/utils/fixTeamName");
const axios = require("axios");

module.exports = async date => {
  const todayDate = moment().format("YYYY-MM-DD");
  const seekingDate = moment(date).format("YYYY-MM-DD");
  const seekingDateField = moment(date).format("dddd-Do-MMMM");

  // eslint-disable-next-line max-len
  const url = `http://push.api.bbci.co.uk/p?t=morph://data/bbc-morph-football-scores-match-list-data/endDate/${seekingDate}/startDate/${seekingDate}/todayDate/${todayDate}/tournament/full-priority-order/version/2.4.0&c=1`;
  let response, data;

  try {
    response = await axios.get(url);
    data = JSON.parse(response.data.moments[0].payload); // payload
  }
  catch (e) {
    const error = {
      name: `Not found data about matches on ${seekingDate}`,
      url,
      responseData: response.data,
      todayDate,
      seekingDate,
      seekingDateField,
    };
    console.log("<<<<<<ERROR------");
    console.error(new Error(JSON.stringify(error, null, 4)));
    console.error(e);
    console.log("-----ERROR>>>>>>>");
    return [];
  }

  const leagues = ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"];
  const matches = [];
  _.each(data.matchData, ({ tournamentDatesWithEvents, tournamentMeta }) => {
    const league = fixLeagueName(tournamentMeta.tournamentSlug);
    if (!leagues.includes(league)) return;

    _.each(tournamentDatesWithEvents[seekingDateField], dayInfo => {
      _.each(dayInfo.events, matchInfo => {
        const home = fixTeamName(matchInfo.homeTeam.name.full);
        const guest = fixTeamName(matchInfo.awayTeam.name.full);

        const homeScore = matchInfo.homeTeam.scores.score;
        const guestScore = matchInfo.awayTeam.scores.score;

        const status = matchInfo.eventProgress.status;

        if (homeScore !== null && guestScore !== null && status === "RESULT") {
          matches.push({
            key: `${league}:${home}-${guest}`,
            score: `${homeScore} : ${guestScore}`,
          });
        }
      });
    });
  });

  return matches;
};
