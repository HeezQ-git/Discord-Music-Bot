import axios from 'axios';

const accountService = {
    activateAccount: (data) => {
        console.log('posting!');
        return axios.post('/api/backoffice/account/activate', data);
    },
}

export { accountService };