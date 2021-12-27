import axios from 'axios';

const songsService = {
    getSongs: (data) => {
        return axios.get('/api/backoffice/songs', data);
    },
}

export { songsService };