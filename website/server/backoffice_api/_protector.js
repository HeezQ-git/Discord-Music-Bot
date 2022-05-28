const jwt = require("jsonwebtoken");
const WebsiteUsers = require("../models/websiteUsers");

const getToken = (req) => req.cookies["token"];

const checkToken = async (req, res, next) => {
    const token = getToken(req);
    if (!token) return res.redirect("/login");

    jwt.verify(token, "[S(X(Cx8r2.=fBUT", (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    });
};

const addAction = async (req, res, next) => {
    const token = getToken(req);

    jwt.verify(token, "[S(X(Cx8r2.=fBUT", async (err, user) => {
        if (err) return res.redirect("/login");
        next();

        const _user = await WebsiteUsers.findOne({ email: user.user.email });
        _user.actions++;
        await WebsiteUsers.updateOne({ email: user.user.email }, _user);
    });
};

module.exports = {
    checkToken,
    addAction,
};
