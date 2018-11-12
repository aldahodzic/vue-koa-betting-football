import {createWrapper, disableFile, cutFromOptions} from "../../__utils__";
import Component from "@/components/match/Actions";

disableFile();

describe("match/Actions.vue", () => {

    let wrapper, buttons, divLoading, selector, buttonChangeMode, confirmCurrentBetSlip, loadMatches;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-match-selector"],
            computed: {
                leagues: () => ["League 1", "League 2", "League 3"],
                ...computed,
            },
            ...options,
        });
        buttons = wrapper.find("#buttons");
        divLoading = wrapper.find("#loading");
        selector = wrapper.find("app-match-selector-stub");
        buttonChangeMode = wrapper.find("#change-mode");
        confirmCurrentBetSlip = wrapper.find("#confirm-current-bet-slip");
        loadMatches = wrapper.find("#load-matches");
    };

    describe("Testing snapshots", () => {

        it("Show action buttons", () => {
            mountWrapper();

            expect(buttons.element).toMatchSnapshot();
        });

        it("Show button which change mode of selector-item", () => {
            mountWrapper({computed: {showInfo: () => true}});

            expect(buttonChangeMode.element).toMatchSnapshot();
        });

        it("Show confirm current bet slip button", () => {
            mountWrapper({computed: {currentBetsEmpty: () => false}});

            expect(confirmCurrentBetSlip.element).toMatchSnapshot();
        });

        it("Show div with loading text", () => {
            mountWrapper({data: {loading: "processing"}});

            expect(divLoading.element).toMatchSnapshot();
        });

        it("Show match-selector", () => {
            mountWrapper({computed: {showSelector: () => true}});

            expect(selector.element).toMatchSnapshot();
        });

    });

    describe("Triggering event", () => {

        it("loadMatches", () => {
            mountWrapper({methods: ["loadMatches"]});

            loadMatches.trigger("click");

            expect(wrapper.vm.loadMatches).toBeCalled();
        });

        it("toggleSelectorItemMode", () => {
            mountWrapper({
                methods: ["toggleSelectorItemMode"],
                computed: {showInfo: () => true},
            });

            buttonChangeMode.trigger("click");

            expect(wrapper.vm.toggleSelectorItemMode).toBeCalled();
        });

        it("sendToWaitingBets", () => {
            mountWrapper({
                methods: ["sendToWaitingBets"],
                computed: {currentBetsEmpty: () => false},
            });

            confirmCurrentBetSlip.trigger("click");

            expect(wrapper.vm.sendToWaitingBets).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        it("currentBetsEmpty", () => {
            mountWrapper({computed: {bets: () => ({current: new Array(3)})}});

            expect(wrapper.vm.currentBetsEmpty).toBeFalsy();
        });

        describe("textAction", () => {

            let makeIt = ({matches, selectedLeagues, leagues, result}) => {
                it(`textAction == ${result.split(/[\._]/).slice(1).join(" -> ")}`, () => {
                    mountWrapper({computed: {
                        matches: () => new Array(matches),
                        selectedLeagues: () => new Array(selectedLeagues),
                        leagues: () => new Array(leagues),
                    }});

                    expect(wrapper.vm.textAction).toBe(result);
                });
            };

            makeIt({matches: 0, selectedLeagues: 1, leagues: 1, result: "phrases.load.leagues_all"});
            makeIt({matches: 1, selectedLeagues: 1, leagues: 1, result: "phrases.update.leagues_all"});
            makeIt({matches: 0, selectedLeagues: 1, leagues: 2, result: "phrases.load.leagues_selected"});
            makeIt({matches: 1, selectedLeagues: 1, leagues: 2, result: "phrases.update.leagues_selected"});

        });

        it("showInfo", () => {
            mountWrapper({computed: {currentBetsEmpty: () => false}});
            expect(wrapper.vm.showInfo).toBeFalsy();

            mountWrapper({computed: {currentBetsEmpty: () => true, matches: () => []}});
            expect(wrapper.vm.showInfo).toBeFalsy();

            mountWrapper({computed: {currentBetsEmpty: () => true, matches: () => new Array(3)}});
            expect(wrapper.vm.showInfo).toBeTruthy();
        });

        it("showSelector", () => {
            mountWrapper({data: {loading: "!end"}, computed: {matches: () => []}});
            expect(wrapper.vm.showSelector).toBeFalsy();

            mountWrapper({data: {loading: "!end"}, computed: {matches: () => new Array(3)}});
            expect(wrapper.vm.showSelector).toBeTruthy();

            mountWrapper({data: {loading: "end"}, computed: {matches: () => []}});
            expect(wrapper.vm.showSelector).toBeTruthy();
        });

    });

    describe("Testing methods", () => {

        it("loadMatches", async () => {
            mountWrapper({methods: ["_loadMatches"]});

            wrapper.vm.loadMatches();

            expect(wrapper.vm.loading).toBe("processing");
            expect(wrapper.vm._loadMatches).toBeCalled();
            expect(wrapper.vm.loading).not.toBe("end");

            await wrapper.vm.$nextTick();

            expect(wrapper.vm.loading).toBe("end");
        });


        it("toggleSelectorItemMode", async () => {
            mountWrapper({
                data: {buttonInfoText: "show.info.bets"},
                methods: ["_toggleSelectorItemMode"],
            });

            wrapper.vm.toggleSelectorItemMode();

            expect(wrapper.vm._toggleSelectorItemMode).toBeCalled();
            expect(wrapper.vm.buttonInfoText).toBe("hide.info.bets");
        });

        it("sendToWaitingBets", async () => {
            mountWrapper({methods: ["_pushToWaiting"]});

            wrapper.vm.sendToWaitingBets();

            expect(wrapper.vm._pushToWaiting).toBeCalled();
        });


    });

});
