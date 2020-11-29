const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");
const moment = require("moment");

exports.create = async (URL, leagueName) => {
  const bookmakerName = "Williamhill";
  const logger = new Logger(leagueName, bookmakerName);
  let html;
  const allMatches = [];

  try {
    html = await parseHTML(URL, "dynamic", {
      dataSelector: "#football",
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

  const trs = $("article.sp-o-market");

  trs.each((i, element) => {
    try {
      const match = {};

      // Teams
      {
        const el = $(element).find(".sp-o-market__title");
        const text = el.text().trim();
        const teams = text.split(/ v /);
        match.home = fixTeamName(teams[0].trim());
        match.guest = fixTeamName(teams[1].trim());
      }

      // League
      match.league = leagueName;

      // Date
      {
        const time = $(element).find("sp-o-market__clock__time").text().trim();
        const date = $(element).parents(".sp-o-market--three-cols").find(".sp-o-market__header-clock").text();

        match.date = moment(`${date} ${time}`, "ddd, DD MMM HH:mm").valueOf();

        if (incorrectMatchDate(match.date)) return;
      }

      // Coefficients
      {
        match.coefficients = {};
        const divs = $(element).find(".sp-o-market__buttons button");
        const coefficientTypes = ["1", "0", "2"];
        divs.each((i, div) => {
          let coefficient = 1;
          const text = $(div).text().trim();
          if (text !== "EVS") {
            const [home, guest] = text.split("/");
            coefficient = (home / guest) + 1;
          }

          if (!isNaN(coefficient)) {
            match.coefficients[coefficientTypes[i]] = [{
              name: bookmakerName,
              coefficient,
            }];
          }
          else match.coefficients[coefficientTypes[i]] = [];
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
