const Songs = require('./../../../models/songs');
const Fillout = require('./../../../models/fillout');

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

const getSong = async (req, res) => {
    const response = {
        success: false,
        song: {},
    };

    if (req.body.songId.length >= 24) {
        const song = await Songs.findOne({ _id: req.body.songId });
        if (song) {
            response.success = true;
            response.song = song;
        }
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

const addSong = async (req, res) => {
    const response = {
        success: false,
    };

    const song = await Songs.create({
        name: req.body.songName,
        artist: req.body.artist,
        version: req.body.version,
        game: req.body.game,
        dancemode: req.body.dancemode,
        xboxbrokenlevel: req.body.brokenLevel,
        difficulty: req.body.difficulty,
        effort: req.body.effort,
        times: req.body.time,
        genre: req.body.genre,
        tags: req.body.tag,
        duration: req.body.duration,
        type: req.body.type,
        cover: req.body.songCover,
        released: req.body.released,
        excluded: req.body.excluded,
    });

    if (song) response.success = true;

    return res.status(200).json(response);
};

const deleteSong = async (req, res) => {
    const response = {
        success: false,
    };

    const song = await Songs.deleteOne({ _id: req.body.songId });
    if (song) response.success = true;

    return res.status(200).json(response);
};

const editSong = async (req, res) => {
    const response = {
        success: false,
    };

    const song = await Songs.updateOne(
        { _id: req.body.songId },
        {
            name: req.body.songName,
            artist: req.body.artist,
            version: req.body.version,
            game: req.body.game,
            dancemode: req.body.dancemode,
            xboxbrokenlevel: req.body.brokenLevel,
            difficulty: req.body.difficulty,
            effort: req.body.effort,
            times: req.body.time,
            genre: req.body.genre,
            tags: req.body.tag,
            duration: req.body.duration,
            type: req.body.type,
            cover: req.body.songCover,
            released: req.body.released,
            excluded: req.body.excluded,
        }
    );

    if (song) response.success = true;

    return res.status(200).json(response);
};

module.exports = {
    getSongs,
    getSong,
    filloutData,
    updateSongs,
    addSong,
    deleteSong,
    editSong,
};
