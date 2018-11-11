const fixTeamName = require("../utils/fixTeamName");
const Logger = require("../utils/logger");
const parseHTML = require("../utils/parseHTML");
const createDOM = require("../utils/createDOM");
const incorrectMatchDate = require("../utils/incorrectMatchDate");

const moment = require("moment");

exports.create = async (URL, leagueName) => {

    const logger = new Logger(leagueName, "Parimatch");
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

    let table = $("form[name='f1']");
    let tBodies = table.find("tbody[class*='row']");

    tBodies.each((i, _element) => {
        try {
            let element = $(_element);
            if(element.find(".bk").length !== 1) return;

            let match = {};

            // Teams
            {
                let span = element.find("td[class='l'] > a");
                let text = span.html();
                text = text.replace(/\((\w+)\)/g, "");
                let teams = text.split("<br>");
                match.home = fixTeamName(teams[0].trim());
                match.guest = fixTeamName(teams[1].trim());

                if(match.home.includes("Home") && match.guest.includes("Away")) return;
            }

            // League
            {
                match.league = leagueName;
            }

            // Date
            {
                let span = element.find("tr > td:nth-child(2)");
                let text = span.html();
                let [date, time] = text.split("<br>");
                match.date = moment(`${date}/${(new Date()).getFullYear()}-${time}`, "DD/MM/YYYY-HH:mm").valueOf();

                if(incorrectMatchDate(match.date)) return;
            }

            // Coefficients
            {
                match.coefficients = {};

                let coefficientTypes = ["1", "0", "2"];
                coefficientTypes.forEach((coeff, index) => {
                    let coefficient = +element.find(`tr > td:nth-child(${9 + index}) > u > a`).text();
                    if(!isNaN(coefficient)) match.coefficients[coeff] = [{
                        name: "Parimatch",
                        coefficient
                    }];
                    else match.coefficients[coefficientTypes[coeff]] = [];
                })
            }

            allMatches.push(match);
        }
        catch(e) {
            logger.fail("Error while parsing data of match", e, _element);
        }
    });

    if(allMatches.length > 0) logger.log(`[${allMatches.length}] matches created: Parimatch`);
    else logger.fail("none matches found: Parimatch");

    logger.end();

    return allMatches;
};
