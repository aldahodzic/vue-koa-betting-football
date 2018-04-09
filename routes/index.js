const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

let matches = require("./matches");
let auth = require("./auth");
let bets = require("./bets");

publicRoute.post("/matches", matches.checkDB, matches.parser, matches.writeDB);

publicRoute.post("/auth/authorization", auth.authorization);
publicRoute.post("/auth/registration", auth.registration);

publicRoute.get("/bets/get/confirmed", bets.getConfirmed);
publicRoute.post("/bets/confirm", bets.confirm);


module.exports = publicRoute.routes();
