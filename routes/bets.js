const _ = require("lodash");
const moment = require("moment");

const Bet = require("libs/mongo/schemas/bet");
const Match = require("libs/mongo/schemas/match");
const parsers = require("libs/parsers");

exports.confirm = async ctx => {
    let data = ctx.request.body;
    data.userId = ctx.user._id;
    let bet = await Bet.create(data);
    ctx.end(bet.getData());
};

exports.getResults = async (ctx, next) => {
    let allBets = await Bet.find({userId: ctx.user._id});

    let keys = [];
    _.each(allBets , ({bets}) => _.each(bets, bet => {
        let key = `${bet.league}:${bet.home}-${bet.guest}`;
        if(!bet.score && !keys.includes(key)) keys.push(key);
    }));

    if(keys.length === 0) return ctx.end(allBets);

    ctx.state.allBetsOfUser = allBets;
    ctx.state.keysOfMatchesForUpdate = keys;
    await next();
};


exports.setScoreOfMatches = async (ctx, next) => {
    let matches = await Match.find({key: {$in: ctx.state.keysOfMatchesForUpdate}});

    // get all day, in with was games, but matches in db don't have result
    let daysForUpdate = [];
    let matchResultsExist = [];
    _.each(matches, ({key, score, date}) => {
        if(score) matchResultsExist.push({key, score});
        else daysForUpdate.push(date);
    });

    _.remove(daysForUpdate, forDel => forDel === null);
    daysForUpdate = _.uniqBy(daysForUpdate, dateNum => moment(dateNum).format("DD.MM"));

    // get results of all matches in selected days
    let matchResultsPromises = daysForUpdate.map(dateNum => parsers.results(dateNum));
    let matchResults = await Promise.all(matchResultsPromises);
    matchResults = _.flattenDeep(matchResults);

    // set result for selected matches
    let matchUpdatedPromises = matchResults.map(({key, score}) => Match.findOneAndUpdate({key}, {score}, {new: true}));
    let updatedMatches = await Promise.all(matchUpdatedPromises);
    _.remove(updatedMatches, match => match === null);

    ctx.state.matchResults = matchResultsExist.concat(updatedMatches.map(({key, score}) => ({key, score})));

    await next();
};



exports.updateBets = async (ctx, next) => {

    let bets = ctx.state.allBetsOfUser;
    let matches = ctx.state.matchResults;

    let betPromises = [];
    _.each(bets, betSlip => _.each(betSlip.bets, bet => {
        let match = matches.find(match => match.key === `${bet.league}:${bet.home}-${bet.guest}`);
        betPromises.push(Bet.findOneAndUpdate(
            {_id: betSlip._id, bets: {$elemMatch: {_id: bet._id}}},
            {$set: {"bets.$.score": match.score}},
            {new: true}
        ));
    }));

    await Promise.all(betPromises);

    await next();
};
