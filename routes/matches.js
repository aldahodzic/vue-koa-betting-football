const fs = require("fs");
const {williamhill} = require("libs/parsers");
const _ = require("lodash");

module.exports = async ctx => {

    let urls = [
        ["http://sports.williamhill.com/bet/en-gb/betting/t/344/UEFA+Champions+League.html", "ChampionsLeague"],
        ["http://sports.williamhill.com/bet/en-gb/betting/t/1935/UEFA+Europa+League.html", "EuropaLeague"],
        ["http://sports.williamhill.com/bet/en-gb/betting/t/295/English+Premier+League.html", "England"],
        ["http://sports.williamhill.com/bet/en-gb/betting/t/338/Spanish+La+Liga+Primera.html", "Spain"],
        ["http://sports.williamhill.com/bet/en-gb/betting/t/315/German+Bundesliga.html", "Germany"],
        ["http://sports.williamhill.com/bet/en-gb/betting/t/321/Italian+Serie+A.html", "Italy"],
        ["http://sports.williamhill.com/bet/en-gb/betting/t/312/French+Ligue+1.html", "France"]
    ];
    let allData = [];

    urls.forEach(([url, leagueName]) => {
        let data = williamhill.create(url, leagueName);
        allData.push(data);
    });

    allData = await Promise.all(allData);

    fs.writeFile('db/matches.json', JSON.stringify(allData), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });




    ctx.end("ok");
};
