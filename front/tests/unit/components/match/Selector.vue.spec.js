import {createWrapper, disableFile} from "../../__utils__";
import Component from "@/components/match/Actions/Selector";

disableFile();

describe("match/Selector.vue", () => {

    let wrapper, sampleHeadSpan, noneMatches;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-match-selector-item"],
            ...options,
        });
        sampleHeadSpan = wrapper.find("p.head > span:nth-of-type(1)");
        noneMatches = wrapper.find("#none-matches");
    };

    describe("Testing snapshots", () => {

        it("None matches element", () => {
            mountWrapper({computed: {emptySelectedMatches: () => true}});

            expect(noneMatches.element).toMatchSnapshot();
        });

        it("Match-selector", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

    });

    describe("Triggering event", () => {

        it("Triggering after click on head span", () => {
            mountWrapper({methods: ["sortMatches"]});

            sampleHeadSpan.trigger("click");

            expect(wrapper.vm.sortMatches).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        it("emptySelectedMatches", () => {
            mountWrapper({computed: {matchesFromSelectedLeagues: () => []}});

            expect(wrapper.vm.emptySelectedMatches).toBeTruthy();
        });

        describe("matchesFromSelectedLeagues", () => {
            let makeIt = (type, direction, expected) => {
                it(`type=${type}, direction=${direction}`, () => {
                    mountWrapper({data: {sort: {type, direction}}});

                    expect(wrapper.vm.matchesFromSelectedLeagues[0].league).toBe(expected);
                });
            };

            makeIt("0", 1, "League3"); makeIt("0", -1, "League1");
            makeIt("1", 1, "League2"); makeIt("1", -1, "League3");
            makeIt("2", 1, "League1"); makeIt("2", -1, "League2");
            makeIt("Date", 1, "League3"); makeIt("Date", -1, "League1");
            makeIt("Teams", 1, "League3"); makeIt("Teams", -1, "League1");
        });

    });

    describe("Testing methods", () => {

        it("sortMatches", () => {
            mountWrapper();
            let customSort = {name: "sortByName", direction: 11};

            wrapper.vm.sortMatches(customSort);

            expect(wrapper.vm.sort.direction).toBe(11);
            expect(wrapper.vm.sort.type).toBe("sortByName");
            expect(customSort.direction).toBe(-11);
        });

    });

});
