const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    _id: String,
    musicManager: String,
    queueManager: String,
    isPaused: {
        type: Boolean,
        default: false
    }
});

const Message = mongoose.model('Message', msgSchema);
module.exports = Message;