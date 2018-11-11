import {createWrapper, disableFile} from "../__utils__";
import Component from "@/App.vue";

disableFile();

describe("App.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-header", "router-view"],
            ...options
        });
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

    });

});
