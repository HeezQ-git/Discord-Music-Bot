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
            } else response.msg = 'Password is incorrect.';
        } else response.msg = 'User does not exist.';
    } else response.msg = 'Password was not provided.';

    return res.status(200).json(response);
}

module.exports = {
    loginUser,
};