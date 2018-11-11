import {createWrapper, disableFile} from "../../__utils__";
import Component from "@/components/match/Menu";

disableFile();

describe("match/Menu.vue", () => {

    let wrapper, leagueSample;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, options);
        leagueSample = wrapper.find("li:nth-of-type(1)");
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

        it("Correct class appointment", () => {
            mountWrapper({computed: {selectedLeagues: () => ["League 2"]}});

            expect(wrapper.element).toMatchSnapshot();
        });

    });

    describe("Testing triggering methods", () => {

        it("selectLeague", () => {
            mountWrapper({methods: ["selectLeague"]});

            leagueSample.trigger("click");

            expect(wrapper.vm.selectLeague).toBeCalledWith({name: "League 1", classes: "selected"});
        });

    });


    describe("Testing computed properties", () => {

        it("leagues", () => {
            mountWrapper({computed: {leagueList: () => ["League 1", "League 2"]}});

            expect(wrapper.vm.leagues).toEqual([{name: "League 1", classes: "selected"}, {name: "League 2", classes: "selected"}]);
        });

    });

    describe("Testing methods", () => {

        it("selectLeague", () => {
            mountWrapper({methods: ["_selectLeague"]});

            wrapper.vm.selectLeague({name: "League Name"});

            expect(wrapper.vm._selectLeague).toBeCalledWith("League Name");
        });

    });

});
