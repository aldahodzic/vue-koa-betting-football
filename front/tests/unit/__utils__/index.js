import {shallowMount} from "@vue/test-utils";
import _ from "lodash";
import * as _data from "./fakeData";

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
            $t: message => `$t(::${message}::)`,
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

export const cutFromOptions = (options, props) => {
    let cutProperties = {};
    let defaultArray = ["methods", "stubs"];
    let defaultObject = ["computed", "data", "props"];

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

export const mapProperties = (...properties) => {
    return properties.reduce((result, property) => {
        let stub = _.last(properties) === true ? true : `{{${property}}}`;
        return {
            ...result,
            [property]: stub,
        };
    }, {});
};

export const DATA = _data;

export const changeDataToRenderableMode = (_data) => {
    let modifiedData = {};
    let data = _.cloneDeep(_data);

    _.each(data, (value, key) => {
        if(_.isObject(value) || _.isArray(value)) {
            modifiedData[key] = changeDataToRenderableMode(value);

            let toString = function() {return JSON.stringify(this)};
            Object.defineProperty(modifiedData[key], "toString", {
                enumerable: false,
                value: toString.bind(modifiedData[key]),
            });
        }
        else modifiedData[key] = `{{${value.toString()}}}`;
    });

    return modifiedData;
};