import axios from 'axios';

const mailerService = {
    newPendingUser: (data) => {
        return axios.post('/api/backoffice/mailer/newPendingUser', data);
    },
    sendEmail: (data) => {
        return axios.post('/api/backoffice/mailer/sendEmail', data);
    },
}

export { mailerService };