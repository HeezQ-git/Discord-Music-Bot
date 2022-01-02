import axios from 'axios';

const mailerService = {
    newPendingUser: (data) => {
        return axios.post('/api/backoffice/mailer/newPendingUser', data);
    },
    sendEmail: (data) => {
        return axios.post('/api/backoffice/mailer/sendEmail', data);
    },
    sendForgetPassword: (data) => {
        return axios.post('/api/backoffice/mailer/sendForgetPassword', data);
    },
}

export { mailerService };