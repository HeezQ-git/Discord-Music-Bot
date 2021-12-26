import axios from 'axios';

const loginService = {
    loginUser: (data) => {
        return axios.post('/api/backoffice/login', data);
    },
    checkUser: (data) => {
        return axios.post('/api/backoffice/login/checkUser', data);
    },
}

export { loginService };