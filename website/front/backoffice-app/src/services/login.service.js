import axios from "axios";

const loginService = {
    loginUser: (data) => {
        return axios.post("/api/backoffice/login", data);
    },
    loginGoogleUser: (data) => {
        return axios.post("/api/backoffice/login/googleUser", data);
    },
    checkSession: (data) => {
        return axios.post("/api/backoffice/login/checkSession", data);
    },
    checkUser: (data) => {
        return axios.post("/api/backoffice/login/checkUser", data);
    },
    checkEmail: (data) => {
        return axios.post("/api/backoffice/login/checkEmail", data);
    },
};

export { loginService };
