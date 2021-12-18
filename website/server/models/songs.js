const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songsSchema = new Schema({
    songID: Number,
    name: {
        type: String,
        required: true,
        default: "",
    },
    artist: {
        type: [{ type: String }],
        required: true,
        default: "",
    },
    game: {
        type: String,
        required: true,
        default: "",
    },
    dancemode: {
        type: String,
        required: true,
        default: "",
    },
    xboxbrokenlevel: {
        type: String,
        required: true,
        default: "",
    },
    difficulty: {
        type: String,
        required: true,
        default: "",
    },
    effort: {
        type: String,
        required: true,
        default: "",
    },
    times: {
        type: String,
        required: false,
        default: "",
    },
    genre: {
        type: String,
        required: false,
        default: "",
    },
    tags: {
        type: [{ type: String }],
        required: false,
        default: "",
    },
    duration: {
        type: String,
        required: false,
        default: "",
    },
    cover: {
        type: String,
        required: true,
        default: "",
    }
});

const Message = mongoose.model('Songs', songsSchema);
module.exports = Message;