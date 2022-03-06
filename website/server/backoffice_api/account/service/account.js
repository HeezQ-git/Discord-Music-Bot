const PendingUsers = require("./../../../models/pendingUsers");
const WebsiteUsers = require("./../../../models/websiteUsers");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

const accountActivate = async (req, res) => {
    const response = {
        success: false,
        msg: "",
    };

    const id = req.body.id;
    let pendingUser;
    try {
        pendingUser = await PendingUsers.findOne({ _id: id });
    } catch (e) {
        response.msg = `Couldn't find pending account with this ID`;
        return res.status(200).json(response);
    }

    if (pendingUser) {
        if (
            !pendingUser.username ||
            !pendingUser.email ||
            !pendingUser.password
        ) {
            response.msg = `Some required fields are empty`;
        }
        await PendingUsers.deleteOne(pendingUser);
        await WebsiteUsers.create({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password,
            registerDate: Date.now(),
        });
        const userToCheck = await WebsiteUsers.findOne({
            email: pendingUser.email,
        });
        if (userToCheck) response.success = true;
        else {
            response.msg = `Couldn't add user to database!`;
            PendingUsers.create(pendingUser);
        }
    } else response.msg = `Couldn't find pending account with this ID`;

    return res.status(200).json(response);
};

const checkPasswordReset = async (req, res) => {
    const response = {
        success: false,
        msg: "",
    };

    if (req.body.passwordResetId) {
        const user = await WebsiteUsers.findOne({
            passwordResetId: req.body.passwordResetId,
        });
        if (user) {
            response.success = true;
        } else response.msg = `Password reset ID is invalid or expired`;
    } else response.msg = `Password reset ID not specified`;

    return res.status(200).json(response);
};

const changePassword = async (req, res) => {
    const response = {
        success: false,
        msg: "",
    };

    if (req.body.password) {
        const hashedPassword = await hashPassword(req.body.password);
        const user = await WebsiteUsers.findOne({
            passwordResetId: req.body.passwordResetId,
        });
        if (user) {
            if (req.body.passwordResetId === user.passwordResetId) {
                try {
                    user.password = hashedPassword;
                    user.passwordResetId = "";
                    await WebsiteUsers.updateOne(
                        { passwordResetId: req.body.passwordResetId },
                        user
                    );
                    response.success = true;
                } catch (error) {
                    response.msg = error;
                }
            } else response.msg = `Password reset ID doesn't match.`;
        } else response.msg = `Password reset ID is invalid or expired`;
    }

    return res.status(200).json(response);
};

module.exports = {
    accountActivate,
    checkPasswordReset,
    changePassword,
};
