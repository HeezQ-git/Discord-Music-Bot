import axios from 'axios';

const classesService = {
    getClasses: () => {
        return axios.get('/api/backoffice/classes');
    },
    addClass: (className) => {
        return axios.post('/api/backoffice/classes', { name: className });
    },
}

export { classesService };