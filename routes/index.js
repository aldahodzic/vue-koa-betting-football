const Koa_router = require("koa-router");

const publicRoute = new Koa_router();

// publicRoute.post("/", require("routes/public/registration"));

module.exports = publicRoute.routes();
