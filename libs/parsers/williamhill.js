const cheerio = require("cheerio");
const _ = require("lodash");
const needle = require("needle");
const moment = require("moment");

const fixTeamName = require("./fixTeamName");

exports.create = async (URL, leagueName) => {

    let cnt = 1;
    let time = Date.now();
    let log = (mes, ...attrs) => {
        let start = time;
        let end = Date.now();
        console.log(`${cnt}. ${mes} done in ${(end - start) / 1000} seconds`);
        if(attrs.length > 0) console.log(attrs);
        time = end;
        cnt += 1;
    };

    let innerHTML;
    try {
        innerHTML = await new Promise((resolve, reject) => needle.get(URL, (err, res) => err ? reject(err) : resolve(res.body)));
        log("got page content");
    }
    catch(e) {
        log("page content parsing failed");
        return [];
    }

    const $ = cheerio.load(innerHTML);
    log("created virtual dom of page");

    let tBody = $("div[id*='tup_mkt_grp']:nth-of-type(1) > table > tbody");
    let trs = tBody.find(".rowOdd");
    let allTeams = [];

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

                if(match.date > moment().add(10, "days").valueOf()) return;
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

            allTeams.push(match);
        }
        catch({message, stack}) {
            console.log("Error >>", {
                path: `williamhill[${leagueName}]`,
                message,
                stack: stack.split(" at ").splice(1, 3),
                elementText: $(element).text() ? $(element).text().replace(/(\t|\n)+/g, " | ") : "no element text"
            });
        }


    });

    if(allTeams.length > 0) log("matches created: Williamhill");
    else log("none matches found: Williamhill");

    return allTeams;

};
