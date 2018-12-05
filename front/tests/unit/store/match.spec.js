import {getters, mutations, actions} from "@/store/match";
import {disableFile, stateConstructor, storeConstructor} from "../__utils__";

disableFile();

jest.mock("@/plugins/axios", () => require("../__utils__/mocks/axios"));

describe("Testing store/match", () => {

    let state, store;
    function mergeState(newState) {
        state = stateConstructor({
            matches: [],
            selectorItemMode: "bet",
        }, newState);
    }
    function createStore(customFields) {
        store = storeConstructor(state, customFields);
    }

    describe("Testing getters", () => {

        it("matches", () => {
            mergeState({
                matches: [{league: "League 1"}, {league: "League 1"}, {league: "League 2"}],
            });
            let rootGetters = {"league/selectedLeagues": ["League 2"]};

            let matches = getters.matches(state, null, null, rootGetters);

            expect(matches).toEqual([{league: "League 2"}]);
        });

        it("selectorItemMode", () => {
            mergeState({
                selectorItemMode: "selectorItemMode",
            });

            let mode = getters.selectorItemMode(state);

            expect(mode).toEqual("selectorItemMode");
        });

    });

    describe("Testing mutations", () => {

        describe("toggleSelectorItemMode", () => {

            it("set selectorItemMode to bet", () => {
                mergeState({
                    selectorItemMode: "info",
                });

                mutations.toggleSelectorItemMode(state);

                expect(state.selectorItemMode).toBe("bet");
            });

            it("set selectorItemMode to info", () => {
                mergeState({
                    selectorItemMode: "bet",
                });

                mutations.toggleSelectorItemMode(state);

                expect(state.selectorItemMode).toBe("info");
            });

        });

        it("cleanMatches", () => {
            mergeState({
                matches: [{league: "League 1"}, {league: "League 1"}, {league: "League 2"}],
            });
            let selectedLeagues = ["League 1"];

            mutations.cleanMatches(state, selectedLeagues);

            expect(state.matches).toEqual([{league: "League 2"}]);
        });

        it("pushMatches", () => {
            mergeState({
                matches: [{key: "match 1", date: 1525989600000, dateTmpl: "11.05"}],
            });
            let matchData = [{key: "match 2", date: 1546383600000}, {key: "match 3", date: 1556383600000}];

            mutations.pushMatches(state, matchData);

            expect(state.matches).toEqual([
                {key: "match 1", date: 1525989600000, dateTmpl: "11.05"},
                {key: "match 2", date: 1546383600000, dateTmpl: "02.01"},
                {key: "match 3", date: 1556383600000, dateTmpl: "27.04"},
            ]);
            expect(localStorage.getItem("matches")).toBe(JSON.stringify(state.matches));
        });

    });

    describe("Testing actions", () => {

        it("loadMatches", async () => {
            createStore({
                rootGetters: {
                    "league/selectedLeagues": "selectedLeagues"
                }
            });

            await actions.loadMatches(store);

            expect(store.commit).toHaveBeenCalledTimes(2);
            expect(store.commit.mock.calls[0]).toEqual(["cleanMatches", "selectedLeagues"]);
            expect(store.commit.mock.calls[1]).toEqual(["pushMatches", "new matches"]);
        });

        it("toggleSelectorItemMode", () => {
            createStore();

            actions.toggleSelectorItemMode(store);

            expect(store.commit).toBeCalledWith("toggleSelectorItemMode");
        });

    });

});