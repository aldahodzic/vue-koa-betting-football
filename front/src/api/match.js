import http from "@/plugins/axios";

export function downloadOrParseMatches (leagues) {
  return http.post("/matches", { leagues });
}
