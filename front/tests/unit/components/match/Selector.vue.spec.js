import {createWrapper, disableFile, cutFromOptions, DATA, mapProperties} from "../../__utils__";
import Component from "@/components/match/Actions/Selector";

disableFile();

describe("match/Selector.vue", () => {

    let wrapper, sampleHeadSpan, noneMatches;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-match-selector-item"],
            computed: {
                show: mapProperties("emptyMatches", "selector", true),
                matches: DATA.matches,
                ...computed,
            },
            ...options,
        });
        sampleHeadSpan = wrapper.find("p.head > span:nth-of-type(1)");
    };

    it("Testing snapshot", () => {
         mountWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Triggering event", () => {

        it("Triggering after click on head span", () => {
            mountWrapper({
                methods: ["sortMatches"],
            });

            sampleHeadSpan.trigger("click");

            expect(wrapper.vm.sortMatches).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        describe("show", () => {

            let makeIt = (propName, propValue, {emptySelectedMatches}) => {
                it(`show.${propName} = ${propValue}`, () => {
                    mountWrapper({computed: {emptySelectedMatches}});

                    expect(wrapper.vm.show[propName]).toBe(propValue);
                });
            };

            makeIt("emptyMatches", true, {emptySelectedMatches: true});
            makeIt("selector", true, {emptySelectedMatches: false});

        });

        describe("emptySelectedMatches", () => {

            it("emptySelectedMatches = true", () => {
                mountWrapper({
                    computed: {
                        matchesFromSelectedLeagues: [],
                    },
                });

                expect(wrapper.vm.emptySelectedMatches).toBeTruthy();
            });

            it("emptySelectedMatches = false", () => {
                mountWrapper({
                    computed: {
                        matchesFromSelectedLeagues: DATA.matches,
                    },
                });

                expect(wrapper.vm.emptySelectedMatches).toBeFalsy();
            });

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
