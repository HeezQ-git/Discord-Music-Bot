const Songs = require("./../../../models/songs");
const Fillout = require("./../../../models/fillout");

const getSongs = async (req, res) => {
    const response = {
        success: true,
        songs: [],
    };

    const songs = await Songs.find();
    if (songs.length > 0) {
        response.success = true;
        response.songs = songs;
    }

    return res.status(200).json(response);
};

const filloutData = async (req, res) => {
    const response = {
        success: true,
        songs: [],
    };

    const songs = await Songs.find();
    if (songs.length > 0) {
        response.success = true;
        response.songs = songs;
    }

    return res.status(200).json(response);
};

module.exports = {
    getSongs,
    filloutData,
};
