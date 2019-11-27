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
    let allMatches = [];

    try {
        html = await parseHTML(URL, "dynamic", {
            dataSelector: "#football",
            bookmaker: bookmakerName,
            league: leagueName,
        });
        logger.log("got page content");
    }
    catch(e) {
        logger.fail("page content parsing failed", e);
        logger.end();
        return allMatches;
    }

    const $ = createDOM(html);
    logger.log("created virtual dom of page");

    let trs = $("article.sp-o-market");

    trs.each((i, element) => {

        try {
            let match = {};

            // Teams
            {
                let el = $(element).find(".sp-o-market__title");
                let text = el.text().trim();
                let teams = text.split(/ v /);
                match.home = fixTeamName(teams[0].trim());
                match.guest = fixTeamName(teams[1].trim());
            }

            // League
            {
                match.league = leagueName;
            }

            // Date
            {
                let time = $(element).find("sp-o-market__clock__time").text().trim();
                let date = $(element).parents(".sp-o-market--three-cols").find(".sp-o-market__header-clock").text();

                match.date = moment(`${date} ${time}`, "ddd, DD MMM HH:mm").valueOf();

                if(incorrectMatchDate(match.date)) return;
            }

            // Coefficients
            {
                match.coefficients = {};
                let divs = $(element).find(".sp-o-market__buttons button");
                let coefficientTypes = ["1", "0", "2"];
                divs.each((i, div) => {
                    let coefficient, text = $(div).text().trim();
                    let [home, guest] = text.split("/");
                    coefficient = (home / guest) + 1;

                    if(!isNaN(coefficient)) match.coefficients[coefficientTypes[i]] = [{
                        name: "Williamhill",
                        coefficient
                    }];
                    else match.coefficients[coefficientTypes[i]] = [];
                })
            }

            allMatches.push(match);
        }
        catch(e) {
            logger.fail("Error while parsing data of match", e, element);
        }
    });

    if(allMatches.length > 0) logger.log(`[${allMatches.length}] matches created: ${bookmakerName}`);
    else logger.fail(`none matches found: ${bookmakerName}`);

    logger.end();

    return allMatches;
};
