import {getters, mutations, actions} from "@/store/auth";
import {Cookies, disableFile} from "../__utils__";

disableFile();

// must name mockCookies
jest.mock("@/plugins/cookies", () => require("../__utils__/mocks/cookies"));
jest.mock("@/plugins/axios", () => require("../__utils__/mocks/axios"));

describe("Testing store/auth", () => {

    let state = {};
    let defaultState = {
        user: {
            logout: false,
        },
    };
    function mergeState(newState) {
        state = Object.assign(state, newState);
    }

    let store = {};
    function createStore() {
        store = {
            state,
            commit: jest.fn(),
        };
    }

    beforeEach(() => {
        Cookies.reset();
        state = defaultState;
    });

    describe("Testing getters", () => {

        describe("user", () => {

            it("user is authorized", () => {
                Cookies.set("auth", "authToken");

                let user = getters.user(state);

                expect(user).toEqual({auth: true, logout: false});
            });

            it("user is unauthorized", () => {
                Cookies.set("auth", "guest");

                let user = getters.user(state);

                expect(user).toEqual({auth: false, logout: false});
            });

            it("user is logged out", () => {
                mergeState({
                    user: {logout: true},
                });

                let user = getters.user(state);

                expect(user).toEqual({auth: false, logout: true});
            });

        });
        
    });

    describe("Testing mutations", () => {

        it("setUserAuthStatus", () => {
            mergeState({
                user: {auth: "status 1"},
            });

            mutations.setUserAuthStatus(state, "status 2");

            expect(state.user.auth).toBe("status 2");
        });

        it("setUserLogout", () => {
            mergeState({
                user: {logout: "status 1"},
            });

            mutations.setUserLogout(state, "status 2");

            expect(state.user.logout).toBe("status 2");
        });

    });

    describe("Testing actions", () => {

        describe("userAuthAction", () => {

            it("userAuthAction successful", async () => {
                createStore();

                await actions.userAuthAction(store, {url: "authorizedUser"});

                expect(store.commit).toHaveBeenCalledTimes(2);
                expect(store.commit.mock.calls[0]).toEqual(["setUserAuthStatus", true]);
                expect(store.commit.mock.calls[1]).toEqual(["setUserLogout", false]);
            });

            it("userAuthAction failed", async () => {
                createStore();

                await actions.userAuthAction(store, {url: "unauthorizedUser"});

                expect(store.commit).toHaveBeenCalledTimes(2);
                expect(store.commit.mock.calls[0]).toEqual(["setUserAuthStatus", false]);
                expect(store.commit.mock.calls[1]).toEqual(["setUserLogout", false]);
            });

        });

    });
    
});