import {createWrapper, disableFile, DATA} from "../../__utils__";
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
                lineMode: "lineMode",
                betSlipIndex: 2,
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });

});
