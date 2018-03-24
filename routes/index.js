const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

publicRoute.get("/matches", require("./matches"));


module.exports = publicRoute.routes();
