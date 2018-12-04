const Axios = {

    post(url) {
        if(url == "/auth/authorizedUser") {
            return send(true, "user token");
        }

        if(url == "/auth/unauthorizedUser") {
            return send(false, "guest");
        }

        if(url == "/matches") {
            return send(false, "new matches");
        }
    }

};

function send(status, data) {
    return {status, data};
}

module.exoprts = Axios;
export default Axios;