import {shallowMount} from "@vue/test-utils";
import _ from "lodash";
import * as _data from "./fakeData";

export const createWrapper = (component, options = {}) => {

    let {computed, methods, stubs, data, props, methodsInHooks} = cutFromOptions(options, ["computed", "methods", "stubs", "data", "props", "methodsInHooks"]);

    // adapting computed properties for vue-test-utils structure
    for(let computedProperty in computed) {
        let computedPropertyValue = computed[computedProperty];
        computed[computedProperty] = () => computedPropertyValue;
    }

    // cut hooks, for manual testing
    let _component = _.cloneDeep(component);
    let _hookNames = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed"];
    let hooks = cutFromOptions(_component, _hookNames);

    // stub methods in hooks, can not set them to jest.fn()
    let _methodsInHooks = methodsInHooks.reduce((stubbedMethods, method) => ({...stubbedMethods, [method]: () => null}), {});

    let wrapper = shallowMount(component, {
        data: () => data,
        propsData: props,
        computed,
        methods: {
            $t: message => `$t(::${message}::)`,
            ..._methodsInHooks,
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

    // special method to call hooks manually
    wrapper.callHook = name => hooks[name].call(wrapper.vm);

    return wrapper;
};

export const disableFile = () => {
    if(process.env.APP_TEST_ALL_FILES) return;
    describe.only("Bypass this test file", () => {});
};

export const cutFromOptions = (options, props) => {
    let cutProperties = {};
    let defaultArray = ["methods", "stubs", "methodsInHooks"];
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