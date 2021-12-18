const Songs = require('./../../../models/songs');

const getSongs = async (req, res) => {
    console.log('inside getting songs?');

    const songs = await Songs.find();
    console.log(songs);

    const response = {
        success: true,
        songs: songs,
    };

    return res.status(200).json(response);
}

module.exports = {
    getSongs,
};