const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteUsersSchema = new Schema({
    email: String,
    username: String,
    password: String,
});

const WebsiteUsers = mongoose.model('WebsiteUsers', websiteUsersSchema);
module.exports = WebsiteUsers;