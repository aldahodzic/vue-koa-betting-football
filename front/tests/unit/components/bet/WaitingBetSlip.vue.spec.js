import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../../__utils__";
import Component from "@/components/bet/betSlip/types/Waiting";

disableFile();

describe("bet/WaitingBetSlip.vue", () => {

    let wrapper, removeBetSlipButton, confirmBetSlipButton, betSlipRate;
    let mountWrapper = (options = {}) => {
        let {props} = cutFromOptions(options, ["props"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-bet-slip-info"],
            props: {
                totalCoefficient: 10,
                totalSum: 20,
                ...props,
            },
            ...options,
        });
        removeBetSlipButton = wrapper.find(".remove");
        confirmBetSlipButton = wrapper.find(".confirm");
        betSlipRate = wrapper.find(".input > input");
    };

    it("Testing snapshot", () => {
        mountWrapper({
            props: mapProperties("bets", "betSlipIndex"),
            computed: mapProperties("totalCoefficientTmpl", "totalSumTmpl", "disabledClass"),
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("deleteBetSlip", () => {
            mountWrapper({
                methods: ["deleteBetSlip"],
            });

            removeBetSlipButton.trigger("click");

            expect(wrapper.vm.deleteBetSlip).toBeCalled();
        });

        it("confirmBetSlip", () => {
            mountWrapper({
                methods: ["confirmBetSlip"],
            });

            confirmBetSlipButton.trigger("click");

            expect(wrapper.vm.confirmBetSlip).toBeCalled();
        });

        it("newRate", () => {
            mountWrapper({
                methods: ["newRate"],
            });

            betSlipRate.setValue("10");

            expect(wrapper.vm.newRate).toBeCalledWith("10");
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

        describe("disabled", () => {

            it("disable = true", () => {
                mountWrapper({
                    props: {
                        rate: -1,
                    },
                });

                expect(wrapper.vm.disabled).toBeTruthy();
            });

            it("disable = false", () => {
                mountWrapper({
                    props: {
                        rate: 1,
                    },
                });

                expect(wrapper.vm.disabled).toBeFalsy();
            });

        });

        describe("disabledClass", () => {

            it("disabledClass > exist", () => {
                mountWrapper({
                    computed: {
                        disabled: true,
                    },
                });

                expect(wrapper.vm.disabledClass).toBe("confirm-disabled");
            });

            it("disabledClass not exist", () => {
                mountWrapper({
                    computed: {
                        disabled: false,
                    },
                });

                expect(wrapper.vm.disabledClass).toBe("");
            });

        });

    });

    describe("Testing methods", () => {

        it("deleteBetSlip", () => {
            mountWrapper({
                props: {
                    betSlipIndex: 11,
                },
                methods: ["_deleteBetSlip"],
            });

            wrapper.vm.deleteBetSlip();

            expect(wrapper.vm._deleteBetSlip).toBeCalledWith({force: true, index: 11});
        });

        it("newRate", () => {
            mountWrapper({
                props: {
                    betSlipIndex: 12,
                },
                methods: ["_newRateOfBetSlip"],
            });

            wrapper.vm.newRate("100");

            expect(wrapper.vm._newRateOfBetSlip).toBeCalledWith({betSlipIndex: 12, rate: 100});
        });

        describe("confirmBetSlip", () => {

            it("_confirmBetSlip not called", () => {
                mountWrapper({
                    computed: {
                        disabled: true,
                    },
                    methods: ["_confirmBetSlip"],
                });

                wrapper.vm.confirmBetSlip();

                expect(wrapper.vm._confirmBetSlip).not.toBeCalled();
            });

            it("_confirmBetSlip was called", () => {
                mountWrapper({
                    props: {
                        betSlipIndex: 13,
                    },
                    computed: {
                        disabled: false,
                    },
                    methods: ["_confirmBetSlip"],
                });

                wrapper.vm.confirmBetSlip();

                expect(wrapper.vm._confirmBetSlip).toBeCalledWith(13);
            });

        });

    });

});
