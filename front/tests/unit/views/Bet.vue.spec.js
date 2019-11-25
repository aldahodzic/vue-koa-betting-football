import { createWrapper, disableFile, cutFromOptions, DATA, mapProperties, changeDataToRenderableMode } from "../__utils__";
import Component from "@/views/Bet.vue";

disableFile();

describe("views/Bet.vue", () => {
  let wrapper, previous;
  const mountWrapper = (options = {}) => {
    const { computed, stubs } = cutFromOptions(options, ["computed", "stubs"]);
    wrapper = createWrapper(Component, {
      stubs: ["app-bet-menu", "app-bet-selector", ...stubs],
      computed: {
        "user.auth": true,
        waitingBets: [],
        resultBets: [],
        selector: {},
        load: {},
        ...computed,
      },
      methodsInHooks: ["_getResults"],
      ...options,
    });
    previous = wrapper.find("#get-previous");
  };

  it("Testing snapshot", () => {
    mountWrapper({
      stubs: ["bet-slip-component-test-name"],
      computed: {
        show: mapProperties("noneBets", "bets", "loadPrevious", "loading", "selector", true),
        ...mapProperties("emptyBetsText"),
        betSlipComponent: "bet-slip-component-test-name",
        bets: changeDataToRenderableMode(DATA.bets),
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  describe("Testing triggering methods", () => {
    it("getAllBets", () => {
      mountWrapper({
        methods: ["getAllBets"],
        computed: {
          "show.loadPrevious": true,
        },
      });

      previous.trigger("click");

      expect(wrapper.vm.getAllBets).toBeCalled();
    });
  });

  describe("Testing computed properties", () => {
    describe("show", () => {
      const makeIt = (showProp, showValue, { selector = {}, load = {}, emptyBets }) => {
        it(`show.${showProp} = ${showValue}`, () => {
          mountWrapper({ computed: { selector, emptyBets, load } });

          expect(wrapper.vm.show[showProp]).toBe(showValue);
        });
      };

      describe("show.noneBets", () => {
        // result
        makeIt("noneBets", true, { emptyBets: true, selector: { type: "results" }, load: { ready: true } });
        makeIt("noneBets", false, { emptyBets: false, selector: { type: "results" }, load: { ready: true } });
        makeIt("noneBets", false, { emptyBets: true, selector: { type: "!results" }, load: { ready: true } });
        makeIt("noneBets", false, { emptyBets: true, selector: { type: "results" }, load: { ready: false } });

        // waiting
        makeIt("noneBets", true, { emptyBets: true, selector: { type: "waiting" } });
        makeIt("noneBets", false, { emptyBets: true, selector: { type: "!waiting" } });
        makeIt("noneBets", false, { emptyBets: false, selector: { type: "waiting" } });
      });

      describe("show.bets", () => {
        // result
        makeIt("bets", true, { emptyBets: false, selector: { type: "results" }, load: { ready: true } });
        makeIt("bets", false, { emptyBets: true, selector: { type: "results" }, load: { ready: true } });
        makeIt("bets", false, { emptyBets: false, selector: { type: "!results" }, load: { ready: true } });
        makeIt("bets", false, { emptyBets: false, selector: { type: "results" }, load: { ready: false } });

        // waiting
        makeIt("bets", true, { emptyBets: false, selector: { type: "waiting" } });
        makeIt("bets", false, { emptyBets: true, selector: { type: "waiting" } });
        makeIt("bets", false, { emptyBets: false, selector: { type: "!waiting" } });
      });

      describe("show.loadPrevious", () => {
        makeIt("loadPrevious", true, { selector: { type: "results" }, load: { ready: true, previous: true } });
        makeIt("loadPrevious", false, { selector: { type: "!results" }, load: { ready: true, previous: true } });
        makeIt("loadPrevious", false, { selector: { type: "results" }, load: { ready: false, previous: true } });
        makeIt("loadPrevious", false, { selector: { type: "results" }, load: { ready: true, previous: false } });
      });

      describe("show.loading", () => {
        makeIt("loading", true, { selector: { type: "results" }, load: { status: "loading" } });
        makeIt("loading", false, { selector: { type: "!results" }, load: { status: "loading" } });
        makeIt("loading", false, { selector: { type: "results" }, load: { status: "!loading" } });
      });

      describe("show.selector", () => {
        makeIt("selector", true, { selector: { type: "results" }, load: { ready: true } });
        makeIt("selector", false, { selector: { type: "!results" }, load: { ready: true } });
        makeIt("selector", false, { selector: { type: "results" }, load: { ready: false } });
      });
    });

    describe("betSlipComponent", () => {
      it("betSlipComponent = app-waiting-bet-slip", () => {
        mountWrapper({
          computed: {
            "selector.type": "waiting",
          },
        });

        expect(wrapper.vm.betSlipComponent).toBe("app-waiting-bet-slip");
      });

      it("betSlipComponent = app-result-bet-slip", () => {
        mountWrapper({
          computed: {
            "selector.type": "result",
          },
        });

        expect(wrapper.vm.betSlipComponent).toBe("app-result-bet-slip");
      });
    });

    describe("bets", () => {
      it("bets type = waiting", () => {
        mountWrapper({
          computed: {
            "selector.type": "waiting",
            waitingBets: ["waiting"],
          },
        });

        expect(wrapper.vm.bets).toEqual(["waiting"]);
      });

      it("bets type = result", () => {
        mountWrapper({
          computed: {
            "selector.type": "result",
            resultBets: ["results"],
          },
        });

        expect(wrapper.vm.bets).toEqual(["results"]);
      });
    });

    describe("emptyBets", () => {
      it("emptyBets = true", () => {
        mountWrapper({
          computed: {
            bets: [],
          },
        });

        expect(wrapper.vm.emptyBets).toBeTruthy();
      });

      it("emptyBets = false", () => {
        mountWrapper({
          computed: {
            bets: new Array(3),
          },
        });

        expect(wrapper.vm.emptyBets).toBeFalsy();
      });
    });

    describe("emptyBetsText", () => {
      const makeIt = (value, selector = {}) => {
        it(`emptyBetsText = ${value}`, () => {
          mountWrapper({ computed: { selector, emptyBets: true } });

          expect(wrapper.vm.emptyBetsText).toBe(value);
        });
      };

      makeIt("not.made.bets", { type: "waiting" });
      makeIt("not.made.bets", { type: "results", filter: "all" });
      makeIt("not.have.bets.filter-value", { filter: "filter-value" });
    });
  });

  describe("Testing methods", () => {
    it("getAllBets", () => {
      mountWrapper({
        methods: ["_changeLoad", "_getResults"],
      });

      wrapper.vm.getAllBets();

      expect(wrapper.vm._changeLoad).toBeCalledWith({ field: "previous", value: false });
      expect(wrapper.vm._getResults).toBeCalledWith({ force: true, created: "all" });
    });
  });

  describe("Testing hooks", () => {
    describe("created", async () => {
      it("user authorized => get results", () => {
        mountWrapper({
          methods: ["_getResults"],
          computed: {
            "user.auth": true,
          },
        });

        wrapper.callHook("created");

        expect(wrapper.vm._getResults).toBeCalledWith({ created: "last" });
      });

      it("user not authorized => redirect to matches", () => {
        mountWrapper({
          computed: {
            "user.auth": false,
          },
        });

        wrapper.callHook("created");

        expect(wrapper.vm.$router.replace).toBeCalledWith("matches");
      });
    });

    it("beforeDestroy", () => {
      mountWrapper({
        methods: ["_resetSelector"],
      });

      wrapper.callHook("beforeDestroy");

      expect(wrapper.vm._resetSelector).toBeCalled();
    });
  });
});
