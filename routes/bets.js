const Bet = require("libs/mongo/schemas/bet");

exports.confirm = async ctx => {
    let data = ctx.request.body;
    let bet = await Bet.create(data);
    ctx.end(bet.getData());
};

exports.getConfirmed = async ctx => {
    let bets = await Bet.find({result: {$exists: false}});
    ctx.end(bets);
};
