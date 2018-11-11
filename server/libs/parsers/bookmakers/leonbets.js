const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");

exports.create = async (URL, leagueName) => {

    let logger = new Logger(leagueName, "Leonbets");
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

    let table = $("table[class='betoffer']");
    let trs = table.find("tr[class*='row']");

    trs.each((i, _element) => {
        try {
            let element = $(_element);
            let match = {};

            // Teams
            {
                let span = element.find("a.nou2");
                let text = span.text().trim();
                let teams = text.split(" - ");
                match.home = fixTeamName(teams[0].trim());
                match.guest = fixTeamName(teams[1].trim());
            }

            // League
            {
                match.league = leagueName;
            }

            // Date
            {
                let span = element.find("td") ;
                let text = span.html();
                let leftBracket = text.indexOf("(");
                let rightBracket = text.indexOf(")");
                match.date = +text.slice(leftBracket + 1, rightBracket);

                if(incorrectMatchDate(match.date)) return;
            }

            // Coefficients
            {
                match.coefficients = {};
                let as = $(element).find("a.oddj > strong");
                let coefficientTypes = ["1", "0", "2"];
                as.each((i, a) => {
                    let coefficient = +$(a).text().trim();
                    if(!isNaN(coefficient)) match.coefficients[coefficientTypes[i]] = [{
                        name: "Leonbets",
                        coefficient
                    }];
                    else match.coefficients[coefficientTypes[i]] = [];
                })
            }

            allMatches.push(match);
        }
        catch(e) {
            logger.fail("Error while parsing data of match", e, _element);
        }
    });

    if(allMatches.length > 0) logger.log(`[${allMatches.length}] matches created: Leonbets`);
    else logger.fail("none matches found: Leonbets");

    logger.end();

    return allMatches;
};
