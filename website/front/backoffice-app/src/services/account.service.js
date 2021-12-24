import axios from 'axios';

const accountService = {
    activateAccount: (data) => {
        return axios.post('/api/backoffice/account/activate', data);
    },
}

export { accountService };