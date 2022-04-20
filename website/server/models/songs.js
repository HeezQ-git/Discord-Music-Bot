const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    artist: {
        type: [{ type: String }],
        required: true,
    },
    version: {
        type: Number,
        default: 1,
    },
    game: {
        type: String,
        required: true,
    },
    dancemode: {
        type: Number,
        required: true,
    },
    xboxbrokenlevel: {
        type: Number,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    effort: {
        type: Number,
        required: true,
    },
    times: {
        type: String,
        required: false,
    },
    genre: {
        type: [{ type: Number }],
        required: false,
    },
    tags: {
        type: [{ type: Number }],
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    type: String,
    cover: {
        type: String,
        required: true,
    },
    preview: {
        type: String,
        required: false,
    },
    released: {
        type: Boolean,
        required: true,
    },
    excluded: {
        type: Boolean,
        required: false,
    },
});

const Message = mongoose.model("Songs", songsSchema);
module.exports = Message;
