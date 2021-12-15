const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userId: String,
    song_page: Number,
    song_temp: {
        name: {
            type: String,
            required: false,
        },
        artist: {
            type: [{ type: String }],
            required: false,
        },
        game: {
            type: String,
            required: false,
        },
        dancemode: {
            type: String,
            required: false,
        },
        xboxbrokenlevel: {
            type: String,
            required: false,
        },
        difficulty: {
            type: String,
            required: false,
        },
        effort: {
            type: String,
            required: false,
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
            required: false,
        }
    }
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;