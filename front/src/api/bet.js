import http from "@/plugins/axios";

import {
  config as generateConfig,
  confirmBetSlip as generateConfirmBetSlip,
  generateResults,
} from "./generate";

export function getResults (type) {
  if (generateConfig.isActivated) {
    const data = generateResults();
    return { status: true, data };
  }

  return http.get(`/bets/results/${type}`);
}

export function confirmBetSlip (betSlip) {
  if (generateConfig.isActivated) {
    generateConfirmBetSlip(betSlip);
    return { status: true };
  }

  return http.post("/bets/confirm", betSlip);
}
