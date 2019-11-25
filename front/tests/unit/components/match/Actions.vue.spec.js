import { createWrapper, disableFile, cutFromOptions, mapProperties } from "../../__utils__";
import Component from "@/components/match/Actions";

disableFile();

describe("match/Actions.vue", () => {
  let wrapper, buttonChangeMode, confirmCurrentBetSlip, loadMatches;
  const mountWrapper = (options = {}) => {
    const { computed } = cutFromOptions(options, ["computed"]);
    wrapper = createWrapper(Component, {
      stubs: ["app-match-selector"],
      computed: {
        leagues: [],
        matches: [],
        selectedLeagues: [],
        "bets.current": [],
        ...computed,
      },
      ...options,
    });
    buttonChangeMode = wrapper.find("#change-mode");
    confirmCurrentBetSlip = wrapper.find("#confirm-current-bet-slip");
    loadMatches = wrapper.find("#load-matches");
  };

  it("Testing snapshot", () => {
    mountWrapper({
      data: mapProperties("buttonInfoText"),
      computed: {
        show: {
          ...mapProperties("info", "selector", "confirm", true),
          loading: mapProperties("active", "passive", true),
        },
        ...mapProperties("textAction"),
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  describe("Triggering event", () => {
    it("loadMatches", () => {
      mountWrapper({
        computed: {
          "show.loading.passive": true,
        },
        methods: ["loadMatches"],
      });

      loadMatches.trigger("click");

      expect(wrapper.vm.loadMatches).toBeCalled();
    });

    it("toggleSelectorItemMode", () => {
      mountWrapper({
        computed: {
          show: { "loading.passive": true, info: true },
        },
        methods: ["toggleSelectorItemMode"],
      });

      buttonChangeMode.trigger("click");

      expect(wrapper.vm.toggleSelectorItemMode).toBeCalled();
    });

    it("sendToWaitingBets", () => {
      mountWrapper({
        computed: {
          show: { "loading.passive": true, confirm: true },
        },
        methods: ["sendToWaitingBets"],
      });

      confirmCurrentBetSlip.trigger("click");

      expect(wrapper.vm.sendToWaitingBets).toBeCalled();
    });
  });

  describe("Testing computed properties", () => {
    describe("show", () => {
      const makeIt = (showProp, showValue, { loading = {}, emptyMatches, emptyCurrentBets }) => {
        it(`show.${showProp} = ${showValue}`, () => {
          mountWrapper({ data: { loading }, computed: { emptyMatches, emptyCurrentBets } });

          expect(wrapper.vm.show[showProp]).toEqual(showValue);
        });
      };

      describe("show.info", () => {
        makeIt("info", true, { emptyCurrentBets: true, emptyMatches: false });
        makeIt("info", false, { emptyCurrentBets: false, emptyMatches: false });
        makeIt("info", false, { emptyCurrentBets: true, emptyMatches: true });
      });

      describe("show.selector", () => {
        makeIt("selector", true, { loading: "end", emptyMatches: true });
        makeIt("selector", true, { loading: "wait", emptyMatches: true });
        makeIt("selector", true, { loading: "!wait && !end", emptyMatches: false });
        makeIt("selector", false, { loading: "!wait && !end", emptyMatches: true });
      });

      describe("show.loading", () => {
        makeIt("loading", { active: true, passive: false }, { loading: "processing" });
        makeIt("loading", { active: false, passive: true }, { loading: "!processing" });
      });

      describe("show.confirm", () => {
        makeIt("confirm", true, { emptyCurrentBets: false });
        makeIt("confirm", false, { emptyCurrentBets: true });
      });
    });

    describe("emptyCurrentBets", () => {
      it("emptyCurrentBets = true", () => {
        mountWrapper({
          computed: {
            "bets.current": [],
          },
        });

        expect(wrapper.vm.emptyCurrentBets).toBeTruthy();
      });

      it("emptyCurrentBets = false", () => {
        mountWrapper({
          computed: {
            "bets.current": new Array(3),
          },
        });

        expect(wrapper.vm.emptyCurrentBets).toBeFalsy();
      });
    });

    describe("emptyMatches", () => {
      it("emptyMatches = true", () => {
        mountWrapper({
          computed: {
            matches: [],
          },
        });

        expect(wrapper.vm.emptyMatches).toBeTruthy();
      });

      it("emptyMatches = false", () => {
        mountWrapper({
          computed: {
            matches: new Array(3),
          },
        });

        expect(wrapper.vm.emptyMatches).toBeFalsy();
      });
    });

    describe("textAction", () => {
      const makeIt = ({ matches, selectedLeagues, leagues, result }) => {
        // eslint-disable-next-line no-useless-escape
        it(`textAction == ${result.split(/[\._]/).slice(1).join(" -> ")}`, () => {
          mountWrapper({
            computed: {
              matches: new Array(matches),
              selectedLeagues: new Array(selectedLeagues),
              leagues: new Array(leagues),
            },
          });

          expect(wrapper.vm.textAction).toBe(result);
        });
      };

      makeIt({ matches: 0, selectedLeagues: 1, leagues: 1, result: "phrases.load.leagues_all" });
      makeIt({ matches: 1, selectedLeagues: 1, leagues: 1, result: "phrases.update.leagues_all" });
      makeIt({ matches: 0, selectedLeagues: 1, leagues: 2, result: "phrases.load.leagues_selected" });
      makeIt({ matches: 1, selectedLeagues: 1, leagues: 2, result: "phrases.update.leagues_selected" });
    });
  });

  describe("Testing methods", () => {
    it("loadMatches", async () => {
      mountWrapper({
        data: {
          loading: "wait",
        },
        methods: ["_loadMatches"],
      });

      wrapper.vm.loadMatches();

      expect(wrapper.vm.loading).toBe("processing");
      expect(wrapper.vm._loadMatches).toBeCalled();

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.loading).toBe("end");
    });

    it("toggleSelectorItemMode", async () => {
      mountWrapper({
        data: {
          buttonInfoText: "show.info.bets",
        },
        methods: ["_toggleSelectorItemMode"],
      });

      wrapper.vm.toggleSelectorItemMode();

      expect(wrapper.vm._toggleSelectorItemMode).toBeCalled();
      expect(wrapper.vm.buttonInfoText).toBe("hide.info.bets");
    });

    it("sendToWaitingBets", async () => {
      mountWrapper({
        methods: ["_pushToWaiting"],
      });

      wrapper.vm.sendToWaitingBets();

      expect(wrapper.vm._pushToWaiting).toBeCalled();
    });
  });
});
