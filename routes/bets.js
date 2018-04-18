const _ = require("lodash");
const moment = require("moment");

const Bet = require("libs/mongo/schemas/bet");
const Match = require("libs/mongo/schemas/match");
const parsers = require("libs/parsers");

exports.confirm = async ctx => {

    if(!ctx.user) ctx.error(401, "not.authorized.user");

    let data = ctx.request.body;

    _.each(data.bets , bet => {if(bet.dateNum < Date.now()) ctx.error(403, "Disallowed: Update matches")});

    data.userId = ctx.user._id;
    let bet = await Bet.create(data);
    ctx.end(bet.getData());
};

exports.getResults = async (ctx, next) => {

    if(!ctx.user) ctx.error(401, "not.authorized.user");

    let old = ctx.params.created === "last" ? moment().subtract(2, "weeks").valueOf() : 0;
    let allBets = await Bet.find({userId: ctx.user._id, createdAt: {$gt: old}});

    // if after parsing, immediately return bets
    if(ctx.state.allBetsUpdated) return ctx.end(allBets);

    // get keys of all matches in all bet slips of user
    let keys = [];
    let allBetsReady = true;
    _.each(allBets , ({bets}) => _.each(bets, bet => {
        let key = `${bet.league}:${bet.home}-${bet.guest}`;
        if((!bet.score || bet.score === "none") && !keys.includes(key) && bet.dateNum < Date.now()) {
            keys.push(key);
            allBetsReady = false;
        }
    }));

    if(allBetsReady) return ctx.end(allBets.map(bet => bet.getData()));

    ctx.state.allBetsOfUser = allBets;
    ctx.state.keysOfMatchesForUpdate = keys;
    await next();
};


exports.setScoreOfMatches = async (ctx, next) => {
    let matches = await Match.find({key: {$in: ctx.state.keysOfMatchesForUpdate}});

    // divide matches, for group which have score -> they push to ready, all else -> push their date to parse
    let daysForUpdate = [];
    let matchResultsExist = [];
    _.each(matches, ({key, score, date}) => {
        if(score) matchResultsExist.push({key, score});
        else daysForUpdate.push(date);
    });
    daysForUpdate = _.uniqBy(daysForUpdate, dateNum => moment(dateNum).format("DD.MM"));

    // parse results of all matches in selected days
    let matchResultsPromises = daysForUpdate.map(dateNum => parsers.results(dateNum));
    let matchResults = await Promise.all(matchResultsPromises);
    matchResults = _.flattenDeep(matchResults);

    // set result for selected matches in db
    let matchUpdatedPromises = matchResults.map(({key, score}) => {
        let match = matches.find(match => match.key === key);
        if(match && (!match.score || match.score === "none")) return Match.findOneAndUpdate({key}, {score}, {new: true});
        else return null;
    });

    let updatedMatches = await Promise.all(matchUpdatedPromises);
    _.remove(updatedMatches, match => match === null);

    // concatenate existing scores with parsed
    ctx.state.matchResults = matchResultsExist.concat(updatedMatches.map(({key, score}) => ({key, score})));

    await next();
};



exports.updateBets = async (ctx, next) => {

    let bets = ctx.state.allBetsOfUser;
    let matches = ctx.state.matchResults;

    // set result of all matches or 'none', in all bets, in all betSlips of user
    let betPromises = [];
    _.each(bets, betSlip => _.each(betSlip.bets, bet => {
        let match = matches.find(match => match.key === `${bet.league}:${bet.home}-${bet.guest}`);
        if(!bet.score || (bet.score === "none" && match && match.score)) betPromises.push(Bet.findOneAndUpdate(
            {_id: betSlip._id, bets: {$elemMatch: {_id: bet._id}}},
            {$set: {"bets.$.score": match ? match.score : "none"}},
            {new: true}
        ));
    }));

    await Promise.all(betPromises);

    ctx.state.allBetsUpdated = true;

    await next();
};
