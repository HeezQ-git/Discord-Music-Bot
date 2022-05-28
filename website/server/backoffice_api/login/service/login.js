const WebsiteUsers = require("../../../models/websiteUsers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signToken = (user) => jwt.sign({ user: user }, "[S(X(Cx8r2.=fBUT");

const loginUser = async (req, res) => {
    const response = {
        success: false,
        msg: "",
        token: "",
    };

    if (req.body.password) {
        const user = await WebsiteUsers.findOne({ email: req.body.email });

        if (user) {
            if (user.accountType === "classic") {
                const result = await bcrypt.compare(
                    req.body.password,
                    user.password
                );

                if (result) {
                    response.success = true;
                    response.token = signToken({
                        username: user.username,
                        email: user.email,
                    });
                } else response.msg = "Email or password is invalid.";
            } else response.msg = "Login via Google Account";
        } else response.msg = "Email or password is invalid.";
    } else response.msg = "Password was not provided.";

    return res.status(200).json(response);
};

const loginGoogleUser = async (req, res) => {
    const response = {
        success: false,
        msg: "",
    };

    if (req.body.googleId) {
        const user = await WebsiteUsers.findOne({
            googleId: req.body.googleId,
        });
        if (user) {
            response.success = true;
            response.token = signToken(user);
        } else {
            let username;
            if (req.body.username.includes(" "))
                username = req.body.username.split(" ")[0];
            else username = req.body.username;

            await WebsiteUsers.create({
                accountType: "google",
                username: username,
                email: req.body.email,
                avatar: req.body.imageUrl,
                googleId: req.body.googleId,
            });
            response.success = true;
            response.token = signToken(user);
        }
    }

    return res.status(200).json(response);
};

const checkSession = async (req, res) => {
    const token = req.body.token;

    const response = {
        success: false,
    };

    if (token) {
        try {
            const verify = jwt.verify(token, "[S(X(Cx8r2.=fBUT");
            response.success = !!verify.user;
            response.user = {
                username: verify.user.username,
                email: verify.user.email,
            };
        } catch (error) {}
    }

    return res.status(200).json(response);
};

const checkUser = async (req, res) => {
    const response = {
        success: false,
    };
    const users = await WebsiteUsers.find();
    if (
        users.some(
            (e) => e.username.toLowerCase() == req.body.username.toLowerCase()
        )
    )
        response.success = true;

    return res.status(200).json(response);
};

const checkEmail = async (req, res) => {
    const response = {
        success: false,
    };

    const user = await WebsiteUsers.findOne({ email: req.body.email });
    if (user) response.success = true;

    return res.status(200).json(response);
};

module.exports = {
    loginUser,
    loginGoogleUser,
    checkSession,
    checkUser,
    checkEmail,
};
