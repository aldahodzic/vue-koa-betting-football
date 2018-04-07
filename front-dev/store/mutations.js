import _ from "lodash";
import moment from "moment";

export default {
    createSelectableLeagues(state) {
        state.selectableLeagues = state.leaguesList.map(name => ({name, selectedClass: name === "ChampionsLeague" ? "selected" : ""}));
    },
    selectLeague(state, leagueName) {
        let league = state.selectableLeagues.find(league => league.name === leagueName);
        league.selectedClass = league.selectedClass !== "selected" ? "selected" : "";
    },
    cleanMatches(state, selectedLeagues) {
        _.remove(state.matches, match => selectedLeagues.includes(match.league));
        // after removing, matches are not reactive, splice doesn't work
        state.matches = [...state.matches];
    },
    pushMatches(state, data) {
        _.each(data, match => state.matches.push({
            ...match,
            dateNum: match.date,
            date: moment(match.date).format("DD.MM")
        }));
        localStorage.setItem("matches", JSON.stringify(state.matches));
    },
    changeCurrentBetSlip(state, {key, bookie, type, callback}) {
        let {home, guest, dateNum, date, league} = state.matches.find(match => match.key === key);
        let selectedBet = state.bets.current.find(bet => bet.key === key);

        if(!selectedBet) {
            state.bets.current.push({home, guest, dateNum, date, league, bookie, key, type});
            return callback(true);
        }

        if(selectedBet.type === type) {
            let index = state.bets.current.findIndex(bet => bet.type === type && bet.key === key);
            state.bets.current.splice(index, 1);
            return callback(true);
        }

        callback(false);
    },
    changeSelectButtonMode(state) {
        state.selectButtonMode = state.selectButtonMode === "bet" ? "info" : "bet";
    },
    pushToWaiting(state) {
        state.bets.waiting.push(state.bets.current);
        state.bets.current = [];
    },
    updateMatchButtonsSelectClass(state) {
        state.trigger_updateMatchButtonsSelectClass = !state.trigger_updateMatchButtonsSelectClass;
    },
    setUserAuthStatus(state, status) {
        state.user.auth = status;
    },
    deleteBet(state, {indexOfBet, indexOfBetSlip}) {
        state.bets.waiting[indexOfBetSlip].splice(indexOfBet, 1);
    },
    deleteBetSlip(state, {index, force}) {
        if(!force && state.bets.waiting[index].length !== 0) return;
        state.bets.waiting.splice(index, 1);
    },
}
