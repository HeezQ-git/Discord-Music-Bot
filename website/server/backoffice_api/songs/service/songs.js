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
        success: false,
        songs: [],
    };

    const fillout = await Fillout.find();
    if (fillout.length > 0) {
        response.success = true;
        response.fillout = fillout;
    }

    return res.status(200).json(response);
};

const updateSongs = async (req, res) => {
    const response = {
        success: false,
        succeed: 0,
        failure: 0,
    };

    for await (const song of req.body.songs) {
        const _song = await Songs.updateOne({ _id: song._id }, song);
        if (_song) response.succeed++;
        else response.failure++;
    }

    if (response.failure == 0) response.success = true;

    return res.status(200).json(response);
};

module.exports = {
    getSongs,
    filloutData,
    updateSongs,
};
