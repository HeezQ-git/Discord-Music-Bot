const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filloutSchema = new Schema({
    name: String,
    game: String,
    version: Number,
    user: {
        type: String,
        default: "",
    },
    done: {
        type: Boolean,
        default: false,
    },
});

const fillout = mongoose.model("fillout", filloutSchema);
module.exports = fillout;
