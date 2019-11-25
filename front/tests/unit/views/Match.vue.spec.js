import { createWrapper, disableFile } from "../__utils__";
import Component from "@/views/Match.vue";

disableFile();

describe("views/Match.vue", () => {
  let wrapper;
  const mountWrapper = (options = {}) => {
    wrapper = createWrapper(Component, {
      stubs: ["app-match-menu", "app-match-actions"],
      ...options,
    });
  };

  it("Testing snapshot", () => {
    mountWrapper();

    expect(wrapper.element).toMatchSnapshot();
  });
});
