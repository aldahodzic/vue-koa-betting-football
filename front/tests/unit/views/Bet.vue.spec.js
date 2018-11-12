import {createWrapper, disableFile, cutFromOptions} from "../__utils__";
import Component from "@/views/Bet.vue";

disableFile();

describe("Match.vue", () => {

    let wrapper, loadingBets, noneBets, selector, selectedBets, previous;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-bet-menu", "app-bet-selector", "app-waiting-bet-slip", "app-result-bet-slip"],
            computed: {
                waitingBets: () => [],
                resultBets: () => [],
                selector: () => ({}),
                load: () => ({}),
                bets: () => [
                    {
                        _id: "_id 1",
                        bets: "bets 1",
                        rate: "rate 1",
                        totalCoefficient: "totalCoefficient 1",
                        totalSum: "totalSum 1",
                        createdDate: "createdDate 1",
                        outcome: "outcome 1",
                        outcomeSum: "outcomeSum 1",
                    },
                    {
                        _id: "_id 2",
                        bets: "bets 2",
                        rate: "rate 2",
                        totalCoefficient: "totalCoefficient 2",
                        totalSum: "totalSum 2",
                        createdDate: "createdDate 2",
                        outcome: "outcome 2",
                        outcomeSum: "outcomeSum 2",
                    },
                ],
                ...computed,
            },
            ...options,
        });
        loadingBets = wrapper.find("#loading-bets");
        noneBets = wrapper.find("#none-bets");
        selector = wrapper.find("app-bet-selector-stub");
        selectedBets = wrapper.find(".selected-bets");
        previous = wrapper.find("#get-previous");
    };

    describe("Testing snapshot", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

        it("Block loading bets", () => {
            mountWrapper({computed: {show: () => ({loading: true})}});

            expect(loadingBets.element).toMatchSnapshot();
        });

        it("Block none bets", () => {
            mountWrapper({computed: {show: () => ({noneBets: true}), emptyBetsText: () => "empty-bets-text"}});

            expect(noneBets.element).toMatchSnapshot();
        });

        it("Selector", () => {
            mountWrapper({computed: {show: () => ({selector: true})}});

            expect(selector.element).toMatchSnapshot();
        });

        describe("Block selected bets", () => {

            it("betSlip type = waiting", () => {
                mountWrapper({computed: {show: () => ({bets: true}), betSlipComponent: () => "app-waiting-bet-slip"}});

                expect(selectedBets.element).toMatchSnapshot();
            });

            it("betSlip type = result", () => {
                mountWrapper({computed: {show: () => ({bets: true}), betSlipComponent: () => "app-result-bet-slip"}});

                expect(selectedBets.element).toMatchSnapshot();
            });

        });

        it("Block load previous", () => {
            mountWrapper({computed: {show: () => ({loadPrevious: true})}});

            expect(previous.element).toMatchSnapshot();
        });

    });

    describe("Testing triggering methods", () => {

        it("getAllBets", () => {
            mountWrapper({methods: ["getAllBets"], computed: {show: () => ({loadPrevious: true})}});

            previous.trigger("click");

            expect(wrapper.vm.getAllBets).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        describe("show", () => {

            let makeIt = (showProp, showValue, {selector = {}, load = {}, emptyBets}) => {
                it(`show.${showProp} = ${showValue}`, () => {
                    mountWrapper({computed: {selector: () => selector, emptyBets: () => emptyBets, load: () => load}});

                    expect(wrapper.vm.show[showProp]).toBe(showValue);
                });
            };

            describe("show.noneBets", () => {
                // result
                makeIt("noneBets", true, {emptyBets: true, selector: {type: "results"}, load: {ready: true}});
                makeIt("noneBets", false, {emptyBets: false, selector: {type: "results"}, load: {ready: true}});
                makeIt("noneBets", false, {emptyBets: true, selector: {type: "!results"}, load: {ready: true}});
                makeIt("noneBets", false, {emptyBets: true, selector: {type: "results"}, load: {ready: false}});

                // waiting
                makeIt("noneBets", true, {emptyBets: true, selector: {type: "waiting"}});
                makeIt("noneBets", false, {emptyBets: true, selector: {type: "!waiting"}});
                makeIt("noneBets", false, {emptyBets: false, selector: {type: "waiting"}});
            });

            describe("show.bets", () => {
                // result
                makeIt("bets", true, {emptyBets: false, selector: {type: "results"}, load: {ready: true}});
                makeIt("bets", false, {emptyBets: true, selector: {type: "results"}, load: {ready: true}});
                makeIt("bets", false, {emptyBets: false, selector: {type: "!results"}, load: {ready: true}});
                makeIt("bets", false, {emptyBets: false, selector: {type: "results"}, load: {ready: false}});

                // waiting
                makeIt("bets", true, {emptyBets: false, selector: {type: "waiting"}});
                makeIt("bets", false, {emptyBets: true, selector: {type: "waiting"}});
                makeIt("bets", false, {emptyBets: false, selector: {type: "!waiting"}});
            });

            describe("show.loadPrevious", () => {
                makeIt("loadPrevious", true, {selector: {type: "results"}, load: {ready: true, previous: true}});
                makeIt("loadPrevious", false, {selector: {type: "!results"}, load: {ready: true, previous: true}});
                makeIt("loadPrevious", false, {selector: {type: "results"}, load: {ready: false, previous: true}});
                makeIt("loadPrevious", false, {selector: {type: "results"}, load: {ready: true, previous: false}});
            });

            describe("show.loading", () => {
                makeIt("loading", true, {selector: {type: "results"}, load: {status: "loading"}});
                makeIt("loading", false, {selector: {type: "!results"}, load: {status: "loading"}});
                makeIt("loading", false, {selector: {type: "results"}, load: {status: "!loading"}});
            });

            describe("show.selector", () => {
                makeIt("selector", true, {selector: {type: "results"}, load: {ready: true}});
                makeIt("selector", false, {selector: {type: "!results"}, load: {ready: true}});
                makeIt("selector", false, {selector: {type: "results"}, load: {ready: false}});
            });

        });

        describe("betSlipComponent", () => {

            it("betSlipComponent = app-waiting-bet-slip", () => {
                mountWrapper({computed: {selector: () => ({type: "waiting"})}});

                expect(wrapper.vm.betSlipComponent).toBe("app-waiting-bet-slip");
            });

            it("betSlipComponent = app-result-bet-slip", () => {
                mountWrapper({computed: {selector: () => ({type: "result"})}});

                expect(wrapper.vm.betSlipComponent).toBe("app-result-bet-slip");
            });

        });

        describe("bets", () => {

            it("bets type = waiting", () => {
                mountWrapper({
                    computed: {selector: () => ({type: "waiting"}), waitingBets: () => ["waiting"]},
                    remove: {computed: ["bets"]},
                });

                expect(wrapper.vm.bets).toEqual(["waiting"]);
            });

            it("bets type = result", () => {
                mountWrapper({
                    computed: {selector: () => ({type: "result"}), resultBets: () => ["results"]},
                    remove: {computed: ["bets"]},
                });

                expect(wrapper.vm.bets).toEqual(["results"]);
            });

        });

        describe("emptyBets", () => {

            it("emptyBets = true", () => {
                mountWrapper({computed: {bets: () => []}});

                expect(wrapper.vm.emptyBets).toBeTruthy();
            });

            it("emptyBets = false", () => {
                mountWrapper();

                expect(wrapper.vm.emptyBets).toBeFalsy();
            });

        });

        describe("emptyBetsText", () => {

            let makeIt = (value, selector = {}) => {
                it(`emptyBetsText = ${value}`, () => {
                    mountWrapper({computed: {selector: () => selector, emptyBets: () => true}});

                    expect(wrapper.vm.emptyBetsText).toBe(value);
                });
            };

            makeIt("not.made.bets", {type: "waiting"});
            makeIt("not.made.bets", {type: "results", filter: "all"});
            makeIt("not.have.bets.filter-value", {filter: "filter-value"});

        });

    });

    describe("Testing methods", () => {

        it("getAllBets", () => {
            mountWrapper({methods: ["_changeLoad", "_getResults"]});

            wrapper.vm.getAllBets();

            expect(wrapper.vm._changeLoad).toBeCalledWith({field: "previous", value: false});
            expect(wrapper.vm._getResults).toBeCalledWith({force: true, created: "all"});
        });

    });

    describe("Testing hooks", () => {

        describe("created", async () => {

            it("user authorized => get results", () => {
                mountWrapper({methods: ["_getResults"], computed: {user: () => ({auth: true})}});

                wrapper.callHook("created");

                expect(wrapper.vm._getResults).toBeCalledWith({created: "last"});
            });

            it("user not authorized => redirect to matches", () => {
                mountWrapper({computed: {user: () => ({auth: false})}});

                wrapper.callHook("created");

                expect(wrapper.vm.$router.replace).toBeCalledWith("matches");
            });

        });

        it("beforeDestroy", () => {
            mountWrapper({methods: ["_resetSelector"]});

            wrapper.callHook("beforeDestroy");

            expect(wrapper.vm._resetSelector).toBeCalled();
        });

    });

});
