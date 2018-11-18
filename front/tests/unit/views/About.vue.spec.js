import {createWrapper, disableFile, DATA} from "../__utils__";
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
                leagueList: DATA.leagueList,
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

});
