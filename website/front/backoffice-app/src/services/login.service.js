import axios from 'axios';

const loginService = {
    loginUser: (data) => {
        return axios.post('/api/backoffice/login', data);
    },
}

export { loginService };