import axios from "axios";

const songsService = {
    getSongs: (data) => axios.get("/api/songs", data),
    filloutData: () => axios.post("/api/songs/fillout-data"),
    updateSongs: (data) => axios.post("/api/songs/update-songs", data),
};

export { songsService };
