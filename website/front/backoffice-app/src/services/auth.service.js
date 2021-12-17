import axios from 'axios';

const authService = {
    login: (data) => {
        return axios.post('/api/backoffice/login', data);
    },
    logout: () => {
        window.location.href = '/';
    },
    checkSession: (token) => {
        return axios.post('/api/backoffice/check-session', token);
    }
}

export { authService };