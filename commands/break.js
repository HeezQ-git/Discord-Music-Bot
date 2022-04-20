// const Settings = require("./../models/settings.json");
const Settings = require("../models/settings");

module.exports = {
    name: "break",
    async execute(msg, args, cmd, client) {
        const res = await Settings.find();
        if (!res.length) await Settings.create({ maintenance: true });
        else
            await Settings.updateOne(
                { _id: res[0]._id },
                { maintenance: !res[0].maintenance }
            );
        msg.reply(`${!res[0].maintenance}`);
        msg.delete();
    },
};
