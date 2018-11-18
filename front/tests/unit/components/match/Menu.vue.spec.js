import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../../__utils__";
import Component from "@/components/match/Menu";

// disableFile();

describe("match/Menu.vue", () => {

    let wrapper, leagueSample;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            computed: {
                leagueList: [],
                selectedLeagues: [],
                ...computed
            },
            ...options,
        });
        leagueSample = wrapper.find("li:nth-of-type(1)");
    };

    it("Testing snapshot", () => {
        mountWrapper({
            computed: {
                leagues: [mapProperties("name", "className"), mapProperties("name", "className")],
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("selectLeague", () => {
            mountWrapper({
                computed: {
                    leagues: [{name: "League 1", className: "selected"}],
                },
                methods: ["selectLeague"],
            });

            leagueSample.trigger("click");

            expect(wrapper.vm.selectLeague).toBeCalledWith({name: "League 1", className: "selected"});
        });

    });

    describe("Testing computed properties", () => {

        it("leagues", () => {
            mountWrapper({
                computed: {
                    leagueList: ["League 1", "League 2"],
                    selectedLeagues: ["League 2"],
                },
            });

            expect(wrapper.vm.leagues).toEqual([{name: "League 1", className: ""}, {name: "League 2", className: "selected"}]);
        });

    });

    describe("Testing methods", () => {

        it("selectLeague", () => {
            mountWrapper({
                methods: ["_selectLeague"],
            });

            wrapper.vm.selectLeague({name: "League Name"});

            expect(wrapper.vm._selectLeague).toBeCalledWith("League Name");
        });

    });

});
