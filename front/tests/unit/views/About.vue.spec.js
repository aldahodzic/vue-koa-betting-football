import {createWrapper, disableFile} from "../__utils__";
import Component from "@/views/About.vue";

disableFile();

describe("About.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, options);
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

    });

});
