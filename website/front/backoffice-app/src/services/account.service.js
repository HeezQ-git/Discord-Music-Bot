import axios from "axios";

const accountService = {
    activateAccount: (data) => axios.post("/api/account/activate", data),
    checkPasswordReset: (data) =>
        axios.post("/api/account/check-password-reset", data),
    changePassword: (data) => axios.post("/api/account/change-password", data),
};

export { accountService };
