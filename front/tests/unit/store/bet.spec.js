import _ from "lodash";
import {getters, mutations, actions} from "@/store/bet";
import {disableFile, stateConstructor, storeConstructor, mapProperties, DATA} from "../__utils__";

disableFile();

jest.mock("@/plugins/axios", () => require("../__utils__/mocks/axios"));

describe("Testing store/bet", () => {

    let state, store;
    function mergeState(newState) {
        state = stateConstructor({}, newState);
    }
    function createStore(customFields) {
        store = storeConstructor(state, customFields);
    }

    describe("Testing getters", () => {

        it("bets", () => {
            mergeState({
                bets: "bets",
            });

            let bets = getters.bets(state);

            expect(bets).toBe("bets");
        });

        it("waitingBets", () => {
            mergeState({
                "bets.waiting": [{
                    rate: 10,
                    bets: [{bookie: {coefficient: 1}}, {bookie: {coefficient: 2}},{bookie: {coefficient: 3}}],
                }],
            });

            let waitingBets = getters.waitingBets(state);

            expect(waitingBets).toEqual([{
                rate: 10,
                bets: [{bookie: {coefficient: 1}}, {bookie: {coefficient: 2}},{bookie: {coefficient: 3}}],
                totalCoefficient: 6,
                totalSum: 60,
            }]);
        });

        describe("filteredResultBets", () => {

            it("get all result bets", () => {
                mergeState({
                    "selector.filter": "all",
                    "bets.results": ["all result bets"],
                });

                let resultBets = getters.filteredResultBets(state);

                expect(resultBets).toEqual(["all result bets"]);
            });

            it("get all filtered result bets", () => {
                mergeState({
                    "selector.filter": "win",
                    "bets.results": [{outcome: "win"}, {outcome: "win"}, {outcome: "lose"}],
                });

                let resultBets = getters.filteredResultBets(state);

                expect(resultBets).toEqual([{outcome: "win"}, {outcome: "win"}]);
            });

        });

        describe("filteredAndSortedResultBets", () => {

            it("sorted in descending mode", () => {
                mergeState({
                    selector: {
                        sort: "key",
                        direction: 1,
                    },
                });
                let filteredResultBets = [{key: 2}, {key: 3}, {key: 1}];

                let resultBets = getters.filteredAndSortedResultBets(state, {filteredResultBets});

                expect(resultBets).toEqual([{key: 1}, {key: 2}, {key: 3}]);
            });

            it("sorted in ascending mode", () => {
                mergeState({
                    selector: {
                        sort: "key",
                        direction: -1,
                    },
                });
                let filteredResultBets = [{key: 2}, {key: 3}, {key: 1}];

                let resultBets = getters.filteredAndSortedResultBets(state, {filteredResultBets});

                expect(resultBets).toEqual([{key: 3}, {key: 2}, {key: 1}]);
            });

        });

        it("selector", () => {
            mergeState({
                selector: "selector",
            });

            let selector = getters.selector(state);

            expect(selector).toBe("selector");
        });

        describe("load", () => {

            const makeIt = (value, status) => {
                it(`load with reay = ${value}`, () => {
                    mergeState({load: {status}});

                    let load = getters.load(state);

                    expect(load).toEqual({status, ready: value});
                });
            };

            makeIt(false, "!wait && !loaded");
            makeIt(true, "wait");
            makeIt(true, "loaded");

        });

    });

    describe("Testing mutations", () => {

        describe("changeCurrentBetSlip", () => {

            it("must push new betSlip", () => {
                mergeState({
                    "bets.current": [],
                });
                let betData = mapProperties("key", "bookie", "type");
                let matchData = mapProperties("home", "guest", "date", "dateTmpl", "league");

                mutations.changeCurrentBetSlip(state, {betData, matchData});

                expect(state.bets.current).toEqual([mapProperties("home", "guest", "date", "dateTmpl", "league", "bookie", "key", "type")]);
            });

            it("must remove existing betSlip", () => {
                mergeState({
                    "bets.current": [mapProperties("key", "type")],
                });
                let betData = mapProperties("key", "type");

                mutations.changeCurrentBetSlip(state, {betData, matchData: {}});

                expect(state.bets.current).toEqual([]);
            });

        });

        it("pushToWaiting", () => {
            mergeState({
                bets: {
                    current: "some bets",
                    waiting: [],
                },
            });

            mutations.pushToWaiting(state);

            expect(state.bets.waiting).toEqual([{rate: 0, bets: "some bets"}]);
            expect(state.bets.current).toEqual([]);
        });

        it("clearResults", () => {
            mergeState({
                "bets.results": "some result bets",
            });

            mutations.clearResults(state);

            expect(state.bets.results).toEqual([]);
        });

        describe("pushToResults", () => {

            let incomingResultBets;
            let stubData = (type, score) => {
                incomingResultBets = _.cloneDeep(DATA.resultBetsDataFromBack);
                incomingResultBets.forEach(betSlip =>
                    betSlip.bets.forEach(bet => {
                            bet.type = type;
                            bet.score = score;
                        }
                    ));
            };

            it("result bets when won", () => {
                mergeState({
                    "bets.results": [],
                });
                stubData("1", "1 : 0");

                mutations.pushToResults(state, incomingResultBets);

                expect(state.bets.results).toEqual(DATA.expectedResultBetsWhenWon);
            });

            it("result bets when waiting", () => {
                mergeState({
                    "bets.results": [],
                });
                stubData("1", "none");

                mutations.pushToResults(state, incomingResultBets);

                expect(state.bets.results).toEqual(DATA.expectedResultBetsWhenWaiting);
            });

            it("result bets when lose", () => {
                mergeState({
                    "bets.results": [],
                });
                stubData("2", "1 : 0");

                mutations.pushToResults(state, incomingResultBets);

                expect(state.bets.results).toEqual(DATA.expectedResultBetsWhenLose);
            });

        });

        it("deleteBet", () => {
            mergeState({
                "bets.waiting": [{bets: ["some bet 1", "some bet 2"]}],
            });

            mutations.deleteBet(state, {indexOfBet: 0, indexOfBetSlip: 0});

            expect(state.bets.waiting).toEqual([{bets: ["some bet 2"]}]);
        });

        describe("deleteBetSlip", () => {

            it("do not delete betSlip, if not forced and not empty bets", () => {
                mergeState({
                    "bets.waiting": [{bets: ["bet 1", "bet 2"]}],
                });

                mutations.deleteBetSlip(state, {force: false, index: 0});

                expect(state.bets.waiting).toEqual([{bets: ["bet 1", "bet 2"]}]);
            });

            it("delete betSlip, if empty bets", () => {
                mergeState({
                    "bets.waiting": [{bets: []}],
                });

                mutations.deleteBetSlip(state, {force: false, index: 0});

                expect(state.bets.waiting).toEqual([]);
            });

            it("delete betSlip, if forced", () => {
                mergeState({
                    "bets.waiting": [{bets: new Array(2)}],
                });

                mutations.deleteBetSlip(state, {force: true, index: 0});

                expect(state.bets.waiting).toEqual([]);
            });

        });

        it("newRateOfBetSlip", () => {
            mergeState({
                "bets.waiting": [{rate: "some"}],
            });

            mutations.newRateOfBetSlip(state, {betSlipIndex: 0, rate: "new rate"});

            expect(state.bets.waiting[0].rate).toBe("new rate");
        });

        describe("changeSelector", () => {

            const makeIt = (title, {sort, field, value, incomingSort}) => {
                it(title, () => {
                    mergeState({
                        "selector.sort": incomingSort,
                    });

                    mutations.changeSelector(state, {field, value});

                    expect(state.selector.sort).toBe(sort);
                    expect(state.selector[field]).toBe(value);
                });
            };

            makeIt("change selector and set reset selector.sort to default", {
                sort: "createdAt",
                field: "filter",
                value: "all",
                incomingSort: "outcomeSum",
            });

            makeIt("change selector and do not set reset selector.sort > field not a filter", {
                sort: "outcomeSum",
                field: "!filter",
                value: "all",
                incomingSort: "outcomeSum",
            });

            makeIt("change selector and do not set reset selector.sort > value not 'all'", {
                sort: "outcomeSum",
                field: "filter",
                value: "!all",
                incomingSort: "outcomeSum",
            });

            makeIt("change selector and do not set reset selector.sort > previous sort not by outcomeSum", {
                sort: "!outcomeSum",
                field: "filter",
                value: "all",
                incomingSort: "!outcomeSum",
            });

        });

        it("resetSelector", () => {
            mergeState({
                selector: mapProperties("type", "filter", "sort", "direction"),
            });

            mutations.resetSelector(state);

            expect(state.selector.type).toBe("waiting");
            expect(state.selector.filter).toBe("all");
            expect(state.selector.sort).toBe("createdAt");
            expect(state.selector.direction).toBe(-1);
        });

        it("changeLoad", () => {
            mergeState({
                "load.key": "value",
            });

            mutations.changeLoad(state, {field: "key", value: "value 2"});

            expect(state.load.key).toBe("value 2");
        });

    });

    describe("Testing actions", () => {

        it("changeCurrentBetSlip", () => {
            createStore({
                "rootState.match.matches": [{key: "key 1"}, {key: "key 2"}],
            });

            actions.changeCurrentBetSlip(store, {key: "key 1"});

            expect(store.commit).toBeCalledWith("changeCurrentBetSlip", {
                betData: {key: "key 1"},
                matchData: {key: "key 1"},
            });
        });
        
        it("pushToWaiting", () => {
            createStore();

            actions.pushToWaiting(store);

            expect(store.commit).toBeCalledWith("pushToWaiting");
        });

        describe("getResults", () => {
            
            it("process stopped due to !force and none permission", () => {
                createStore({
                    "getters.load.permission": false,
                });

                actions.getResults(store, {force: false});

                expect(store.dispatch).not.toBeCalled();
            });

            it("process stopped due to load status is already loading", () => {
                createStore({
                    "getters.load.status": "loading",
                });

                actions.getResults(store, {force: true});

                expect(store.dispatch).not.toBeCalled();
            });

            it("process must load results", async () => {
                createStore({
                    "getters.load": {
                        permission: true,
                        status: "!loading",
                    },
                });

                await actions.getResults(store, {force: true, created: "last"});

                expect(store.dispatch.mock.calls[0]).toEqual(["startLoadResults"]);
                expect(store.dispatch.mock.calls[1]).toEqual(["endLoadResults", "result bets"]);
            });
            
        });

        it("startLoadResults", () => {
            createStore();

            actions.startLoadResults(store);

            expect(store.commit.mock.calls[0]).toEqual(["clearResults"]);
            expect(store.commit.mock.calls[1]).toEqual(["changeLoad", {field: "status", value: "loading"}]);
            expect(store.commit.mock.calls[2]).toEqual(["changeSelector", {field: "filter", value: "all"}]);
            expect(store.commit.mock.calls[3]).toEqual(["changeSelector", {field: "sort", value: "createdAt"}]);
            expect(store.commit.mock.calls[4]).toEqual(["changeSelector", {field: "direction", value: -1}]);
        });

        it("endLoadResults", () => {
            createStore();

            actions.endLoadResults(store, "results");

            expect(store.commit.mock.calls[0]).toEqual(["pushToResults", "results"]);
            expect(store.commit.mock.calls[1]).toEqual(["changeLoad", {field: "permission", value: false}]);
            expect(store.commit.mock.calls[2]).toEqual(["changeLoad", {field: "status", value: "loaded"}]);
        });

        it("deleteBet", () => {
            createStore();

            actions.deleteBet(store, {indexOfBetSlip: 2});

            expect(store.commit.mock.calls[0]).toEqual(["deleteBet", {indexOfBetSlip: 2}]);
            expect(store.commit.mock.calls[1]).toEqual(["deleteBetSlip", {index: 2}]);
        });

        it("deleteBetSlip", () => {
            createStore();

            actions.deleteBetSlip(store, "data");

            expect(store.commit).toBeCalledWith("deleteBetSlip", "data");
        });

        describe("confirmBetSlip", () => {

            it("loading failed", () => {
                createStore({
                    "getters.bets.waiting": ["must fail"],
                });

                actions.confirmBetSlip(store, 0);

                expect(store.commit).not.toBeCalled();
            });

            it("loading failed", async () => {
                createStore({
                    "getters.bets.waiting": ["must success"],
                });

                await actions.confirmBetSlip(store, 0);

                expect(store.commit.mock.calls[0]).toEqual(["deleteBetSlip", {index: 0, force: true}]);
                expect(store.commit.mock.calls[1]).toEqual(["changeLoad", {field: "permission", value: false}]);
            });

        });

        it("newRateOfBetSlip", () => {
            createStore();

            actions.newRateOfBetSlip(store, "newRateData");

            expect(store.commit).toBeCalledWith("newRateOfBetSlip", "newRateData");
        });

        it("changeSelector", () => {
            createStore();

            actions.changeSelector(store, "options");

            expect(store.commit).toBeCalledWith("changeSelector", "options");
        });

        it("resetSelector", () => {
            createStore();

            actions.resetSelector(store);

            expect(store.commit).toBeCalledWith("resetSelector");
        });

        it("changeLoad", () => {
            createStore();

            actions.changeLoad(store, "options");

            expect(store.commit).toBeCalledWith("changeLoad", "options");
        });

    });

});