const cheerio = require("cheerio");
const _ = require("lodash");
const needle = require("needle");

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

    let innerHTML = await new Promise((resolve, reject) => needle.get(URL, (err, res) => err ? reject(err) : resolve(res.body)));
    log("got page content");

    const $ = cheerio.load(innerHTML);
    log("created virtual dom of page");

    let tBody = $("div[id*='tup_mkt_grp'] > table > tbody");
    let trs = tBody.find(".rowOdd");
    let allTeams = [];

    trs.each((i, element) => {

        let match = {};

        // Teams
        {
            let span = $(element).find("span[id*='_mkt_namespace']");
            let text = span.text().trim();
            text = text.replace(/ v /g, "|-|");
            let teams = text.split("|-|");
            match.home = teams[0].trim();
            match.guest = teams[1].trim();
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
        }

        // Coefficients
        {
            match.coefficients = {};
            let divs = $(element).find(".eventprice");
            let coefficientTypes = ["1", "0", "2"];
            divs.each((i, div) => {
                let [home, guest] = $(div).text().trim().split("/");
                let coefficient = (home / guest) + 1;
                match.coefficients[coefficientTypes[i]] = [{
                    name: "Williamhill",
                    coefficient
                }];
            })
        }

        allTeams.push(match);
    });

    log("matches created: Williamhill");

    return allTeams;

};
