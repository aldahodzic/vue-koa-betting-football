const _ = require("lodash");

const Match = require("libs/mongo/schemas/match");
const {parsers, bookies} = require("libs/parsers");

exports.checkDB = async (ctx, next) => {
    // POST doesn't working due CORS
    // let {leagues} = ctx.request.body;
    let leagues = ctx.params.query.split("|");

    ctx.state.readyMatches = [];
    ctx.state.leagues = {
        read: leagues,
        write: [],
    };

    let matches = await Match.find({league: {$in: ctx.state.leagues.read}});

    // if not found matches, going to parsing
    if(matches.length === 0) {
        ctx.state.leagues.write = ctx.state.leagues.read;
        return await next();
    }

    // if updating time of league is expired, going to parsing these leagues
    let leagueMatches = {};
    let groupedMatches = _.groupBy(matches, "league");
    _.each(groupedMatches, (leagueGroup, leagueName) => {
        let lastUpdatedMatch = _.minBy(leagueGroup, "updatedAt");
        if(lastUpdatedMatch.updatedAt.getTime() + 3600000 < Date.now()) ctx.state.leagues.write.push(lastUpdatedMatch.league);
        leagueMatches[leagueName] = true;
    });
    // push to parsing, leagues witch haven't matches
    _.each(ctx.state.leagues.read, leagueName => !leagueMatches[leagueName] ? ctx.state.leagues.write.push(leagueName) : null);

    // push matches to ctx, witch was got from db, (not need updating)
    if(ctx.state.leagues.write.length !== 0) {
        ctx.state.readyMatches = matches.filter(match => !ctx.state.leagues.write.includes(match.league));
        return await next();
    }

    // Else, if none matches to update or parsing, return them
    let data = matches.map(match => match.getData());
    return ctx.end(data);
};



exports.parser = async (ctx, next) => {

    // launch parser for every url in bookie's urls
    let allData = [];
    _.each(bookies, (urls, bookieName) => {
        _.each(urls, ({url, league}) => {
            if(ctx.state.leagues.write.includes(league)) allData.push(parsers[bookieName].create(url, league));
        });
    });
    allData = await Promise.all(allData);

    ctx.state.allMatchesData = allData;
    await next()
};


exports.writeDB = async ctx => {
    let matches = ctx.state.allMatchesData;

    let matchesAll = _.flattenDeep(matches);

    // Combine the coefficients of the same matches from different bookies
    let matchesConcatenated = {};
    _.each(matchesAll, match =>{
        let key = `${match.league}:${match.home}-${match.guest}`;
        if(key in matchesConcatenated) _.each(["1", "0", "2"], cType => {
            matchesConcatenated[key].coefficients[cType] = [...matchesConcatenated[key].coefficients[cType], ...match.coefficients[cType]];
        });
        else matchesConcatenated[key] = match;
    });

    // Select, after, if match is exist update, otherwise insert match to db
    let promiseMatches = [];
    _.each(matchesConcatenated, (matchData, key) => {
        matchData.key = key;
        let match = Match.findOneAndUpdate({key}, matchData, {upsert: true, new: true});
        promiseMatches.push(match);
    });

    // Concatenation ready matches and parsed/updated, after pick the data of matches
    let matchesAfterActionsDB = await Promise.all(promiseMatches);
    let matchesToFront = [].concat(ctx.state.readyMatches, matchesAfterActionsDB);
    matchesToFront = matchesToFront.map(match => match.getData());
    ctx.end(matchesToFront);
};
