const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'replay',
    aliases: ['restart'],
    description: 'Replays the current song.',
    cooldown: 10,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        try {
            await queue.seek(0);
        } catch (e) { 
            console.log(e);
            return msg.channel.send(`${emoji.no} Couldn't replay current song.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        };
        
        return msg.channel.send(`${emoji.yes} Replaying the current song!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}