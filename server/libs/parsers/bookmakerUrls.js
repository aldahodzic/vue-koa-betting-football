const bookmakers = {
  parimatch: true,
  marathonbet: true,
  // Very good anti bot security, use only from local PC
  sportingbet: false,
  betwinner: true,
  williamhill: true,
  coral: true,
  leonbets: true,
};

const urls = {
  parimatch: [
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14056585&lang=en",
      league: "ChampionsLeague",
    },
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14056586&lang=en",
      league: "EuropaLeague",
    },
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14054644&lang=en",
      league: "England",
    },
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14054659&lang=en",
      league: "Spain",
    },
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14055252&lang=en",
      league: "Germany",
    },
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14056416&lang=en",
      league: "Italy",
    },
    {
      url: "https://www.parimatch.com/sbet.content.html?hd=14054356&lang=en",
      league: "France",
    },
  ],
  sportingbet: [
    {
      url: "https://sports.sportingbet.com/en/sports/4/46/betting/premier-league",
      league: "England",
    },
  ],
  marathonbet: [
    {
      url: "https://www.marathonbet.com/en/betting/Football/England/Premier+League",
      league: "England",
    },
  ],
  betwinner: [
    {
      url: "https://betwinner1.com/us/line/Football/88637-England-Premier-League/",
      league: "England",
    },
  ],
  coral: [
    {
      url: "https://sports.coral.co.uk/competitions/football/football-england/premier-league",
      league: "England",
    },
  ],
  williamhill: [
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/344/UEFA+Champions+League.html",
      league: "ChampionsLeague",
    },
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/1935/UEFA+Europa+League.html",
      league: "EuropaLeague",
    },
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/295/English+Premier+League.html",
      league: "England",
    },
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/338/Spanish+La+Liga+Primera.html",
      league: "Spain",
    },
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/315/German+Bundesliga.html",
      league: "Germany",
    },
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/321/Italian+Serie+A.html",
      league: "Italy",
    },
    {
      url: "http://sports.williamhill.com/bet/en-gb/betting/t/312/French+Ligue+1.html",
      league: "France",
    },
  ],
  leonbets: [
    {
      url: "https://www.leonbets.net/betoffer/1/228",
      league: "ChampionsLeague",
    },
    {
      url: "https://www.leonbets.net/events/Soccer/1970324836975359-England-Premier-League",
      league: "England",
    },
    {
      url: "https://www.leonbets.net/betoffer/1/117",
      league: "Spain",
    },
    {
      url: "https://www.leonbets.net/betoffer/1/59",
      league: "Germany",
    },
    {
      url: "https://www.leonbets.net/betoffer/1/81",
      league: "Italy",
    },
    {
      url: "https://www.leonbets.net/betoffer/1/55",
      league: "France",
    },
  ],
};

const allowedBookmakers = {};
for (const b in urls) if (bookmakers[b]) allowedBookmakers[b] = urls[b];

module.exports = allowedBookmakers;
