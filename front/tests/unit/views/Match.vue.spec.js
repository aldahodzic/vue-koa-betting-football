import {createWrapper, disableFile} from "../__utils__";
import Component from "@/views/Match.vue";

disableFile();

describe("Match.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-match-menu", "app-match-actions"],
            ...options,
        });
    };

    describe("Testing snapshot", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

    });

});
