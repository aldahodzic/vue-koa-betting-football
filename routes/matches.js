const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const _ = require("lodash");
const moment = require("moment");
const fs = require("fs");

module.exports = async ctx => {

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

    const browser = await puppeteer.launch();
    log("browser opened");

    const page = await browser.newPage();
    log("created page");

    page.setDefaultNavigationTimeout(1200000);
    await page.goto("http://sports.williamhill.com/bet/en-gb/betting/t/295/English+Premier+League.html");
    log("connected to page");

    let innerHTML = await page.content();
    log("got page content");

    const $ = cheerio.load(innerHTML);
    log("created virtual dom of page");


    let tBody = $("div[id*='tup_mkt_grp'] > table > tbody");
    log("got tbody");

    let trs = tBody.find(".rowOdd");
    log("got all trs");

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
            let text = $("#headerCollapsed_or").find("span > a").text();
            if(text.includes("Spanish La Liga")) match.league = "Spain";
        }


        // Date
        {
            //tzTime:br:1522494000:br:dd_MMM:br:3
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
                let coefficient = Math.round((home / guest * 100)) / 100;
                match.coefficients[coefficientTypes[i]] = [{
                    name: "Williamhill",
                    coefficient
                }];
            })
        }

        allTeams.push(match);
    });

    fs.writeFile('db/matches.json', JSON.stringify(allTeams), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });



    ctx.end("ok");
};
