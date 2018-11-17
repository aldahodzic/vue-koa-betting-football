import {createWrapper, disableFile, cutFromOptions} from "../../__utils__";
import Component from "@/components/bet/Selector";

disableFile();

describe("bet/Selector.vue", () => {

    let wrapper, outcomeSumOption, sortSelect, sortSelectOptions, arrowButton, filterSelect, filterSelectOptions, hideButton, showButton;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            computed: {
                selector: () => ({}),
                ...computed
            },
            ...options,
        });
        sortSelect = wrapper.find("#sort");
        sortSelectOptions = sortSelect.findAll("option");
        outcomeSumOption = sortSelect.find("option[value='outcomeSum']");
        arrowButton = wrapper.find("#arrows");
        filterSelect = wrapper.find("#filter");
        filterSelectOptions = filterSelect.findAll("option");
        hideButton = wrapper.find("#toogle-info-visibility > span:nth-of-type(1)");
        showButton = wrapper.find("#toogle-info-visibility > span:nth-of-type(2)");
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

        it("Show option, when show not all types of betSlip", () => {
            mountWrapper({computed: {selector: () => ({filter: "!all"})}});

            expect(outcomeSumOption.element).toMatchSnapshot();
        });

    });

    describe("Testing triggering methods", () => {

        describe("changeSelector", () => {

            it("changeSelector > sort", () => {
                mountWrapper({methods: ["changeSelector"]});

                sortSelectOptions.at(1).setSelected();

                expect(wrapper.vm.changeSelector).toBeCalledWith("sort", "rate");
            });

            it("changeSelector > direction", () => {
                mountWrapper({methods: ["changeSelector"]});

                arrowButton.trigger("click");

                expect(wrapper.vm.changeSelector).toBeCalledWith("direction");
            });

            it("changeSelector > filter", () => {
                mountWrapper({methods: ["changeSelector"]});

                filterSelectOptions.at(1).setSelected();

                expect(wrapper.vm.changeSelector).toBeCalledWith("filter", "win");
            });

        });

        describe("changeBetSlipInfoVisibility", () => {

            it("changeBetSlipInfoVisibility to hide", () => {
                mountWrapper({methods: ["changeBetSlipInfoVisibility"]});

                hideButton.trigger("click");

                expect(wrapper.vm.changeBetSlipInfoVisibility).toBeCalledWith(false);
            });

            it("changeBetSlipInfoVisibility to show", () => {
                mountWrapper({methods: ["changeBetSlipInfoVisibility"]});

                showButton.trigger("click");

                expect(wrapper.vm.changeBetSlipInfoVisibility).toBeCalledWith(true);
            });

        })

    });

    describe("Testing methods", () => {

        describe("changeSelector", () => {

            it("changeSelector for all options not direction", () => {
                mountWrapper({methods: ["_changeSelector"]});

                wrapper.vm.changeSelector("selector field", "selector value");

                expect(wrapper.vm._changeSelector).toBeCalledWith({field: "selector field", value: "selector value"});
            });

            it("changeSelector specially for direction", () => {
                mountWrapper({computed: {selector: () => ({direction: 2})}, methods: ["_changeSelector"]});

                wrapper.vm.changeSelector("direction");

                expect(wrapper.vm._changeSelector).toBeCalledWith({field: "direction", value: -2});
            });

        });

        it("changeBetSlipInfoVisibility", () => {
            mountWrapper();
            let stubFunction = jest.fn();
            wrapper.vm.$root.$on("changeBetSlipInfoVisibility", stubFunction);

            wrapper.vm.changeBetSlipInfoVisibility("visibility status");

            expect(stubFunction).toBeCalledWith("visibility status");
        });

    });

});
