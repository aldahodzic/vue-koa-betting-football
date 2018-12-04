import {disableFile, stateConstructor, storeConstructor} from "../__utils__";
import {getters, mutations, actions} from "@/store/league";

disableFile();

describe("Testing store/league", () => {

    let state, store;
    function mergeState(newState) {
        state = stateConstructor({
            leagueList: [],
            selectedLeagues: [],
        }, newState);
    }
    function createStore(customFields) {
        store = storeConstructor(state, customFields);
    }

    describe("Testing getters", () => {

        it("leagueList", () => {
            mergeState({
                leagueList: ["League 1", "League 2"],
            });

            let leagues = getters.leagueList(state);

            expect(leagues).toEqual(["League 1", "League 2"]);
        });

        describe("selectedLeagues", () => {

            it("selectedLeagues return normally", () => {
                mergeState({
                    selectedLeagues: ["League 1", "League 2"],
                });

                let leagues = getters.selectedLeagues(state);

                expect(leagues).toEqual(["League 1", "League 2"]);
            });

            it("selectedLeagues empty > must set all leagues", () => {
                mergeState({
                    leagueList: ["League 1", "League 2"],
                    selectedLeagues: [],
                });

                let leagues = getters.selectedLeagues(state);

                expect(leagues).toEqual(["League 1", "League 2"]);
            });

        });

    });

    describe("Testing mutations", () => {

        describe("selectLeague", () => {

            it("League already selected", () => {
                mergeState({
                    selectedLeagues: ["League 1", "League 2"],
                });

                mutations.selectLeague(state, "League 2");

                expect(state.selectedLeagues).toEqual(["League 1"]);
            });

            it("Make league selected", () => {
                mergeState({
                    selectedLeagues: ["League 1", "League 2"],
                });

                mutations.selectLeague(state, "League 3");

                expect(state.selectedLeagues).toEqual(["League 1", "League 2", "League 3"]);
            });

        });

    });

    describe("Testing actions", () => {

        it("selectLeague", () => {
            createStore();

            actions.selectLeague(store, "League 1");

            expect(store.commit).toBeCalledWith("selectLeague", "League 1");
        });

    });

});