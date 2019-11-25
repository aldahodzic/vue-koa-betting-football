import { shallowMount } from "@vue/test-utils";
import _ from "lodash";
import * as _data from "./fakeData";

import _Cookies from "./mocks/cookies";
import _Axios from "./mocks/axios";

export const Cookies = _Cookies;
export const Axios = _Axios;

export const createWrapper = (component, _options = {}) => {
  const options = mergeObjectsDeep(_options);

  // eslint-disable-next-line max-len
  const { computed, methods, stubs, data, props, methodsInHooks } = cutFromOptions(options, ["computed", "methods", "stubs", "data", "props", "methodsInHooks"]);

  // adapting computed properties for vue-test-utils structure
  for (const computedProperty in computed) {
    const computedPropertyValue = computed[computedProperty];
    computed[computedProperty] = () => computedPropertyValue;
  }

  // cut hooks, for manual testing
  const _component = _.cloneDeep(component);
  const _hookNames = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed"];
  const hooks = cutFromOptions(_component, _hookNames);

  // stub methods in hooks, can not set them to jest.fn()
  const _methodsInHooks = methodsInHooks.reduce((stubbedMethods, method) => ({ ...stubbedMethods, [method]: () => null }), {});

  const wrapper = shallowMount(component, {
    data: () => data,
    propsData: props,
    computed,
    methods: {
      $t: message => {
        if (!message) return "";
        const clearMessage = message.replace(/\{+/, "").replace(/\}+/, "");
        return `{{ $t('${clearMessage}') }}`;
      },
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

  const mockMethods = {};
  methods.forEach(methodName => mockMethods[methodName] = jest.fn());
  wrapper.setMethods(mockMethods);

  // special method to call hooks manually
  wrapper.callHook = name => hooks[name].call(wrapper.vm);

  return wrapper;
};

export const disableFile = () => {
  if (process.env.APP_TEST_ALL_FILES) return;
  describe.only("Bypass this test file", () => {});
};

export const cutFromOptions = (options, props) => {
  const cutProperties = {};
  const defaultArray = ["methods", "stubs", "methodsInHooks"];
  const defaultObject = ["computed", "data", "props"];

  props.forEach(prop => {
    cutProperties[prop] = options[prop];
    delete options[prop];
  });

  for (const property in cutProperties) {
    const propertyValue = cutProperties[property];
    if (!propertyValue && defaultArray.includes(property)) cutProperties[property] = [];
    if (!propertyValue && defaultObject.includes(property)) cutProperties[property] = {};
  }

  return cutProperties;
};

export const mapProperties = (...properties) => {
  return properties.reduce((result, property) => {
    const stub = _.last(properties) === true ? true : `{{ ${property} }}`;
    return {
      ...result,
      [property]: stub,
    };
  }, {});
};

export const DATA = _data;

export const changeDataToRenderableMode = (_data) => {
  const modifiedData = {};
  const data = _.cloneDeep(_data);

  _.each(data, (value, key) => {
    if (_.isObject(value) || _.isArray(value)) {
      modifiedData[key] = changeDataToRenderableMode(value);

      const toString = function () { return JSON.stringify(this); };
      Object.defineProperty(modifiedData[key], "toString", {
        enumerable: false,
        value: toString.bind(modifiedData[key]),
      });
    }
    else modifiedData[key] = `{{ ${value.toString()} }}`;
  });

  return modifiedData;
};

export const stateConstructor = (state = {}, customState = {}) => {
  return mergeObjectsDeep(state, customState);
};

export const storeConstructor = (state, customStore = {}) => {
  const store = mergeObjectsDeep({ state }, customStore);

  store.commit = jest.fn();
  store.dispatch = jest.fn();

  return store;
};

function mergeObjectsDeep (...objects) {
  const mergedObjects = _.merge(...objects);
  const flattenObject = {};

  function setPlainPath (object, path) {
    for (const field in object) {
      const value = object[field];

      // if data in renderable mode push to result immediately
      const descriptor = giveClass(value) == "object" && Object.getOwnPropertyDescriptor(value, "toString");
      if (descriptor) {
        flattenObject[`${path}.${field}`] = value;
        continue;
      }

      if (giveClass(value) !== "object" || (_.isPlainObject(value) && _.size(value) == 0)) {
        flattenObject[`${path}.${field}`] = value;
      }
      else setPlainPath(value, `${path}.${field}`);
    }
  }
  setPlainPath(mergedObjects, "");

  // remove . from begin
  for (const field in flattenObject) {
    const _field = field.slice(1);
    flattenObject[_field] = flattenObject[field];
    delete flattenObject[field];
  }

  // rewriting all properties
  const resultObject = {};
  for (const field in flattenObject) {
    _.set(resultObject, field, flattenObject[field]);
  }

  return resultObject;
}

function giveClass (object) {
  return Object.prototype.toString.call(object).slice(8, -1).toLowerCase();
}
