export const bets = [
    {
        _id: "_id 1",
        bets: ["bets 1"],
        rate: 11,
        totalCoefficient: 1.111,
        totalSum: 11.11,
        createdDate: "createdDate 1",
        outcome: "outcome 1",
        outcomeSum: 11.11,
    },
    {
        _id: "_id 2",
        bets: ["bets 2"],
        rate: 22,
        totalCoefficient: 2.222,
        totalSum: 22.22,
        createdDate: "createdDate 2",
        outcome: "outcome 2",
        outcomeSum: 22.22,
    }
];

export const matches = [
    {
        "key": "League1:Home team 1-Guest team 1",
        "home": "Home team 1",
        "guest": "Guest team 1",
        "league": "League1",
        "dateTmpl": "27.10",
        "date": 1540648800000,
        "coefficients": {
            "0": [{"name": "Bookmaker 1", "coefficient": 1}, {"name": "Bookmaker 2","coefficient": 1.1}, {"name": "Bookmaker 3", "coefficient": 1.1}],
            "1": [{"name": "Bookmaker 1","coefficient": 2}, {"name": "Bookmaker 2","coefficient": 2.1}, {"name": "Bookmaker 3", "coefficient": 2.1}],
            "2": [{"name": "Bookmaker 1","coefficient": 3}, {"name": "Bookmaker 2","coefficient": 3.1}, {"name": "Bookmaker 3", "coefficient": 3.1}]
        },
    },
    {
        "key": "League2:Home team 2-Guest team 2",
        "home": "Home team 2",
        "guest": "Guest team 2",
        "league": "League2",
        "dateTmpl": "28.10",
        "date": 1540738800000,
        "coefficients": {
            "0": [{"name": "Bookmaker 1", "coefficient": 2}, {"name": "Bookmaker 2","coefficient": 2.2}, {"name": "Bookmaker 3", "coefficient": 2.2}],
            "1": [{"name": "Bookmaker 1","coefficient": 3}, {"name": "Bookmaker 2","coefficient": 3.2}, {"name": "Bookmaker 3", "coefficient": 3.2}],
            "2": [{"name": "Bookmaker 1","coefficient": 1}, {"name": "Bookmaker 2","coefficient": 1.2}, {"name": "Bookmaker 3", "coefficient": 1.2}]
        },
    },
    {
        "key": "League3:Home team 3-Guest team 3",
        "home": "Home team 3",
        "guest": "Guest team 3",
        "league": "League3",
        "dateTmpl": "29.10",
        "date": 1540825200000,
        "coefficients": {
            "0": [{"name": "Bookmaker 1", "coefficient": 3}, {"name": "Bookmaker 2","coefficient": 3.3}, {"name": "Bookmaker 3", "coefficient": 3.3}],
            "1": [{"name": "Bookmaker 1","coefficient": 1}, {"name": "Bookmaker 2","coefficient": 1.3}, {"name": "Bookmaker 3", "coefficient": 1.3}],
            "2": [{"name": "Bookmaker 1","coefficient": 2}, {"name": "Bookmaker 2","coefficient": 2.3}, {"name": "Bookmaker 3", "coefficient": 2.3}]
        },
    },
];

export const betSlipBetsInfo = [
    {
        key: "match key 1",
        lineMode: "result",
        dateTmpl: "12.12",
        league: "league 1",
        home: "home team 1",
        guest: "guest team 1",
        type: "1",
        bookie: "bookie 1",
        betIndex: 1,
        betSlipIndex: 2,
        score: "3 : 2",
        matchResult: "win",
    },
    {
        key: "match key 2",
        lineMode: "result",
        dateTmpl: "12.12",
        league: "league 2",
        home: "home team 2",
        guest: "guest team 2",
        type: "2",
        bookie: "bookie 2",
        betIndex: 2,
        betSlipIndex: 2,
        score: "1 : 1",
        matchResult: "lose",
    },
];