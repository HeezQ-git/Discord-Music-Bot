const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteUsersSchema = new Schema({
    accountType: {
        type: String,
        default: "classic",
    },
    username: String,
    email: String,
    password: String,
    imageUrl: String,
    googleId: String,
    passwordResetId: String,
    forgotPassEmail: Date,
});

const WebsiteUsers = mongoose.model('WebsiteUsers', websiteUsersSchema);
module.exports = WebsiteUsers;