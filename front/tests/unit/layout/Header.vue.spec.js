import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../__utils__";
import Component from "@/components/layout/Header";

disableFile();

describe("layout/Header.vue", () => {

    let wrapper, setEnLanguage, logout;
    let mountWrapper = (options = {}) => {
        let {computed} = cutFromOptions(options, ["computed"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-validating-input"],
            computed: {
                "user.auth": true,
                ...computed,
            },
            ...options,
        });
        setEnLanguage = wrapper.find(".change-language:nth-of-type(1)");
        logout = wrapper.find("#logout");
    };

    it("Testing snapshot", () => {
            mountWrapper({
                computed: {
                    show: mapProperties("authorized", "unauthorized", true),
                },
            });

            expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("setLanguage", () => {
            mountWrapper({
                methods: ["setLanguage"],
            });

            setEnLanguage.trigger("click");

            expect(wrapper.vm.setLanguage).toBeCalledWith("en");
        });

        it("userLogout", () => {
            mountWrapper({
                methods: ["userLogout"],
            });

            logout.trigger("click");

            expect(wrapper.vm.userLogout).toBeCalled();
        });

    });

    describe("Testing computed properties", () => {

        describe("show", () => {

            it("show when user authorized", () => {
                mountWrapper({
                    computed: {
                        "user.auth": true,
                    },
                });

                expect(wrapper.vm.show).toEqual({authorized: true, unauthorized: false});
            });

            it("show when user unauthorized", () => {
                mountWrapper({
                    computed: {
                        "user.auth": false,
                    },
                });

                expect(wrapper.vm.show).toEqual({authorized: false, unauthorized: true});
            });

        });

    });

    describe("Testing methods", () => {

        it("userLogout", async () => {
            mountWrapper({
                methods: ["_userLogout"],
            });

            wrapper.vm.userLogout();
            await wrapper.vm.$nextTick();

            expect(wrapper.vm._userLogout).toBeCalled();
            expect(wrapper.vm.$router.replace).toBeCalledWith("matches");
        });

        it("setLanguage", () => {
            mountWrapper({
                methods: ["$setLanguage"],
            });

            wrapper.vm.setLanguage("en");

            expect(wrapper.vm.$setLanguage).toBeCalledWith("en");
        });

    });

});