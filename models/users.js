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
            type: [{ type: String }],
        },
        artist: {
            type: [{ type: String }],
        },
        game: {
            type: [{ type: String }],
        },
        dancemode: {
            type: [{ type: String }],
        },
        xboxbrokenlevel: {
            type: [{ type: String }],
        },
        difficulty: {
            type: [{ type: String }],
        },
        effort: {
            type: [{ type: String }],
        },
        times: {
            type: [{ type: String }],
        },
        genre: {
            type: [{ type: String }],
        },
        tags: {
            type: [{ type: String }],
        },
        duration: {
            type: [{ type: String }],
        },
        cover: {
            type: [{ type: String }],
        }
    }
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;