import {createWrapper, disableFile, cutFromOptions, mapProperties} from "../__utils__";
import Component from "@/views/Authentication.vue";

disableFile();

describe("views/Authentication.vue", () => {

    let wrapper, authorization, button, validatingInput;
    let mountWrapper = (options = {}) => {
        let {data, computed} = cutFromOptions(options, ["computed", "data"]);
        wrapper = createWrapper(Component, {
            stubs: ["app-validating-input"],
            data: {
                ...data,
                // in some stub-fields do not exist pattern
                ...mergedDataFields(data.fields),
            },
            computed: {
                "user.auth": false,
                ...computed,
            },
            ...options,
        });
        authorization = wrapper.find("h2:nth-of-type(1)");
        button = wrapper.find("#submit");
        validatingInput = wrapper.find("app-validating-input-stub:nth-of-type(1)");

        function mergedDataFields(fields) {
            if(!fields) return {};
            fields.forEach(field => {
                if(!field.pattern) field.pattern = /.+/;
            });
            return {fields};
        }
    };

    it("Testing snapshot", () => {
        mountWrapper({
            computed: mapProperties("currentMode", "buttonValue", "disabled", "buttonTitle"),
        });

        expect(wrapper.element).toMatchSnapshot();
    });

    describe("Testing triggering methods", () => {

        it("changeMode", () => {
            mountWrapper({
                methods: ["changeMode"],
            });

            authorization.trigger("click");

            expect(wrapper.vm.changeMode).toBeCalledWith("authorization");
        });

        it("onNewInputValue", () => {
            mountWrapper({
                methods: ["onNewInputValue"],
            });

            validatingInput.vm.$emit("new-value", "new value string");

            expect(wrapper.vm.onNewInputValue).toBeCalledWith(wrapper.vm.fields[0], "new value string");
        });

        describe("send", () => {

            it("Disabled button", () => {
                mountWrapper({
                    methods: ["send"],
                });

                button.trigger("click");

                expect(wrapper.vm.send).not.toBeCalled();
            });

            it("Correct triggering", () => {
                mountWrapper({
                    computed: {
                        dataValid: true,
                        dataFilled: true
                    },
                    methods: ["send"],
                });

                button.trigger("click");

                expect(wrapper.vm.send).toBeCalled();
            });

        });

    });

    describe("Computed properties", () => {

        describe("dataValid", () => {

            it("dataValid = true", () => {
                mountWrapper({
                    data: {
                        fields: [{pattern: /^[a-z]+$/, value: "az"}],
                    },
                });

                expect(wrapper.vm.dataValid).toBeTruthy();
            });

            it("dataValid = false", () => {
                mountWrapper({
                    data: {
                        fields: [{pattern: /^[a-z]+$/, value: "az22"}],
                    },
                });

                expect(wrapper.vm.dataValid).toBeFalsy();
            });

        });

        describe("dataFilled", () => {

            it("dataFilled = true", () => {
                mountWrapper({
                    data: {
                        fields: [{value: "az"}, {value: 1}],
                    },
                });

                expect(wrapper.vm.dataFilled).toBeTruthy();
            });

            it("dataFilled = false", () => {
                mountWrapper({
                    data: {
                        fields: [{value: ""}, {value: 1}],
                    },
                });

                expect(wrapper.vm.dataFilled).toBeFalsy();
            });

        });

        describe("buttonTitle", () => {

            it("buttonTitle = fill.data", () => {
                mountWrapper({
                    computed: {
                        dataFilled: false,
                    },
                });

                expect(wrapper.vm.buttonTitle).toBe("fill.data");
            });

            it("buttonTitle = move.mouse.sign", () => {
                mountWrapper({
                    computed: {
                        dataFilled: true,
                        dataValid: false,
                    },
                });

                expect(wrapper.vm.buttonTitle).toBe("move.mouse.sign");
            });

            it("buttonTitle is empty", () => {
                mountWrapper({
                    computed: {
                        dataFilled: true,
                        dataValid: true,
                    },
                });

                expect(wrapper.vm.buttonTitle).toBeFalsy();
            });

        });

        it("currentMode", () => {
            mountWrapper({
                data: {
                    authTypes: [{className: "active", mode: "mode 1"}, {className: "", mode: "mode 2"}],
                },
            });

            expect(wrapper.vm.currentMode).toBe("mode 1");
        });

        describe("buttonValue", () => {

            it("buttonValue = SignIn", () => {
                mountWrapper({
                    computed: {
                        currentMode: "authorization",
                    },
                });

                expect(wrapper.vm.buttonValue).toBe("SignIn");
            });

            it("buttonValue = SignUp", () => {
                mountWrapper({
                    computed: {
                        currentMode: "registration",
                    },
                });

                expect(wrapper.vm.buttonValue).toBe("SignUp");
            });

        });

        describe("disableButton", () => {

            it("disableButton = false", () => {
                mountWrapper({
                    computed: {
                        dataFilled: true,
                        dataValid: true,
                    },
                });

                expect(wrapper.vm.disableButton).toBeFalsy();
            });

            it("disableButton = true", () => {
                mountWrapper({
                    computed: {
                        dataFilled: false,
                        dataValid: false,
                    },
                });

                expect(wrapper.vm.disableButton).toBeTruthy();
            });

        });

    });

    describe("Testing methods", () => {

        it("send", async () => {
            let login = "userLogin";
            let password = "userPassword";
            mountWrapper({
                data: {
                    fields: [{title: "login", value: login}, {title: "password", value: password}],
                },
                computed: {
                    currentMode: "authorization",
                },
                methods: ["_userAuthAction", "checkUserAuth"],
            });

            wrapper.vm.send();
            await wrapper.vm.$nextTick();

            expect(wrapper.vm._userAuthAction).toBeCalledWith({url: "authorization", userData: {login, password}});
            expect(wrapper.vm.checkUserAuth).toBeCalled();
        });

        describe("userAuthResult", () => {

            it("userAuthResult = not redirecting", () => {
                mountWrapper({
                    computed: {
                        "user.auth": false,
                    },
                });

                wrapper.vm.checkUserAuth();

                expect(wrapper.vm.$router.replace).not.toBeCalled();
            });

            it("userAuthResult = redirecting", () => {
                mountWrapper({
                    computed: {
                        "user.auth": true,
                    },
                });

                wrapper.vm.checkUserAuth();

                expect(wrapper.vm.$router.replace).toBeCalledWith("matches");
            });

        });

        it("changeMode", () => {
            mountWrapper({
                data: {
                    authTypes: [{mode: "mode 1", className: "active"}, {mode: "mode 2", className: ""}],
                },
            });

            wrapper.vm.changeMode("mode 2");

            expect(wrapper.vm.authTypes.find(({mode}) => mode == "mode 1").className).toBe("");
            expect(wrapper.vm.authTypes.find(({mode}) => mode == "mode 2").className).toBe("active");
        });

        it("onNewInputValue", () => {
            mountWrapper();
            let input = {value: "some value 1"};

            wrapper.vm.onNewInputValue(input, "some value 2");

            expect(input.value).toBe("some value 2");
        });

    });

    describe("Testing hooks", () => {

        it("created", () => {
            mountWrapper({
                methods: ["checkUserAuth"],
            });

            wrapper.callHook("created");

            expect(wrapper.vm.checkUserAuth).toBeCalled();
        });

    });

});