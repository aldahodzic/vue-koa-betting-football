import {createWrapper, disableFile, expectAsyncFunctionCalled} from "../../__utils__";
import Component from "@/components/match/Actions/Selector/Item";

disableFile();

describe("match/Selector-Item.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        let localComputed = options.computed;
        delete options.computed;
        wrapper = createWrapper(Component, {
            props: {
                type: "0",
                matchKey: "League1:Home team 1-Guest team 1",
                coefficients: [{"name": "Bookmaker 1", "coefficient": 1.1}, {"name": "Bookmaker 2","coefficient": 1.2}, {"name": "Bookmaker 3", "coefficient": 1.3}],
            },
            computed: {
                selectorItemMode: () => "bet",
                ...localComputed,
            },
            ...options,
        });

    };

    describe("Testing snapshots", () => {

        it("Component mode=bet", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

        it("Component mode=info", () => {
            mountWrapper({computed: {selectorItemMode: () => "info"}});

            expect(wrapper.element).toMatchSnapshot();
        });

    });

    describe("Triggering event", () => {

        it("doFunction", () => {
            mountWrapper({computed: {button: () => ({func: "some function"})}, methods: ["doFunction"]});

            wrapper.trigger("click");

            expect(wrapper.vm.doFunction).toBeCalledWith("some function");
        });

    });


    describe("Testing computed properties", () => {

        it("bestBookie", () => {
            mountWrapper({props: {coefficients: [{"name": "Bookmaker 1", "coefficient": 1}, {"name": "Bookmaker 2", "coefficient": 2}]}});

            expect(wrapper.vm.bestBookie).toEqual({"name": "Bookmaker 2", "coefficient": "2.00"});
        });

        it("infoBookies", () => {
            mountWrapper({props: {coefficients: [{"name": "Bookmaker 1", "coefficient": 1}, {"name": "Bookmaker 2", "coefficient": 2}]}});

            expect(wrapper.vm.infoBookies).toEqual("Bookmaker 2 2.00<hr>Bookmaker 1 1.00");
        });

        describe("button", () => {

            it("selector-item-mode = bet", () => {
                mountWrapper({computed: {
                    selectorItemMode: () => "bet",
                    bestBookie: () => ({name: "Bookmaker 1", coefficient: "2.00"})},
                });

                expect(wrapper.vm.button).toEqual({title: "Bookmaker 1", text: "2.00", func: wrapper.vm.makeBet});
            });

            it("selector-item-mode = info", () => {
                mountWrapper({computed: {selectorItemMode: () => "info", infoBookies: () => "some info"}});

                expect(wrapper.vm.button).toEqual({text: "some info"});
            });

        });

    });

    describe("Testing methods", () => {

        it("makeBet", async () => {
            mountWrapper({computed: {bets: () => ({current: new Array(5)})}, methods: ["_changeCurrentBetSlip", "changeClass"]});

            wrapper.vm.makeBet();

            expect(wrapper.vm._changeCurrentBetSlip).toBeCalled();
            await expectAsyncFunctionCalled(wrapper, "changeClass", 5);
        });

        it("changeClass", async () => {
            mountWrapper({computed: {bets: () => ({current: new Array(5)})}, data: {classes: {selected: true}}});

            expect(wrapper.vm.classes.selected).toBeTruthy();

            wrapper.vm.changeClass(4);

            expect(wrapper.vm.classes.selected).toBeFalsy();
        });

        it("doFunction", async () => {
            mountWrapper();
            let stubFunction = jest.fn();

            wrapper.vm.doFunction(stubFunction);

            expect(stubFunction).toBeCalled();
        });

    });

    describe("Testing hooks", () => {

        describe("created", () => {

            it("correct triggering of event: updateAllSelectorItems.class[selected]", () => {
                mountWrapper({data: {classes: {selected: true}}});

                expect(wrapper.vm.classes.selected).toBeTruthy();

                wrapper.vm.$root.$emit("updateAllSelectorItems.class[selected]");

                expect(wrapper.vm.classes.selected).toBeFalsy();
            });

        })

    });

});
