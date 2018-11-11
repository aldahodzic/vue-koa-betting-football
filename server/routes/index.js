const koaRouter = require("koa-router");

const router = new koaRouter({
    prefix: "/api/v1",
});

let matches = require("./matches");
let auth = require("./auth");
let bets = require("./bets");

router.post("/matches", matches.checkDB, matches.parser, matches.writeDB);

router.post("/auth/authorization", auth.authorization);
router.post("/auth/registration", auth.registration);
router.delete("/auth/logout", auth.logout);

router.get("/bets/results/:created", bets.getResults, bets.setScoreOfMatches, bets.updateBets, bets.getResults);
router.post("/bets/confirm", bets.confirm);


module.exports = router.routes();
