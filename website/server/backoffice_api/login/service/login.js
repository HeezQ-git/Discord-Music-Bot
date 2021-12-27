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

const checkUser = async (req, res) => {
    const response = {
        success: false,
    }
    const user = await websiteUsers.findOne({ username: req.body.username });
    if (user) response.success = true;

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
    checkUser,
    checkEmail,
};