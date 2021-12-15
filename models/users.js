const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userId: String,
    messageId: {
        type: String,
        default: "",
    },
    song_page: Number,
    song_temp: {
        name: {
            type: String,
            default: "",
        },
        artist: {
            type: [{ type: String }],
        },
        game: {
            type: String,
            default: "",
        },
        dancemode: {
            type: String,
            default: "",
        },
        xboxbrokenlevel: {
            type: String,
            default: "",
        },
        difficulty: {
            type: String,
            default: "",
        },
        effort: {
            type: String,
            default: "",
        },
        times: {
            type: String,
            default: "",
        },
        genre: {
            type: String,
            default: "",
        },
        tags: {
            type: [{ type: String }],
        },
        duration: {
            type: String,
            default: "",
        },
        cover: {
            type: String,
            default: "",
        }
    }
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;