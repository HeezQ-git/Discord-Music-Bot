const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songsSchema = new Schema({
    songID: Number,
    name: {
        type: String,
        required: true,
    },
    artist: {
        type: [{ type: String }],
        required: true,
    },
    game: {
        type: String,
        required: true,
    },
    dancemode: {
        type: String,
        required: true,
    },
    xboxbrokenlevel: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    effort: {
        type: String,
        required: true,
    },
    times: {
        type: String,
        required: false,
    },
    genre: {
        type: String,
        required: false,
    },
    tags: {
        type: [{ type: String }],
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    cover: {
        type: String,
        required: true,
    }
});

const Message = mongoose.model('Songs', songsSchema);
module.exports = Message;