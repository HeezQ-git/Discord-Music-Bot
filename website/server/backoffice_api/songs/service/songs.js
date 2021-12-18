const Songs = require('./../../../models/songs');

const getSongs = async (req, res) => {

    const songs = await Songs.find();

    const response = {
        success: true,
        songs: songs,
    };

    return res.status(200).json(response);
}

module.exports = {
    getSongs,
};