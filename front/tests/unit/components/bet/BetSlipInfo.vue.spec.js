import {createWrapper, disableFile, DATA, mapProperties, changeDataToRenderableMode} from "../../__utils__";
import Component from "@/components/bet/betSlip/Info";

disableFile();

describe("bet/BetSlipInfo.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-bet-slip-info-line"],
            ...options,
        });
    };

    it("Testing snapshot", () => {
        mountWrapper({
            props: {
                bets: changeDataToRenderableMode(DATA.betSlipBetsInfo),
                ...mapProperties("lineMode", "betSlipIndex"),
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

});
