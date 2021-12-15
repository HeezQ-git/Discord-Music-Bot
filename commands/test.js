const Channels = require('./../models/channels');

module.exports = {
    name: 'test',
    aliases: [],
    cooldown: 0,
    category: 'Test',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        let channels;
        channels = await Channels.findOne({ _id: msg.guildId });
        if (!channels) {
            try {
                const _msg = new Channels({
                    _id: msg.guildId,
                    tMusic: ""
                });
                _msg.save();
            } catch (e) { console.log(e) };
            channels = await Channels.findOne({ _id: msg.guildId });
        }
        console.log(channels);

        // const res = await Message.findOneAndUpdate({ _id: msg.guildId }, { $set: { musicManager: msg.id } });
        // console.log(res);
        // console.log((await Message.findOne({ _id: msg.guildId })).musicManager);
    }
}
