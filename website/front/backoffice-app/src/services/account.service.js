import axios from 'axios';

const accountService = {
    activateAccount: (data) => {
        return axios.post('/api/backoffice/account/activate', data);
    },
    checkPasswordReset: (data) => {
        return axios.post('/api/backoffice/account/checkPasswordReset', data);
    },
    changePassword: (data) => {
        return axios.post('/api/backoffice/account/changePassword', data);
    },
}

export { accountService };