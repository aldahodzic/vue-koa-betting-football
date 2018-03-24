const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

publicRoute.get("/status", require("./status"));

module.exports = publicRoute.routes();
