const cheerio = require("cheerio");
const _ = require("lodash");
const needle = require("needle");
const moment = require("moment");
let fs = require("fs");

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

    let table = $("form[name='f1']");
    let tBodies = table.find("tbody[class*='row']");
    let allTeams = [];


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

                if(match.home.includes("Home") && match.guest.includes("Away Teams")) return;
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
            }

            // Coefficients
            {
                match.coefficients = {};

                let coefficientTypes = ["1", "0", "2"];
                _.each(coefficientTypes, (coeff, index) => {
                    let coefficient = +element.find(`tr > td:nth-child(${9 + index}) > u > a`).text();
                    if(!isNaN(coefficient)) match.coefficients[coeff] = [{
                        name: "Parimatch",
                        coefficient
                    }];
                    else match.coefficients[coefficientTypes[coeff]] = [];
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

    log("matches created: Parimatch");

    return allTeams;

};
