import axios from 'axios';

const songsService = {
    getSongs: (data) => {
        return axios.get('/api/backoffice/songs', data);
    },
    // addClasses: (songs) => {
    //     return axios.post('/api/backoffice/songs', { name: songs });
    // }
}

export { songsService };