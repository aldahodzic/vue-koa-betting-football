const Axios = {

    post(property) {
        if(property == "/auth/authorizedUser") {
            return send(true, "user token");
        }

        if(property == "/auth/unauthorizedUser") {
            return send(false, "guest");
        }
    }

};

function send(status, data) {
    return {status, data};
}

module.exoprts = Axios;
export default Axios;