import { createWrapper, disableFile, cutFromOptions, mapProperties } from "../../__utils__";
import Component from "@/components/bet/Selector";

disableFile();

describe("bet/Selector.vue", () => {
  let wrapper, sortSelectOptions, arrowButton, filterSelectOptions, hideButton, showButton;
  const mountWrapper = (options = {}) => {
    const { computed } = cutFromOptions(options, ["computed"]);
    wrapper = createWrapper(Component, {
      computed: {
        selector: {},
        ...computed,
      },
      ...options,
    });
    sortSelectOptions = wrapper.findAll("#sort > option");
    arrowButton = wrapper.find("#arrows");
    filterSelectOptions = wrapper.findAll("#filter > option");
    hideButton = wrapper.find("#toogle-info-visibility > span:nth-of-type(1)");
    showButton = wrapper.find("#toogle-info-visibility > span:nth-of-type(2)");
  };

  it("Testing snapshot", () => {
    mountWrapper({
      computed: {
        show: mapProperties("sumResultOption", true),
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  describe("Testing triggering methods", () => {
    describe("changeSelector", () => {
      it("changeSelector > sort", () => {
        mountWrapper({
          methods: ["changeSelector"],
        });

        sortSelectOptions.at(1).setSelected();

        expect(wrapper.vm.changeSelector).toBeCalledWith("sort", "rate");
      });

      it("changeSelector > direction", () => {
        mountWrapper({
          methods: ["changeSelector"],
        });

        arrowButton.trigger("click");

        expect(wrapper.vm.changeSelector).toBeCalledWith("direction");
      });

      it("changeSelector > filter", () => {
        mountWrapper({
          methods: ["changeSelector"],
        });

        filterSelectOptions.at(1).setSelected();

        expect(wrapper.vm.changeSelector).toBeCalledWith("filter", "win");
      });
    });

    describe("changeBetSlipInfoVisibility", () => {
      it("changeBetSlipInfoVisibility to hide", () => {
        mountWrapper({
          methods: ["changeBetSlipInfoVisibility"],
        });

        hideButton.trigger("click");

        expect(wrapper.vm.changeBetSlipInfoVisibility).toBeCalledWith(false);
      });

      it("changeBetSlipInfoVisibility to show", () => {
        mountWrapper({
          methods: ["changeBetSlipInfoVisibility"],
        });

        showButton.trigger("click");

        expect(wrapper.vm.changeBetSlipInfoVisibility).toBeCalledWith(true);
      });
    });
  });

  describe("Testing computed properties", () => {
    describe("show", () => {
      it("show.sumResultOption = true", () => {
        mountWrapper({
          computed: {
            "selector.filter": "!all",
          },
        });

        expect(wrapper.vm.show.sumResultOption).toBeTruthy();
      });

      it("show.sumResultOption = false", () => {
        mountWrapper({
          computed: {
            "selector.filter": "all",
          },
        });

        expect(wrapper.vm.show.sumResultOption).toBeFalsy();
      });
    });
  });

  describe("Testing methods", () => {
    describe("changeSelector", () => {
      it("changeSelector for all options not direction", () => {
        mountWrapper({
          methods: ["_changeSelector"],
        });

        wrapper.vm.changeSelector("selector field", "selector value");

        expect(wrapper.vm._changeSelector).toBeCalledWith({ field: "selector field", value: "selector value" });
      });

      it("changeSelector specially for direction", () => {
        mountWrapper({
          computed: {
            "selector.direction": 2,
          },
          methods: ["_changeSelector"],
        });

        wrapper.vm.changeSelector("direction");

        expect(wrapper.vm._changeSelector).toBeCalledWith({ field: "direction", value: -2 });
      });
    });

    it("changeBetSlipInfoVisibility", () => {
      mountWrapper();
      const stubFunction = jest.fn();
      wrapper.vm.$root.$on("changeBetSlipInfoVisibility", stubFunction);

      wrapper.vm.changeBetSlipInfoVisibility("visibility status");

      expect(stubFunction).toBeCalledWith("visibility status");
    });
  });
});
