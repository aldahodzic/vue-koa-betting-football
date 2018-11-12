import {createWrapper, disableFile} from "../../__utils__";
import Component from "@/components/bet/betSlip/Info";

disableFile();

describe("bet/BetSlipInfo.vue", () => {

    let wrapper;
    let mountWrapper = (options = {}) => {
        wrapper = createWrapper(Component, {
            stubs: ["app-bet-slip-info-line"],
            remove: {computed: ["bets"]},
            ...options,
        });
    };

    describe("Testing snapshots", () => {

        it("Component itself", () => {
            mountWrapper({props: {bets: [
                {
                    key: "match key 1",
                    lineMode: "result",
                    dateTmpl: "12.12",
                    league: "league 1",
                    home: "home team 1",
                    guest: "guest team 1",
                    type: "1",
                    bookie: "bookie 1",
                    betIndex: 1,
                    betSlipIndex: 2,
                    score: "3 : 2",
                },
                {
                    key: "match key 2",
                    lineMode: "result",
                    dateTmpl: "12.12",
                    league: "league 2",
                    home: "home team 2",
                    guest: "guest team 2",
                    type: "2",
                    bookie: "bookie 2",
                    betIndex: 2,
                    betSlipIndex: 2,
                    score: "1 : 1",
                },
            ]}});

            expect(wrapper.element).toMatchSnapshot();
        });

    });

});
