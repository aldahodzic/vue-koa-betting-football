import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../../__utils__";
import Component from "@/components/bet/betSlip/types/Result";

disableFile();

describe("bet/ResultBetSlip.vue", () => {

    let wrapper, info, result;
    let mountWrapper = (options = {}) => {
        let {props} = cutFromOptions(options, ["props"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-bet-slip-info"],
            props: {
                totalCoefficient: 10,
                totalSum: 20,
                outcomeSum: 200,
                ...props,
            },
            ...options,
        });
        info = wrapper.find(".info");
        result = wrapper.find(".result");
    };

    it("Testing snapshot", () => {
        mountWrapper({
            props: mapProperties("bets", "betSlipIndex", "createdDate", "rate"),
            data: mapProperties("showInfo", true),
            computed: mapProperties("betSlipClass", "totalCoefficientTmpl", "betSlipResultText", "betSlipResultSum"),
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("toggleShowInfo", () => {
            mountWrapper({
                methods: ["toggleShowInfo"],
            });

            result.trigger("click");

            expect(wrapper.vm.toggleShowInfo).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        it("totalCoefficientTmpl", () => {
            mountWrapper({
                props: {
                    totalCoefficient: 9.23674,
                },
            });

            expect(wrapper.vm.totalCoefficientTmpl).toBe("9.237");
        });

        it("totalSumTmpl", () => {
            mountWrapper({
                props: {
                    totalSum: 125.1,
                },
            });

            expect(wrapper.vm.totalSumTmpl).toBe("125.10");
        });

        describe("betSlipResultText", () => {

            let makeIt = (outcome, result) => {
                it(`betSlipResultText = ${result}`, () => {
                    mountWrapper({props: {outcome}});

                    expect(wrapper.vm.betSlipResultText).toBe(result);
                });
            };

            makeIt("waiting", "sum.potential");
            makeIt("win", "Profit");
            makeIt("lose", "sum.lost");

        });

        it("betSlipResultSum", () => {
            mountWrapper({
                props: {
                    outcomeSum: 53.122,
                },
            });

            expect(wrapper.vm.betSlipResultSum).toBe("53.12");
        });

        it("betSlipClass", () => {
            mountWrapper({
                props: {
                    outcome: "classType",
                },
            });

            expect(wrapper.vm.betSlipClass).toBe("bet-slip-classType");
        });

    });

    describe("Testing methods", () => {

        it("toggleShowInfo", () => {
            mountWrapper({
                data: {
                    showInfo: false,
                },
            });

            wrapper.vm.toggleShowInfo();

            expect(wrapper.vm.showInfo).toBeTruthy();
        });

    });

    describe("Testing hooks", () => {

        it("created", () => {
            mountWrapper({
                data: {
                    showInfo: false,
                },
            });

            wrapper.vm.$root.$emit("changeBetSlipInfoVisibility", "visibility status");

            expect(wrapper.vm.showInfo).toBe("visibility status");
        });

    });

});
