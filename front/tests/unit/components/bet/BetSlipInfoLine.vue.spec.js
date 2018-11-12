import {createWrapper, disableFile, cutFromOptions} from "../../__utils__";
import Component from "@/components/bet/betSlip/Info/Line";

disableFile();

describe("bet/BetSlipInfoLine.vue", () => {

    let wrapper, closeButton, scoreInfo;
    let mountWrapper = (options = {}) => {
        let {props} = cutFromOptions(options, ["props"]);
        wrapper = createWrapper(Component, {
            props: {
                bookie: {coefficient: 2},
                ...props
            },
            ...options,
        });
        closeButton = wrapper.find(".close");
        scoreInfo = wrapper.find(".score");
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper({props: {
                dateTmpl: "12.12",
                league: "league 1",
                home: "home team 1",
                guest: "guest team 1",
                type: "1",
                bookie: {name: "bookie 1", coefficient: 2},
            }});

            expect(wrapper.element).toMatchSnapshot();
        });

        it("close button", () => {
            mountWrapper({computed: {mode: () => ({waiting: true})}});

            expect(closeButton.element).toMatchSnapshot();
        });

        it("score block", () => {
            mountWrapper({computed: {mode: () => ({results: true}), betClass: () => "betClass", scoreTmpl: () => "1 : 1"}});

            expect(scoreInfo.element).toMatchSnapshot();
        });

    });

    describe("Testing triggering methods", () => {

        it("deleteBet", () => {
            mountWrapper({methods: ["deleteBet"], computed: {mode: () => ({waiting: true})}});

            closeButton.trigger("click");

            expect(wrapper.vm.deleteBet).toBeCalled();
        });

    });


    describe("Testing computed properties", () => {

        describe("mode", () => {

            it("mode = waiting", () => {
                mountWrapper({props: {lineMode: "waiting"}});

                expect(wrapper.vm.mode).toEqual({waiting: true, results: false});
            });

            it("mode = results", () => {
                mountWrapper({props: {lineMode: "result"}});

                expect(wrapper.vm.mode).toEqual({waiting: false, results: true});
            });

        });

        it("coefficientTmpl", () => {
            mountWrapper({computed: {bookie: () => ({coefficient: 26.577})}});

            expect(wrapper.vm.coefficientTmpl).toBe("26.58");
        });

        describe("scoreTmpl", () => {

            it("scoreTmpl = result", () => {
                mountWrapper({props: {score: "3 : 1", matchResult: "1"}});

                expect(wrapper.vm.scoreTmpl).toBe("3 : 1");
            });

            it("scoreTmpl = default template", () => {
                mountWrapper({props: {matchResult: null}});

                expect(wrapper.vm.scoreTmpl).toBe("- : -");
            });

        });

        describe("betClass", () => {

            it("betClass = empty", () => {
                mountWrapper({props: {matchResult: null}});

                expect(wrapper.vm.betClass).toBe("");
            });

            it("betClass when win", () => {
                mountWrapper({props: {matchResult: "1", type: "1"}});

                expect(wrapper.vm.betClass).toBe("bet-match-won");
            });

            it("betClass when lose", () => {
                mountWrapper({props: {matchResult: "2", type: "1"}});

                expect(wrapper.vm.betClass).toBe("bet-match-lose");
            });

        });

    });

    describe("Testing methods", () => {

        it("deleteBet", () => {
            mountWrapper({data: {betIndex: 1, betSlipIndex: 2}, methods: ["_deleteBet"]});

            wrapper.vm.deleteBet();

            expect(wrapper.vm._deleteBet).toBeCalledWith({indexOfBet: 1, indexOfBetSlip: 2});
        });

    });

});
