import {shallowMount} from "@vue/test-utils";
import _ from "lodash";

export const createWrapper = (component, options = {}) => {

    let {
        computed = {},
        methods = [],
        stubs = [],
        data = {},
        props = {},
    } = options;

    let wrapper = shallowMount(component, {
        propsData: props,
        computed: {
            user: () => ({
                auth: _.at(options, "computed.user.auth")[0] || true,
            }),
            leagueList: () => ["League 1", "League 2", "League 3"],
            selectedLeagues: () => ["League 1", "League 2", "League 3"],
            matches: () => [
                {
                    "key": "League1:Home team 1-Guest team 1",
                    "home": "Home team 1",
                    "guest": "Guest team 1",
                    "league": "League1",
                    "dateTmpl": "27.10",
                    "date": 1540648800000,
                    "coefficients": {
                        "0": [{"name": "Bookmaker 1", "coefficient": 1}, {"name": "Bookmaker 2","coefficient": 1.1}, {"name": "Bookmaker 3", "coefficient": 1.1}],
                        "1": [{"name": "Bookmaker 1","coefficient": 2}, {"name": "Bookmaker 2","coefficient": 2.1}, {"name": "Bookmaker 3", "coefficient": 2.1}],
                        "2": [{"name": "Bookmaker 1","coefficient": 3}, {"name": "Bookmaker 2","coefficient": 3.1}, {"name": "Bookmaker 3", "coefficient": 3.1}]
                    },
                },
                {
                    "key": "League2:Home team 2-Guest team 2",
                    "home": "Home team 2",
                    "guest": "Guest team 2",
                    "league": "League2",
                    "dateTmpl": "28.10",
                    "date": 1540738800000,
                    "coefficients": {
                        "0": [{"name": "Bookmaker 1", "coefficient": 2}, {"name": "Bookmaker 2","coefficient": 2.2}, {"name": "Bookmaker 3", "coefficient": 2.2}],
                        "1": [{"name": "Bookmaker 1","coefficient": 3}, {"name": "Bookmaker 2","coefficient": 3.2}, {"name": "Bookmaker 3", "coefficient": 3.2}],
                        "2": [{"name": "Bookmaker 1","coefficient": 1}, {"name": "Bookmaker 2","coefficient": 1.2}, {"name": "Bookmaker 3", "coefficient": 1.2}]
                    },
                },
                {
                    "key": "League3:Home team 3-Guest team 3",
                    "home": "Home team 3",
                    "guest": "Guest team 3",
                    "league": "League3",
                    "dateTmpl": "29.10",
                    "date": 1540825200000,
                    "coefficients": {
                        "0": [{"name": "Bookmaker 1", "coefficient": 3}, {"name": "Bookmaker 2","coefficient": 3.3}, {"name": "Bookmaker 3", "coefficient": 3.3}],
                        "1": [{"name": "Bookmaker 1","coefficient": 1}, {"name": "Bookmaker 2","coefficient": 1.3}, {"name": "Bookmaker 3", "coefficient": 1.3}],
                        "2": [{"name": "Bookmaker 1","coefficient": 2}, {"name": "Bookmaker 2","coefficient": 2.3}, {"name": "Bookmaker 3", "coefficient": 2.3}]
                    },
                },
            ],
            bets: () => ({
                current: [],
                waiting: [],
                confirmed: [],
                results: [],
            }),
            ...computed,
        },
        methods: {
            $t: message => message,
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

    wrapper.setData(data);

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
