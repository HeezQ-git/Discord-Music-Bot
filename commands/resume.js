const { createEmbed } = require('./../handlers/embeds');
const emoji = require('./../config/emojis.json');
const Message = require('./../models/msg');

module.exports = {
    name: 'resume',
    aliases: ['unpause'],
    cooldown: 3,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const isPaused = (await Message.findOne({ _id: msg.guildId })).isPaused;

        if (!isPaused) return msg.channel.send(`${emoji.no} Queue isn't paused!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        const queue = client.distube.getQueue(msg.guildId);

        try {
            await Message.updateOne({ _id: msg.guildId }, { $set: { isPaused: false } });
            await queue.resume();
        } catch (e) {
            return msg.channel.send(`${emoji.no} Queue isn't paused or there are no songs in queue!`).then(e => setTimeout(() => e.delete().catch(console.log), 7000));
        }

        newMsg = await msg.channel.messages.fetch((await Message.findOne({ _id: msg.guildId })).musicManager);
        if (newMsg) newMsg.edit({ embeds: [ createEmbed('song-playing', queue, queue.songs[0]) ] });
    }
}