import {createWrapper, disableFile} from "../__utils__";
import Component from "@/App.vue";

disableFile();

describe("layout/App.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-header", "router-view"],
            ...options
        });
    };

    it("Testing snapshot", () => {
        mountWrapper();

        expect(wrapper.element).toMatchSnapshot();
    });

});
