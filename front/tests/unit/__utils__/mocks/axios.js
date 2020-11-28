const Axios = {

  get (url) {
    if (url === "/bets/results/last") {
      return send(true, "result bets");
    }
  },

  post (url, data) {
    if (url === "/auth/authorizedUser") {
      return send(true, "user token");
    }

    if (url === "/auth/unauthorizedUser") {
      return send(false, "guest");
    }

    if (url === "/matches") {
      return send(true, "new matches");
    }

    if (url === "/bets/confirm") {
      if (data === "must fail") return send(false, "error");
      if (data === "must success") return send(true, "confirmed");
    }
  },

};

function send (status, data) {
  return { status, data };
}

module.exoprts = Axios;
export default Axios;
