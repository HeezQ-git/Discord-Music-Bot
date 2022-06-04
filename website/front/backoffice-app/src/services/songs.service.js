import axios from "axios";

const songsService = {
    getSongs: (data) => axios.get("/api/songs", data),
    getSong: (data) => axios.post("/api/songs/get-song", data),
    filloutData: () => axios.post("/api/songs/fillout-data"),
    updateSongs: (data) => axios.post("/api/songs/update-songs", data),
    addSong: (data) => axios.post("/api/songs/add-song", data),
    deleteSong: (data) => axios.post("/api/songs/delete-song", data),
    editSong: (data) => axios.post("/api/songs/edit-song", data),
};

export { songsService };
