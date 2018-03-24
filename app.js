const Koa = require("koa");
const KoaLogger = require("koa-logger");
const KoaBodyparser = require("koa-bodyparser");
const KoaStatic = require("koa-static");

const app = new Koa();

app.use(KoaBodyparser());

app.use(KoaStatic("front"));

app.use(require("handlers/error"));

app.use(KoaLogger());

app.use(require("handlers/headers"));

app.use(require("routes"));

app.listen(3000, () => console.log("app start at port 3000"));
