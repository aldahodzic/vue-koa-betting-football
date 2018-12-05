import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../../__utils__";
import Component from "@/components/bet/Menu";

disableFile();

describe("bet/Menu.vue", () => {

    let wrapper, menuItemSample, lastBets;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            computed: {
                load: {},
                ...computed,
            },
            ...options,
        });
        menuItemSample = wrapper.find("span:nth-of-type(1)");
        lastBets = wrapper.find(".get-last-bets");
    };

    it("Testing snapshot", () => {
        mountWrapper({
            computed: mapProperties("buttonLoadResultsClass"),
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("selectLeague", () => {
            mountWrapper({
                methods: ["changeMenu"],
            });

            menuItemSample.trigger("click");

            expect(wrapper.vm.changeMenu).toBeCalledWith(wrapper.vm.menu[0]);
        });

        it("selectLeague", () => {
            mountWrapper({
                methods: ["getLastBets"],
            });

            lastBets.trigger("click");

            expect(wrapper.vm.getLastBets).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        describe("buttonLoadResultsClass", () => {

            it("buttonLoadResultsClass = enabled", () => {
                mountWrapper({
                    computed: {
                        "load.status": "wait",
                    },
                });

                expect(wrapper.vm.buttonLoadResultsClass).toBe("");
            });

            it("buttonLoadResultsClass = disabled", () => {
                mountWrapper({
                    computed: {
                        "load.status": "loading",
                    },
                });

                expect(wrapper.vm.buttonLoadResultsClass).toBe("disabled");
            });

        });

    });

    describe("Testing methods", () => {

        it("changeMenu", () => {
            mountWrapper({
                data: {
                    menu: [{classes: "selected", type: "type 1"}, {classes: "", type: "type 2"}],
                },
                methods: ["_changeSelector"],
            });

            wrapper.vm.changeMenu({type: "type 2"});

            expect(wrapper.vm.menu[0].classes).toBe("");
            expect(wrapper.vm.menu[1].classes).toBe("selected");
            expect(wrapper.vm._changeSelector).toBeCalledWith({field: "type", value: "type 2"});
        });

        it("getLastBets", () => {
            mountWrapper({
                methods: ["_getResults"],
            });

            wrapper.vm.getLastBets();

            expect(wrapper.vm._getResults).toBeCalledWith({force: true, created: "last"});
        });

    });

});
