const cheerio = require("cheerio");
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

    let table = $("table[class='betoffer']");
    let trs = table.find("tr[class*='row']");
    let allTeams = [];

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

                if(match.date > moment().add(10, "days").valueOf()) return;
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

            allTeams.push(match);
        }
        catch({message, stack}) {
            console.log("Error >>", {
                path: `williamhill[${leagueName}]`,
                message,
                stack: stack.split(" at ").splice(1, 3),
                elementText: $(_element).text() ? $(_element).text().replace(/(\t|\n)+/g, " | ") : "no element text"
            });
        }
    });

    if(allTeams.length > 0) log("matches created: Leonbets");
    else log("none matches found: Leonbets");

    return allTeams;

};
