module.exports = {
    name: "clear",
    aliases: ["purge"],
    cooldown: 0,
    category: "Moderation",
    execute(msg, args, client) {
        msg.delete();
        if (!msg.channel.permissionsFor(msg.member).has("MANAGE_MESSAGES"))
            return msg.channel
                .send("❌ | Insufficient permissions!")
                .then((e) => setTimeout(() => e.delete(), 4000));
        if (!args[0])
            return msg.channel
                .send("❌ | You need to provide amount of messages to clear.")
                .then((e) => setTimeout(() => e.delete(), 4000));

        msg.channel
            .bulkDelete(parseInt(args[0]))
            .then((el) =>
                msg.channel
                    .send(`✅ | I've deleted **${el.size} messages**!`)
                    .then((e) => setTimeout(() => e.delete(), 3000))
            );
    },
};
