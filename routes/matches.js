const fs = require("fs");
const parsers = require("libs/parsers");
const _ = require("lodash");

const Match = require("libs/mongo/schemas/match");
const bookies = require("libs/parsers/bookies");

const moment = require("moment");

exports.checkDB = async (ctx, next) => {


    // let selectedLeagues = ctx.params.query;

    return ctx.end(ctx.request.body);

    let matches = await Match.find();

    if(matches.length > 0) {
        let data = matches.map(match => match.getData());
        return ctx.end(data);
    }



    await next();

};



exports.parser = async (ctx, next) => {

    // Launch parser for every url in bookie's urls
    let allData = [];
    _.each(bookies, (urls, bookieName) => {
        _.each(urls, ({url, league, selected}) => {
                selected = true;
            if(selected) allData.push(parsers[bookieName].create(url, league));
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
        let key = `${match.league}-${match.home}--${match.guest}`;
        if(key in matchesConcatenated) _.each(["1", "0", "2"], cType => {
            matchesConcatenated[key].coefficients[cType] = [...matchesConcatenated[key].coefficients[cType], ...match.coefficients[cType]];
        });
        else matchesConcatenated[key] = match;
    });

    // Select, after, if match exist update, otherwise insert match to db
    let promiseMatches = [];
    _.each(matchesConcatenated, (matchData, key) => {
        let match = Match.findOneAndUpdate({key}, {key, ...matchData}, {upsert: true, new: true});
        promiseMatches.push(match);
    });

    // Pick the data of matches
    let matchesAfterActionsDB = await Promise.all(promiseMatches);
    matchesAfterActionsDB = matchesAfterActionsDB.map(match => match.getData());

    ctx.end(matchesAfterActionsDB);
};
