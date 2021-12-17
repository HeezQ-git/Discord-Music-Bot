import axios from 'axios';

const plansService = {
    getPlans: (classId) => {
        return axios.get(`/api/backoffice/plans?classId=${classId}`);
    },
    setPlans: (subjectData) => {
        return axios.post('/api/backoffice/plans', subjectData);
    },
}

export { plansService };