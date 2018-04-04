const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

let matches = require("./matches");
let auth = require("./auth");

publicRoute.post("/matches", matches.checkDB, matches.parser, matches.writeDB);

publicRoute.post("/auth/authorization", auth.authorization);

publicRoute.post("/auth/registration", auth.registration);

module.exports = publicRoute.routes();
