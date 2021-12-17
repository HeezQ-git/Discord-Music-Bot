import axios from 'axios';

const subjectsService = {
    getSubjects: () => {
        return axios.get('/api/backoffice/subjects');
    },
    addSubject: (subject) => {
        return axios.post('/api/backoffice/subjects', { name: subject });
    },
}

export { subjectsService };