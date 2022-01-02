// const pendingUsers = require('./../../../models/pendingUsers');
const websiteUsers = require('../../../models/websiteUsers');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    const response = {
        success: false,
        msg: '',
    }

    if (req.body.password) {
        const user = await websiteUsers.findOne({ email: req.body.email });
        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                response.success = true;
            } else response.msg = 'E-mail or password is incorrect.';
        } else response.msg = 'E-mail or password is incorrect.';
    } else response.msg = 'Password was not provided.';

    return res.status(200).json(response);
}

const loginGoogleUser = async (req, res) => {
    const response = {
        success: false,
        msg: '',
    }

    if (req.body.googleId) {
        const user = await websiteUsers.findOne({ googleId: req.body.googleId });
        if (user) {
            response.success = true;
            response.msg = 'logged in';
            // const result = await bcrypt.compare(req.body.password, user.password);
            // if (result) {
            //     response.success = true;
            // } else response.msg = 'E-mail or password is incorrect.';
        } else {
            await websiteUsers.create({
                accountType: 'google',
                username: req.body.username,
                email: req.body.email,
                imageUrl: req.body.imageUrl,
                googleId: req.body.googleId,
            });
            response.success = true;
            response.msg = 'created';
        };
    }

    return res.status(200).json(response);
}

const checkUser = async (req, res) => {
    const response = {
        success: false,
    }
    const users = await websiteUsers.find();
    if (users.some(e => e.username.toLowerCase() == req.body.username.toLowerCase())) response.success = true;

    return res.status(200).json(response);
}

const checkEmail = async (req, res) => {
    const response = {
        success: false,
    }
    const user = await websiteUsers.findOne({ email: req.body.email });
    if (user) response.success = true;

    return res.status(200).json(response);
}

module.exports = {
    loginUser,
    loginGoogleUser,
    checkUser,
    checkEmail,
};