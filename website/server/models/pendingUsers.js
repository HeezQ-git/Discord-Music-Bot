const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pendingUsersSchema = new Schema({
    email: String,
    username: String,
    password: String,
    resendemail: Date,
    hash: String,
});

const pendingUsers = mongoose.model('pendingUsers', pendingUsersSchema);
module.exports = pendingUsers;