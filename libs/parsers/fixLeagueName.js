module.exports = name => {

    if(name === "german-bundesliga") return "Germany";
    if(name === "premier-league") return "England";
    if(name === "italian-serie-a") return "Italy";
    if(name === "french-ligue-one") return "France";
    if(name === "spanish-la-liga") return "Spain";
    if(name === "champions-league") return "ChampionsLeague";
    if(name === "europa-league") return "EuropaLeague";
    return name;
};
