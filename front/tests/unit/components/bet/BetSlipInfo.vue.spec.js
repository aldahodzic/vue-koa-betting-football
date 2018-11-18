import {createWrapper, disableFile, DATA, mapProperties} from "../../__utils__";
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
                bets: DATA.betSlipBetsInfo,
                ...mapProperties("lineMode", "betSlipIndex"),
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

});
