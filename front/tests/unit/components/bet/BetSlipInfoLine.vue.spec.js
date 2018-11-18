import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../../__utils__";
import Component from "@/components/bet/betSlip/Info/Line";

disableFile();

describe("bet/BetSlipInfoLine.vue", () => {

    let wrapper, closeButton;
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
    };

    it("Testing snapshot", () => {
         mountWrapper({
            props: {
                ...mapProperties("dateTmpl", "league", "home", "guest", "type"),
                bookie: {name: "{{bookie.name}}", coefficient: 2},
            },
            computed: {
                show: mapProperties("waiting", "results", true),
                ...mapProperties("coefficientTmpl", "betClass", "scoreTmpl"),
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("deleteBet", () => {
            mountWrapper({
                methods: ["deleteBet"],
                computed: {
                    show: {waiting: true},
                },
            });

            closeButton.trigger("click");

            expect(wrapper.vm.deleteBet).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        describe("show", () => {

            it("show = waiting", () => {
                mountWrapper({
                    props: {
                        lineMode: "waiting",
                    },
                });

                expect(wrapper.vm.show).toEqual({waiting: true, results: false});
            });

            it("show = results", () => {
                mountWrapper({
                    props: {
                        lineMode: "result",
                    },
                });

                expect(wrapper.vm.show).toEqual({waiting: false, results: true});
            });

        });

        it("coefficientTmpl", () => {
            mountWrapper({
                props: {
                    bookie: {coefficient: 26.577},
                },
            });

            expect(wrapper.vm.coefficientTmpl).toBe("26.58");
        });

        describe("scoreTmpl", () => {

            it("scoreTmpl = result", () => {
                mountWrapper({
                    props: {
                        score: "3 : 1",
                        matchResult: "1",
                    },
                });

                expect(wrapper.vm.scoreTmpl).toBe("3 : 1");
            });

            it("scoreTmpl = default template", () => {
                mountWrapper({
                    props: {
                        matchResult: null,
                    },
                });

                expect(wrapper.vm.scoreTmpl).toBe("- : -");
            });

        });

        describe("betClass", () => {

            it("betClass = empty", () => {
                mountWrapper({
                    props: {
                        matchResult: null,
                    },
                });

                expect(wrapper.vm.betClass).toBe("");
            });

            it("betClass when win", () => {
                mountWrapper({
                    props: {
                        matchResult: "1",
                        type: "1",
                    },
                });

                expect(wrapper.vm.betClass).toBe("bet-match-won");
            });

            it("betClass when lose", () => {
                mountWrapper({
                    props: {
                        matchResult: "2",
                        type: "1",
                    },
                });

                expect(wrapper.vm.betClass).toBe("bet-match-lose");
            });

        });

    });

    describe("Testing methods", () => {

        it("deleteBet", () => {
            mountWrapper({
                props: {
                    betIndex: 1,
                    betSlipIndex: 2,
                },
                methods: ["_deleteBet"],
            });

            wrapper.vm.deleteBet();

            expect(wrapper.vm._deleteBet).toBeCalledWith({indexOfBet: 1, indexOfBetSlip: 2});
        });

    });

});
