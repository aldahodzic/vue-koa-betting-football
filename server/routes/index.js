const KoaRouter = require("koa-router");

const router = new KoaRouter({
  prefix: "/api/v1",
});

const matches = require("./matches");
const auth = require("./auth");
const bets = require("./bets");
const parsedData = require("./parsed-data");

router.post("/matches", matches.checkDB, matches.parser, matches.writeDB);

router.post("/auth/authorization", auth.authorization);
router.post("/auth/registration", auth.registration);
router.delete("/auth/logout", auth.logout);

router.get("/bets/results/:created", bets.getResults, bets.setScoreOfMatches, bets.updateBets, bets.getResults);
router.post("/bets/confirm", bets.confirm);

router.get("/parsed-data", parsedData.list);
router.get("/parsed-data/:file", parsedData.file);

module.exports = router.routes();
