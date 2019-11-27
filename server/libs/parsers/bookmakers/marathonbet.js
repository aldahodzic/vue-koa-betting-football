const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");
const moment = require("moment");

const fs = require("fs");


exports.create = async (URL, leagueName) => {
    
    const bookmakerName = "Marathonbet";
    const logger = new Logger(leagueName, bookmakerName);
    let html;
    let allMatches = [];

    try {
        html = await parseHTML(URL, "static", {
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

    let blocks = $(".coupon-row");

    blocks.each((i, element) => {
        try {
            let match = {};

            // Teams
            {
                let spanHome = $(element).find(".member-name")[0];
                let spanGuest = $(element).find(".member-name")[1];

                match.home = fixTeamName($(spanHome).text().trim());
                match.guest = fixTeamName($(spanGuest).text().trim());
            }

            // League
            {
                match.league = leagueName;
            }

            // Date
            {
                let dateText =$(element).find(".date").text().trim();

                match.date = moment(dateText, "DD MMM HH:mm").valueOf();

                if(incorrectMatchDate(match.date)) return;
            }

            // Coefficients
            {
                match.coefficients = {};
                let coefficientTypes = ["1", "0", "2"];
                let elementNTH = ["0", "1", "2"];

                coefficientTypes.forEach((coefficient, i) => {
                    let _coefficient = parseFloat($($(element).find(".price")[i]).text());
                    if(!isNaN(_coefficient)) match.coefficients[coefficient] = [{
                        name: bookmakerName,
                        coefficient: _coefficient,
                    }];
                    else match.coefficients[coefficient] = [];
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
