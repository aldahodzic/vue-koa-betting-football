export default {
    leaguesList: ["ChampionsLeague", "EuropaLeague", "England", "Italy", "Germany", "Spain", "France"],
    selectableLeagues: [],
    matches: JSON.parse(localStorage.getItem("matches")) || [],
    selectButtonMode: "bet", // [bet, info],
    bets: {
        current: [],
        waiting: [],
        confirmed: [],
        results: []
    },
    user: {
        auth: false
    },
    // triggers
    trigger_updateMatchButtonsSelectClass: false,
    trigger_updateConfirmedBets: true,
}
