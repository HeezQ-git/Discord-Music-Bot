const emoji = require('./../config/emojis.json');

module.exports = {
    name: 'skip',
    aliases: ['next'],
    cooldown: 2,
    category: 'Music',
    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || queue.songs.length <= 1) return msg.channel.send(`${emoji.no} Cannot skip the queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        try {
            queue.skip();
        } catch (e) {}
    }
}