const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userId: String,
    randomMenu: {
        type: String,
        default: "main",
    },
    randomMessageId: {
        type: String,
        default: "",
    },
    randomSettings: {
        artist: {
            type: [{ type: String }],
        },
        version: {
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
    },
    messageId: {
        type: String,
        default: "",
    },
    mode: {
        type: String,
        default: "new",
    },
    song_page: {
        type: Number,
        default: 1,
    },
    fillout: {
        type: Boolean,
        default: false,
    },
    isFilled: {
        type: Boolean,
        default: false,
    },
    song_temp: {
        songId: String,
        version: {
            type: [{ type: String }],
        },
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
        },
        preview: {
            type: [{ type: String }],
        }
    }
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;