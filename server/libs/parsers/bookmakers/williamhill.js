const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");
const moment = require("moment");

exports.create = async (URL, leagueName) => {

    const logger = new Logger(leagueName, "Williamhill");
    let innerHTML;
    let allMatches = [];

    try {
        innerHTML = await parseHTML(URL);
        logger.log("got page content");
    }
    catch(e) {
        logger.fail("page content parsing failed", e);
        logger.end();
        return allMatches;
    }

    const $ = createDOM(innerHTML);
    logger.log("created virtual dom of page");

    let tBody = $("div[id*='tup_mkt_grp']:nth-of-type(1) > table > tbody");
    let trs = tBody.find(".rowOdd");

    trs.each((i, element) => {

        try {
            let match = {};

            // Teams
            {
                let span = $(element).find("span[id*='_mkt_namespace']");
                let text = span.text().trim();
                text = text.replace(/ v /g, "|-|");
                let teams = text.split("|-|");
                match.home = fixTeamName(teams[0].trim());
                match.guest = fixTeamName(teams[1].trim());
            }

            // League
            {
                match.league = leagueName;
            }

            // Date
            {
                let span = $(element).find("span[id*='tzTime:br:']");
                let text = span.attr("id");
                let idParts = text.split(":br:");
                match.date = +idParts[1] * 1000;

                if(incorrectMatchDate(match.date)) return;
            }

            // Coefficients
            {
                match.coefficients = {};
                let divs = $(element).find(".eventprice");
                let coefficientTypes = ["1", "0", "2"];
                divs.each((i, div) => {
                    let coefficient, text = $(div).text().trim();
                    if(text === "EVS") coefficient = 2;
                    else {
                        let [home, guest] = text.split("/");
                        coefficient = (home / guest) + 1;
                    }

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

    if(allMatches.length > 0) logger.log(`[${allMatches.length}] matches created: Williamhill`);
    else logger.fail("none matches found: Williamhill");

    logger.end();

    return allMatches;
};
