const fs = require("fs");
const parsers = require("libs/parsers");
const _ = require("lodash");

const Match = require("libs/mongo/schemas/match");
const bookies = require("libs/parsers/bookies");



exports.checkDB = async (ctx, next) => {

    let matches = await Match.find({});

    let data = [];
    _.each(matches, match => data.push(match.getData()));

    if(matches.length > 0) return ctx.end(data);

    await next();

};



exports.parser = async (ctx, next) => {

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

    let matchesConcatenated = {};

    _.each(matchesAll, match =>{
        let key = `${match.league}-${match.home}--${match.guest}`;
        if(key in matchesConcatenated) _.each(["1", "0", "2"], cType => {
            matchesConcatenated[key].coefficients[cType] = [...matchesConcatenated[key].coefficients[cType], ...match.coefficients[cType]];
        });
        else matchesConcatenated[key] = match;
    });


    let promiseMatches = [];
    _.each(matchesConcatenated, (matchData, key) => {
        let match = Match.findOneAndUpdate({key}, {key, ...matchData}, {upsert: true, new: true});
        promiseMatches.push(match);
    });

    let matchesAfterActionsDB = await Promise.all(promiseMatches);
    matchesAfterActionsDB = matchesAfterActionsDB.map(match => match.getData());

    ctx.end(matchesAfterActionsDB);
};
