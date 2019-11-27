const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");
const moment = require("moment");

exports.create = async (URL, leagueName) => {

    const bookmakerName = "Coral";
    const logger = new Logger(leagueName, bookmakerName);
    let html;
    let allMatches = [];

    try {
        html = await parseHTML(URL, "dynamic", {
            dataSelector: ".tab-content",
            waitSelector: ".odds-price",
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

    let blocks = $(".odds-card");

    blocks.each((i, element) => {

        try {
            let match = {};

            // Teams
            {
                let els = $(element).find(".odds-names-opponent-name");
                let home = $(els[0]).text().trim();
                let guest = $(els[1]).text().trim();
                match.home = fixTeamName(home);
                match.guest = fixTeamName(guest);
            }

            // League
            {
                match.league = leagueName;
            }

            // Date
            {
                let date = $(element).find(".odds-left").text().trim();

                match.date = moment(date, "HH:mm, DD MMM").valueOf();

                if(incorrectMatchDate(match.date)) return;
            }

            // Coefficients
            {
                match.coefficients = {};
                let divs = $(element).find(".odds-price");
                let coefficientTypes = ["1", "0", "2"];
                divs.each((i, div) => {
                    let coefficient, text = $(div).text().trim();
                    let [home, guest] = text.split("/");
                    coefficient = (home / guest) + 1;

                    if(!isNaN(coefficient)) match.coefficients[coefficientTypes[i]] = [{
                        name: bookmakerName,
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
