const Bet = require("libs/mongo/schemas/bet");

exports.confirm = async ctx => {

    let data = ctx.request.body;

    console.log(JSON.stringify(data));
    
    let bet = await Bet.create(data);

    ctx.end(bet.getData());

};

