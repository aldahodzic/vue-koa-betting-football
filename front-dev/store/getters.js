import Vue from "vue";
import _ from "lodash";

export default {
    leagues(state) {
        return state.selectableLeagues;
    },
    selectedLeagues(state, getters) {
        let leagues = getters.leagues.map(league => league.selectedClass === "selected" ? league.name : null);
        _.remove(leagues, leagues => leagues === null);
        return leagues.length === 0 ? state.leaguesList : leagues;
    },
    matches(state, getters) {
        return state.matches.filter(match => getters.selectedLeagues.includes(match.league));
    },
    currentBets(state) {
        return state.bets.current
    },
    selectButtonMode(state) {
        return state.selectButtonMode
    },
    bets(state) {
        return state.bets;
    },

    user(state) {
        let authToken = Vue.cookie.get("auth");
        let auth = !!authToken && authToken !== "guest";
        console.log(auth);
        return {...state.user, auth};
    },
    // triggers
    trigger_updateMatchButtonsSelectClass(state) {
        return state.trigger_updateMatchButtonsSelectClass
    },
}
