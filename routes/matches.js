const fs = require("fs");
const parsers = require("libs/parsers");
const _ = require("lodash");

module.exports = async ctx => {

    let bookies = {
        parimatch: [
            ["https://www.parimatch.com/en/sport/futbol/liga-chempionov-uefa", "ChampionsLeague"],
            ["https://www.parimatch.com/en/sport/futbol/liga-evropy-uefa", "EuropaLeague"],
            ["https://www.parimatch.com/en/sport/futbol/anglija-premer-liga", "England"],
            ["https://www.parimatch.com/en/sport/futbol/ispanija-primera", "Spain"],
            ["https://www.parimatch.com/en/sport/futbol/germanija-bundesliga", "Germany"],
            ["https://www.parimatch.com/en/sport/futbol/italija-serija-a", "Italy"],
            ["https://www.parimatch.com/en/sport/futbol/francija-liga-1", "France"],
        ],
        williamhill: [
            ["http://sports.williamhill.com/bet/en-gb/betting/t/344/UEFA+Champions+League.html", "ChampionsLeague"],
            ["http://sports.williamhill.com/bet/en-gb/betting/t/1935/UEFA+Europa+League.html", "EuropaLeague"],
            ["http://sports.williamhill.com/bet/en-gb/betting/t/295/English+Premier+League.html", "England"],
            ["http://sports.williamhill.com/bet/en-gb/betting/t/338/Spanish+La+Liga+Primera.html", "Spain"],
            ["http://sports.williamhill.com/bet/en-gb/betting/t/315/German+Bundesliga.html", "Germany"],
            ["http://sports.williamhill.com/bet/en-gb/betting/t/321/Italian+Serie+A.html", "Italy"],
            ["http://sports.williamhill.com/bet/en-gb/betting/t/312/French+Ligue+1.html", "France"]
        ]
    };


    let allData = [];
    _.each(bookies, (urls, bookieName) => {
        _.each(urls, ([url, leagueName]) => {
            allData.push(parsers[bookieName].create(url, leagueName));
        });
    });
    allData = await Promise.all(allData);

    fs.writeFile('db/matches2.json', JSON.stringify(allData), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });


    ctx.end("ok");
};
