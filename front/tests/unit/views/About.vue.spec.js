import {createWrapper, disableFile} from "../__utils__";
import Component from "@/views/About.vue";

disableFile();

describe("views/About.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, options);
    };

    it("Testing snapshot", () => {
        mountWrapper({
            computed: {
                leagueList: ["League 1", "League 2", "League 3"],
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

});
