const pendingUsers = require('./../../../models/pendingUsers');
const websiteUsers = require('../../../models/websiteUsers');

const accountActivate = async (req, res) => {
    const response = {
        success: false,
        status: 400,
        msg: '',
    }

    const id = req.body.id;
    const pendingUser = await pendingUsers.findOne({ _id: id });
    
    if (pendingUser) {
        if (!pendingUser.username || !pendingUser.email || !pendingUser.password) {
            response.msg = `Some required fields are empty`;
            response.status = 401;
        }
        await pendingUsers.deleteOne(pendingUser);
        await websiteUsers.create(pendingUser);
        const userToCheck = await websiteUsers.findOne({ email: websiteUsers.email });
        if (userToCheck) response.status = 200
        else response.msg = `Couldn't add user to database!`;
    } else response.msg = `Couldn't find pending account with this ID!`;

    return res.status(response.status).json(response);
}

module.exports = {
    accountActivate,
};