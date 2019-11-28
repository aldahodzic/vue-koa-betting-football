const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");
const moment = require("moment");

exports.create = async (URL, leagueName) => {
  const bookmakerName = "Sportingbet";
  const logger = new Logger(leagueName, bookmakerName);
  let html;
  const allMatches = [];

  try {
    html = await parseHTML(URL, "static", {
      bookmaker: bookmakerName,
      league: leagueName,
    });
    logger.log("got page content");
  }
  catch (e) {
    logger.fail("page content parsing failed", e);
    logger.end();
    return allMatches;
  }

  const $ = createDOM(html);
  logger.log("created virtual dom of page");

  const blocks = $(".marketboard-event-group__item--event");

  blocks.each((i, element) => {
    try {
      const match = {};

      // Teams
      {
        const spanHome = $(element).find(".mb-option-button__option-name")[0];
        const spanGuest = $(element).find(".mb-option-button__option-name")[2];

        match.home = fixTeamName($(spanHome).text().trim());
        match.guest = fixTeamName($(spanGuest).text().trim());
      }

      // League
      match.league = leagueName;

      // Date
      {
        const dayElement = $(element).parents(".marketboard-event-group__item--sub-group").find("h2");
        const dayText = $(dayElement).text().trim().split(" - ")[1];

        const timeText = $(element).find(".marketboard-event-without-header__market-time").text();

        match.date = moment(`${dayText} ${timeText}`, "DD/MM/YYYY HH:mm").valueOf();

        if (incorrectMatchDate(match.date)) return;
      }

      // Coefficients
      {
        match.coefficients = {};
        const coefficientTypes = ["1", "0", "2"];

        coefficientTypes.forEach((coefficient, i) => {
          const _coefficient = parseFloat($($(element).find(".mb-option-button__option-odds")[i]).text());
          if (!isNaN(_coefficient)) {
            match.coefficients[coefficient] = [{
              name: bookmakerName,
              coefficient: _coefficient,
            }];
          }
          else match.coefficients[coefficient] = [];
        });
      }

      allMatches.push(match);
    }
    catch (e) {
      logger.fail("Error while parsing data of match", e, element);
    }
  });

  if (allMatches.length > 0) logger.log(`[${allMatches.length}] matches created: ${bookmakerName}`);
  else logger.fail(`none matches found: ${bookmakerName}`);

  logger.end();

  return allMatches;
};
