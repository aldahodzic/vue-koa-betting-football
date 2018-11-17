import {shallowMount} from "@vue/test-utils";
import _ from "lodash";
import * as _data from "./fakeData";

export const DATA = _data;

export const createWrapper = (component, options = {}) => {

    let {computed, methods, stubs, data, props} = cutFromOptions(options, ["computed", "methods", "stubs", "data", "props"]);

    // adapting computed properties for vue-test-utils structure
    for(let computedProperty in computed) {
        let computedPropertyValue = computed[computedProperty];
        computed[computedProperty] = () => computedPropertyValue;
    }

    let wrapper = shallowMount(component, {
        data: () => data,
        propsData: props,
        computed,
        methods: {
            $t: message => message,
            _getResults: () => null, // stub vuex method
        },
        mocks: {
            $router: {
                replace: jest.fn(),
            },
            $i18n: {
                locale: "",
            },
        },
        stubs: [
            "router-link",
            ...stubs,
        ],
    });

    let mockMethods = {};
    methods.forEach(methodName => mockMethods[methodName] = jest.fn());
    wrapper.setMethods(mockMethods);

    wrapper.callHook = name => {
        let hooks = wrapper.vm.$options[name];
        if(hooks && hooks.length > 0) {
            hooks.forEach(hook => hook.call(wrapper.vm));
        }
    };

    return wrapper;
};

export const disableFile = () => {
    if(process.env.APP_TEST_ALL_FILES) return;
    describe.only("Bypass this test file", () => {});
};

export const expectAsyncFunctionCalled = (wrapper, functionName, payload) => {
    return new Promise(async (resolve, reject) => {
        if(!wrapper) return reject(new Error("Missed argument: wrapper"));
        if(!functionName) return reject(new Error("Missed argument: functionName or function"));

        let func;
        if(typeof functionName == "function") {
            func = functionName;
        }
        else {
            func = _.at(wrapper.vm, functionName)[0];
        }

        if(!func) return reject(new Error(`Not found function: ${functionName.toString()}`));

        try {
            expect(func).not.toBeCalled();

            await wrapper.vm.$nextTick();

            if(!payload) {
                expect(func).toBeCalled();
            }
            else {
                expect(func).toBeCalledWith(payload);
            }
            resolve();
        }
        catch(e) {
            reject(e);
        }
    });
};

export const cutFromOptions = (options, props) => {

    let cutProperties = {};
    let defaultArray = ["methods", "stubs"];
    let defaultObject = ["computed", "data", "props",    "remove"];

    props.forEach(prop => {
        cutProperties[prop] = options[prop];
        delete options[prop];
    });

    for(let property in cutProperties) {
        let propertyValue = cutProperties[property];
        if(!propertyValue && defaultArray.includes(property)) cutProperties[property] = [];
        if(!propertyValue && defaultObject.includes(property)) cutProperties[property] = {};
    }

    return cutProperties;
};