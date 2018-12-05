import {createWrapper, disableFile, cutFromOptions, DATA, mapProperties} from "../../__utils__";
import Component from "@/components/match/Actions/Selector/Item";

disableFile();

describe("match/Selector-Item.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        let {computed, props} = cutFromOptions(options, ["computed", "props"]);
        wrapper = createWrapper(Component, {
            props: {
                type: "0",
                matchKey: "League1:Home team 1-Guest team 1",
                coefficients: DATA.selectorItemCoefficients,
                ...props,
            },
            computed: {
                selectorItemMode: "bet",
                "bets.current": [],
                ...computed,
            },
            ...options,
        });

    };

    it("Testing snapshot", () => {
        mountWrapper({
            computed: {
                button: mapProperties("title", "text"),
                ...mapProperties("classes", "selectedClass"),
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Triggering event", () => {

        it("makeBet", () => {
            mountWrapper({
                methods: ["makeBet"],
            });

            wrapper.trigger("click");

            expect(wrapper.vm.makeBet).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        describe("classes", () => {

            let makeIt = (className, type) => {
                it(`classes, active = ${className}`, () => {
                    mountWrapper({props: {type}});

                    for(let _className in wrapper.vm.classes) {
                        if(_className == className) expect(wrapper.vm.classes[_className]).toBeTruthy();
                        else expect(wrapper.vm.classes[_className]).toBeFalsy();
                    }
                });
            };

            makeIt("h", "1");
            makeIt("d", "0");
            makeIt("g", "2");

        });

        describe("selected", () => {

            let makeIt = (selectedValue, props) => {
                it(`selected = ${selectedValue}`, () => {
                    mountWrapper({props, computed: {"bets.current": [{key: "bet1", type: "0"}, {key: "bet2"}, {key: "bet3"}]}});

                    expect(wrapper.vm.selected).toBe(selectedValue);
                });
            };

            makeIt(true, {matchKey: "bet1", type: "0"}); // correct matchKey and prediction
            makeIt(false, {matchKey: "bet1", type: "1"}); // correct matchKey and wrong prediction
            makeIt(undefined, {matchKey: "not exist"}); // wrong matchKey

        });

        describe("selectedClass", () => {

            it("selectedClass = selected", () => {
                mountWrapper({
                    computed: {
                        selected: true,
                    },
                });

                expect(wrapper.vm.selectedClass).toBe("selected");
            });

            it("selectedClass = empty", () => {
                mountWrapper({
                    computed: {
                        selected: false,
                    },
                });

                expect(wrapper.vm.selectedClass).toBe("");
            });

        });

        it("bestBookie", () => {
            mountWrapper({
                props: {
                    coefficients: [{name: "Bookmaker 1", coefficient: 1}, {name: "Bookmaker 2", coefficient: 2}],
                },
            });

            expect(wrapper.vm.bestBookie).toEqual({name: "Bookmaker 2", coefficient: 2, coefficientTmpl: "2.00"});
        });

        it("infoBookies", () => {
            mountWrapper({
                props: {
                    coefficients: [{name: "Bookmaker 1", coefficient: 1}, {name: "Bookmaker 2", coefficient: 2}],
                },
            });

            expect(wrapper.vm.infoBookies).toEqual("Bookmaker 2 2.00<hr>Bookmaker 1 1.00");
        });

        describe("button", () => {

            it("selector-item-mode = bet", () => {
                mountWrapper({
                    computed: {
                        selectorItemMode: "bet",
                        bestBookie: {name: "Bookmaker 1", coefficientTmpl: "2.00"},
                    },
                });

                expect(wrapper.vm.button).toEqual({title: "Bookmaker 1", text: "2.00"});
            });

            it("selector-item-mode = info", () => {
                mountWrapper({
                    computed: {
                        selectorItemMode: "info",
                        infoBookies: "some info",
                    },
                });

                expect(wrapper.vm.button).toEqual({text: "some info"});
            });

        });

    });

    describe("Testing methods", () => {

        describe("makeBet", () => {
            
            it("makeBet interrupted", () => {
                mountWrapper({
                    computed: {
                        selectorItemMode: "!bet",
                    },
                    methods: ["_changeCurrentBetSlip"],
                });

                wrapper.vm.makeBet();

                expect(wrapper.vm._changeCurrentBetSlip).not.toBeCalled();
            });

            it("makeBet done", () => {
                mountWrapper({
                    props: {
                        matchKey: "match-key",
                        type: "0",
                    },
                    computed: {
                        selectorItemMode: "bet",
                        bestBookie: "best-bookie",
                    },
                    methods: ["_changeCurrentBetSlip"],
                });

                wrapper.vm.makeBet();

                expect(wrapper.vm._changeCurrentBetSlip).toBeCalledWith({key: "match-key", bookie: "best-bookie", type: "0"});
            });
            
        });

    });

});
