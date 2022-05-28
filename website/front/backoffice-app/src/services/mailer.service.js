import axios from "axios";

const mailerService = {
    newPendingUser: (data) => axios.post("/api/mailer/new-pending-user", data),
    sendEmail: (data) => axios.post("/api/mailer/send-email", data),
    sendForgetPassword: (data) =>
        axios.post("/api/mailer/send-forget-password", data),
};

export { mailerService };
