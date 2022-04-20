import axios from "axios";

const songsService = {
    getSongs: (data) => axios.get("/api/backoffice/songs", data),
    filloutData: () => axios.post("/api/backoffice/filloutData"),
};

export { songsService };
