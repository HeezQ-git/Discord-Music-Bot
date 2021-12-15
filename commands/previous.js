const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'previous',
    aliases: ['prev'],
    description: 'Plays previous song from queue.',
    cooldown: 5,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        if (!queue.previousSongs || queue.previousSongs.length === 0) return msg.channel.send(`${emoji.no} There are no previous songs.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));

        try {
            await queue.previous();
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't play previous song!`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };

        return msg.channel.send(`${emoji.yes} Playing previous song...`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}