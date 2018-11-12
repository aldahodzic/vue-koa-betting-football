import {createWrapper, disableFile} from "../../__utils__";
import Component from "@/components/authentication/ValidatingInput";

disableFile();

describe("authentication/ValidatingInput.vue", () => {

    let wrapper, icon, input;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, options);
        icon = wrapper.find(".icon");
        input = wrapper.find("input");
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper();

            expect(wrapper.element).toMatchSnapshot();
        });

        it("Icon visible", () => {
            mountWrapper({
                data: {activated: true},
                computed: {icon: () => ({className: "some-class", title: "icon title", context: "icon context"})},
            });

            expect(icon.element).toMatchSnapshot();
        });

    });

    describe("Triggering event", () => {

        it("onInput", () => {
            mountWrapper({methods: ["onInput"]});

            input.setValue("some value");
            input.trigger("input");

            expect(wrapper.vm.onInput).toBeCalledWith("some value");
        });

    });

    describe("Testing computed properties", () => {

        describe("valid", () => {

            it("valid = true", () => {
                mountWrapper({props: {pattern: /[a-z]+/, value: "az"}});

                expect(wrapper.vm.valid).toBeTruthy();
            });

            it("valid = true", () => {
                mountWrapper({props: {pattern: /[0-9]+/, value: "az"}});

                expect(wrapper.vm.valid).toBeFalsy();
            });

        });

        describe("icon", () => {

            it("icon = valid", () => {
                mountWrapper({data: {icons: {valid: "valid icon"}}, computed: {valid: () => true}});

                expect(wrapper.vm.icon).toBe("valid icon");
            });

            it("icon = failed", () => {
                mountWrapper({data: {icons: {failed: "failed icon"}}, computed: {valid: () => false}});

                expect(wrapper.vm.icon).toBe("failed icon");
            });

        });

    });

    describe("Testing methods", () => {

        it("onInput", () => {
            mountWrapper({data: {activated: false}});
            let stubFunction = jest.fn();
            wrapper.vm.$on("new-value", stubFunction);

            wrapper.vm.onInput("some value");

            expect(wrapper.vm.activated).toBeTruthy();
            expect(stubFunction).toBeCalledWith("some value");
        });

    });

    describe("Testing watch", () => {

        it("mode", () => {
            mountWrapper({data: {activated: true}});
            let stubFunction = jest.fn();
            wrapper.vm.$on("new-value", stubFunction);

            wrapper.setProps({mode: "new mode"});

            expect(stubFunction).toBeCalledWith("");
            expect(wrapper.vm.activated).toBeFalsy();
        });

    });

});