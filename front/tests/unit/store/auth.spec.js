import { getters, mutations, actions } from "@/store/auth";
import { Cookies, disableFile, stateConstructor, storeConstructor } from "../__utils__";

disableFile();

jest.mock("@/plugins/cookies", () => require("../__utils__/mocks/cookies"));
jest.mock("@/plugins/axios", () => require("../__utils__/mocks/axios"));

describe("Testing store/auth", () => {
  let state, store;
  function mergeState (newState) {
    state = stateConstructor({
      "user.logout": false,
    }, newState);
  }
  function createStore (customFields) {
    store = storeConstructor(state, customFields);
  }

  beforeEach(() => {
    Cookies.reset();
  });

  describe("Testing getters", () => {
    describe("user", () => {
      it("user is authorized", () => {
        mergeState();
        Cookies.set("auth", "authToken");

        const user = getters.user(state);

        expect(user).toEqual({ auth: true, logout: false });
      });

      it("user is unauthorized", () => {
        mergeState();
        Cookies.set("auth", "guest");

        const user = getters.user(state);

        expect(user).toEqual({ auth: false, logout: false });
      });

      it("user is logged out", () => {
        mergeState({
          "user.logout": true,
        });

        const user = getters.user(state);

        expect(user).toEqual({ auth: false, logout: true });
      });
    });
  });

  describe("Testing mutations", () => {
    it("setUserAuthStatus", () => {
      mergeState({
        "user.logout": "status 1",
      });

      mutations.setUserAuthStatus(state, "status 2");

      expect(state.user.auth).toBe("status 2");
    });

    it("setUserLogout", () => {
      mergeState({
        "user.logout": "status 1",
      });

      mutations.setUserLogout(state, "status 2");

      expect(state.user.logout).toBe("status 2");
    });
  });

  describe("Testing actions", () => {
    describe("userAuthAction", () => {
      it("userAuthAction successful", async () => {
        createStore();

        await actions.userAuthAction(store, { url: "authorizedUser" });

        expect(store.commit).toHaveBeenCalledTimes(2);
        expect(store.commit.mock.calls[0]).toEqual(["setUserAuthStatus", true]);
        expect(store.commit.mock.calls[1]).toEqual(["setUserLogout", false]);
      });

      it("userAuthAction failed", async () => {
        createStore();

        await actions.userAuthAction(store, { url: "unauthorizedUser" });

        expect(store.commit).toHaveBeenCalledTimes(2);
        expect(store.commit.mock.calls[0]).toEqual(["setUserAuthStatus", false]);
        expect(store.commit.mock.calls[1]).toEqual(["setUserLogout", false]);
      });
    });
  });
});
