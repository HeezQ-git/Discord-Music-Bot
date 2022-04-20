const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    maintenance: Boolean,
});

const settings = mongoose.model("settings", settingsSchema);
module.exports = settings;
