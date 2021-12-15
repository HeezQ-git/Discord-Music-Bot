const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userId: String,
    song_page: Number,
    song_temp: {
        name: {
            type: String,
            required: false,
            default: "",
        },
        artist: {
            type: [{ type: String }],
            required: false,
        },
        game: {
            type: String,
            required: false,
            default: "",
        },
        dancemode: {
            type: String,
            required: false,
            default: "",
        },
        xboxbrokenlevel: {
            type: String,
            required: false,
            default: "",
        },
        difficulty: {
            type: String,
            required: false,
            default: "",
        },
        effort: {
            type: String,
            required: false,
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
        },
        duration: {
            type: String,
            required: false,
            default: "",
        },
        cover: {
            type: String,
            required: false,
            default: "",
        }
    }
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;