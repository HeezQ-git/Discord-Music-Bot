const pendingUsers = require('./../../../models/pendingUsers');
const websiteUsers = require('../../../models/websiteUsers');

const accountActivate = async (req, res) => {
    const response = {
        success: false,
        msg: '',
    }

    const id = req.body.id;
    const pendingUser = await pendingUsers.findOne({ _id: id });
    
    if (pendingUser) {
        if (!pendingUser.username || !pendingUser.email || !pendingUser.password) {
            response.msg = `Some required fields are empty`;
        }
        await pendingUsers.deleteOne(pendingUser);
        await websiteUsers.create({ username: pendingUser.username, email: pendingUser.email, password: pendingUser.password, });
        const userToCheck = await websiteUsers.findOne({ email: pendingUser.email });
        if (userToCheck) response.success = true
        else {
            response.msg = `Couldn't add user to database!`
            pendingUsers.create(pendingUser);
        };
    } else response.msg = `Couldn't find pending account with this ID`;

    return res.status(200).json(response);
}

module.exports = {
    accountActivate,
};