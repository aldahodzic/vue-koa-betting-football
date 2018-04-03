const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

let matches = require("./matches");
let auth = require("./auth");

publicRoute.post("/matches", matches.checkDB, matches.parser, matches.writeDB);

publicRoute.post("/auth/login", auth.login);

publicRoute.post("/auth/registration", auth.registration);

module.exports = publicRoute.routes();
