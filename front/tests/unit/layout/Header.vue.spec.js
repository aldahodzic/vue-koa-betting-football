import {createWrapper, disableFile, expectAsyncFunctionCalled} from "../__utils__";
import Component from "@/components/layout/Header";

disableFile();

describe("Header.vue", () => {

    let wrapper, authNav, notAuthNav, setEnLanguage, logout;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-validating-input"],
            ...options,
        });
        authNav = wrapper.find("#auth");
        notAuthNav = wrapper.find("#not-auth");
        setEnLanguage = wrapper.find(".change-language:nth-of-type(1)");
        logout = wrapper.find("#logout");
    };

    describe("Testing snapshots", () => {

        it("User authorized", () => {
            mountWrapper({computed: {user: () => ({auth: true})}});

            expect(authNav.element).toMatchSnapshot();
        });

        it("User not authorized", () => {
            mountWrapper({computed: {user: () => ({auth: false})}});

            expect(notAuthNav.element).toMatchSnapshot();
        });

    });

    describe("Testing triggering methods", () => {

        it("setLanguage", () => {
            mountWrapper({methods: ["setLanguage"]});

            setEnLanguage.trigger("click");

            expect(wrapper.vm.setLanguage).toBeCalledWith("en");
        });

        it("userLogout", () => {
            mountWrapper({methods: ["userLogout"]});

            logout.trigger("click");

            expect(wrapper.vm.userLogout).toBeCalled();
        });

    });

    describe("Testing methods", () => {

        it("userLogout", async () => {
            mountWrapper({methods: ["_userLogout"]});

            wrapper.vm.userLogout();

            expect(wrapper.vm._userLogout).toBeCalled();
            expectAsyncFunctionCalled(wrapper, "$router.replace", "matches");
        });

        it("setLanguage", () => {
            mountWrapper();

            wrapper.vm.setLanguage("en");

            expect(document.documentElement.lang).toBe("en");
            expect(localStorage.getItem("language")).toBe("en");
            expect(wrapper.vm.$i18n.locale).toBe("en");
        });

    });

    describe("Testing hooks", () => {

    });

});