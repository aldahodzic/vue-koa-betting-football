import { createWrapper, disableFile, DATA, changeDataToRenderableMode } from "../__utils__";
import Component from "@/views/About.vue";

disableFile();

describe("views/About.vue", () => {
  let wrapper;
  const mountWrapper = (options = {}) => {
    wrapper = createWrapper(Component, options);
  };

  it("Testing snapshot", () => {
    mountWrapper({
      computed: {
        leagueList: changeDataToRenderableMode(DATA.leagueList),
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
