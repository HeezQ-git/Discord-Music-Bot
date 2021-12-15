const emoji = require("./../config/emojis.json");

module.exports = {
    name: 'addrelated',
    aliases: ['findrelated', 'searchrelated'],
    description: 'Adds related songs to queue',
    cooldown: 5,
    category: 'Music',

    async execute(msg, args, cmd, client) {
        msg.delete().catch(console.log);

        const queue = client.distube.getQueue(msg.guildId);
        if (!queue || !queue.songs[0]) return msg.channel.send(`${emoji.no} There are no songs in queue.`).then(e => setTimeout(() => e.delete().catch(console.log), 4000));
        
        await queue.addRelatedSong();

        return msg.channel.send(`${emoji.yes} Added a related/similar song to the queue!`).then(e => setTimeout(() => e.delete().catch(console.log), 5000));
    }
}