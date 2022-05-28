import axios from "axios";

const loginService = {
    loginUser: (data) => axios.post("/api/login", data),
    loginGoogleUser: (data) => axios.post("/api/login/google-user", data),
    checkSession: (data) => axios.post("/api/login/check-session", data),
    checkUser: (data) => axios.post("/api/login/check-user", data),
    checkEmail: (data) => axios.post("/api/login/check-email", data),
};

export { loginService };
