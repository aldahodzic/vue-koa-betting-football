import http from "@/plugins/axios";

import { config as generateConfig, generateMatches } from "./generate";

export function downloadOrParseMatches (leagues) {
  if (generateConfig.isActivated) {
    const data = generateMatches(leagues);
    return { status: true, data };
  }

  return http.post("/matches", { leagues });
}
