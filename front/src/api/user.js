import http from "@/plugins/axios";

export function authorizeUser (data) {
  return http.post("/auth/authorization", data);
}

export function registerUser (data) {
  return http.post("/auth/registration", data);
}

export function logoutUser () {
  return http.delete("/auth/logout");
}
