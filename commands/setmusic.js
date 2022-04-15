const Channels = require("./../models/channels");
const emoji = require("./../config/emojis.json");

module.exports = {
    name: "setmusic",
    aliases: ["sm"],
    cooldown: 0,
    category: "Moderation",
    async execute(msg, args, client) {
        msg.delete();

        if (!args[0])
            return msg.channel
                .send(
                    `${emoji.no} You need to mention the music channel or provide its ID.`
                )
                .then((e) =>
                    setTimeout(() => e.delete().catch(console.log), 5000)
                );
        if (args[0].includes("<#"))
            args[0] = args[0].replace("<#", "").replace(">", "");
        if (args[0].length != 18)
            return msg.channel
                .send(
                    `${emoji.no} There was an error fetching mentioned channel!`
                )
                .then((e) =>
                    setTimeout(() => e.delete().catch(console.log), 5000)
                );
        await Channels.findOneAndUpdate(
            { _id: msg.guildId },
            { $set: { tMusic: args[0].toString() } }
        );
        return msg.channel
            .send(
                `${emoji.yes} Current music channel has been set to: <#${args[0]}>`
            )
            .then((e) => setTimeout(() => e.delete().catch(console.log), 5000));
    },
};
