const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

let matches = require("./matches");
let auth = require("./auth");

publicRoute.get("/matches/:query", matches.checkDB, matches.parser, matches.writeDB);
// publicRoute.post("/matches", matches.checkDB, matches.parser, matches.writeDB);

publicRoute.get("/auth/login/:data", auth.login);
// publicRoute.post("/auth/login", auth.login);

publicRoute.get("/auth/registration/:data", auth.registration);
// publicRoute.post("/auth/registration", auth.registration);

module.exports = publicRoute.routes();
