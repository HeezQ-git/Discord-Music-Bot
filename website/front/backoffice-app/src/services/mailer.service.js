import axios from 'axios';

const mailerService = {
    newPendingUser: (data) => {
        return axios.post('/api/backoffice/mailer/newPendingUser', data);
    },
}

export { mailerService };