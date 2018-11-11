const Match = require("libs/mongo/schemas/match");
const Bet = require("libs/mongo/schemas/bet");



let matches = [
    {
        key: "ChampionsLeague:Juventus-Real Madrid",
        home: "Juventus",
        guest: "Real Madrid",
        league: "ChampionsLeague",
        date: 1522784700000,
        coefficients: {
            "0": [{
                name: "bet1",
                coefficient: 3.2
            }],
            "1": [{
                name: "bet2",
                coefficient: 2.01
            }],
            "2": [{
                name: "bet3",
                coefficient: 1.2
            }],
        }
    },
    {
        key: "ChampionsLeague:Sevilla-Bayern Munich",
        home: "Sevilla",
        guest: "Bayern Munich",
        league: "ChampionsLeague",
        date: 1522784700000,
        coefficients: {
            "0": [{
                name: "bet1",
                coefficient: 5.8
            }],
            "1": [{
                name: "bet2",
                coefficient: 3.6
            }],
            "2": [{
                name: "bet3",
                coefficient: 1.1
            }],
        }
    },
    {
        key: "ChampionsLeague:Barcelona-Roma",
        home: "Barcelona",
        guest: "Roma",
        league: "ChampionsLeague",
        date: 1522871100000,
        coefficients: {
            "0": [{
                name: "bet1",
                coefficient: 5.8
            }],
            "1": [{
                name: "bet2",
                coefficient: 3.6
            }],
            "2": [{
                name: "bet3",
                coefficient: 1.1
            }],
        }
    },
    {
        key: "ChampionsLeague:Manchester City-Liverpool",
        home: "Manchester City",
        guest: "Liverpool",
        league: "ChampionsLeague",
        date: 1523389500000,
        coefficients: {
            "0": [{
                name: "bet1",
                coefficient: 5.8
            }],
            "1": [{
                name: "bet2",
                coefficient: 3.6
            }],
            "2": [{
                name: "bet3",
                coefficient: 1.1
            }],
        }
    },
    {
        key: "ChampionsLeague:Roma-Barcelona",
        home: "Roma",
        guest: "Barcelona",
        league: "ChampionsLeague",
        date: 1523389500000,
        coefficients: {
            "0": [{
                name: "bet1",
                coefficient: 5.8
            }],
            "1": [{
                name: "bet2",
                coefficient: 3.6
            }],
            "2": [{
                name: "bet3",
                coefficient: 1.1
            }],
        }
    }
];



(async () => {
    let arr = [];

    await Match.remove({});
    await Bet.remove({});

    for(let match of matches) {
        arr.push(Match.create(match));
    }

    let res = await Promise.all(arr);

    process.exit(1);

})();








