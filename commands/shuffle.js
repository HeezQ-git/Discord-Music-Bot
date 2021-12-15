const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'shuffle',
    aliases: ['mix'],
    description: 'Shuffles current queue.',
    cooldown: 5,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));

        try {
            await queue.shuffle();
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't shuffle current queue!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
        return msg.channel.send(`${emoji.yes} Successfully shuffled ${queue.songs.length} songs!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}