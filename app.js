const Koa = require("koa");
const KoaLogger = require("koa-logger");
const KoaBodyparser = require("koa-bodyparser");

const app = new Koa();

app.use(KoaBodyparser());

app.use(require("handlers/error"));

app.use(require("handlers/static"));

app.use(KoaLogger());

app.use(require("handlers/headers"));

app.use(require("handlers/auth"));

app.use(require("routes"));


app.listen(3000, () => console.log("app start at port 3000"));
