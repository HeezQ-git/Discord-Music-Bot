const emoji = require('./../config/emojis.json');
const Message = require('./../models/msg');

module.exports = {
    name: 'stop',
    aliases: [],
    cooldown: 3,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || queue.songs.length <= 0) return msg.channel.send(`${emoji.no} Cannot stop the queue, because no music is being played!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        try { 
            await queue.stop();
        } catch (e) {
            return msg.channel.send(`${emoji.no} No music is being played!`).then(e => setTimeout(() => e.delete().catch(console.log), 7000));
        }
        
        try {
            await Message.updateOne({ _id: msg.guildId }, { $set: { isPaused: false } });
            newMsg = await msg.channel.messages.fetch((await Message.findOne({ _id: msg.guildId })).musicManager);
            newMsg.delete().catch(console.log);
        } catch (e) {}
    }
}