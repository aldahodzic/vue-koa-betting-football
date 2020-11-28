import http from "@/plugins/axios";

export function getResults (type) {
  return http.get(`/bets/results/${type}`);
}

export function confirmBetSlip (betSlip) {
  return http.post("/bets/confirm", betSlip);
}
