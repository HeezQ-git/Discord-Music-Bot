const mongoose = require('mongoose');

const channelsSchema = new mongoose.Schema({
    _id: String,
    tMusic: String
});

const Channels = mongoose.model('Channels', channelsSchema);
module.exports = Channels;